import sqlite3
import os

# 컨테이너 내부의 DB 파일 경로
DB_PATH = '/app/instance/jobtrend.db'
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # 1. 사용자(Users) 테이블 생성
    cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
    ''')
    
    # 2. 트렌드 기록(Trend History) 테이블 생성
    cur.execute('''
    CREATE TABLE IF NOT EXISTS trend_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        job TEXT NOT NULL,
        year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
    ''')
    
    conn.commit()
    conn.close()
    print("✅ DB 테이블 생성 완료!")

if __name__ == '__main__':
    init_db()