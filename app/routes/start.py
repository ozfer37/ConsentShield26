from fastapi import APIRouter
import uuid
import time

from app.storage.sessions import save_session
from app.utils.phrases import get_phrase

start_router = APIRouter()

@start_router.post("/start")
def start_session(data: dict = {}):
    session_id = str(uuid.uuid4())
    phrase = get_phrase()
    start_time = int(time.time())

    save_session(session_id, phrase, start_time)

    return {
        "session_id": session_id,
        "phrase": phrase,
        "start_time": start_time
    }
