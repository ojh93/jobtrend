import os
from flask import Flask
from instance.config import Config
from flask_cors import CORS  # 🔹 CORS 추가

def create_app():
    app = Flask(
        __name__,
        template_folder=os.path.join(os.path.dirname(__file__), 'templates'),
        static_folder=os.path.join(os.path.dirname(__file__), 'static')
    )

    # 환경설정
    app.config.from_object(Config)
    # ✅ 기본 세션은 브라우저 종료 시 만료
    app.config['SESSION_PERMANENT'] = False

    # 🔹 CORS 설정
    # 개발 환경: 모든 도메인 허용
    CORS(app)

    # 운영 환경: 특정 도메인만 허용 (예시)
    # CORS(app, resources={
    #     r"/api/*": {
    #         "origins": ["https://myfrontend.com"],  # 프론트엔드 주소
    #         "methods": ["GET", "POST", "OPTIONS"],
    #         "allow_headers": ["Content-Type", "Authorization"]
    #     }
    # })

    # 전역 캐시 방지
    @app.after_request
    def add_no_cache_headers(response):
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response

    # 블루프린트 등록
    from .routes.main import main_bp
    from .routes.auth import auth_bp
    from .routes.trend import trend_bp
    from .ai import ai_bp 

    app.register_blueprint(main_bp)  # '/' 경로
    app.register_blueprint(auth_bp, url_prefix='/auth')  # '/auth/...' 경로
    app.register_blueprint(trend_bp)
    app.register_blueprint(ai_bp)

    return app
