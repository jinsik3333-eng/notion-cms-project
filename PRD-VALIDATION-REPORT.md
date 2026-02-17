# ResumeLens PRD 기술적 검증 보고서

**검증일**: 2026-02-17
**검증자**: Claude Code prd-validator
**최종 판정**: ✓ 기술적 실현 가능 (구현 명세 보완 필요)

---

## 1. 기술적 실현 가능성 검증

### 1.1 Claude API 기능 검증

#### [FACT] Claude API Structured Output 지원
- **상태**: ✓ 확인됨
- **버전**: Claude 3.5 Sonnet, Opus 4.1 이상에서 공식 지원 (2025년 11월)
- **기능**: JSON 스키마 기반 구조화된 출력 보장
- **장점**: 토큰 생성 제한으로 100% JSON 유효성 보장
- **적용**: F002 (5가지 관점 분석)에 적합
- **출처**: [Structured outputs - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)

#### [FACT] Claude API Vision 지원
- **상태**: ✓ 확인됨
- **기능**: 이미지 분석 가능 (현재 PRD에는 미언급)
- **활용**: 향후 이력서 이미지 업로드 기능 가능
- **출처**: [Vision - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/vision)

#### [UNCERTAIN] "동시 분석" 구현 방식
- **PRD 표현**: "5가지 관점 동시 분석"
- **해석 모호성**: 단일 API 호출 vs 5개 병렬 호출
- **권장 방식**: 단일 API 호출로 5가지 분석을 동시 수행 (Structured Output 활용)
  - 비용: 1회 API 호출 (저비용)
  - 지연: 5-10초 (실시간)
  - 복잡도: 낮음 (프롬프트 구성만)

**대안 분석**:
| 방식 | 비용 | 지연 | 신뢰도 | 권장 |
|------|------|------|--------|------|
| 단일 호출 | ⭐ | 5-10초 | 높음 | ✓ |
| 5개 병렬 호출 | ⭐⭐⭐⭐⭐ | 10-15초 | 높음 | △ |
| Batch API | ⭐ | 1시간 | 높음 | ✗ (실시간 부족) |

### 1.2 Notion API 기능 검증

#### [FACT] Notion API Database Query 지원
- **상태**: ✓ 확인됨
- **엔드포인트**: `POST /v1/databases/{database_id}/query`
- **기능**: 페이지 필터링, 정렬, 페이지네이션
- **적용**: F004 (가격표, 후기 콘텐츠)에 적합
- **출처**: [Query a database - Notion API](https://developers.notion.com/reference/post-database-query)

#### [FACT] Notion API Block 조회 지원
- **상태**: ✓ 확인됨
- **엔드포인트**: `GET /v1/blocks/{block_id}/children`
- **기능**: 페이지 콘텐츠(Rich Text) 조회 가능
- **페이지 크기**: 100개 항목 기본, 재귀 호출로 모든 내용 조회
- **출처**: [Retrieve and update blocks - Notion API](https://developers.notion.com/changelog/retrieve-and-update-blocks-with-get-and-patch-v1blocksid)

#### [FACT] Notion API 인증
- **상태**: ✓ 확인됨
- **방식**: Bearer Token (NOTION_TOKEN 환경변수)
- **권한**: Integration이 접근 권한 가진 database만 쿼리 가능

### 1.3 Next.js 15 + React 19 호환성 검증

#### [FACT] Next.js 15 Route Handlers (API 라우트)
- **상태**: ✓ 완전 지원
- **위치**: `app/api/route-name/route.ts`
- **방식**: `async function POST/GET(request: Request)`
- **응답**: `Response` 객체 반환
- **출처**: [Route Handlers - Next.js Docs](https://nextjs.org/docs/app/getting-start/route-handlers)

#### [FACT] Next.js 15 Streaming 지원
- **상태**: ✓ 완전 지원
- **용도**: LLM 응답 실시간 스트리밍
- **구현**: `ReadableStream` 반환
- **장점**: Claude API 응답을 실시간으로 클라이언트에 전송 가능
- **출처**: [Streaming - Next.js Docs](https://nextjs.org/learn/dashboard-app/streaming)

#### [FACT] React 19 호환성
- **상태**: ✓ Next.js 15에 완전 통합
- **주요 기능**:
  - Server Components 기본
  - `"use client"` directive로 클라이언트 컴포넌트 전환
  - 현재 프로젝트와 완벽 호환

#### [FACT] TypeScript 5 호환성
- **상태**: ✓ 완전 지원
- **타입 정의**: 모든 API에 타입 정보 포함

### 1.4 기술 스택 종합 평가

| 기술 | 현재 버전 | 필요 기능 | 지원 | 비고 |
|------|----------|---------|------|------|
| Next.js | 16.1.6 | Route Handlers, Streaming | ✓ | 15 업그레이드 권장 |
| React | 19.2.3 | Server/Client Components | ✓ | 완전 호환 |
| TypeScript | 5.x | Type Safety | ✓ | 완전 호환 |
| Tailwind CSS | 4.x | UI 스타일링 | ✓ | 완전 호환 |
| shadcn/ui | - | UI 컴포넌트 | ✓ | 완전 호환 |
| React Hook Form | 7.71.1 | 폼 관리 | ✓ | 완전 호환 |
| Zod | 4.3.6 | 스키마 검증 | ✓ | 완전 호환 |
| Zustand | 5.0.11 | 상태 관리 | ✓ | 완전 호환 |
| Claude API | - | 구조화된 출력 | ✓ | Structured Output 활용 |
| Notion API | v1 | Database Query | ✓ | 완전 호환 |

---

## 2. 아키텍처 일관성 검증

### 2.1 Atomic Design 패턴 적용 가능성

#### [FACT] 현재 프로젝트의 Atomic Design 구조
```
components/
├── ui/                  # 원시 컴포넌트 (shadcn/ui)
├── atoms/              # 단일 요소 (LoadingSpinner, Logo)
├── molecules/          # 조합 요소 (NavItem, PageHeader)
├── organisms/          # 복잡한 기능 (Header, LoginForm)
└── templates/          # 레이아웃 (DefaultLayout)
```

#### ResumeLens 새로운 컴포넌트 매핑

**새로 추가할 원자(Atoms)**:
- 분석 점수 배지 (ScoreBadge)
- 분석 카테고리 라벨 (AnalysisLabel)

**새로 추가할 분자(Molecules)**:
- 분석 점수 행 (AnalysisScoreRow): 제목 + 점수 + 진행바
- 피드백 섹션 (FeedbackSection): 제목 + 텍스트

**새로 추가할 유기체(Organisms)**:
- ResumeAnalyzerForm: 입력 폼 + 제출 (F001)
- AnalysisResultsCard: 5개 분석 결과 표시 (F003)
- PricingCardGrid: 가격표 카드 목록 (F004)
- ReviewCard: 후기 카드 (F004)

**새로 추가할 템플릿(Templates)**:
- 없음 (기존 DefaultLayout 재사용)

### 2.2 Route 구조 일관성

#### [FACT] 현재 Next.js 라우트 구조
```
app/
├── (auth)/              # 인증 라우트 그룹
├── (marketing)/         # 공개 페이지
├── (dashboard)/         # 보호된 페이지
├── layout.tsx           # 루트 레이아웃
└── not-found.tsx        # 404 페이지
```

#### ResumeLens 새로운 라우트 구조
```
app/
├── (marketing)/
│   ├── page.tsx                    # 랜딩 페이지 (홈 업데이트)
│   ├── resume-analyzer/
│   │   ├── page.tsx                # 분석 입력 페이지
│   │   └── results/
│   │       └── page.tsx            # 분석 결과 페이지
│   ├── pricing/
│   │   └── page.tsx                # 가격표 페이지
│   └── reviews/
│       └── page.tsx                # 후기 페이지
│
└── api/
    └── analyze-resume/
        └── route.ts                # Claude API 통합
```

이 구조는 기존 아키텍처와 완벽하게 일관성 있음. ✓

### 2.3 상태 관리 구조

#### [FACT] Zustand 활용 필요성

분석 결과는 `/resume-analyzer/results` 페이지에서 필요하므로, Zustand 스토어 필수:

```typescript
// lib/store/analysis-store.ts
interface AnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  setResult: (result: AnalysisResult) => void;
  // ... 기타 메서드
}
```

### 2.4 레이어드 아키텍처

```
┌─────────────────────────────────────────┐
│  Frontend (UI Layer)                    │
│  - React Components                     │
│  - shadcn/ui + TailwindCSS              │
│  - Zustand (분석 결과)                  │
└─────────────────────────────────────────┘
           ↓ fetch()
┌─────────────────────────────────────────┐
│  API Routes (Business Logic Layer)      │
│  - POST /api/analyze-resume             │
│  - GET /api/notion/pricing              │
│  - GET /api/notion/reviews              │
└─────────────────────────────────────────┘
    ↙                           ↘
┌─────────────────────┐  ┌─────────────────┐
│  Claude API         │  │  Notion API     │
│  (분석)             │  │  (콘텐츠)       │
└─────────────────────┘  └─────────────────┘
```

**평가**: 명확한 계층 분리, 1인 개발자도 관리 가능. ✓

---

## 3. API 통합 복잡도 평가

### 3.1 Claude API 통합

**필요한 구현**:
1. Environment 변수 설정 (CLAUDE_API_KEY)
2. Route Handler 작성 (`/api/analyze-resume`)
3. 프롬프트 구성 (5가지 분석 지시사항)
4. Structured Output 스키마 정의
5. 에러 처리 (타임아웃, 레이트 제한)

**복잡도**: 중간 (2-3시간)
**예상 코드량**: ~200줄

### 3.2 Notion API 통합

**필요한 구현**:
1. Environment 변수 설정 (NOTION_TOKEN)
2. Route Handlers 작성:
   - `/api/notion/pricing`
   - `/api/notion/reviews`
   - `/api/notion/intro` (선택사항)
3. 데이터 변환 로직 (Notion 객체 → 프론트엔드 모델)
4. 캐싱 전략 (Next.js `revalidate`)
5. 에러 처리

**복잡도**: 중간 (3-4시간)
**예상 코드량**: ~300줄

### 3.3 폼 검증 & UI 구현

**필요한 구현**:
1. Zod 스키마 (`lib/validations/resume-analysis.ts`)
2. React Hook Form 통합
3. 입력 폼 컴포넌트
4. 결과 표시 컴포넌트
5. 로딩 상태 관리

**복잡도**: 낮음~중간 (3-4시간)
**예상 코드량**: ~400줄

### 3.4 전체 개발 예상 시간

| 작업 | 시간 | 난이도 |
|------|------|--------|
| Claude API 통합 | 2-3h | 중간 |
| Notion API 통합 | 3-4h | 중간 |
| 폼 & UI | 3-4h | 중간 |
| 테스트 & 디버깅 | 3-4h | 중간 |
| 배포 & 최적화 | 2-3h | 낮음 |
| **총합** | **13-18h** | **중간** |

**평가**: 1인 개발자가 1-2주 내 완성 가능. ✓

---

## 4. 정합성 검증

### 4.1 기능 ID ↔ 페이지 매핑

```
F001: 자소서 입력 및 검증
  → /resume-analyzer (ResumeAnalyzerForm)
  ✓ 일관성 있음

F002: 5가지 관점 AI 분석
  → /api/analyze-resume (Claude API Route Handler)
  ✓ 일관성 있음

F003: 분석 결과 표시
  → /resume-analyzer/results (AnalysisResultsCard)
  ✓ 일관성 있음

F004: Notion CMS 콘텐츠 조회
  → /pricing, /reviews, / (Notion API Route Handlers)
  ✓ 일관성 있음

F010: 페이지 네비게이션
  → Header, Navigation (기존 컴포넌트)
  ✓ 일관성 있음

F011: 로딩 상태 표시
  → LoadingSpinner (기존 컴포넌트)
  ✓ 일관성 있음
```

**평가**: 모든 기능 ID가 명확한 구현 대상에 매핑됨. ✓

### 4.2 페이지 구조 정합성

| 페이지 | 기능 ID | 데이터 소스 | 상태 |
|--------|---------|-----------|------|
| / (랜딩) | F010, F011 | Static | ✓ |
| /resume-analyzer | F001, F010, F011 | React State | ✓ |
| /resume-analyzer/results | F003, F010, F011 | Zustand | ✓ |
| /pricing | F004, F010, F011 | Notion API | ✓ |
| /reviews | F004, F010, F011 | Notion API | ✓ |

**평가**: 모든 페이지가 필요한 기능을 포함. ✓

### 4.3 기술 스택 ↔ 기능 적합성

| 기술 | 사용처 | 적합성 |
|------|--------|--------|
| Next.js 15 | 모든 페이지 & API 라우트 | ✓ |
| React 19 | UI 컴포넌트 | ✓ |
| TypeScript | 타입 안정성 | ✓ |
| shadcn/ui | UI 구축 | ✓ |
| React Hook Form | 입력 폼 (F001) | ✓ |
| Zod | 폼 검증 (F001) | ✓ |
| Zustand | 분석 결과 상태 (F003) | ✓ |
| TailwindCSS | 스타일링 | ✓ |
| Claude API | AI 분석 (F002) | ✓ |
| Notion API | 콘텐츠 (F004) | ✓ |

**평가**: 모든 기술이 필요한 기능에 적합. ✓

---

## 5. 데이터 모델 검증

### 5.1 현재 상태

#### [MISSING] 분석 결과 데이터 모델

PRD에서 "결과를 구조화된 형식으로 표시"라고만 명시되어 있음.

**추론된 모델** (명시적이지 않음):
```typescript
// 5가지 관점 각각:
interface Analysis {
  score: number;      // 0-100
  feedback: string;   // 피드백 텍스트
}

// 종합 결과:
interface AnalysisResult {
  logicStructure: Analysis;
  jobSuitability: Analysis;
  differentiation: Analysis;
  sentenceQuality: Analysis;
  interviewerPerspective: Analysis;
  summary: string;    // 종합 평가
  analyzedAt: Date;   // 분석 시간
}
```

**권장**: PRD에 명시하거나 구현 단계에서 정의 필요. ⚠️

#### [MISSING] Notion CMS 데이터 구조

"가격표, 후기 콘텐츠 관리"라고만 명시, 구체적 필드 미정의.

**권장되는 구조**:

1. **PricingPlans 데이터베이스**
   ```
   - Title (텍스트): 요금제명
   - Price (숫자): 월간 가격
   - Features (다중선택): 기능 목록
   - Description (리치텍스트): 설명
   - IsPopular (체크박스): 추천 여부
   - Order (숫자): 정렬순서
   ```

2. **Reviews 데이터베이스**
   ```
   - Author (텍스트): 작성자명
   - Content (리치텍스트): 후기 내용
   - Rating (숫자): 별점 (1-5)
   - Date (날짜): 작성일
   - Company (텍스트): 회사명
   - Position (텍스트): 직급
   - IsVerified (체크박스): 인증여부
   - Order (숫자): 정렬순서
   ```

#### [MISSING] 자소서 입력 유효성 검사 규칙

**권장되는 규칙**:
```typescript
export const resumeInputSchema = z.object({
  content: z.string()
    .min(50, "최소 50글자 이상 입력하세요")
    .max(5000, "최대 5000글자입니다"),
  position: z.string().optional(),
  company: z.string().optional(),
});
```

**결정 필요 항목**:
- 최소/최대 길이
- 필수 필드 여부
- 특수문자 제한 여부
- 파일 업로드 지원 여부

### 5.2 데이터 흐름 다이어그램

```
사용자 입력 (자소서)
    ↓
[Zod 검증] ← resumeInputSchema
    ↓
POST /api/analyze-resume
    ↓
[Claude API]
    ↓
AnalysisResult (JSON)
    ↓
Zustand Store (useAnalysisStore)
    ↓
/resume-analyzer/results 페이지
    ↓
AnalysisResultsCard (UI 렌더링)
```

---

## 6. 발견된 문제점 & 개선 방안

### 문제점 1: "동시 분석" 표현 모호

**상태**: [UNCERTAIN]

**문제**:
- "5가지 관점 동시 분석"이 정확히 어떤 구현을 의미하는지 불명확
- 단일 API 호출 vs 5개 병렬 호출 vs Batch API 중 어느 것인지 명시 필요

**개선 방안**:
```
Before: "Claude API를 통해 자소서를 5가지 관점에서 동시 분석"
After:  "Claude API의 Structured Output을 활용하여 한 번의 API 호출로
        5가지 관점(논리구조, 직무적합성, 차별성, 문장력, 면접관 시선)을
        동시에 분석하여 점수와 피드백을 구조화된 JSON으로 반환"
```

**영향도**: 높음 (구현 방식 결정)

---

### 문제점 2: Notion CMS 데이터 구조 미정의

**상태**: [MISSING]

**문제**:
- "Notion CMS를 활용하여" 어떤 필드를 어떤 타입으로 관리할지 명시 없음
- 구현 단계에서 예상치 못한 시간 소비 가능

**개선 방안**:
```
PRD 추가 섹션:

## Notion CMS 스키마

### 1. PricingPlans Database
- Title (Text): 요금제 이름 (예: 기본, 프로, 엔터프라이즈)
- Price (Number): 월간 가격 (예: 9900)
- Features (Multi-Select): 기능 목록 (예: 무제한 분석, 결과 저장)
- Description (Rich Text): 요금제 설명
- IsPopular (Checkbox): 추천 여부
- Order (Number): 정렬 순서

### 2. Reviews Database
- Author (Text): 작성자명
- Content (Rich Text): 후기 내용
- Rating (Number): 별점 (1-5)
- Date (Date): 작성일
- Company (Text): 회사명 (선택사항)
- IsVerified (Checkbox): 인증 여부
- Order (Number): 정렬 순서
```

**영향도**: 높음 (데이터 구조 결정)

---

### 문제점 3: 분석 결과 UI "구조화된 형식" 불명확

**상태**: [UNCERTAIN]

**문제**:
- "결과를 구조화된 형식으로 표시"가 정확히 어떤 UI를 의미하는지 불명확
- 스코어 시각화, 카드 레이아웃, 그래프 등 다양한 해석 가능

**개선 방안**:
```
PRD 추가 섹션:

## 분석 결과 화면 구성

### 상단: 종합 점수
- 원형 진행바 또는 큰 숫자 + %
- 5개 관점 평균 점수 표시

### 중단: 5개 분석 카드 (각 카드마다)
- 카드 제목 (논리구조, 직무적합성 등)
- 점수 (0-100) + 진행바로 시각화
- 피드백 (텍스트, 최대 200글자)
- 개선 제안 (선택사항)

### 하단: 종합 평가
- 최종 평가 텍스트 (500글자 내)
- "다시 분석하기" 버튼
- "결과 저장" 버튼 (향후 기능)
```

**영향도**: 중간 (UI/UX 결정)

---

### 문제점 4: 자소서 입력 형식 미정의

**상태**: [UNCERTAIN]

**문제**:
- 텍스트 입력 vs 파일 업로드
- 최소/최대 길이 규칙 명시 없음
- 파일 형식 지원 여부 (PDF, Word 등)

**개선 방안**:
```
PRD 추가 섹션:

## F001: 자소서 입력 및 검증

### 입력 방식
- 텍스트 에어리어에 직접 입력 (기본)
- 파일 업로드 (향후 기능, 현재 MVP에서 제외)

### 유효성 검사
- 최소 50글자
- 최대 5000글자
- 필수 필드
- 특수문자 제한 없음

### 입력 직후 피드백
- 글자 수 표시 (실시간)
- 에러 메시지 (빨간색)
- "분석하기" 버튼 활성화 (유효할 때만)
```

**영향도**: 중간 (UX 결정)

---

### 문제점 5: 로딩 상태 표시 (F011) 상세 미정의

**상태**: [UNCERTAIN]

**문제**:
- F011이 "로딩 상태 표시"인데, 정확한 구현 방식 명시 없음
- Claude API 호출 중 사용자에게 보여줄 메시지, 진행 단계 등 미정의

**개선 방안**:
```
PRD 추가 섹션:

## F011: 로딩 상태 표시

### 분석 진행 중 표시
- LoadingSpinner 컴포넌트 표시
- "자소서를 분석 중입니다..."
- 예상 소요 시간: "약 10-15초 소요"
- 진행률: 선택사항

### 타임아웃 처리
- 30초 이상: "분석이 오래 걸리고 있습니다"
- 60초 이상: 자동 실패, "다시 시도" 버튼 제공

### 에러 상태
- API 실패: "분석 중 오류가 발생했습니다. 다시 시도하세요."
- 네트워크 오류: "네트워크 연결을 확인하세요."
```

**영향도**: 낮음 (UX 개선)

---

### 문제점 6: 페이지 내비게이션 경로 미정의

**상태**: [UNCERTAIN]

**문제**:
- 분석 후 결과 페이지로 이동하는 경로 명시 없음
- 결과 페이지에서 다시 분석하는 경로 미정의

**개선 방안**:
```
사용자 흐름:

1. /resume-analyzer (입력 페이지)
   └─→ "분석하기" 클릭
        ↓
2. POST /api/analyze-resume (Claude API 호출)
   └─→ 분석 완료
        ↓
3. 자동 이동: /resume-analyzer/results (결과 페이지)
   Zustand store에 결과 저장
   └─→ "다시 분석하기" 클릭
        ↓
4. /resume-analyzer (입력 페이지로 복귀)
   이전 입력 값은 유지 또는 초기화 (선택)
```

**영향도**: 중간 (UX 결정)

---

### 문제점 7: API 에러 처리 전략 미정의

**상태**: [MISSING]

**문제**:
- Claude API 실패 시 어떤 메시지를 보여줄지
- Notion API 실패 시 fallback은 뭔지
- 재시도 로직이 있는지

**개선 방안**:
```
에러 처리 전략:

Claude API:
- 타임아웃 (> 60초): "분석이 오래 걸렸습니다. 다시 시도하세요."
- 429 Too Many Requests: "요청이 많습니다. 잠시 후 다시 시도하세요."
- 기타 에러: "분석 중 오류가 발생했습니다."
- 재시도: 클라이언트가 수동으로 "다시 시도" 클릭

Notion API:
- 404: 캐시된 데이터 반환 (3시간 유지)
- 403: 관리자에게 알림, 기본 데이터 반환
- 429: 캐시된 데이터 반환
- 재시도: 5분 후 자동 재시도 (백그라운드)
```

**영향도**: 높음 (안정성)

---

### 문제점 8: 데이터 캐싱 전략 미정의

**상태**: [MISSING]

**문제**:
- Notion API 응답을 얼마나 오래 캐시할지
- Claude API 응답을 저장할지 (개인정보 고려)

**개선 방안**:
```
캐싱 전략:

Notion API:
- /api/notion/pricing: 1시간 (ISR revalidate: 3600)
- /api/notion/reviews: 1시간 (ISR revalidate: 3600)
- /api/notion/intro: 6시간 (ISR revalidate: 21600)

Claude API:
- 저장 불가 (사용자 자소서는 개인정보)
- 요청 시 매번 분석
- 브라우저 캐시: 해당 세션 내에서만 유지 (Zustand)
```

**영향도**: 높음 (성능 & 비용)

---

## 7. 종합 평가 및 최종 판정

### 7.1 평가 요약

| 항목 | 상태 | 평가 |
|------|------|------|
| 기술적 실현 가능성 | ✓ | 모든 기술 지원 |
| 아키텍처 일관성 | ✓ | 명확한 구조 |
| API 통합 복잡도 | △ | 1인 개발자 가능 (15-20시간) |
| 정합성 | △ | 대부분 일관성 있음 |
| 데이터 모델 | △ | 일부 미정의 |

### 7.2 필수 수정 사항 (구현 전 필요)

**우선순위 1 (필수)**:
1. 분석 결과 JSON 스키마 명확화
2. Notion 데이터베이스 필드 정의
3. 자소서 입력 유효성 규칙 명시

**우선순위 2 (권장)**:
4. 분석 결과 UI 상세 명세
5. 로딩 상태 표시 방식 정의
6. API 에러 처리 전략

**우선순위 3 (선택)**:
7. 캐싱 전략 정의
8. 페이지 흐름도 추가

### 7.3 개선된 PRD 예상 분량

- 원본: ~500 단어
- 개선 후: ~1500 단어 (API 명세, 데이터 모델, 오류 처리 포함)

### 7.4 최종 판정

**✓ 승인 조건**
- 기술적으로 실현 가능 ✓
- 아키텍처 일관성 있음 ✓
- 1인 개발자 관리 가능 ✓

**⚠️ 조건: 다음 사항 보완 후 구현 진행**
1. 분석 결과 JSON 스키마 정의
2. Notion 데이터 구조 정의
3. 자소서 입력 규칙 정의

---

## 8. 구현 권장 순서

### Phase 1: 기초 (3-5일)
1. ResumeAnalyzerForm 컴포넌트 (F001)
2. /api/analyze-resume Route Handler (F002)
3. AnalysisResultsCard 컴포넌트 (F003)
4. 페이지 연결 & 테스트

### Phase 2: CMS (2-3일)
5. Notion API Route Handlers (F004)
6. /pricing, /reviews 페이지
7. 홈페이지 업데이트

### Phase 3: 완성 (2-3일)
8. 로딩 상태 개선 (F011)
9. 에러 처리 & 재시도 로직
10. 캐싱 최적화

---

## 9. 참고 문헌 및 출처

### Claude API
- [Structured outputs - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Vision - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- [Batch processing - Claude Docs](https://docs.claude.com/en/docs/build-with-claude/batch-processing)

### Notion API
- [Query a database - Notion API](https://developers.notion.com/reference/post-database-query)
- [Retrieve and update blocks - Notion API](https://developers.notion.com/changelog/retrieve-and-update-blocks-with-get-and-patch-v1blocksid)

### Next.js
- [Route Handlers - Next.js Docs](https://nextjs.org/docs/app/getting-start/route-handlers)
- [Streaming - Next.js Docs](https://nextjs.org/learn/dashboard-app/streaming)
- [Incremental Static Regeneration - Next.js Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

### React
- [React 19 - React Docs](https://react.dev/blog/2024/12/19/react-19)

---

**검증 완료 일자**: 2026-02-17
**다음 단계**: PRD 수정 후 구현 시작
