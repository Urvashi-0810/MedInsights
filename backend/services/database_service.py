"""
Database Service: Handle all database operations (CRUD) for reports.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
from models import Base, Report
from config import Config
from typing import Optional, List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class DatabaseService:
    """Service for database operations."""
    
    def __init__(self, database_url: Optional[str] = None):
        """
        Initialize database connection.
        
        Args:
            database_url: PostgreSQL connection string. If None, uses Config.get_database_url()
        """
        try:
            if database_url is None:
                database_url = Config.get_database_url()
            
            self.engine = create_engine(
                database_url,
                pool_pre_ping=True,  # Test connections before use
                echo=Config.DEBUG,   # Log SQL queries in debug mode
                pool_size=10,
                max_overflow=20
            )
            
            self.SessionLocal = sessionmaker(
                bind=self.engine,
                expire_on_commit=False
            )
            
            logger.info(f"Database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database: {str(e)}")
            raise Exception(f"Database initialization failed: {str(e)}")
    
    def create_tables(self):
        """Create all database tables if they don't exist."""
        try:
            Base.metadata.create_all(bind=self.engine)
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Failed to create tables: {str(e)}")
            raise Exception(f"Table creation failed: {str(e)}")
    
    def get_session(self) -> Session:
        """Get a new database session."""
        return self.SessionLocal()
    
    def create_report(self, session: Session, report_data: Dict[str, Any]) -> Report:
        """
        Create a new report record in the database.
        
        Args:
            session: SQLAlchemy session
            report_data: Dictionary with report data
            
        Returns:
            Created Report object
            
        Raises:
            Exception: If database operation fails
        """
        try:
            report = Report(
                user_id=report_data.get("user_id"),
                file_url=report_data.get("file_url"),
                ocr_text=report_data.get("ocr_text"),
                structured_data=report_data.get("structured_data", {}),
                risk_scores=report_data.get("risk_scores", {}),
                parameters=report_data.get("parameters", []),
                key_findings=report_data.get("key_findings", []),
                ai_summary=report_data.get("ai_summary", {}),
                recommendations=report_data.get("recommendations", {}),
                diet_plan=report_data.get("diet_plan", {}),
            )
            
            session.add(report)
            session.commit()
            session.refresh(report)
            
            logger.info(f"Report created successfully with id: {report.id}")
            return report
        except SQLAlchemyError as e:
            session.rollback()
            logger.error(f"Database error creating report: {str(e)}")
            raise Exception(f"Failed to create report: {str(e)}")
    
    def get_report_by_id(self, session: Session, report_id: int) -> Optional[Report]:
        """
        Retrieve a report by ID.
        
        Args:
            session: SQLAlchemy session
            report_id: Report ID
            
        Returns:
            Report object or None if not found
        """
        try:
            report = session.query(Report).filter(Report.id == report_id).first()
            if report:
                logger.info(f"Report {report_id} retrieved successfully")
            else:
                logger.warning(f"Report {report_id} not found")
            return report
        except SQLAlchemyError as e:
            logger.error(f"Database error retrieving report: {str(e)}")
            raise Exception(f"Failed to retrieve report: {str(e)}")
    
    def update_report(self, session: Session, report_id: int, report_data: Dict[str, Any]) -> Optional[Report]:
        """
        Update an existing report.
        
        Args:
            session: SQLAlchemy session
            report_id: Report ID
            report_data: Dictionary with updated data
            
        Returns:
            Updated Report object or None if not found
        """
        try:
            report = session.query(Report).filter(Report.id == report_id).first()
            
            if not report:
                logger.warning(f"Report {report_id} not found for update")
                return None
            
            # Update fields
            for key, value in report_data.items():
                if hasattr(report, key):
                    setattr(report, key, value)
            
            session.commit()
            session.refresh(report)
            
            logger.info(f"Report {report_id} updated successfully")
            return report
        except SQLAlchemyError as e:
            session.rollback()
            logger.error(f"Database error updating report: {str(e)}")
            raise Exception(f"Failed to update report: {str(e)}")
    
    def delete_report(self, session: Session, report_id: int) -> bool:
        """
        Delete a report by ID.
        
        Args:
            session: SQLAlchemy session
            report_id: Report ID
            
        Returns:
            True if deleted, False if not found
        """
        try:
            report = session.query(Report).filter(Report.id == report_id).first()
            
            if not report:
                logger.warning(f"Report {report_id} not found for deletion")
                return False
            
            session.delete(report)
            session.commit()
            
            logger.info(f"Report {report_id} deleted successfully")
            return True
        except SQLAlchemyError as e:
            session.rollback()
            logger.error(f"Database error deleting report: {str(e)}")
            raise Exception(f"Failed to delete report: {str(e)}")
    
    def get_all_reports(self, session: Session, limit: int = 100) -> List[Report]:
        """
        Get all reports with optional limit.
        
        Args:
            session: SQLAlchemy session
            limit: Maximum number of reports to return
            
        Returns:
            List of Report objects
        """
        try:
            reports = session.query(Report).order_by(Report.created_at.desc()).limit(limit).all()
            logger.info(f"Retrieved {len(reports)} reports")
            return reports
        except SQLAlchemyError as e:
            logger.error(f"Database error retrieving all reports: {str(e)}")
            raise Exception(f"Failed to retrieve reports: {str(e)}")
    
    def get_user_reports(self, session: Session, user_id: int, limit: int = 100) -> List[Report]:
        """
        Get all reports for a specific user.
        
        Args:
            session: SQLAlchemy session
            user_id: User ID
            limit: Maximum number of reports to return
            
        Returns:
            List of Report objects
        """
        try:
            reports = session.query(Report).filter(
                Report.user_id == user_id
            ).order_by(Report.created_at.desc()).limit(limit).all()
            logger.info(f"Retrieved {len(reports)} reports for user {user_id}")
            return reports
        except SQLAlchemyError as e:
            logger.error(f"Database error retrieving user reports: {str(e)}")
            raise Exception(f"Failed to retrieve user reports: {str(e)}")
