
import os
import uuid
import aiofiles
from datetime import datetime
from typing import Optional, Tuple
from ..config import settings

class FileProcessor:
    def __init__(self):
        os.makedirs(settings.uploads_dir, exist_ok=True)
        os.makedirs(settings.outputs_dir, exist_ok=True)
    
    async def save_uploaded_file(self, filename: str, content: bytes) -> Tuple[str, str]:
        """Save uploaded file and return file_id and saved path"""
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(filename)[1].lower()
        
        if file_extension not in settings.allowed_file_extensions:
            raise ValueError(f"File extension {file_extension} not allowed")
        
        if len(content) > settings.max_file_size_mb * 1024 * 1024:
            raise ValueError(f"File size exceeds {settings.max_file_size_mb}MB limit")
        
        saved_filename = f"{file_id}_{filename}"
        file_path = os.path.join(settings.uploads_dir, saved_filename)
        
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
        
        return file_id, file_path
    
    async def read_file_content(self, file_id: str) -> Optional[str]:
        """Read content of uploaded file by file_id"""
        try:
            # Find file by file_id prefix
            for filename in os.listdir(settings.uploads_dir):
                if filename.startswith(file_id):
                    file_path = os.path.join(settings.uploads_dir, filename)
                    async with aiofiles.open(file_path, "r", encoding="utf-8") as f:
                        return await f.read()
            return None
        except Exception as e:
            print(f"Error reading file {file_id}: {str(e)}")
            return None
    
    async def create_output_file(self, file_id: str, processed_content: str) -> str:
        """Create output file with processed content"""
        output_filename = f"output_{file_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        output_path = os.path.join(settings.outputs_dir, output_filename)
        
        async with aiofiles.open(output_path, "w", encoding="utf-8") as f:
            await f.write(processed_content)
        
        return output_filename
    
    def get_output_file_path(self, output_filename: str) -> str:
        """Get full path for output file"""
        return os.path.join(settings.outputs_dir, output_filename)
    
    def file_exists(self, file_id: str) -> bool:
        """Check if file exists by file_id"""
        try:
            for filename in os.listdir(settings.uploads_dir):
                if filename.startswith(file_id):
                    return True
            return False
        except:
            return False

file_processor = FileProcessor()
