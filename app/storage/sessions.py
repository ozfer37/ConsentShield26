import sqlite3

DB_NAME = "vacantshield.db"

def get_db():
    return sqlite3.connect(DB_NAME)

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS consent_sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            phrase TEXT,
            start_time INTEGER,
            end_time INTEGER,
            duration_sec INTEGER,
            blink_count INTEGER,
            emotion TEXT,
            panic INTEGER,
            trust_score INTEGER,
            status TEXT,
            hash TEXT,
            created_at INTEGER
        )
    """)

    conn.commit()
    conn.close()

def save_session(session_id, phrase, start_time, user_id=None):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO consent_sessions (
            id, user_id, phrase, start_time, created_at
        ) VALUES (?, ?, ?, ?, ?)
    """, (
        session_id,
        user_id,
        phrase,
        start_time,
        start_time
    ))

    conn.commit()
    conn.close()

def update_session(
    session_id,
    end_time,
    duration_sec,
    blink_count,
    emotion,
    panic,
    trust_score,
    status,
    hash_value
):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE consent_sessions
        SET
            end_time = ?,
            duration_sec = ?,
            blink_count = ?,
            emotion = ?,
            panic = ?,
            trust_score = ?,
            status = ?,
            hash = ?
        WHERE id = ?
    """, (
        end_time,
        duration_sec,
        blink_count,
        emotion,
        int(panic),
        trust_score,
        status,
        hash_value,
        session_id
    ))

    conn.commit()
    conn.close()

def get_session(session_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT phrase, start_time
        FROM consent_sessions
        WHERE id = ?
    """, (session_id,))

    row = cursor.fetchone()
    conn.close()
    return row
