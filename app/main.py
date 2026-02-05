from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.start import start_router
from app.routes.submit import submit_router
from app.storage.sessions import init_db

app = FastAPI(title="VacantShield Backend")

# Initialize SQLite DB
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(start_router, prefix="/api")
app.include_router(submit_router, prefix="/api")

@app.get("/")
def health():
    return {"status": "VacantShield Backend Running"}
