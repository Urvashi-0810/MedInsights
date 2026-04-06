"""
OCR Service: Extract text from medical report PDFs/images using Tesseract OCR.
"""

import pytesseract
from PIL import Image
import pdf2image
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class OCRService:
    """Service for extracting text from images and PDFs using Tesseract OCR."""
    
    @staticmethod
    def extract_text_from_image(image_path: str) -> str:
        """
        Extract text from an image file.
        
        Args:
            image_path: Path to the image file (JPG, PNG, etc.)
            
        Returns:
            Extracted text string
            
        Raises:
            Exception: If OCR extraction fails
        """
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image)
            logger.info(f"Successfully extracted text from image: {image_path}")
            return text
        except Exception as e:
            logger.error(f"Error extracting text from image {image_path}: {str(e)}")
            raise Exception(f"OCR extraction failed for image: {str(e)}")
    
    @staticmethod
    def extract_text_from_pdf(pdf_path: str) -> str:
        """
        Extract text from a PDF file.
        Converts PDF pages to images and then uses OCR.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Extracted text from all pages
            
        Raises:
            Exception: If PDF processing or OCR extraction fails
        """
        try:
            # Convert PDF to images
            images = pdf2image.convert_from_path(pdf_path)
            
            all_text = ""
            for page_num, image in enumerate(images):
                try:
                    page_text = pytesseract.image_to_string(image)
                    all_text += f"\n--- Page {page_num + 1} ---\n{page_text}"
                    logger.info(f"Processed page {page_num + 1} from PDF")
                except Exception as e:
                    logger.error(f"Error processing page {page_num + 1}: {str(e)}")
                    # Continue with next page even if one fails
                    continue
            
            logger.info(f"Successfully extracted text from PDF: {pdf_path}")
            return all_text
        except Exception as e:
            logger.error(f"Error extracting text from PDF {pdf_path}: {str(e)}")
            raise Exception(f"PDF processing failed: {str(e)}")
    
    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Intelligently extract text from either PDF or image file.
        
        Args:
            file_path: Path to the file (PDF, JPG, PNG, etc.)
            
        Returns:
            Extracted text string
            
        Raises:
            Exception: If file type is unsupported or extraction fails
        """
        file_lower = file_path.lower()
        
        if file_lower.endswith(".pdf"):
            return OCRService.extract_text_from_pdf(file_path)
        elif file_lower.endswith((".jpg", ".jpeg", ".png", ".bmp", ".tiff")):
            return OCRService.extract_text_from_image(file_path)
        else:
            raise Exception(f"Unsupported file type: {file_path}")
