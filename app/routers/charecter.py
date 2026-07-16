from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services import rag

router = APIRouter(
    prefix="/chat-bot/character",
    tags=["Character"]
)


class CharacterRequest(BaseModel):
    character_name: str


@router.post("")
def select_character(data: CharacterRequest):

    if data.character_name not in rag.CHARACTERS_CFG:
        raise HTTPException(
            status_code=404,
            detail="Character not found."
        )

    rag.CURRENT_SESSION["character"] = data.character_name

    return {
        "status_code": 200,
        "status_desc": "Success",
        "result": {
            "character_name": data.character_name
        }
    }