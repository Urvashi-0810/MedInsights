"""
Database initialization script.
Creates all necessary tables and indexes.
Run this once before starting the application.
"""

import logging
from config import Config
from models import Base
from services.database_service import DatabaseService

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def init_database():
    """Initialize database and create all tables."""
    try:
        logger.info("Starting database initialization...")
        
        # Create database service
        db_service = DatabaseService()
        
        # Create all tables
        db_service.create_tables()
        
        logger.info("✓ Database initialization completed successfully")
        logger.info(f"Database URL: {Config.get_database_url()}")
        
        return True
    except Exception as e:
        logger.error(f"✗ Database initialization failed: {str(e)}")
        logger.error("Make sure PostgreSQL is running and credentials are correct")
        return False


if __name__ == "__main__":
    success = init_database()
    exit(0 if success else 1)
