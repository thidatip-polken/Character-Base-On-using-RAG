from pathlib import Path
from typing import Optional

import logging
import yaml

from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_ollama import ChatOllama

PROJECT_ROOT = Path(__file__).resolve().parent
CONFIG_PATH = PROJECT_ROOT / "config.yaml"

from app.services.prompts import TEMPLATES

logger = logging.getLogger(__name__)

def load_config(path: Path = CONFIG_PATH) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"Config file not found: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def resolve_path(path_value: str) -> Path:
    p = Path(path_value)
    return p if p.is_absolute() else PROJECT_ROOT / p

config = load_config()

EMBEDDING_MODEL = config.get("EMBEDDING", {}).get(
    "model_name", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)
OLLAMA_BASE_URL = config.get("LLM", {}).get("ollama_base_url", "http://localhost:11434")
LLM_MODEL = config.get("LLM", {}).get("model_name", "qwen3")
CHARACTERS_CFG = config["CHARACTERS"]

embeddings = None
vectorstores = {}
chains = {}

CURRENT_SESSION = {
    "user_name": None,
    "character": None,
}

# Single active session — this backend is designed for one local user at a
# time (matches the notebook / README's local-dev scope). Swap this for a
# real session/cookie store if you need multi-user support.

def get_embeddings() -> HuggingFaceEmbeddings:
    global embeddings

    if embeddings is None:
        logger.info("Loading embedding model: %s", EMBEDDING_MODEL)

        embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )

    return embeddings

def get_vectorstore(character_id: str) -> Chroma:

    if character_id not in CHARACTERS_CFG:
        raise ValueError(f"Character '{character_id}' not found.")

    if character_id not in vectorstores:
        char_cfg = CHARACTERS_CFG[character_id]

        persist_directory = resolve_path(
            char_cfg["persist_directory"]
        )

        collection_name = char_cfg["collection_name"]

        logger.info(
            "Loading Chroma collection '%s' from %s",
            collection_name,
            persist_directory,
        )

        vectorstores[character_id] = Chroma(
            collection_name=collection_name,
            embedding_function=get_embeddings(),
            persist_directory=str(persist_directory),
        )

    return vectorstores[character_id]

def format_docs(docs: list[Document]) -> str:
    formatted = []

    for doc in docs:
        source = doc.metadata.get("source_file", "")
        doc_type = doc.metadata.get("type", "")
        chunk = doc.metadata.get("chunk_index", "")

        formatted.append(
            f"[Source: {source} | Type: {doc_type} | Chunk: {chunk}]\n"
            f"{doc.page_content}"
        )

    return "\n\n---\n\n".join(formatted)

def get_chain(character_id: str):
    if character_id not in chains:
        template = TEMPLATES.get(character_id)
        if template is None:
            raise ValueError(f"No prompt template registered for '{character_id}'")

        prompt = ChatPromptTemplate.from_template(template)
        llm = ChatOllama(
            base_url=OLLAMA_BASE_URL,
            model=LLM_MODEL,
            temperature=0,
            top_k=10,
            top_p=0.7,
        )
        chains[character_id] = prompt | llm | StrOutputParser()
    return chains[character_id]


def ask(character_id: str, question: str, k: int = 6) -> str:
    vectorstore = get_vectorstore(character_id)
    docs = vectorstore.similarity_search(
        question,
        k=k
    )

    context = format_docs(docs)
    chain = get_chain(character_id)

    return chain.invoke(
        {
            "context": context,
            "question": question,
        }
    )