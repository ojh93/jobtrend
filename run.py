import os
from flask import Flask
from flask_cors import CORS
from instance.config import Config

# ===== 1. Flask 앱 생성 =====
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, "app", "templates")
STATIC_DIR = os.path.join(BASE_DIR, "app", "static")

app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.config.from_object("instance.config.Config")

# 🔹 CORS 설정 (개발: *, 운영: 특정 도메인)
CORS(app, resources={r"/*": {"origins": "*"}})

# ===== 2. 블루프린트 등록 =====
from app.routes.main import main_bp
from app.routes.auth import auth_bp
from app.routes.trend import trend_bp
from app.ai.routes import ai_bp

app.register_blueprint(ai_bp, url_prefix="/api/ai")
app.register_blueprint(main_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(trend_bp)

# ===== 3. 서버 실행 =====
if __name__ == "__main__":
    # 서버 시작 시 모델을 미리 로드하고 싶다면 아래 주석 해제
    # from app.ai import llama_service
    # llama_service.load_model()

    app.run(host="0.0.0.0", port=5000, debug=False)
