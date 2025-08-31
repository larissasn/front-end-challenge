
import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..models import ChatRequest, AgentStatus
from ..services.agent_service import agent_service
from ..services.file_processor import file_processor

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/stream/{conversation_id}")
async def chat_stream(conversation_id: str, chat_request: ChatRequest):
    """
    Stream chat response from the AI agent
    
    - **conversation_id**: Unique identifier for the conversation
    - **chat_request**: Contains message and optional file_id for context
    
    Returns a streaming response with AI agent messages
    """
    try:
        # Get file content if file_id provided
        file_content = None
        if chat_request.file_id:
            file_content = await file_processor.read_file_content(chat_request.file_id)
            if not file_content:
                raise HTTPException(status_code=404, detail="File not found or could not be read")
        
        # Create streaming response
        return StreamingResponse(
            agent_service.chat_stream(
                message=chat_request.message,
                conversation_id=conversation_id,
                file_content=file_content
            ),
            media_type="text/plain"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@router.post("/start")
async def start_conversation():
    """
    Start a new conversation
    
    Returns a new conversation ID
    """
    try:
        conversation_id = str(uuid.uuid4())
        return {"conversation_id": conversation_id, "status": "started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status", response_model=AgentStatus)
async def get_agent_status():
    """
    Get current status of the AI agent
    
    Returns agent availability and configuration info
    """
    try:
        status_info = agent_service.get_status()
        return AgentStatus(**status_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# TODO for candidates: Implement these additional endpoints
# - POST /chat/history/{conversation_id} - Get conversation history
# - DELETE /chat/{conversation_id} - Clear conversation
# - POST /chat/export/{conversation_id} - Export conversation to file
# - PUT /chat/settings - Update agent settings (temperature, model, etc.)
