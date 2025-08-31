
import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # OpenRouter Configuration
    openrouter_api_key: str = ""
    openrouter_model: str = "anthropic/claude-3-haiku"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    
    # Agent Configuration
    agent_name: str = "FileProcessorAgent"
    agent_description: str = "AI agent for processing and analyzing text files"
    
    # File Configuration
    max_file_size_mb: int = 10
    allowed_file_extensions: List[str] = [".txt"]
    
    # CORS Configuration
    cors_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Directories
    uploads_dir: str = "./uploads"
    outputs_dir: str = "./outputs"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
