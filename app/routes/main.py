from flask import Blueprint, render_template, session, redirect, url_for, flash, request, jsonify
from app.db import get_connection
import hashlib
import pandas as pd
import os
import time
import concurrent.futures
from app.ai.llama_service import safe_generate_response

main_bp = Blueprint('main', __name__)

# CSV 경로
CSV_PATH = os.path.abspath(
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "csv", "income_quintile_distribution.csv")
)

# CSV 로드
def load_job_names():
    df = pd.read_csv(CSV_PATH)
    return sorted(df['occupation_name'].dropna().unique().tolist())

# 홈
@main_bp.route('/')
def index():
    return render_template('index.html', user_name=session.get('user_name'))

# 마이페이지
@main_bp.route('/mypage')
def mypage():
    if 'user_id' not in session:
        flash('로그인이 필요합니다.')
        return redirect(url_for('auth.login'))
    return render_template('mypage.html')

# 마이페이지 데이터 API
@main_bp.route('/mypage/data')
def mypage_data():
    uid = session.get('user_id')
    if not uid:
        return jsonify({'error': '로그인이 필요합니다'}), 401

    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                SELECT username, email
                FROM users
                WHERE id = :user_id
            """, {'user_id': uid})
            row = cur.fetchone()
            if not row:
                return jsonify({'error': '사용자 정보를 찾을 수 없습니다'}), 404
            user_info = {'name': row[0], 'email': row[1]}

            cur.execute("""
                SELECT id, job, result_summary, education, career, created_at
                FROM predictions
                WHERE user_id = :user_id
                ORDER BY created_at DESC
            """, {'user_id': uid})
            insights = [
                {
                    'id': r[0], 'job': r[1], 'summary': r[2],
                    'education': r[3], 'career': r[4],
                    'created_at': r[5].strftime('%Y-%m-%d %H:%M:%S') if r[5] else None
                } for r in cur.fetchall()
            ]

            cur.execute("""
                SELECT id, job, year, created_at
                FROM trend_history
                WHERE user_id = :user_id
                ORDER BY created_at DESC
            """, {'user_id': uid})
            trend_history = [
                {
                    'id': r[0], 'job': r[1], 'year': r[2],
                    'created_at': r[3].strftime('%Y-%m-%d %H:%M:%S') if r[3] else None
                } for r in cur.fetchall()
            ]

            return jsonify({'user': user_info, 'insights': insights, 'trend_history': trend_history})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

# 프로필 업데이트
@main_bp.route('/profile/update', methods=['POST'])
def profile_update():
    if 'user_id' not in session:
        return jsonify({'error': '로그인이 필요합니다.'}), 401

    data = request.get_json(silent=True) or {}
    name, email = data.get('name'), data.get('email')
    if not name or not email:
        return jsonify({'error': '이름과 이메일은 필수입니다.'}), 400

    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                SELECT id FROM users
                WHERE email = :email AND id != :uid
            """, {'email': email, 'uid': session['user_id']})
            if cur.fetchone():
                return jsonify({'error': '이미 사용 중인 이메일입니다.'}), 400

            cur.execute("""
                UPDATE users
                SET username = :name, email = :email
                WHERE id = :uid
            """, {'name': name, 'email': email, 'uid': session['user_id']})
            if cur.rowcount == 0:
                return jsonify({'error': '수정된 행이 없습니다.'}), 400

            conn.commit()
            session['user_name'], session['user_email'] = name, email
            session.modified = True
            return jsonify({'status': 'success', 'name': name, 'email': email})
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500

# 프로필 삭제
@main_bp.route('/profile/delete', methods=['POST'])
def profile_delete():
    if 'user_id' not in session:
        return jsonify({'error': '로그인이 필요합니다.'}), 401

    data = request.get_json(silent=True) or {}
    password = data.get('password')
    if not password:
        return jsonify({'error': '비밀번호가 필요합니다.'}), 400

    user_id = int(session['user_id'])
    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("SELECT password FROM users WHERE id = :p_uid", {'p_uid': user_id})
            row = cur.fetchone()
            if not row:
                return jsonify({'error': '계정을 찾을 수 없습니다.'}), 404

            if row[0] != hashlib.sha256(password.encode()).hexdigest():
                return jsonify({'error': '비밀번호가 일치하지 않습니다.'}), 403

            cur.execute("DELETE FROM users WHERE id = :p_uid", {'p_uid': user_id})
            conn.commit()
            session.clear()
            return jsonify({'status': 'deleted', 'redirect': url_for('auth.login')})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

# 인사이트 삭제
@main_bp.route('/api/insight/<int:pid>', methods=['DELETE'])
def delete_insight(pid):
    if 'user_id' not in session:
        return jsonify({'error': '로그인 필요'}), 401

    with get_connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute("""
                DELETE FROM predictions
                WHERE id = :p_pid AND user_id = :p_uid
            """, {'p_pid': pid, 'p_uid': session['user_id']})
            conn.commit()
            return jsonify({'status': 'deleted'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

# 페이지 라우팅
@main_bp.route('/trend')
def trend():
    return render_template('trend.html')

@main_bp.route('/insight')
def insight():
    return render_template('insight.html', jobs=load_job_names())

# AI 응답 생성 (질문 원문 그대로 llama_service.py로 전달)
def generate_insight_answer(question: str) -> dict:
    return safe_generate_response(question, timeout=70)

# 단일 인사이트 API
@main_bp.route("/api/insight", methods=["POST", "OPTIONS"])
def insight_api():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json(silent=True)
    if isinstance(data, str):
        question = data.strip().strip('"')
    elif isinstance(data, dict):
        question = (data.get("question") or data.get("prompt") or "").strip()
    else:
        try:
            question = (request.data or b"").decode("utf-8", "ignore").strip().strip('"')
        except Exception:
            question = ""

    if not question:
        return jsonify({"error": "질문을 입력하세요."}), 400

    start_time = time.time()
    result = generate_insight_answer(question)
    elapsed = time.time() - start_time
    print(f"[DEBUG] insight_api 응답 시간: {elapsed:.2f}초")

    return (
        jsonify({"answer": result["answer"]}),
        200
    ) if result.get("ok") else (jsonify({"error": result.get("error")}), 504)

# 배치 인사이트 API
@main_bp.route("/api/ai/insight/batch", methods=["POST"])
def insight_batch_api():
    data = request.get_json(force=True) or {}
    jobs = data.get("jobs", [])
    if not jobs or not isinstance(jobs, list):
        return jsonify({"error": "jobs 배열이 필요합니다."}), 400

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        futures = [
            executor.submit(
                lambda name: {
                    "job": name,
                    **(
                        {"answer": res["answer"]}
                        if (res := generate_insight_answer(name)).get("ok")
                        else {"error": res.get("error")}
                    )
                },
                job
            )
            for job in jobs
        ]

        for f in concurrent.futures.as_completed(futures):
            results.append(f.result())

    return jsonify(results), 200
