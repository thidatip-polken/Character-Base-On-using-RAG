from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services import rag

router = APIRouter(
    prefix="/chat-bot/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    question: str


@router.post("")
def chat(data: ChatRequest):

    character = rag.CURRENT_SESSION["character"]

    if character is None:
        raise HTTPException(
            status_code=400,
            detail="Please select a character first."
        )

    answer = rag.ask(character, data.question)

    return {
        "status_code": 200,
        "status_desc": "Success",
        "result": {
            "character": character,
            "message": data.question,
            "answer": answer
        }
    }