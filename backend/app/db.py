from sqlalchemy import create_engine
from app.core.config import settings
import psycopg2   # ✅ add this

engine = create_engine(settings.DATABASE_URL)


# ✅ ADD THIS FUNCTION
def get_connection():
    return psycopg2.connect(settings.DATABASE_URL)