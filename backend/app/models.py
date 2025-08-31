
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class FileUploadResponse(BaseModel):
    filename: str
    file_id: str
    size: int
    upload_time: datetime
    status: str

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    message: str
    file_id: Optional[str] = None
    conversation_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str
    file_id: Optional[str]
    conversation_id: str
    timestamp: datetime

class ProcessFileRequest(BaseModel):
    file_id: str
    processing_instructions: Optional[str] = "Analyze and summarize this text file"

class ProcessFileResponse(BaseModel):
    file_id: str
    output_filename: str
    processing_status: str
    summary: Optional[str]
    processed_at: datetime

class AgentStatus(BaseModel):
    agent_name: str
    status: str
    model: str
    available: bool
    last_used: Optional[datetime]

class ErrorResponse(BaseModel):
    error: str
    message: str
    status_code: int
