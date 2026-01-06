# 📈 JobTrend — 직군 성장률 예측 & AI 커리어 조언 서비스

> **8년 차 엔지니어의 최적화 DNA를 담은 프로젝트** > **Flask(Blueprint) + Vanilla JS(MVC) + Llama 3(4bit Quantization)** 기반의 고성능 커리어 인사이트 플랫폼

## 📌 프로젝트 개요

**JobTrend**는 공공 데이터와 LLM(거대언어모델)을 결합하여 사용자에게 데이터 기반의 커리어 로드맵을 제시하는 웹 서비스입니다.
단순한 데이터 조회를 넘어, **XGBoost**를 활용한 미래 성장률 예측과 **Llama 3** 기반의 맞춤형 AI 상담 기능을 **CPU 환경에서도 2초 내에 응답**하도록 최적화하여 구현했습니다.

### 🎯 핵심 가치

* **Data-Driven:** KLIPS(한국노동패널) 데이터를 분석하여 객관적인 성장률 및 소득 분위 예측
* **Optimization:** 고가의 GPU 없이도 실행 가능한 경량화된 온디바이스급 AI 모델 서빙
* **Architecture:** 프레임워크에 의존하지 않는 순수 MVC 패턴 구현을 통한 웹 본질의 이해

## 🛠 기술 스택 (Tech Stack)

<table>
  <thead>
    <tr>
      <th width="15%">영역</th>
      <th width="30%">기술 스택</th>
      <th width="55%">상세 활용 내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><b>Backend</b></td>
      <td>
        <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=white">
        <img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=Flask&logoColor=white">
      </td>
      <td>
        <ul>
          <li><b>App Factory & Blueprint</b> 패턴으로 모듈화된 아키텍처 설계</li>
          <li><b>RESTful API</b> 설계 및 세션 기반 인증 구현</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><b>AI / LLM</b></td>
      <td>
        <img src="https://img.shields.io/badge/Llama_3-0467DF?style=flat-square">
        <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=LangChain&logoColor=white">
      </td>
      <td>
        <ul>
          <li><b>GGUF 4bit Quantization</b> 적용 (메모리 최적화)</li>
          <li><code>llama-cpp-python</code>을 활용한 CPU 추론 가속</li>
          <li>LangChain PromptTemplate을 활용한 답변 구조화</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><b>Data / ML</b></td>
      <td>
        <img src="https://img.shields.io/badge/Oracle-F80000?style=flat-square&logo=Oracle&logoColor=white">
        <img src="https://img.shields.io/badge/XGBoost-15B459?style=flat-square">
      </td>
      <td>
        <ul>
          <li><b>Oracle Cloud ATP</b> 연동 (cx_Oracle)</li>
          <li>XGBoost Regressor를 활용한 시계열 성장률 예측</li>
          <li>Pandas를 활용한 IQR 이상치 제거 및 전처리</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><b>Frontend</b></td>
      <td>
        <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
        <img src="https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white">
      </td>
      <td>
        <ul>
          <li><b>Custom MVC Pattern</b> (Model-View-Controller) 직접 구현</li>
          <li>Chart.js를 활용한 동적 데이터 시각화</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><b>DevOps</b></td>
      <td>
        <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white">
      </td>
      <td>
        <ul>
          <li>Multi-stage build를 통한 이미지 경량화</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## 📂 소프트웨어 아키텍처 & 폴더 구조

기능별 응집도를 높이고 결합도를 낮추기 위해 **백엔드(Blueprint)**와 **프론트엔드(MVC)** 모두 모듈형 구조를 채택했습니다.

```bash
📦 jobtrend
 ┣ 📂 app
 ┃ ┣ 📂 ai              # AI 관련 로직 (Llama 3 로드, LangChain 설정)
 ┃ ┣ 📂 data            # 머신러닝 학습용 CSV 데이터
 ┃ ┣ 📂 models          # DB 엔티티 (User, Prediction 등)
 ┃ ┣ 📂 routes          # Flask Blueprint 라우트 (Auth, Main, Trend)
 ┃ ┣ 📂 static
 ┃ ┃ ┣ 📂 js
 ┃ ┃ ┃ ┣ 📂 controller  # 사용자 입력 처리 및 이벤트 핸들링
 ┃ ┃ ┃ ┣ 📂 model       # 데이터 비즈니스 로직 (API 통신)
 ┃ ┃ ┃ ┗ 📂 view        # UI 렌더링 및 DOM 조작
 ┃ ┗ 📂 templates       # Jinja2 HTML 템플릿
 ┣ 📜 Dockerfile        # 컨테이너 빌드 설정
 ┣ 📜 run.py            # 앱 실행 진입점
 ┗ 📜 requirements.txt  # 의존성 패키지 목록

```

## 🚀 주요 기술적 도전 (Technical Challenges)

### 1. CPU 환경에서의 LLM 최적화 (7s → 2s)

* **문제:** 고사양 GPU가 없는 클라우드 환경(Render, 일반 Docker)에서 Llama 3(8B) 모델 구동 시 메모리 부족 및 7초 이상의 응답 지연 발생.
* **해결:**
* HuggingFace에서 **GGUF 포맷**으로 변환된 모델을 로드하여 **4-bit 양자화(Quantization)** 적용.
* `llama-cpp-python` 라이브러리를 통해 CPU 명령어 세트(AVX2 등)를 활용한 추론 가속.


* **결과:** 응답 속도를 평균 **2초대로 단축(약 70% 개선)**하며 실시간 서비스 가능성 확보.

### 2. 프레임워크 없는 순수 MVC 패턴 구현

* **의도:** React 등 프레임워크의 '마법'에 의존하기보다, JavaScript의 본질적인 데이터 흐름과 상태 관리를 이해하고자 함.
* **구현:**
* **Model:** `fetch` API를 통해 백엔드와 통신하고 데이터를 관리.
* **View:** 데이터를 받아 DOM을 업데이트하고 차트를 렌더링.
* **Controller:** 사용자 이벤트를 감지하여 Model과 View를 조율.


* **결과:** 코드의 역할이 명확해져 유지보수가 쉬워졌으며, 프론트엔드 아키텍처에 대한 이해도 상승.

## ✨ 주요 기능 시연

### 1. 직군 트렌드 예측
![직군 트렌드 예측 _ JobTrends - Chrome 2025-09-04 13-58-00](https://github.com/user-attachments/assets/1b3330ae-abca-43fb-b188-a1ea638994b5)

사용자가 선택한 직군의 과거 데이터를 바탕으로 XGBoost 모델이 **미래 성장률과 소득 분위**를 예측하여 시각화합니다.

### 2. AI 인사이트 (RAG 기반)
![AI 인사이트 _ JobTrends - Chrome 2025-09-04 14-08-44](https://github.com/user-attachments/assets/68674950-ea23-4c9b-a3a8-f98cc85a9527)

예측된 데이터를 바탕으로 Llama 3 모델이 **"이 직군으로 전직하기 위한 구체적인 조언"**을 생성해줍니다.

## 💻 실행 방법 (Getting Started)

### 로컬 환경 (Local)

```bash
# 1. 저장소 클론
git clone https://github.com/ojh93/jobtrend.git

# 2. 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 의존성 설치
pip install -r requirements.txt

# 4. 모델 다운로드 (최초 1회)
python download_model.py

# 5. 실행
python run.py

```

### 도커 환경 (Docker)

```bash
# 1. 이미지 빌드
docker build -t jobtrend .

# 2. 컨테이너 실행
docker run -p 5000:5000 jobtrend

```

---

**Contact:** 오정현 (lontin36@naver.com)
