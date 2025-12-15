<<<<<<< HEAD
import os
import cx_Oracle
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    try:
        dsn = cx_Oracle.makedsn(
            os.getenv("ORACLE_HOST"),
            int(os.getenv("ORACLE_PORT")),
            service_name=os.getenv("ORACLE_SERVICE")
        )
        conn = cx_Oracle.connect(
            user=os.getenv("ORACLE_USER"),
            password=os.getenv("ORACLE_PASSWORD"),
            dsn=dsn,
            encoding="UTF-8"
        )
        return conn
    except cx_Oracle.DatabaseError as e:
        error, = e.args
        print(f"❌ 데이터베이스 연결 실패: {error.message}")
        raise
=======
import sqlite3
import os

# 현재 app 디렉토리의 절대 경로
APP_DIR = os.path.dirname(os.path.abspath(__file__))
# app 디렉토리의 부모 (프로젝트 루트)로 이동 후 'instance' 폴더 지정
INSTANCE_DIR = os.path.join(os.path.dirname(APP_DIR), 'instance')
# instance 폴더 안에 jobtrend.db 파일 경로 지정
DB_PATH = os.path.join(INSTANCE_DIR, 'jobtrend.db')

# /app/instance 디렉토리가 (컨테이너 내에) 없으면 생성
os.makedirs(INSTANCE_DIR, exist_ok=True)

def get_connection():
    # DB_PATH 경로에 jobtrend.db 파일이 없으면 자동 생성하며 연결
    conn = sqlite3.connect(DB_PATH)
    # 쿼리 결과를 딕셔너리처럼 (컬럼명으로) 접근하게 설정
    conn.row_factory = sqlite3.Row
    return conn
>>>>>>> a9ccfb7 (feat: 최신 Dockerfile 및 라우트 오류 수정 사항 반영)
