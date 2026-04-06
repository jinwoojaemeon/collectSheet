<div align="center">

# 🚀 collectSheet

**엑셀 데이터를 업로드·분석하고, 웹에서 바로 조회·JSON API로 활용할 수 있게 만드는 프론트엔드 프로젝트**

</div>

## 📘 개요 (Overview)

본 프로젝트는 **Vite + React + TypeScript** 기반의 **싱글 페이지 애플리케이션(SPA)**으로,  
복잡한 엑셀 파일을 업로드하면 **AI 기반 분석·뷰어 스타일 선택·데이터 매핑** 흐름을 거쳐  
**대용량 데이터를 가상 스크롤로 빠르게 표시**하고, **JSON 다운로드·API URL** 등 확장을 염두에 둔 UI를 제공합니다.

현재 데모는 **목업 데이터**와 **클라이언트 측 가상 스크롤** 중심이며,  
**Spring Boot 등 백엔드 API**와 연동할 수 있도록 `axios` 기반 API 계층과 환경 변수 구조를 갖추고 있습니다.

## 🧱 기술 스택 (Tech Stack)

| 구분 | 사용 기술 |
|------|------------|
| **Runtime / Build** | Node.js, Vite 6 |
| **UI** | React 19, TypeScript 5.8 |
| **스타일** | Tailwind CSS 4 (`@tailwindcss/vite`) |
| **상태 관리** | Zustand 5 |
| **HTTP** | Axios |
| **아이콘** | Lucide React |
| **애니메이션** | Motion |
| **AI (선택)** | Google GenAI (`@google/genai`) |
| **도구** | Git, GitHub, VS Code / Cursor |

## 🛠️ 설치 및 실행 (Installation & Run)

### 1. 프로젝트 클론

```bash
git clone https://github.com/<username>/collectSheet.git
cd collectSheet
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

루트에 `.env` 또는 `.env.local` 파일을 만들고, 예시는 [`.env.example`](./.env.example)를 참고합니다.

| 변수 | 설명 |
|------|------|
| `GEMINI_API_KEY` | Google Gemini API 사용 시 (선택) |
| `VITE_API_BASE_URL` | 백엔드 API 베이스 URL (미설정 시 `src/api/config.ts` 기본값 사용) |

```bash
cp .env.example .env
# .env 를 열어 키와 URL을 본인 환경에 맞게 수정
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 접속:

```
http://localhost:3000
```

> 기본 포트는 **3000**이며, `package.json`의 `dev` 스크립트에서 변경할 수 있습니다.

### 5. 프로덕션 빌드

```bash
npm run build
npm run preview   # 빌드 결과 미리보기
```

### 6. 타입 검사

```bash
npm run lint
```

## 📂 프로젝트 구조 (Directory Structure)

```
collect-sheet/
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx                 # 엔트리
    ├── App.tsx                  # 라우팅에 가까운 페이지 전환 + lazy/Suspense
    ├── api/
    │   ├── config.ts            # API 베이스 URL, 타임아웃, 엔드포인트
    │   ├── axios.ts             # Axios 인스턴스
    │   └── services.ts          # 도메인별 API 호출 (예: sheetService)
    ├── store/
    │   └── uiStore.ts           # 화면 전환·선택 파일 등 UI 상태 (Zustand)
    ├── hooks/
    │   └── useElementHeight.ts  # 뷰어 영역 높이(ResizeObserver)
    ├── types/
    │   └── app.ts               # 공통 타입
    ├── constants/               # 목업·도메인 상수
    ├── utils/                   # 목 데이터 생성 등
    ├── styles/
    │   └── index.css            # Tailwind 엔트리
    ├── components/
    │   ├── common/              # VirtualScroll 등
    │   └── modals/              # 업로드 마법사 모달
    └── pages/
        ├── public/Landing/      # 랜딩·로그인 UI
        └── app/
            ├── Dashboard/       # 파일 목록·업로드
            └── Viewer/          # 테이블/카드 뷰 + 검색·필터
```

상세 아키텍처 가이드는 [`docs/구조가이드문서.md`](./docs/구조가이드문서.md), 개발 가이드는 [`docs/DEVELOPMENT_GUIDE.md`](./docs/DEVELOPMENT_GUIDE.md)를 참고하세요.

## 🌟 주요 기능 (Key Features)

### 🏠 공개 영역
- **랜딩 페이지**: 서비스 소개, 로그인/회원가입 진입
- **로그인 UI**: Google / 이메일 형식 (데모는 로컬 상태로 대시보드 전환)

### 📁 로그인 후 (Dashboard)
- **업로드한 파일 카드 목록** (목업 데이터)
- **새 엑셀 등록** 버튼 → **업로드 마법사 모달**
  - 파일 업로드 → AI 분석(시뮬레이션) → DB/엑셀 스타일 뷰 선택 → 데이터 매핑 → 시트 설정
- 파일 카드에서 **데이터 열람** → 뷰어 페이지로 이동

### 📊 데이터 뷰어 (Viewer)
- **시트 탭** (데모용 Sheet1~3)
- **테이블 뷰 / 카드 뷰** 전환
- 테이블 모드에서 **DB 스타일 / 엑셀 원본 스타일** 전환
- **검색**, **카테고리 필터**
- **대용량 행 가상 스크롤**로 스크롤 성능 유지
- **API URL 복사**, **JSON 다운로드** 버튼 (UI 레벨, 백엔드 연동 시 확장)

## 🔌 백엔드 연동 (Spring Boot 등)

- API 베이스 URL: `VITE_API_BASE_URL` 또는 `src/api/config.ts`의 `API_BASE_URL`
- 서비스 메서드는 `src/api/services.ts`의 `sheetService` 등에 추가
- CORS·인증·쿠키 정책은 배포 환경에 맞게 백엔드와 함께 설정

## 💡 학습 포인트 (Learning Points)

- **Vite + React + TypeScript**로 SPA 구성 및 `@` 경로 별칭
- **Zustand**로 화면 단위 UI 상태 관리
- **Axios** 단일 인스턴스와 `config`·`services` 분리 패턴
- **React.lazy + Suspense**로 페이지 단위 코드 스플리팅
- **가상 스크롤**로 대량 리스트 렌더링
- **Tailwind CSS 4** 유틸리티 기반 스타일링

## 🔮 개선사항 및 향후 계획 (Improvements & Future Plans)

| 항목 | 내용 |
|------|------|
| **백엔드 연동** | Spring Boot REST API와 연동, 실제 엑셀 파싱·저장 |
| **인증** | JWT / 세션 + Spring Security와의 통합 |
| **실제 AI 파이프라인** | 업로드 파일 분석, 컬럼 매핑 추천 (Gemini 등) |
| **파일 저장** | Object Storage, 업로드 진행률, 대용량 청크 업로드 |
| **테스트** | Vitest / React Testing Library |

## 🚧 개발 환경 요구사항

- **Node.js**: 18 이상 권장
- **npm**: 9 이상 (또는 호환 패키지 매니저)
- **브라우저**: Chrome, Edge, Firefox 등 최신 브라우저

## 📚 참고 문서

- [구조 가이드](./docs/구조가이드문서.md) — 폴더 구조·API·스토어 패턴
- [DEVELOPMENT_GUIDE](./docs/DEVELOPMENT_GUIDE.md) — 프로젝트별 개발 참고

## 📸 화면 미리보기 (Preview)

> 스크린샷을 `docs/images/` 등에 추가한 뒤, 아래 표의 경로를 수정해 사용할 수 있습니다.

| 화면 | 설명 |
|------|------|
| 랜딩 | 서비스 소개 및 로그인 진입 |
| 대시보드 | 엑셀 파일 카드 목록·업로드 |
| 뷰어 | 가상 스크롤 테이블/카드·필터 |

<!-- 예시: ![대시보드](./docs/images/dashboard.png) -->

## 🤝 기여하기 (Contributing)

1. Fork the Project  
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the Branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

## 📄 라이선스 (License)

프로젝트 정책에 맞게 라이선스를 명시하세요. (예: 교육·포트폴리오 목적)

---

**프로젝트**: collectSheet  
**패키지 버전**: `0.0.0` (`package.json` 기준)
