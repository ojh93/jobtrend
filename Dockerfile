# 1. 파이썬 3.11이 설치된 깨끗한 리눅스(slim 버전)를 준비합니다.
FROM python:3.11-slim

# 2. 리눅스 안에 /app 이라는 작업 폴더를 만듭니다.
WORKDIR /app

# 3. 리눅스용 C++ 빌드 도구(build-essential)를 설치합니다.
RUN apt-get update && apt-get install -y build-essential

# 4. 라이브러리 설치
COPY requirements.txt .

# [수정됨] 핵심 라이브러리들을 순서대로 설치합니다.
RUN pip install hf_transfer
# ▼▼▼ 여기가 추가된 핵심입니다! ▼▼▼
RUN pip install llama-cpp-python 
# ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
RUN pip install -r requirements.txt

# ---------------------------------------------------------
# 5. [핵심] 빌드 시점에 AI 모델 미리 다운로드 (이미지에 포함!)
# ---------------------------------------------------------
ENV HF_HUB_ENABLE_HF_TRANSFER=1

# 파이썬 코드를 직접 실행해서 모델을 받아옵니다.
RUN python -c "from huggingface_hub import hf_hub_download; hf_hub_download(repo_id='Bllossom/llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M', filename='llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M.gguf')"

# 6. 나머지 모든 프로젝트 코드를 복사합니다.
COPY . .

# 7. 컨테이너가 실행될 때 이 명령어를 실행합니다.
CMD ["flask", "run", "--host=0.0.0.0"]