from flask import Blueprint, request, jsonify
from app.ai.llama_service import safe_generate_response as generate_response

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/ask', methods=['POST'])
def ask_ai():
    data = request.get_json(silent=True)
    prompt = data.strip() if isinstance(data, str) else (data or {}).get('prompt', '')
    prompt = (prompt or "").strip()  # Python은 strip()만 사용

    if not prompt:
        return jsonify({"error": "프롬프트가 비어 있습니다."}), 400

    try:
        result = generate_response(prompt)
        return jsonify(result if isinstance(result, dict) else {"answer": result})
    except Exception:
        return jsonify({"error": "AI 응답 생성 중 오류가 발생했습니다."}), 500


@ai_bp.route("/insight", methods=["POST"])
def ai_insight():
    data = request.get_json(silent=True)
    prompt = data.strip() if isinstance(data, str) else (data or {}).get("prompt", "")
    prompt = (prompt or "").strip()

    if not prompt:
        return jsonify({"error": "프롬프트가 비어있습니다."}), 400

    result = generate_response(prompt)
    return jsonify(result if isinstance(result, dict) else {"response": result})
