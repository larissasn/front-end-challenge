
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
from ..models import FileUploadResponse, ErrorResponse
from ..services.file_processor import file_processor

router = APIRouter(prefix="/upload", tags=["file-upload"])

@router.post("/", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a text file for processing
    
    - **file**: The .txt file to upload (max 10MB)
    
    Returns file information including file_id for future reference
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        if not file.filename.lower().endswith('.txt'):
            raise HTTPException(status_code=400, detail="Only .txt files are allowed")
        
        # Read file content
        content = await file.read()
        
        # Save file
        file_id, file_path = await file_processor.save_uploaded_file(
            file.filename, content
        )
        
        return FileUploadResponse(
            filename=file.filename,
            file_id=file_id,
            size=len(content),
            upload_time=datetime.now(),
            status="uploaded"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/status/{file_id}")
async def get_file_status(file_id: str):
    """
    Get status of uploaded file
    
    - **file_id**: The ID of the uploaded file
    """
    try:
        if not file_processor.file_exists(file_id):
            raise HTTPException(status_code=404, detail="File not found")
        
        return {"file_id": file_id, "status": "ready", "available": True}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
