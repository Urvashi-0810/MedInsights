"""
SQLAlchemy ORM models for database tables.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, TIMESTAMP, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Report(Base):
    """
    Main reports table storing all medical report analysis data.
    All JSON data is stored in JSONB columns for PostgreSQL efficiency.
    """
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=True)
    file_url = Column(Text, nullable=False)
    ocr_text = Column(Text, nullable=True)
    
    # JSON-stored structured analysis data
    structured_data = Column(JSON, nullable=True, default={})
    risk_scores = Column(JSON, nullable=True, default={})
    parameters = Column(JSON, nullable=True, default=[])
    key_findings = Column(JSON, nullable=True, default=[])
    ai_summary = Column(JSON, nullable=True, default={})
    recommendations = Column(JSON, nullable=True, default={})
    diet_plan = Column(JSON, nullable=True, default={})
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Report(id={self.id}, user_id={self.user_id}, created_at={self.created_at})>"
    
    def to_dict(self):
        """Convert model to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "file_url": self.file_url,
            "structured_data": self.structured_data,
            "risk_scores": self.risk_scores,
            "parameters": self.parameters,
            "key_findings": self.key_findings,
            "ai_summary": self.ai_summary,
            "recommendations": self.recommendations,
            "diet_plan": self.diet_plan,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
