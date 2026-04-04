from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from config import settings
from database import engine, Base
import models  # ensure all models are registered before create_all

from routers import user, company, job, application

# ── Create all DB tables on startup ──────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── Ensure uploads directory exists ──────────────────────────────────────────
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="JobPortal API",
    description="Full-stack Job Portal — Python FastAPI backend",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static file serving for uploaded files ────────────────────────────────────
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(user.router)
app.include_router(company.router)
app.include_router(job.router)
app.include_router(application.router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "JobPortal API is running", "docs": "/docs"}
