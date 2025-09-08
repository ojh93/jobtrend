from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify, make_response, current_app
from app.db import get_connection
import hashlib

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

def hash_password(password: str) -> str:
    return hashlib.sha256(password.strip().encode()).hexdigest()

def clear_session_cookie(resp):
    """세션 쿠키 완전 삭제"""
    cookie_name = current_app.config.get("SESSION_COOKIE_NAME", "session")
    resp.set_cookie(
        cookie_name,
        '',
        expires=0,
        max_age=0,
        path="/",
        domain=None,       # 필요시 지정
        secure=False,      # HTTPS 환경이면 True
        httponly=True,
        samesite="Lax"
    )
    return resp

# --- 회원가입 ---
@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')

    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    password = request.form.get('password', '')

    if not name or not email or not password:
        flash('모든 필드를 입력하세요.')
        return redirect(url_for('auth.signup'))

    hashed_pw = hash_password(password)

    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM users WHERE email = :email", {'email': email})
        if cursor.fetchone()[0] > 0:
            flash('이미 사용 중인 이메일입니다.')
            return redirect(url_for('auth.signup'))

        cursor.execute("""
            INSERT INTO users (username, email, password)
            VALUES (:name, :email, :password)
        """, {'name': name, 'email': email, 'password': hashed_pw})
        conn.commit()

        # 자동 로그인
        cursor.execute("""
            SELECT id, username FROM users
            WHERE email = :email AND password = :password
        """, {'email': email, 'password': hashed_pw})
        user = cursor.fetchone()

        if user:
            session.permanent = True
            session['user_id'] = user[0]
            session['user_name'] = user[1]
            flash(f'{user[1]}님, 회원가입을 환영합니다!')
            return redirect(url_for('main.index'))

    except Exception as e:
        flash(f'오류 발생: {str(e)}')
        return redirect(url_for('auth.signup'))
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        # 세션 초기화 + 쿠키 삭제
        session.clear()
        resp = make_response(render_template('login.html'))
        return clear_session_cookie(resp)

    # JSON과 form-data 모두 처리
    if request.is_json:
        data = request.get_json(silent=True) or {}
        email = data.get('email', '').strip()
        password = data.get('password', '')
    else:
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

    if not email or not password:
        if request.is_json:
            return jsonify(success=False, message='이메일과 비밀번호를 모두 입력하세요.'), 400
        flash('이메일과 비밀번호를 모두 입력하세요.', 'error')
        return render_template('login.html', email=email), 400

    hashed_pw = hash_password(password)

    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, username FROM users
            WHERE email = :email AND password = :password
        """, {'email': email, 'password': hashed_pw})
        user = cursor.fetchone()

        if not user:
            # 실패 처리
            if request.is_json:
                return jsonify(success=False, message='이메일 또는 비밀번호가 올바르지 않습니다.'), 401
            flash('이메일 또는 비밀번호가 올바르지 않습니다.', 'error')
            return render_template('login.html', email=email), 401

        # 성공 처리
        session.permanent = True
        session['user_id'] = user[0]
        session['user_name'] = user[1]

        if request.is_json:
            return jsonify(success=True, message=f'{user[1]}님, 환영합니다!', redirect=url_for('main.index'))

        flash(f'{user[1]}님, 환영합니다!', 'success')
        return redirect(url_for('main.index'))

    except Exception as e:
        if request.is_json:
            return jsonify(success=False, message=str(e)), 500
        flash(f'오류 발생: {str(e)}', 'error')
        return render_template('login.html', email=email), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


@auth_bp.route('/logout', methods=['GET', 'POST'])
def logout():
    # 세션 전체 삭제
    session.clear()

    # 쿠키 삭제
    resp = make_response(redirect(url_for('auth.login')))
    return clear_session_cookie(resp)



# --- 대시보드 ---
@auth_bp.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('로그인이 필요합니다.')
        return redirect(url_for('auth.login'))
    return render_template('dashboard.html', name=session['user_name'])

# --- 개인정보 수정 ---
@auth_bp.route('/update', methods=['PUT'])
def update_user():
    if 'user_id' not in session:
        return jsonify(error='로그인이 필요합니다.'), 401

    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    hashed_pw = hash_password(password)

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE users
            SET username = :name, email = :email, password = :password
            WHERE id = :id
        """, {
            'name': name,
            'email': email,
            'password': hashed_pw,
            'id': session['user_id']
        })
        conn.commit()
        session['user_name'] = name
        session['user_email'] = email
        session.modified = True
        return jsonify(message='정보 수정 성공')
    except Exception as e:
        conn.rollback()
        return jsonify(error=str(e)), 500
    finally:
        cur.close()
        conn.close()

# --- 회원 탈퇴 ---
@auth_bp.route('/delete', methods=['DELETE'])
def delete_user():
    if 'user_id' not in session:
        return jsonify(error='로그인이 필요합니다.'), 401

    data = request.get_json()
    password = data.get('password')
    hashed_pw = hash_password(password)

    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id FROM users
            WHERE id = :id AND password = :password
        """, {'id': session['user_id'], 'password': hashed_pw})
        if not cursor.fetchone():
            return jsonify(error='비밀번호가 올바르지 않습니다.'), 400

        cursor.execute("DELETE FROM users WHERE id = :id", {'id': session['user_id']})
        conn.commit()

        session.clear()
        resp = make_response(jsonify(message='회원탈퇴 완료', redirect='/auth/login'))
        return clear_session_cookie(resp)

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify(error=str(e)), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()
