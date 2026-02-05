from fastapi import APIRouter
import time

from app.storage.sessions import get_session, update_session
from app.services.trust import calculate_trust
from app.services.hash import generate_hash

submit_router = APIRouter()

@submit_router.post("/submit")
def submit_consent(data: dict):
    try:
        # 1️⃣ Read session_id
        session_id = data.get("session_id")
        if not session_id:
            return {"error": "INVALID_SESSION"}

        # 2️⃣ Fetch session from DB
        session = get_session(session_id)
        if not session:
            return {"error": "INVALID_SESSION"}

        phrase, start_time = session

        # 3️⃣ Read input values
        blink_count = int(data.get("blink_count", 0))
        emotion = data.get("emotion", "neutral")
        panic = bool(data.get("panic", False))
        duration_sec = int(data.get("duration_sec", 0))

        if emotion not in ["neutral", "happy", "fear"]:
            emotion = "neutral"

        # 4️⃣ Calculate trust score & status
        trust_score, status = calculate_trust(
            blink_count=blink_count,
            emotion=emotion,
            panic=panic
        )

        # 5️⃣ Timestamp
        end_time = int(time.time())

        # 6️⃣ Generate hash
        hash_value = generate_hash(
            session_id=session_id,
            phrase=phrase,
            trust_score=trust_score,
            timestamp=end_time
        )

        # 7️⃣ Update DB record
        update_session(
            session_id=session_id,
            end_time=end_time,
            duration_sec=duration_sec,
            blink_count=blink_count,
            emotion=emotion,
            panic=panic,
            trust_score=trust_score,
            status=status,
            hash_value=hash_value
        )

        # 8️⃣ Return response (FROZEN FORMAT)
        return {
            "trust_score": trust_score,
            "status": status,
            "hash": hash_value,
            "timestamp": end_time
        }

    except Exception:
        # MUST NEVER CRASH
        return {"error": "SERVER_ERROR"}
