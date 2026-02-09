import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use environment variable if available (for Render PostgreSQL), otherwise use SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///fastapi_db")

# Convert PostgreSQL URL format if needed (Render uses postgres://, SQLAlchemy needs postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)




