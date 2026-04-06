"""
Main Flask application entry point.
Initialize Flask app, configure services, and register blueprints.
"""

import os
import sys
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

from config import Config
from services.database_service import DatabaseService
from services.report_service import ReportService
from routes.reports import reports_bp, init_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def create_app(config_class=Config):
    """
    Application factory for creating Flask app.
    
    Args:
        config_class: Configuration class to use
        
    Returns:
        Configured Flask application
    """
    
    # Create Flask app
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize services
    try:
        logger.info("Initializing services...")
        
        # Database service
        db_service = DatabaseService()
        db_service.create_tables()
        logger.info("✓ Database service initialized")
        
        # Report service
        report_service = ReportService(
            db_service=db_service,
            gemini_api_key=Config.GEMINI_API_KEY,
            ml_model_path=Config.ML_MODEL_PATH
        )
        logger.info("✓ Report service initialized")
        
        # Initialize routes with services
        init_routes(report_service, db_service)
        logger.info("✓ Routes initialized")
        
        # Store services in app context
        app.db_service = db_service
        app.report_service = report_service
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {str(e)}")
        logger.error("Make sure PostgreSQL is running and .env is configured correctly")
        raise
    
    # Register blueprints
    app.register_blueprint(reports_bp)
    logger.info("✓ Blueprints registered")
    
    # Health check endpoint
    @app.route("/health", methods=["GET"])
    def health():
        """Health check endpoint."""
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "environment": Config.FLASK_ENV
        }), 200
    
    # Root endpoint
    @app.route("/", methods=["GET"])
    def index():
        """Root endpoint with API documentation."""
        return jsonify({
            "name": "Healthcare Report Analysis API",
            "version": "1.0.0",
            "description": "AI-powered medical report analysis system with OCR, Gemini structuring, and ML predictions",
            "endpoints": {
                "upload": "POST /api/reports/upload",
                "overview": "GET /api/reports/{id}/overview",
                "parameters": "GET /api/reports/{id}/parameters",
                "ai_summary": "GET /api/reports/{id}/ai-summary",
                "recommendations": "GET /api/reports/{id}/recommendations",
                "diet_plan": "GET /api/reports/{id}/diet-plan",
                "full_report": "GET /api/reports/{id}",
                "all_reports": "GET /api/reports",
                "health": "GET /health"
            },
            "documentation": "See README.md for detailed API documentation"
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        """Handle 404 errors."""
        return jsonify({"error": "Endpoint not found"}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(e):
        """Handle 405 errors."""
        return jsonify({"error": "Method not allowed"}), 405
    
    @app.errorhandler(500)
    def internal_error(e):
        """Handle 500 errors."""
        logger.error(f"Internal server error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
    @app.before_request
    def log_request():
        """Log incoming requests."""
        logger.debug(f"{request.method} {request.path}")
    
    logger.info("Flask app created successfully")
    return app


if __name__ == "__main__":
    try:
        # Create app
        app = create_app()
        
        # Print startup info
        logger.info("=" * 60)
        logger.info("Healthcare Report Analysis API")
        logger.info("=" * 60)
        logger.info(f"Environment: {Config.FLASK_ENV}")
        logger.info(f"Debug: {Config.DEBUG}")
        logger.info(f"Database: {Config.get_database_url()}")
        logger.info(f"Upload folder: {Config.UPLOAD_FOLDER}")
        logger.info("=" * 60)
        logger.info("Starting Flask development server...")
        logger.info("API available at: http://localhost:5000")
        logger.info("=" * 60)
        
        # Run app
        app.run(
            host="0.0.0.0",
            port=5000,
            debug=Config.DEBUG
        )
    except Exception as e:
        logger.error(f"Failed to start application: {str(e)}")
        sys.exit(1)
