import concurrent.futures
import logging
import os
import psutil
from huggingface_hub import hf_hub_download, login
from llama_cpp import Llama
from langchain.llms.base import LLM
from langchain.prompts import PromptTemplate

# ----------- Hugging Face 로그인 (토큰이 있으면) -----------
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
if HF_API_TOKEN:
    login(token=HF_API_TOKEN)

# ----------- CPU/메모리 기반 최적화 -----------
def auto_optimize_params():
    cpu_count = os.cpu_count() or 4
    mem_gb = psutil.virtual_memory().total / (1024**3)
    threads = max(2, int(cpu_count * 0.75))
    batch = 128 if mem_gb >= 16 else 64 if mem_gb >= 8 else 32
    return threads, batch

N_THREADS, N_BATCH = auto_optimize_params()

# ----------- 모델 로딩 (환경 변수에서 읽기) -----------
REPO_ID = os.getenv(
    "HF_REPO_ID",
    "Bllossom/llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M"
)
FILENAME = os.getenv(
    "HF_FILENAME",
    "llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M.gguf"
)
CTX_SIZE = int(os.getenv("HF_CTX_SIZE", 512))

model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
llm_cpp = Llama(
    model_path=model_path,
    n_ctx=CTX_SIZE,
    n_threads=N_THREADS,
    n_batch=N_BATCH,
    use_mlock=True,
    verbose=False
)
llm_cpp("테스트", max_tokens=1, temperature=0.0)  # Warm-up

# ----------- LangChain LLM 래퍼 -----------
class LlamaCppLLM(LLM):
    def _call(self, prompt: str, stop=None):
        res = llm_cpp(
            prompt,
            max_tokens=80,
            temperature=0.7,
            top_p=1.0,
            top_k=40,
            stop=stop or ["다. ", "요. ", "다.", "요.", "</s>"],
            echo=False
        )
        return res["choices"][0]["text"].strip()

    @property
    def _identifying_params(self):
        return {"model_path": model_path}

    @property
    def _llm_type(self):
        return "llama_cpp_python"

llm = LlamaCppLLM()

# ----------- 프롬프트: 한 문장 요약 -----------
prompt_template = (
    "다음 내용을 한국 기준으로 40~60자 내의 완결된 한 문장으로 요약하라. "
    "긍정과 부정을 균형 있게 포함하고 군더더기 없이 작성하라.\n\n"
    "내용: {question}\n\n"
    "출력은 한 문장만 하시오."
)
prompt = PromptTemplate(input_variables=["question"], template=prompt_template)
chain = prompt | llm

# ----------- 후처리 -----------
def _postprocess_generated_text(full_text: str) -> str:
    text = full_text.replace("\n", " ").strip()
    for end in ["다.", "요."]:
        if end in text:
            text = text.split(end)[0] + end
            break
    if text.endswith("된"):
        text = text.rstrip("된") + "됩니다."
    elif not (text.endswith("다.") or text.endswith("요.")):
        text += "다."
    return text

# ----------- 안전 실행 -----------
def safe_generate_response(question: str, timeout: int = 30) -> dict:
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(lambda: chain.invoke({"question": question.strip()}))
            answer = future.result(timeout=timeout)
            return {"ok": True, "answer": _postprocess_generated_text(answer)}
    except concurrent.futures.TimeoutError:
        logging.warning(f"LangChain generate_response timed out after {timeout} seconds")
        return {"ok": False, "error": "timeout"}
    except Exception as e:
        logging.exception("LangChain generate_response 호출 중 예외 발생")
        return {"ok": False, "error": f"AI 호출 오류: {str(e)}"}

def generate_response(question: str, timeout: int = 30):
    result = safe_generate_response(question, timeout=timeout)
    return result.get("answer") if result.get("ok") else result
