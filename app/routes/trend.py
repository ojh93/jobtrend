# app/routes/trend.py
from flask import Blueprint, request, jsonify, session, render_template
from app.db import get_connection
import datetime

trend_bp = Blueprint('trend', __name__)

@trend_bp.route('/trend')
def trend_page():
    return render_template('trend.html')

@trend_bp.route('/trend/predict', methods=['POST'])
def predict_trend():
    if 'user_id' not in session:
        return jsonify({'error': '로그인이 필요합니다.'}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'error': '잘못된 요청 형식입니다.'}), 400

    job_name = data.get('job')
    year_value = data.get('year')
    if not job_name or not year_value:
        return jsonify({'error': '직업과 연도는 필수입니다.'}), 400

    prediction_result = f"{year_value}년 {job_name} 직군의 전망은 밝습니다."

    conn = get_connection()
    cur = conn.cursor()
    try:
        # DB 컬럼명 확인 후 맞게 수정 (예: job_group, "year")
        cur.execute("""
            INSERT INTO trend_history (user_id, job, year, created_at)
            VALUES (:user_id, :job, :yr, :created_at)
        """, {
            'user_id': session['user_id'],
            'job': job_name,
            'yr': year_value,
            'created_at': datetime.datetime.now()
        })
        conn.commit()
        print(f"[DEBUG] trend_history 저장 완료 → user_id={session['user_id']}, job_group={job_name}, year={year_value}")
    except Exception as e:
        conn.rollback()
        print("[ERROR] trend_history 저장 실패:", e)
        return jsonify({'error': 'DB 저장 실패'}), 500
    finally:
        cur.close()
        conn.close()

    return jsonify({'prediction': prediction_result})
