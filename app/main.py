from fastapi import FastAPI, Request
import time

from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.routers.login import router as login_router
from app.routers.charecter import router as char_router
from app.routers.chat import router as chat_router

app = FastAPI()

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://thidatip-polken.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Process-Time"] = str(time.perf_counter() - start_time)
    return response

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(login_router)
app.include_router(char_router)
app.include_router(chat_router)