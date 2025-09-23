# JobTrends — 직군 성장률·소득분위 예측 & AI 인사이트

> **Flask + Oracle + LangChain + LLaMA** 기반의 직군 데이터 분석 및 AI 인사이트 제공 웹 서비스  
> 사용자의 직군 정보를 기반으로 **성장률·소득분위 예측**과 **맞춤형 AI 인사이트**를 제공합니다.



## 📌 프로젝트 개요
JobTrends는 공공 데이터와 AI 모델을 결합해 **직군별 미래 전망**을 예측하고,  
사용자 맞춤형 인사이트를 제공하는 서비스입니다.

- **직군 트렌드 예측**: 성장률·소득분위 예측 및 시각화
- **AI 인사이트**: LLaMA 기반 요약·분석·추천
- **마이페이지**: 예측/인사이트 이력 관리
- **회원 시스템**: 회원가입·로그인·프로필 수정·탈퇴



## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| **백엔드** | Python 3, Flask, Flask-CORS, cx_Oracle, SQLAlchemy |
| **AI** | Hugging Face Hub, llama_cpp_python, LangChain, transformers |
| **프론트엔드** | HTML5, CSS3, JavaScript(ES6 Modules), D3.js, Chart.js |
| **데이터** | CSV 기반 예측 데이터, Pandas, NumPy |
| **기타** | bcrypt, dotenv, requests |


## 📂 폴더 구조

app/ ├── ai/ # AI 서비스 모듈 │ ├── llama_service.py │ └── routes.py ├── models/ # 데이터 모델 │ └── user.py ├── static/ # 정적 파일 (CSS, JS, 이미지, CSV) │ ├── css/ │ ├── js/ │ │ ├── controller/ │ │ ├── model/ │ │ ├── utils/ │ │ └── view/ │ └── assets/ ├── templates/ # HTML 템플릿 │ ├── base.html │ ├── index.html │ ├── insight.html │ └── trend.html ├── utils/ # 헬퍼 함수 │ └── helpers.py ├── db.py # Oracle DB 연결 └── run.py # Flask 앱 실행 진입점

## 🚀 주요 기능

### 1. 직군 트렌드 예측
- CSV 기반 성장률·소득분위 예측
- Chart.js 시각화
- 예측 결과 마이페이지 자동 저장

### 2. AI 인사이트
- Hugging Face LLaMA 모델 로드
- LangChain PromptTemplate 기반 요약·분석
- 실시간 채팅 UI + 추천 질문

### 3. 회원 시스템
- 회원가입, 로그인, 로그아웃
- 프로필 수정, 회원탈퇴
- bcrypt 비밀번호 해시

### 4. 마이페이지
- 예측/인사이트 이력 조회·삭제
- 프로필 관리
