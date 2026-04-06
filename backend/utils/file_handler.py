"""
File Handler Utility: Manage file uploads, validation, and storage.
"""

import os
import uuid
from datetime import datetime
from typing import Tuple, Optional
from werkzeug.utils import secure_filename
from config import Config
import logging

logger = logging.getLogger(__name__)


class FileHandler:
    """Handle file upload validation and storage."""
    
    ALLOWED_EXTENSIONS = Config.ALLOWED_EXTENSIONS
    MAX_FILE_SIZE = Config.MAX_FILE_SIZE
    UPLOAD_FOLDER = Config.UPLOAD_FOLDER
    
    @staticmethod
    def validate_file(filename: str, file_size: int) -> Tuple[bool, Optional[str]]:
        """
        Validate uploaded file.
        
        Args:
            filename: Original filename
            file_size: Size of file in bytes
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not filename:
            return False, "No filename provided"
        
        # Check extension
        file_ext = filename.rsplit(".", 1)[1].lower() if "." in filename else ""
        if file_ext not in FileHandler.ALLOWED_EXTENSIONS:
            return False, f"File type not allowed. Allowed: {', '.join(FileHandler.ALLOWED_EXTENSIONS)}"
        
        # Check file size
        if file_size > FileHandler.MAX_FILE_SIZE:
            max_mb = FileHandler.MAX_FILE_SIZE / (1024 * 1024)
            return False, f"File too large. Maximum size: {max_mb:.1f}MB"
        
        return True, None
    
    @staticmethod
    def save_file(file_content: bytes, original_filename: str) -> str:
        """
        Save uploaded file to disk with unique name.
        
        Args:
            file_content: File content bytes
            original_filename: Original filename
            
        Returns:
            Path to saved file
            
        Raises:
            Exception: If file save fails
        """
        try:
            # Create upload folder if it doesn't exist
            if not os.path.exists(FileHandler.UPLOAD_FOLDER):
                os.makedirs(FileHandler.UPLOAD_FOLDER)
            
            # Generate unique filename
            file_ext = original_filename.rsplit(".", 1)[1].lower()
            unique_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_ext}"
            
            # Secure filename
            safe_filename = secure_filename(unique_filename)
            file_path = os.path.join(FileHandler.UPLOAD_FOLDER, safe_filename)
            
            # Write file
            with open(file_path, "wb") as f:
                f.write(file_content)
            
            logger.info(f"File saved successfully: {file_path}")
            return file_path
        except Exception as e:
            logger.error(f"Failed to save file: {str(e)}")
            raise Exception(f"Failed to save file: {str(e)}")
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """
        Delete a file from disk.
        
        Args:
            file_path: Path to file
            
        Returns:
            True if deleted, False otherwise
        """
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"File deleted: {file_path}")
                return True
            else:
                logger.warning(f"File not found for deletion: {file_path}")
                return False
        except Exception as e:
            logger.error(f"Failed to delete file {file_path}: {str(e)}")
            return False
    
    @staticmethod
    def get_upload_folder_stats() -> dict:
        """Get statistics about the uploads folder."""
        try:
            total_size = 0
            file_count = 0
            
            if os.path.exists(FileHandler.UPLOAD_FOLDER):
                for filename in os.listdir(FileHandler.UPLOAD_FOLDER):
                    file_path = os.path.join(FileHandler.UPLOAD_FOLDER, filename)
                    if os.path.isfile(file_path):
                        file_count += 1
                        total_size += os.path.getsize(file_path)
            
            return {
                "upload_folder": FileHandler.UPLOAD_FOLDER,
                "file_count": file_count,
                "total_size_bytes": total_size,
                "total_size_mb": round(total_size / (1024 * 1024), 2)
            }
        except Exception as e:
            logger.error(f"Failed to get upload folder stats: {str(e)}")
            return {}
