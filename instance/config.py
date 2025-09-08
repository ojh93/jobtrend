import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()  # .env 파일 로드

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

    HF_API_TOKEN = os.getenv("HF_API_TOKEN")
    HF_MODEL_ID = os.getenv("HF_MODEL_ID")

    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_HTTPONLY = True
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1)
