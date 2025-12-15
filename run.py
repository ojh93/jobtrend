<<<<<<< HEAD
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
    # Render가 할당한 포트를 사용 (없으면 기본 5000)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

=======
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
    # Render가 할당한 포트를 사용 (없으면 기본 5000)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

>>>>>>> a9ccfb7 (feat: 최신 Dockerfile 및 라우트 오류 수정 사항 반영)
