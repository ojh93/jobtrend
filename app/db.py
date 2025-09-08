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
