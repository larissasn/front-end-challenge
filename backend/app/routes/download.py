
import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from ..models import ProcessFileRequest, ProcessFileResponse
from ..services.file_processor import file_processor
from ..services.agent_service import agent_service
from datetime import datetime

router = APIRouter(prefix="/download", tags=["download"])

@router.post("/process", response_model=ProcessFileResponse)
async def process_file(request: ProcessFileRequest):
    """
    Process uploaded file and create output file
    
    - **request**: Contains file_id and optional processing instructions
    
    Returns information about the processed output file
    """
    try:
        # Check if file exists
        if not file_processor.file_exists(request.file_id):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Read file content
        content = await file_processor.read_file_content(request.file_id)
        if not content:
            raise HTTPException(status_code=400, detail="Could not read file content")
        
        # Process content using agent
        processed_content = await agent_service.process_file_content(
            content, request.processing_instructions
        )
        
        # Create output file
        output_filename = await file_processor.create_output_file(
            request.file_id, processed_content
        )
        
        return ProcessFileResponse(
            file_id=request.file_id,
            output_filename=output_filename,
            processing_status="completed",
            summary=processed_content[:200] + "..." if len(processed_content) > 200 else processed_content,
            processed_at=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@router.get("/file/{filename}")
async def download_file(filename: str):
    """
    Download processed output file
    
    - **filename**: Name of the output file to download
    
    Returns the file as a download
    """
    try:
        file_path = file_processor.get_output_file_path(filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type='text/plain'
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@router.get("/list")
async def list_output_files():
    """
    List all available output files
    
    Returns a list of processed files available for download
    """
    try:
        from ..config import settings
        output_dir = settings.outputs_dir
        if not os.path.exists(output_dir):
            return {"files": []}
        
        files = []
        for filename in os.listdir(output_dir):
            if filename.endswith('.txt'):
                file_path = os.path.join(output_dir, filename)
                stat = os.stat(file_path)
                files.append({
                    "filename": filename,
                    "size": stat.st_size,
                    "created": datetime.fromtimestamp(stat.st_ctime),
                    "modified": datetime.fromtimestamp(stat.st_mtime)
                })
        
        return {"files": files}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not list files: {str(e)}")

# TODO for candidates: Implement these additional endpoints  
# - GET /download/history - Get processing history
# - POST /download/batch - Process multiple files at once
# - DELETE /download/file/{filename} - Delete output file
# - GET /download/preview/{filename} - Preview file content without downloading
