# collectsheet 개발 가이드 (상세 요구사항 및 구현 스펙)

> 이 문서는 `collectsheet_guild.md`의 요구사항을 분석·확장하여, **엑셀 시트 정형화 → 빠른 검색·이용 웹사이트** 구현을 위한 철저한 개발 가이드입니다.

---

## 목차

1. [요구사항 상세 분석](#1-요구사항-상세-분석)
2. [비기능 요구사항](#2-비기능-요구사항)
3. [데이터 및 API 스펙](#3-데이터-및-api-스펙)
4. [엑셀 파서 상세 스펙](#4-엑셀-파서-상세-스펙)
5. [AI 분석 연동 상세](#5-ai-분석-연동-상세)
6. [뷰어·검색·필터 UI 스펙](#6-뷰어검색필터-ui-스펙)
7. [폴더 구조 및 파일별 책임](#7-폴더-구조-및-파일별-책임)
8. [구현 체크리스트 및 시나리오](#8-구현-체크리스트-및-시나리오)

---

## 1. 요구사항 상세 분석

### 1.1 문제 정의 (Problem Statement)

| 구분 | 내용 |
|------|------|
| **대상 사용자** | 엑셀 데이터를 자주 조회·공유하는 비개발자(영업, 물류, 인사 등) |
| **핵심 불편** | 엑셀 파일은 모바일에서 보기 어렵고, 검색·필터가 없으며, 공유 시 버전/보안 관리가 어렵다. |
| **기대 결과** | 엑셀 업로드만으로 **정형화된 데이터** + **검색/필터 가능한 웹 앱** + **공유 가능한 고유 URL** |

### 1.2 기능 요구사항 (Functional Requirements)

| ID | 요구사항 | 상세 설명 | 우선순위 |
|----|----------|-----------|----------|
| FR-1 | **Universal Parser** | 1단 헤더, 2단(병합) 헤더 등 다양한 엑셀 형태를 **일관된 JSON 배열**로 변환 | P0 |
| FR-2 | **정형화 규칙** | 헤더는 유효한 키(공백/특수문자 정규화), 빈 행·빈 열 처리, 숫자/날짜 타입 보존 | P0 |
| FR-3 | **AI 기반 UI 설정** | 상위 N행 샘플만으로 제목, 검색 컬럼, 필터 컬럼, 강조 컬럼 자동 추천 | P0 |
| FR-4 | **고유 URL 생성** | 시트별 고유 ID로 `/view/[id]` 형태의 공유 가능 링크 제공 | P0 |
| FR-5 | **동적 뷰어** | `ui_config`에 따라 검색창·필터·테이블 컬럼·강조 스타일 자동 구성 | P0 |
| FR-6 | **빠른 검색** | 클라이언트 또는 서버에서 검색어로 행 필터링, 대용량 시 가상 스크롤/페이지네이션 고려 | P0 |
| FR-7 | **필터** | 범주형 컬럼 기준 다중 선택 필터 (AND 조건) | P0 |
| FR-8 | **파일 업로드** | 드래그 앤 드롭 또는 파일 선택, `.xlsx` (필요 시 `.xls` 지원) | P0 |
| FR-9 | **(선택) 비밀번호** | 비공개 시트 접근 시 비밀번호 입력 | P1 |
| FR-10 | **(선택) 다중 시트** | 한 엑셀 파일 내 여러 시트 중 선택 또는 첫 시트 자동 사용 | P1 |

### 1.3 사용자 시나리오 (User Stories)

- **US-1:** 사용자가 엑셀 파일을 업로드하면, 3초 이내에 "분석 완료" 후 공유 링크가 표시된다.
- **US-2:** 공유 링크를 연 사용자는 검색창에 키워드를 입력해 원하는 행만 빠르게 찾을 수 있다.
- **US-3:** 공유 링크를 연 사용자는 상단 필터 버튼으로 범주(예: 지역, 부서)를 선택해 데이터를 좁힐 수 있다.
- **US-4:** 모바일에서도 테이블이 가로 스크롤 또는 카드 형태로 읽기 편하게 표시된다.

---

## 2. 비기능 요구사항

| 구분 | 요구사항 |
|------|----------|
| **성능** | 업로드 후 AI 분석 포함 5초 이내 응답, 뷰어 첫 로드 2초 이내 목표. 1만 행 이하에서 클라이언트 검색/필터 반응 즉시. |
| **보안** | 업로드/API는 서버에서만 처리. API 키(OpenAI, Supabase)는 환경 변수, 클라이언트 노출 금지. |
| **반응형** | 320px~1920px 대응. 모바일 우선 레이아웃(검색·필터 상단 고정, 테이블 스크롤). |
| **접근성** | 테이블에 `th`/`scope`, 검색/필터에 `label` 또는 `aria-label` 제공. |
| **호환** | Chrome, Safari, Edge 최신 2버전. (해커톤 기준 모바일 Safari 고려) |

---

## 3. 데이터 및 API 스펙

### 3.1 DB 스키마 (Supabase)

**테이블: `sheets`**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | `uuid` | NO (PK) | `gen_random_uuid()`, URL 경로에 사용 (`/view/{id}`) |
| `title` | `text` | YES | 시트 제목 (AI 추천 또는 파일명) |
| `raw_data` | `jsonb` | NO | `[{ "col1": "val1", ... }, ...]` 형태의 행 배열 |
| `ui_config` | `jsonb` | YES | 아래 `ui_config` 스키마 참고 |
| `created_at` | `timestamptz` | NO | `default now()` |
| `password` | `text` | YES | (선택) 해시 저장 권장 |

**`ui_config` JSON 스키마 (AI 출력 + 기본값)**

```json
{
  "title": "string",
  "summary": "string",
  "searchColumn": "string",
  "filterColumns": ["string"],
  "mainDisplayColumns": ["string"],
  "numericColumns": ["string"],
  "highlightKeys": ["string"]
}
```

- `searchColumn`: 검색 입력창과 매핑할 단일 컬럼 키.
- `filterColumns`: 필터 버튼/드롭다운으로 쓸 컬럼 키 배열 (1~3개 권장).
- `mainDisplayColumns`: 모바일에서 우선 노출할 컬럼 (없으면 `raw_data[0]`의 모든 키).
- `numericColumns`: 숫자 정렬·우측 정렬·강조 스타일 적용 대상.
- `highlightKeys`: (기존 가이드 호환) 강조할 컬럼.

**SQL (Supabase SQL Editor)**

```sql
create table sheets (
  id uuid default gen_random_uuid() primary key,
  title text,
  raw_data jsonb not null default '[]',
  ui_config jsonb,
  created_at timestamptz not null default now(),
  password text
);

-- 뷰어용 단일 조회 (필요 시 RLS 적용)
-- select * from sheets where id = $1;
```

### 3.2 API 스펙

**Base URL:** `/api` (Next.js App Router 기준 `src/app/api/`)

| Method | Path | 설명 | Request | Response |
|--------|------|------|---------|----------|
| POST | `/api/upload` | 엑셀 업로드 + 파싱 + AI 분석 + DB 저장 | `FormData`: `file` (xlsx) | `201`: `{ id, title, viewUrl }` |
| GET | `/api/view/[id]` | 뷰어용 시트 단일 조회 | - | `200`: `{ id, title, raw_data, ui_config }` |

**POST /api/upload**

- Content-Type: `multipart/form-data`, 필드명 `file`.
- 처리 순서: 파일 검증(확장자/크기) → 파서로 JSON 변환 → 상위 5행으로 AI 분석 → Supabase insert → `id`로 `viewUrl` 생성하여 반환.
- 에러: 400 (파일 없음/형식 오류), 413 (용량 초과), 500 (파서/AI/DB 오류).

**GET /api/view/[id]**

- `id`: `sheets.id` (uuid).
- 404: 해당 id 없음. 200: 위 응답 body.

(선택) 비밀번호 보호 시: POST body 또는 쿼리에 `password` 전달 후 검증 후 `raw_data`/`ui_config` 반환.

---

## 4. 엑셀 파서 상세 스펙

### 4.1 목표

- **입력:** `.xlsx` (SheetJS로 읽은 워크시트)
- **출력:** `Array<Record<string, string | number | null>>` — 첫 행(또는 2행)을 헤더로 한 객체 배열

### 4.2 헤더 처리 알고리즘

1. **시트 선택:** 첫 시트 사용 (`workbook.Sheets[workbook.SheetNames[0]]`)
2. **원시 행렬:** `XLSX.utils.sheet_to_json(sheet, { header: 1 })` → `any[][]`
3. **헤더 행 수 결정:**
   - 1행만 있거나 2행이 모두 비슷한 "제목" 성격이면 1행만 헤더.
   - 2행이 1행의 "소분류" 성격(예: 1행 "운임", 2행 "40FT", "20FT")이면 2행 헤더로 처리.
4. **2단 헤더 시:**
   - 첫 줄 빈칸: 이전 셀 값으로 Forward Fill.
   - 1행 + 2행을 `_`로 연결해 최종 헤더 키 생성 (예: `운임_40FT`, `운임_20FT`).
5. **키 정규화:**
   - 앞뒤 공백 제거.
   - 빈 헤더는 `column_0`, `column_1` 등으로 대체.
   - 키 내 공백/특수문자는 유지하거나, URL/식별자 안전하게 `_`로 치환 (팀 규칙 통일).

### 4.3 데이터 행

- 3행(또는 헤더 다음 행)부터 데이터.
- 셀 값: 문자열·숫자·날짜(ISO 문자열로 통일 가능). 빈 셀은 `null` 또는 `""` (일관되게 하나만 사용).
- 행의 키는 반드시 헤더에서 온 키와 1:1 대응.

### 4.4 엣지 케이스

- **빈 시트:** `[]` 반환.
- **헤더만 있고 데이터 없음:** `[]` 반환.
- **열 수 불일치:** 헤더 길이에 맞춰 부족한 열은 `null`로 채움.
- **매우 큰 파일:** 행 수 제한(예: 50,000행) 후 잘라내고, 필요 시 경고 메시지 반환.

### 4.5 파서 함수 시그니처 (참고)

```js
// src/lib/parser.js
/**
 * @param {ArrayBuffer|Buffer} fileBuffer - xlsx 파일 버퍼
 * @returns {{ headers: string[], rows: Array<Record<string, string|number|null>> }}
 */
export function parseExcelToJson(fileBuffer) { ... }
```

---

## 5. AI 분석 연동 상세

### 5.1 역할

엑셀의 **상위 5행(헤더 제외)** 샘플만 전달해, UI 설정용 JSON을 받는다.

### 5.2 API

- **모델:** `gpt-4o-mini` 또는 `gpt-4o` (비용/속도 trade-off)
- **Structured Output:** Vercel AI SDK 또는 OpenAI API의 `response_format: { type: "json_object" }` 사용 권장. 스키마 고정 시 유효성 검사 적용.

### 5.3 프롬프트 (시스템 + 사용자)

**시스템:**

```
You are a UX/UI expert. Given a JSON array of sample rows from an Excel sheet (first 5 data rows), output a single JSON object for configuring a mobile-first data viewer. The viewer has: a search box, filter chips, and a data table. Return only valid JSON, no markdown.
```

**사용자 (예시):**

```
Analyze this sample and return the UI config JSON.

Schema (strict):
{
  "title": "string (short, user-facing title)",
  "summary": "string (one-line description)",
  "searchColumn": "string (one column key best for text search, e.g. name, destination)",
  "filterColumns": ["string"] (1-3 column keys with few unique values, e.g. category, region),
  "mainDisplayColumns": ["string"] (3-4 column keys to show first on mobile),
  "numericColumns": ["string"] (column keys that are numbers, for right-align and emphasis)
}

Sample rows (first 5):
${JSON.stringify(sampleRows)}
```

### 5.4 폴백

- AI 실패 또는 타임아웃 시: `title`: 파일명, `searchColumn`: 첫 번째 컬럼, `filterColumns`: 빈 배열, `mainDisplayColumns`: 모든 컬럼, `numericColumns`: 빈 배열.

---

## 6. 뷰어·검색·필터 UI 스펙

### 6.1 페이지

- **경로:** `/view/[id]`
- **동작:** `id`로 GET `/api/view/[id]` 호출 → `title`, `raw_data`, `ui_config` 사용.

### 6.2 레이아웃 (위→아래)

1. **헤더:** `ui_config.title` 또는 `title`, (선택) 공유 버튼(URL 복사).
2. **검색:** `ui_config.searchColumn`이 있으면 단일 검색 입력창. 입력 시 해당 컬럼 값에 대해 대소문자 구분 없이 부분 일치 필터.
3. **필터:** `ui_config.filterColumns` 각 키에 대해:
   - 해당 컬럼의 유니크 값 목록 추출 → 버튼/드롭다운/챕으로 표시.
   - 다중 선택 가능, AND 조건으로 행 필터링.
4. **테이블:**
   - 컬럼: `ui_config.mainDisplayColumns`가 있으면 해당 순서, 없으면 `Object.keys(raw_data[0])`.
   - `ui_config.numericColumns`에 포함된 컬럼: 우측 정렬, 숫자 포맷(천 단위 구분 등).
   - 행: 검색·필터 적용 후 결과만 표시.
   - 대량 데이터: 1만 행 이하는 클라이언트 전체 필터 후 렌더, 그 이상은 가상 스크롤 또는 페이지네이션 권장.

### 6.3 반응형

- **데스크톱:** 테이블 가로 스크롤 가능, 필터 가로 배치.
- **모바일:** 테이블 카드 형태 또는 가로 스크롤, 필터는 접기/펼치기 또는 한 줄 스크롤.

### 6.4 상태

- URL 쿼리 반영 (선택): `?q=검색어&필터키=값` 형태로 공유 시 동일 뷰 복원.

---

## 7. 폴더 구조 및 파일별 책임

```
collect-sheet/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/
│   │   │   │   └── route.js    # POST: 업로드 → 파싱 → AI → DB → { id, viewUrl }
│   │   │   └── view/
│   │   │       └── [id]/
│   │   │           └── route.js # GET: 시트 단일 조회
│   │   ├── view/
│   │   │   └── [id]/
│   │   │       └── page.js     # 뷰어 페이지 (검색/필터/테이블)
│   │   ├── layout.js
│   │   └── page.js              # 메인: 업로드 UI
│   ├── lib/
│   │   ├── excelParser.js       # parseExcelToJson, 2단 헤더 등
│   │   ├── openai.js            # analyzeSheetForUI(sampleRows) → ui_config
│   │   └── supabase.js          # createClient, insertSheet, getSheetById
│   └── components/
│       ├── FileDropzone.js      # 드래그 앤 드롭 + input file
│       ├── DynamicTable.js      # raw_data + ui_config 기반 테이블
│       └── FilterBar.js         # filterColumns 기반 필터 UI
├── .env.local                   # NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY
├── docs/
│   ├── collectsheet_guild.md    # 기존 MVP 가이드
│   └── DEVELOPMENT_GUIDE.md     # 본 문서
└── package.json
```

**의존성 추가 권장:** `xlsx`, `@supabase/supabase-js`, `openai` (또는 `ai` SDK).

---

## 8. 구현 체크리스트 및 시나리오

### 8.1 기능 체크리스트

- [ ] `.xlsx` 드래그 앤 드롭 업로드
- [ ] 1단 헤더 엑셀 → JSON 변환 검증
- [ ] 2단 병합 헤더 엑셀 → JSON 변환 검증 (Forward Fill + 합친 키)
- [ ] AI 분석 호출 후 `ui_config` 저장 및 폴백 동작
- [ ] `/view/[id]`에서 데이터 로드 및 검색/필터 반영
- [ ] 검색: 한 컬럼 부분 일치
- [ ] 필터: 다중 선택 AND 조건
- [ ] 모바일 뷰에서 테이블/필터 사용 가능
- [ ] 공유 링크 새 시크릿 창에서 정상 표시

### 8.2 시연 시나리오 (해커톤)

1. 복잡한 운임표/주소록 엑셀을 화면에 보여주며 "이걸 매번 열어서 찾기 불편하다" 설명.
2. 업로드 영역에 파일 드롭 → "분석 중..." 로딩 표시.
3. "완료" 후 생성된 링크 표시 → 클릭 시 뷰어 페이지로 이동.
4. 검색창에 키워드 입력 → 즉시 행 필터링.
5. 필터 버튼으로 범주 선택 → 결과 축소.
6. 같은 링크를 휴대폰에서 열어 모바일에서도 조회 가능함을 보여줌.

### 8.3 기술 어필 포인트

- **Vercel AI SDK** Structured Output으로 `ui_config` JSON 고정.
- **Supabase JSONB**로 유연한 스키마 (다양한 엑셀 형태 수용).
- **Tailwind CSS** 반응형 + 모바일 우선.

---

## 9. 다음 행동 (Action Items)

1. **의존성 설치:** `xlsx`, `@supabase/supabase-js`, `openai` (또는 `ai`).
2. **Supabase:** 프로젝트 생성 후 위 `sheets` 테이블 생성, `.env.local`에 URL/키 설정.
3. **Phase 1:** `src/lib/excelParser.js` 구현 후 단위 테스트용 엑셀(1단/2단 헤더)로 검증.
4. **Phase 2:** `src/app/api/analyze/route.js` 또는 upload 내부에서 AI 호출, `ui_config` 폴백 포함.
5. **Phase 3:** `src/app/view/[id]/page.js` + `DynamicTable`, `FilterBar`, 검색 로직 구현.
6. **통합:** 메인 페이지에서 업로드 → API 연동 → 링크 표시까지 E2E 확인.

이 가이드를 기준으로 Phase 1 파서부터 순서대로 구현하면, **엑셀 시트 정형화 → 빠른 검색·이용 웹사이트**를 안정적으로 구축할 수 있습니다.
