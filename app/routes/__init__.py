<<<<<<< HEAD
from .main import main_bp
from .auth import auth_bp

def register_routes(app):
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
=======
from .main import main_bp
from .auth import auth_bp

def register_routes(app):
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
>>>>>>> a9ccfb7 (feat: 최신 Dockerfile 및 라우트 오류 수정 사항 반영)
