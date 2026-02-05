import hashlib

def generate_hash(session_id, phrase, trust_score, timestamp):
    raw = f"{session_id}|{phrase}|{trust_score}|{timestamp}"
    return hashlib.sha256(raw.encode()).hexdigest()
