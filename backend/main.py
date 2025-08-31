
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from app.config import settings
from app.routes import upload, chat, download

# Create directories on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create required directories
    os.makedirs(settings.uploads_dir, exist_ok=True)
    os.makedirs(settings.outputs_dir, exist_ok=True)
    print(f"Created directories: {settings.uploads_dir}, {settings.outputs_dir}")
    
    # Check API key configuration
    if not settings.openrouter_api_key:
        print("⚠️  WARNING: OPENROUTER_API_KEY not configured. Set it in .env file.")
        print("⚠️  Agent functionality will be limited without API key.")
    else:
        print("✅ OpenRouter API key configured")
    
    print("🚀 Agent UI Challenge Backend started successfully!")
    yield

# Initialize FastAPI app
app = FastAPI(
    title="Agent UI Challenge Backend",
    description="""
    Backend API for the Agent UI Challenge - A technical assessment for frontend developers.
    
    This API provides:
    - File upload capabilities for .txt files
    - AI agent integration using OpenRouter
    - Streaming chat interface
    - File processing and download functionality
    
    Built with FastAPI and designed to work with Next.js frontend + agent-ui components.
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(download.router, prefix="/api")

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Agent UI Challenge Backend",
        "version": "1.0.0",
        "status": "online",
        "agent_configured": bool(settings.openrouter_api_key),
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "agent_available": bool(settings.openrouter_api_key),
        "upload_dir": os.path.exists(settings.uploads_dir),
        "output_dir": os.path.exists(settings.outputs_dir)
    }

# Serve uploaded files (for development only)
if os.path.exists(settings.uploads_dir):
    app.mount("/uploads", StaticFiles(directory=settings.uploads_dir), name="uploads")

if os.path.exists(settings.outputs_dir):
    app.mount("/outputs", StaticFiles(directory=settings.outputs_dir), name="outputs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
