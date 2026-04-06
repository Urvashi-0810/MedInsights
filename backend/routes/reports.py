"""
API Routes for healthcare report analysis system.
All endpoints are mounted under /api/reports prefix.
"""

from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest
import logging
from typing import Dict, Any

from utils.file_handler import FileHandler
from services.report_service import ReportService
from services.database_service import DatabaseService
from schemas import (
    UploadResponseSchema,
    OverviewResponseSchema,
    ParametersResponseSchema,
    AISummaryResponseSchema,
    RecommendationsResponseSchema,
    DietPlanResponseSchema,
)

logger = logging.getLogger(__name__)

# Blueprint definition
reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")

# These will be initialized by the app
report_service: ReportService = None
db_service: DatabaseService = None


def init_routes(report_svc: ReportService, db_svc: DatabaseService):
    """Initialize routes with service dependencies."""
    global report_service, db_service
    report_service = report_svc
    db_service = db_svc


@reports_bp.route("/upload", methods=["POST"])
def upload_report():
    """
    POST /api/reports/upload
    
    Upload and process a medical report.
    
    Request:
        - file: Medical report PDF/image (multipart form data)
        - user_id (optional): User identifier
        
    Response:
        {
            "report_id": 12,
            "message": "Report processed successfully"
        }
    """
    try:
        # Validate request
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files["file"]
        user_id = request.form.get("user_id", type=int)
        
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
        
        # Read file content
        file_content = file.read()
        
        # Validate file
        is_valid, error_msg = FileHandler.validate_file(file.filename, len(file_content))
        if not is_valid:
            return jsonify({"error": error_msg}), 400
        
        # Save file
        try:
            file_path = FileHandler.save_file(file_content, file.filename)
        except Exception as e:
            logger.error(f"File save failed: {str(e)}")
            return jsonify({"error": "Failed to save file"}), 500
        
        # Process report
        try:
            result = report_service.process_report(file_path, user_id)
            response = UploadResponseSchema(
                report_id=result["report_id"],
                message=result["message"]
            )
            return jsonify(response.dict()), 200
        except Exception as e:
            logger.error(f"Report processing failed: {str(e)}")
            # Clean up uploaded file on failure
            FileHandler.delete_file(file_path)
            return jsonify({"error": f"Report processing failed: {str(e)}"}), 500
    
    except Exception as e:
        logger.error(f"Upload endpoint error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@reports_bp.route("/<int:report_id>/overview", methods=["GET"])
def get_overview(report_id: int):
    """
    GET /api/reports/{id}/overview
    
    Get report overview with risk scores and key findings.
    
    Response:
        {
            "overall_risk_score": 68,
            "risk_level": "Medium",
            "risks": {...},
            "key_findings": [...],
            "ai_summary": "..."
        }
    """
    try:
        session = db_service.get_session()
        try:
            report = db_service.get_report_by_id(session, report_id)
            
            if not report:
                return jsonify({"error": "Report not found"}), 404
            
            # Determine risk level
            overall_score = report.risk_scores.get("overall", 50)
            if overall_score < 33:
                risk_level = "Low"
            elif overall_score < 67:
                risk_level = "Medium"
            else:
                risk_level = "High"
            
            response = {
                "overall_risk_score": overall_score,
                "risk_level": risk_level,
                "risks": report.risk_scores,
                "key_findings": report.key_findings,
                "ai_summary": report.ai_summary.get("summary", "") if report.ai_summary else ""
            }
            
            return jsonify(response), 200
        finally:
            session.close()
    
    except Exception as e:
        logger.error(f"Overview endpoint error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@reports_bp.route("/<int:report_id>/parameters", methods=["GET"])
def get_parameters(report_id: int):
    """
    GET /api/reports/{id}/parameters
    
    Get medical parameters with values and status.
    
    Response:
        {
            "parameters": [
                {
                    "name": "Hemoglobin",
                    "value": 13.5,
                    "unit": "g/dL",
                    "normal_range": "12-15.5",
                    "status": "Normal"
                },
                ...
            ]
        }
    """
    try:
        session = db_service.get_session()
        try:
            report = db_service.get_report_by_id(session, report_id)
            
            if not report:
                return jsonify({"error": "Report not found"}), 404
            
            response = {
                "parameters": report.parameters if report.parameters else []
            }
            
            return jsonify(response), 200
        finally:
            session.close()
    
    except Exception as e:
        logger.error(f"Parameters endpoint error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@reports_bp.route("/<int:report_id>/ai-summary", methods=["GET"])
def get_ai_summary(report_id: int):
    """
    GET /api/reports/{id}/ai-summary
    
    Get AI-generated summary with root causes and recommendations.
    
    Response:
        {
            "summary": "...",
            "root_causes": [...],
            "recommendations": [...]
        }
    """
    try:
        session = db_service.get_session()
        try:
            report = db_service.get_report_by_id(session, report_id)
            
            if not report:
                return jsonify({"error": "Report not found"}), 404
            
            ai_summary = report.ai_summary if report.ai_summary else {}
            response = {
                "summary": ai_summary.get("summary", ""),
                "root_causes": ai_summary.get("root_causes", []),
                "recommendations": ai_summary.get("recommendations", [])
            }
            
            return jsonify(response), 200
        finally:
            session.close()
    
    except Exception as e:
        logger.error(f"AI summary endpoint error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@reports_bp.route("/<int:report_id>/recommendations", methods=["GET"])
def get_recommendations(report_id: int):
    """
    GET /api/reports/{id}/recommendations
    
    Get health recommendations: home remedies, medicines, lifestyle changes.
    
    Response:
        {
            "home_remedies": [...],
            "medications": [...],
            "lifestyle_changes": [...]
        }
    """
    try:
        session = db_service.get_session()
        try:
            report = db_service.get_report_by_id(session, report_id)
            
            if not report:
                return jsonify({"error": "Report not found"}), 404
            
            recommendations = report.recommendations if report.recommendations else {}
            response = {
                "home_remedies": recommendations.get("home_remedies", []),
                "medications": recommendations.get("medications", []),
                "lifestyle_changes": recommendations.get("lifestyle_changes", [])
            }
            
            return jsonify(response), 200
        finally:
            session.close()
    
    except Exception as e:
        logger.error(f"Recommendations endpoint error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@reports_bp.route("/<int:report_id>/diet-plan", methods=["GET"])
def get_diet_plan(report_id: int):
    """
    GET /api/reports/{id}/diet-plan
    
    Get personalized diet plan with nutritional information and meals.
    
    Response:
        {
            "calories": 1880,
            "protein": 101,
            "carbs": 193,
            "fiber": 36,
            "meals": {
                "breakfast": "...",
                "lunch": "...",
                "dinner": "..."
            }
        }
    """
    try:
        session = db_service.get_session()
        try:
            report = db_service.get_report_by_id(session, report_id)
            
            if not report:
                return jsonify({"error": "Report not found"}), 404
            
            diet_plan = report.diet_plan if report.diet_plan else {}
            response = {
                "calories": diet_plan.get("calories", 0),
                "protein": diet_plan.get("protein", 0),
                "carbs": diet_plan.get("carbs", 0),
                "fiber": diet_plan.get("fiber", 0),
                "meals": diet_plan.get("meals", {
                    "breakfast": "",
                    "lunch": "",
                    "dinner": ""
                })
            }
            
            return jsonify(response), 200
        finally:
            session.close()
    
    except Exception as e:
        logger.error(f"Diet plan endpoint error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@reports_bp.route("", methods=["GET"])
def get_all_reports():
    """
    GET /api/reports
    
    Get list of all reports (with optional pagination).
    
    Query Parameters:
        - limit (default 100): Maximum number of reports to return
        
    Response:
        [
            {
                "id": 1,
                "created_at": "2024-01-15T10:30:00",
                "overall_risk_score": 68,
                "file_url": "..."
            },
            ...
        ]
    """
    try:
        limit = request.args.get("limit", 100, type=int)
        limit = min(limit, 500)  # Cap at 500
        
        session = db_service.get_session()
        try:
            reports = db_service.get_all_reports(session, limit)
            
            response = [
                {
                    "id": r.id,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                    "overall_risk_score": r.risk_scores.get("overall", 0) if r.risk_scores else 0,
                    "file_url": r.file_url
                }
                for r in reports
            ]
            
            return jsonify(response), 200
        finally:
            session.close()
    
    except Exception as e:
        logger.error(f"Get all reports error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@reports_bp.route("/<int:report_id>", methods=["GET"])
def get_full_report(report_id: int):
    """
    GET /api/reports/{id}
    
    Get complete report data (all fields).
    
    Response:
        {
            "id": 1,
            "structured_data": {...},
            "risk_scores": {...},
            "parameters": [...],
            "key_findings": [...],
            "ai_summary": {...},
            "recommendations": {...},
            "diet_plan": {...},
            "created_at": "..."
        }
    """
    try:
        session = db_service.get_session()
        try:
            report = db_service.get_report_by_id(session, report_id)
            
            if not report:
                return jsonify({"error": "Report not found"}), 404
            
            response = report.to_dict()
            
            return jsonify(response), 200
        finally:
            session.close()
    
    except Exception as e:
        logger.error(f"Get full report error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@reports_bp.errorhandler(BadRequest)
def handle_bad_request(e):
    """Handle bad request errors."""
    return jsonify({"error": str(e.description)}), 400


@reports_bp.errorhandler(500)
def handle_internal_error(e):
    """Handle internal server errors."""
    logger.error(f"Internal server error: {str(e)}")
    return jsonify({"error": "Internal server error"}), 500
