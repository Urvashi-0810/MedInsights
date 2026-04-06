"""init_db.py helper - Initialize database from Flask app context."""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from init_db import init_database

if __name__ == "__main__":
    init_database()
