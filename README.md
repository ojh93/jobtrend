<<<<<<< HEAD
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
<img width="438" height="945" alt="폴더 구조" src="https://github.com/user-attachments/assets/b0ab88c1-e72f-4392-a3b5-0a1424a99bc6" />

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

## 	🎞️ 주요 기능 시연 영상
![직군 트렌드 예측 _ JobTrends - Chrome 2025-09-04 13-58-00](https://github.com/user-attachments/assets/8ee1fd74-ac6b-4934-b6ca-488a66ca72fd)
- 직군 트렌드 예측 영상 : 사용자가 선택한 직군과 기준연도의 소득 성장률, 소득 분위를 예측합니다.

![AI 인사이트 _ JobTrends - Chrome 2025-09-04 14-08-44](https://github.com/user-attachments/assets/4750d662-bc15-4f18-9383-19f54a22aaec)

- 생성형 AI 답변 영상 : 사용자가 질문 예시를 선택하거나 직접 궁금한 점을 입력하면 ai의 답변이 제공됩니다.





=======

## 🚀 실행 방법

1. 이 폴더를 그대로 로컬에 복사
2. 브라우저로 `index.html` 열기
3. 모든 기능은 JavaScript 기반으로 정상 작동

## 🛠️ 기술 스택

- HTML5, CSS3, JavaScript (Vanilla JS)
- MVC 구조 분리
- 재사용 가능한 컴포넌트 구조 (`components/`)

## 💡 주요 기능

- 페이지 간 이동
- 사용자 인터랙션 반영
- 동적 콘텐츠 렌더링
- 유지보수 가능한 구조

## 📄 작업 내역

- 기존 JS 코드 분리: controller, model, view
- 주석 및 코드 설명 보강
- 폴더 구조 개편 및 명확한 책임 분할
- 공통 레이아웃 컴포넌트화


>>>>>>> a9ccfb7 (feat: 최신 Dockerfile 및 라우트 오류 수정 사항 반영)
