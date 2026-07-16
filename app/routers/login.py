from fastapi import APIRouter
from pydantic import BaseModel

from app.services import rag

router = APIRouter(
    prefix="/chat-bot/login",
    tags=["Login"]
)


class LoginRequest(BaseModel):
    username: str


@router.post("")
def login(data: LoginRequest):

    rag.CURRENT_SESSION["user_name"] = data.username
    rag.CURRENT_SESSION["character"] = None

    return {
        "status_code": 200,
        "status_desc": "Success",
        "result": {
            "username": data.username,
            "message": "Login successful."
        }
    }