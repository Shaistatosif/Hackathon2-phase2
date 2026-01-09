"""
AI-Powered Todo Application - Backend API
FastAPI application entry point
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.tasks import router as tasks_router
from app.api.chat import router as chat_router
from app.core.config import settings
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup: Initialize database
    await init_db()
    yield
    # Shutdown: Cleanup if needed


app = FastAPI(
    title="Todo App API",
    description="AI-Powered Todo Application with Hinglish chatbot support",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(chat_router)


@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes probes"""
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Todo App API",
        "docs": "/docs",
        "health": "/health",
    }
