"""
Report Service: Orchestrates the complete report processing pipeline.
Calls OCR → Gemini → ML → Database services in sequence.
"""

import os
from typing import Dict, Any, List
import logging
from datetime import datetime

from services.ocr_service import OCRService
from services.gemini_service import GeminiService
from services.ml_service import MLService
from services.database_service import DatabaseService
from config import Config

logger = logging.getLogger(__name__)


class ReportService:
    """
    Orchestrator service that coordinates the entire report processing pipeline:
    1. Extract text via OCR
    2. Structure data via Gemini
    3. Predict risk scores via ML
    4. Generate AI summary via Gemini
    5. Generate diet plan via Gemini
    6. Generate recommendations via Gemini
    7. Store everything in database
    """
    
    def __init__(self, db_service: DatabaseService, gemini_api_key: str, ml_model_path: str):
        """
        Initialize report service with dependencies.
        
        Args:
            db_service: DatabaseService instance
            gemini_api_key: Google Gemini API key
            ml_model_path: Path to trained ML model
        """
        self.db_service = db_service
        self.ocr_service = OCRService()
        self.gemini_service = GeminiService(gemini_api_key)
        
        try:
            self.ml_service = MLService(ml_model_path)
        except Exception as e:
            logger.warning(f"ML model initialization failed. Will use default scores: {str(e)}")
            self.ml_service = None
        
        logger.info("ReportService initialized successfully")
    
    def process_report(self, file_path: str, user_id: int = None) -> Dict[str, Any]:
        """
        Complete pipeline: upload file → OCR → structuring → ML → summarization → DB storage.
        
        This is the main orchestration function that ties all services together.
        
        Args:
            file_path: Path to uploaded medical report file
            user_id: Optional user ID for tracking
            
        Returns:
            Dictionary with report_id and processing status
            
        Raises:
            Exception: If any step in the pipeline fails critically
        """
        try:
            logger.info(f"Starting report processing for file: {file_path}")
            
            # Step 1: Extract text via OCR
            logger.info("Step 1/7: Extracting text via OCR...")
            ocr_text = OCRService.extract_text(file_path)
            if not ocr_text.strip():
                raise Exception("OCR extraction returned empty text")
            logger.info(f"✓ OCR complete - extracted {len(ocr_text)} characters")
            
            # Step 2: Structure data via Gemini
            logger.info("Step 2/7: Structuring data with Gemini...")
            structured_data = self.gemini_service.structure_medical_data(ocr_text)
            logger.info(f"✓ Data structured - identified {len(structured_data)} parameters")
            
            # Step 3: Generate key findings
            logger.info("Step 3/7: Generating key findings...")
            key_findings = self._extract_key_findings(structured_data)
            logger.info(f"✓ Key findings: {key_findings}")
            
            # Step 4: Predict risk scores via ML
            logger.info("Step 4/7: Predicting risk scores with ML model...")
            if self.ml_service:
                risk_scores = self.ml_service.predict_risk_scores(structured_data)
            else:
                risk_scores = self._default_risk_scores()
                logger.warning("Using default risk scores (ML model unavailable)")
            logger.info(f"✓ Risk scores: {risk_scores}")
            
            # Step 5: Generate AI summary
            logger.info("Step 5/7: Generating AI summary...")
            ai_summary = self.gemini_service.generate_ai_summary(structured_data, risk_scores)
            logger.info(f"✓ AI summary: {ai_summary.get('summary', '')[:100]}...")
            
            # Step 6: Generate diet plan
            logger.info("Step 6/7: Generating personalized diet plan...")
            diet_plan = self.gemini_service.generate_diet_plan(structured_data, key_findings)
            logger.info(f"✓ Diet plan: {diet_plan.get('calories', 0)} calories")
            
            # Step 7: Generate recommendations
            logger.info("Step 7/7: Generating health recommendations...")
            recommendations = self.gemini_service.generate_recommendations(structured_data, key_findings)
            logger.info(f"✓ Recommendations: {len(recommendations.get('home_remedies', []))} remedies, {len(recommendations.get('medications', []))} medications")
            
            # Step 8: Format parameters
            parameters = self._format_parameters(structured_data)
            
            # Step 9: Store in database
            logger.info("Storing report in database...")
            session = self.db_service.get_session()
            try:
                report_data = {
                    "user_id": user_id,
                    "file_url": file_path,
                    "ocr_text": ocr_text,
                    "structured_data": structured_data,
                    "risk_scores": risk_scores,
                    "parameters": parameters,
                    "key_findings": key_findings,
                    "ai_summary": ai_summary,
                    "recommendations": recommendations,
                    "diet_plan": diet_plan,
                }
                
                report = self.db_service.create_report(session, report_data)
                logger.info(f"✓ Report stored with ID: {report.id}")
                
                return {
                    "report_id": report.id,
                    "message": "Report processed successfully",
                    "status": "success"
                }
            finally:
                session.close()
        
        except Exception as e:
            logger.error(f"Report processing failed: {str(e)}")
            raise Exception(f"Report processing failed: {str(e)}")
    
    def _extract_key_findings(self, structured_data: Dict[str, Any]) -> List[str]:
        """
        Extract key findings from structured data.
        Identifies abnormal values based on normal ranges.
        
        Args:
            structured_data: Medical parameters
            
        Returns:
            List of key findings
        """
        findings = []
        
        # Define normal ranges
        normal_ranges = {
            "glucose_fasting": (70, 100),
            "hba1c": (0, 5.7),
            "ldl": (0, 100),
            "hdl": (40, 200),
            "triglycerides": (0, 150),
            "hemoglobin": (12, 16),
            "wbc": (4.5, 11),
            "systolic_bp": (0, 120),
            "diastolic_bp": (0, 80),
        }
        
        for param, (min_val, max_val) in normal_ranges.items():
            if param in structured_data and structured_data[param]:
                value = float(structured_data[param])
                if value < min_val:
                    findings.append(f"Low {param.replace('_', ' ').title()}: {value}")
                elif value > max_val:
                    findings.append(f"High {param.replace('_', ' ').title()}: {value}")
        
        return findings if findings else ["No significant abnormal findings detected"]
    
    def _format_parameters(self, structured_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Format structured data into parameters array for response.
        
        Args:
            structured_data: Medical parameters
            
        Returns:
            List of parameter objects
        """
        normal_ranges = {
            "hemoglobin": "12-15.5 g/dL",
            "wbc": "4.5-11 thousand/mcL",
            "rbc": "4.5-5.9 million/mcL",
            "platelets": "150-400 thousand/mcL",
            "glucose_fasting": "70-100 mg/dL",
            "hba1c": "< 5.7 %",
            "ldl": "< 100 mg/dL",
            "hdl": "> 40 mg/dL",
            "triglycerides": "< 150 mg/dL",
            "mcv": "80-100 fL",
            "systolic_bp": "< 120 mmHg",
            "diastolic_bp": "< 80 mmHg",
        }
        
        units = {
            "hemoglobin": "g/dL",
            "wbc": "thousand/mcL",
            "rbc": "million/mcL",
            "platelets": "thousand/mcL",
            "glucose_fasting": "mg/dL",
            "hba1c": "%",
            "ldl": "mg/dL",
            "hdl": "mg/dL",
            "triglycerides": "mg/dL",
            "mcv": "fL",
            "systolic_bp": "mmHg",
            "diastolic_bp": "mmHg",
        }
        
        parameters = []
        for param_name, value in structured_data.items():
            if value is not None:
                param_obj = {
                    "name": param_name.replace("_", " ").title(),
                    "value": value,
                    "unit": units.get(param_name, ""),
                    "normal_range": normal_ranges.get(param_name, "N/A"),
                    "status": self._get_parameter_status(param_name, value, normal_ranges)
                }
                parameters.append(param_obj)
        
        return parameters
    
    def _get_parameter_status(self, param_name: str, value: Any, normal_ranges: Dict) -> str:
        """Determine if a parameter is normal, high, or low."""
        range_str = normal_ranges.get(param_name, "")
        
        # Parse range (simplified parsing)
        if not range_str or not value:
            return "Unknown"
        
        try:
            value = float(value)
            
            if "-" in range_str:
                parts = range_str.split("-")
                min_val = float(parts[0].replace("< ", "").replace("> ", "").split()[0])
                range_str_remaining = "-".join(parts[1:])
                max_val = float(range_str_remaining.split()[0])
                
                if value < min_val:
                    return "Low"
                elif value > max_val:
                    return "High"
            elif ">" in range_str:
                min_val = float(range_str.split(">")[1].split()[0])
                if value < min_val:
                    return "Low"
            elif "<" in range_str:
                max_val = float(range_str.split("<")[1].split()[0])
                if value > max_val:
                    return "High"
            
            return "Normal"
        except (ValueError, IndexError):
            return "Unknown"
    
    def _default_risk_scores(self) -> Dict[str, int]:
        """Return default risk scores."""
        return {
            "overall": 50,
            "diabetes": 45,
            "heart_disease": 40,
            "anemia": 20,
            "infection": 25,
        }
