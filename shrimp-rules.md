# ResumeLens 개발 가이드라인

AI 개발 에이전트가 프로젝트를 효율적으로 구현하기 위한 명령형 규칙 문서입니다.

---

## 📋 프로젝트 개요

**프로젝트명**: ResumeLens
**개발 상태**: Phase 1 초기화 완료, Phase 2 공통 모듈부터 시작
**핵심 기능**: Claude API 기반 자소서 5가지 관점 AI 분석 + Notion CMS 마케팅 콘텐츠 관리

**기술 스택**:
- Next.js 16, React 19, TypeScript 5.x
- TailwindCSS v4, shadcn/ui
- React Hook Form 7.x + Zod (폼 검증)
- Zustand (상태관리)
- Claude API (자소서 분석 엔진)
- Notion API (CMS)

---

## 🏗️ 프로젝트 아키텍처

### 디렉토리 구조 (준수 필수)

```
app/                          # Next.js App Router
├── (marketing)/              # 마케팅 페이지 라우트 그룹
│   ├── layout.tsx            # Header + Footer + DefaultLayout 적용
│   ├── page.tsx              # 랜딩 페이지 (/)
│   ├── analyze/page.tsx      # 자소서 분석 페이지
│   ├── result/page.tsx       # 분석 결과 페이지
│   ├── about/page.tsx        # 서비스 소개
│   ├── pricing/page.tsx      # 가격표
│   └── testimonials/page.tsx # 후기
├── api/                       # API Route Handlers
│   ├── analyze-resume/       # POST Claude API 분석
│   └── notion/               # GET Notion CMS 데이터
├── layout.tsx                # Root layout
├── not-found.tsx             # 404 페이지
└── error.tsx                 # 전역 에러 바운더리

components/                   # Atomic Design 계층 구조 (계층 준수 필수!)
├── ui/                       # shadcn/ui 프리미티브 (비즈니스 로직 금지)
├── atoms/                    # 최소 단위 컴포넌트 (버튼 조합 불가)
│   ├── logo.tsx
│   ├── theme-toggle.tsx
│   └── loading-spinner.tsx
├── molecules/                # 원자 2개 이상 조합 (상태 금지)
│   ├── nav-item.tsx
│   ├── page-header.tsx
│   ├── analysis-card.tsx
│   ├── score-circle.tsx
│   ├── pricing-card.tsx
│   └── testimonial-card.tsx
├── organisms/                # 복잡한 기능 (상태/로직 허용)
│   ├── header.tsx
│   ├── footer.tsx
│   ├── mobile-drawer.tsx
│   └── resume-analyze-form.tsx
│   └── analysis-result-view.tsx
└── templates/                # 페이지 레이아웃 래퍼
    ├── default-layout.tsx
    └── page-wrapper.tsx

lib/
├── utils.ts                  # cn() Tailwind 유틸리티 (필수)
├── types/
│   └── analysis.ts           # 분석 결과 타입 정의 (이미 작성됨)
├── validations/
│   └── resume.ts             # Zod 검증 스키마 (이미 작성됨)
├── constants/
│   ├── nav.ts                # 네비게이션 설정
│   └── site.ts               # 사이트 메타데이터
└── styles/                   # 전역 스타일 변수

stores/                       # Zustand 상태 관리
└── analysis-store.ts         # 분석 결과 전역 상태 (이미 작성됨)

types/
└── index.ts                  # 전역 TypeScript 타입

hooks/                        # 커스텀 React 훅
├── use-debounce.ts
├── use-local-storage.ts
└── use-mobile.ts

docs/
├── PRD.md                    # 상세 요구사항 및 기능 명세
├── ROADMAP.md                # 개발 로드맵 및 Task 분해
└── (이 파일) shrimp-rules.md # AI 개발 에이전트 규칙
```

---

## 📝 코드 표준

### 네이밍 규칙

| 항목 | 규칙 | 예시 |
|------|------|------|
| **변수/함수** | camelCase | `resumeText`, `handleAnalyze()` |
| **컴포넌트** | PascalCase | `ResumeAnalyzeForm`, `AnalysisCard` |
| **상수** | UPPER_SNAKE_CASE | `MAX_RESUME_LENGTH = 5000` |
| **파일명 (컴포넌트)** | kebab-case | `resume-analyze-form.tsx` |
| **파일명 (유틸)** | kebab-case | `use-debounce.ts`, `utils.ts` |

### 포맷팅

- **들여쓰기**: 2칸 (탭 금지)
- **줄 길이**: 100자 이하 권장
- **세미콜론**: 필수
- **쌍따옴표**: 우선, 작은따옴표 템플릿 리터럴만

### 주석 규칙

```typescript
// ✅ DO: 한국어 주석 (왜 하는지 설명)
// 분석 결과가 5가지 카테고리를 모두 포함하는지 검증
const isValidResult = Object.keys(analyses).length === 5;

// ❌ DON'T: 영어 주석
// Check if analyses are valid

// ❌ DON'T: 명백한 코드를 주석으로 설명
// resumeText를 5000으로 나눔
const ratio = resumeText.length / 5000;
```

### TypeScript 규칙

**❌ any 타입 금지**:
```typescript
// ❌ DON'T
const analyze = (data: any) => { ... }

// ✅ DO
interface AnalysisRequest {
  resumeText: string;
}
const analyze = (data: AnalysisRequest) => { ... }
```

**✅ 명시적 반환 타입**:
```typescript
// ✅ DO
function getAnalysisScore(result: AnalysisResult): number {
  return result.overallScore;
}

// 제네릭 타입 활용
function createStore<T>(initial: T): Store<T> { ... }
```

---

## 🧩 컴포넌트 구현 규칙

### Atomic Design 계층 준수 (필수!)

```typescript
// ❌ DON'T: atoms에서 molecules 임포트
// components/atoms/my-button.tsx
import { NavItem } from "@/components/molecules/nav-item"; // ❌ 위반!

// ✅ DO: 상위 계층에서만 하위 계층 임포트
// components/molecules/sidebar.tsx
import { Button } from "@/components/ui/button";     // ✅
import { Logo } from "@/components/atoms/logo";      // ✅

// components/organisms/header.tsx
import { NavItem } from "@/components/molecules/nav-item"; // ✅
```

### 컴포넌트 파일 구조

```typescript
"use client"; // 필요한 경우에만 추가 (상호작용 훅 있을 때)

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MyComponentProps {
  children: ReactNode;
  className?: string;
  // 다른 props...
}

/**
 * 컴포넌트 설명 (JSDoc)
 * @param children - 자식 요소
 * @param className - 추가 스타일
 */
export function MyComponent({ children, className }: MyComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  );
}
```

### 컴포넌트 배치 규칙

| 컴포넌트 타입 | 배치 위치 | 상태/로직 | 예시 |
|--------|-----------|---------|------|
| **UI 프리미티브** | `components/ui/` | ❌ 금지 | button, input, card |
| **Atom** | `components/atoms/` | ❌ 금지 | logo, theme-toggle |
| **Molecule** | `components/molecules/` | ✅ 제한적 (상호작용 제외) | nav-item, page-header |
| **Organism** | `components/organisms/` | ✅ 허용 | header, form, result-view |
| **Template** | `components/templates/` | ✅ 레이아웃만 | default-layout |

---

## 🔌 API 라우트 구현 규칙

### 서버사이드 호출 필수

**❌ Claude API / Notion API를 클라이언트에서 호출 금지**:
```typescript
// ❌ DON'T: components/organisms/resume-analyze-form.tsx
const handleAnalyze = async (resumeText: string) => {
  const response = await fetch("https://api.anthropic.com/...", {
    headers: {
      "Authorization": `Bearer ${process.env.ANTHROPIC_API_KEY}` // ❌ 클라이언트에 노출!
    }
  });
};
```

**✅ Route Handler를 통한 간접 호출**:
```typescript
// ✅ DO: app/api/analyze-resume/route.ts
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  const { resumeText } = await request.json();

  // 서버에서만 API 키 접근 가능
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const result = await client.messages.create({ ... });
  return Response.json(result);
}
```

### API Route Handler 구조

```typescript
// app/api/analyze-resume/route.ts
export async function POST(request: Request) {
  try {
    // 1. 요청 파싱
    const { resumeText } = await request.json();

    // 2. 서버사이드 검증
    if (!resumeText || resumeText.length < 50) {
      return Response.json(
        { error: "최소 50자 이상 입력하세요" },
        { status: 400 }
      );
    }

    // 3. API 호출
    const result = await claudeAnalyze(resumeText);

    // 4. 응답 반환
    return Response.json(result);
  } catch (error) {
    // 5. 에러 처리
    console.error("[API Error]", error);
    return Response.json(
      { error: "분석 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
```

### 환경 변수 관리

**`.env.local` 파일 설정** (`.gitignore`에 추가되어 있음):
```
# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Notion API
NOTION_API_KEY=ntn_...
NOTION_PRICING_DB_ID=abc123...
NOTION_TESTIMONIALS_DB_ID=def456...
NOTION_CONTENT_DB_ID=ghi789...
```

**`.env.local.example` 파일** (저장소에 커밋):
```
# 모든 API 키와 DB ID를 명시만 하고 값은 비워두기
ANTHROPIC_API_KEY=
NOTION_API_KEY=
NOTION_PRICING_DB_ID=
NOTION_TESTIMONIALS_DB_ID=
NOTION_CONTENT_DB_ID=
```

---

## 🔄 폼 & 검증 규칙

### React Hook Form + Zod 패턴 (필수)

```typescript
// 1. Zod 스키마 정의 (lib/validations/resume.ts)
import { z } from "zod";

export const resumeSchema = z.object({
  resumeText: z
    .string()
    .min(50, "최소 50자 이상 입력하세요")
    .max(5000, "최대 5,000자 이하만 가능합니다"),
});

export type ResumeInput = z.infer<typeof resumeSchema>;

// 2. 컴포넌트에서 사용
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, type ResumeInput } from "@/lib/validations/resume";

export function ResumeAnalyzeForm() {
  const form = useForm<ResumeInput>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      resumeText: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* 폼 필드 */}
    </form>
  );
}
```

---

## 📦 Zustand 상태관리 규칙

### Store 구조 (이미 작성된 `stores/analysis-store.ts` 참고)

```typescript
import { create } from "zustand";
import type { AnalysisResult } from "@/lib/types/analysis";

interface AnalysisStore {
  // 상태
  resumeText: string;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;

  // 액션
  setResumeText: (text: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setIsAnalyzing: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  resumeText: "",
  analysisResult: null,
  isAnalyzing: false,
  error: null,

  setResumeText: (text) => set({ resumeText: text }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),
  setError: (error) => set({ error }),
  clearAnalysis: () =>
    set({
      resumeText: "",
      analysisResult: null,
      isAnalyzing: false,
      error: null,
    }),
}));
```

### Store 사용 규칙

```typescript
// ✅ DO: 필요한 상태만 선택적으로 구독
const resumeText = useAnalysisStore((state) => state.resumeText);
const setResumeText = useAnalysisStore((state) => state.setResumeText);

// ❌ DON'T: 전체 스토어 구독 (성능 저하)
const store = useAnalysisStore();
```

---

## 🔗 다중 파일 조정 규칙

### 동시 수정 필수 파일

| 작업 | 수정 필수 파일 | 이유 |
|------|-------------|------|
| **새 페이지 추가** | `lib/constants/nav.ts` + 페이지 파일 | 메뉴 동기화 |
| **새 환경변수 추가** | `.env.local` + `.env.local.example` + `.gitignore` 검증 | 개발/배포 일관성 |
| **API 라우트 추가** | `app/api/` + 클라이언트 호출 코드 | 엔드포인트 연결 |
| **컴포넌트 이동/삭제** | 모든 import 경로 + CLAUDE.md (필요시) | 참조 무결성 |

### 예: 새 페이지 추가 시 체크리스트

```markdown
## 가격표 페이지 추가 예시

1. [ ] 페이지 파일 생성: `app/(marketing)/pricing/page.tsx`
2. [ ] 메타데이터 추가: `export const metadata = { title: "... | ResumeLens" }`
3. [ ] 네비게이션 추가: `lib/constants/nav.ts`에 pricing 메뉴 아이템
4. [ ] API 라우트 생성: `app/api/notion/pricing/route.ts` (캐시 24시간)
5. [ ] 타입 확인: `types/index.ts`에 `PricingPlan` 타입 존재
6. [ ] 테스트: 메뉴 클릭 시 페이지 렌더링 확인
```

---

## 📊 데이터 흐름

### 자소서 분석 플로우

```
사용자 입력
  ↓
ResumeAnalyzeForm (F001 입력 폼)
  ↓ (Zod 검증)
Zustand: setResumeText() + setIsAnalyzing(true)
  ↓
POST /api/analyze-resume (F002 Claude API)
  ↓ (claudeAnalyze 호출, Structured Output)
AnalysisResult 반환
  ↓
Zustand: setAnalysisResult() + setIsAnalyzing(false)
  ↓
router.push("/result")
  ↓
AnalysisResultView (F003 결과 표시)
  ├─ ScoreCircle (종합 점수)
  └─ AnalysisCard[] (5개 분석 카드)
```

### Notion CMS 데이터 흐름

```
페이지 로딩 (about, pricing, testimonials)
  ↓
GET /api/notion/[endpoint]
  ↓ (Notion API 쿼리)
데이터 반환 + 캐시 설정 (revalidate)
  ↓
클라이언트 페이지에서 서버 컴포넌트로 데이터 수신
  ↓
UI 렌더링 (마케팅 페이지)
```

---

## ✅ 구현 체크리스트 (단계별)

### Phase 2: 공통 모듈 완성

- [ ] Header 컴포넌트: 로고 + 네비게이션 + 테마 토글
- [ ] Footer 컴포넌트: 저작권 + 외부 링크
- [ ] DefaultLayout: Header + main + Footer 래퍼
- [ ] 메뉴 설정: `lib/constants/nav.ts`에 4개 메뉴 (홈, 서비스, 가격, 후기)
- [ ] ResumeAnalyzeForm: 입력 폼 + 문자 카운터 + 검증
- [ ] 반응형 테스트: 모바일(375px), 태블릿(768px), 데스크톱(1024px)

### Phase 3: Claude API 분석 기능

- [ ] `app/api/analyze-resume/route.ts` 구현
- [ ] Anthropic SDK 설치 + 클라이언트 초기화
- [ ] System Prompt 작성: 5가지 관점 동시 분석 (한국어)
- [ ] Structured Output 스키마 구현
- [ ] 에러 처리: 429 재시도, 500+ 에러 메시지, 60초 타임아웃
- [ ] `/analyze` 페이지: 폼 + 로딩 상태 + API 호출
- [ ] `/result` 페이지: 결과 표시 + 5개 카드 + 색상 코딩

### Phase 4: Notion CMS 콘텐츠

- [ ] `app/api/notion/pricing/route.ts` (캐시 24시간)
- [ ] `app/api/notion/testimonials/route.ts` (캐시 12시간)
- [ ] `app/api/notion/content/route.ts` (캐시 6시간)
- [ ] `/pricing` 페이지: PricingCard 컴포넌트
- [ ] `/about` 페이지: Notion 콘텐츠 표시
- [ ] `/testimonials` 페이지: TestimonialCard 컴포넌트 + 별점

---

## ⚠️ 금지 사항 (반드시 준수)

### 코드 관련

| 금지 사항 | 이유 | 대체안 |
|----------|------|-------|
| `any` 타입 | 타입 안전성 상실 | 명시적 인터페이스 정의 |
| 폴더 간 계층 역참조 | Atomic Design 위반 | 상위 계층에서만 참조 |
| 클라이언트 API 키 노출 | 보안 위험 | Route Handler 서버사이드 호출 |
| `console.log` (프로덕션) | 번들 크기 증가 | 개발 모드에서만 사용 |
| 환경변수 git 커밋 | 자격증명 유출 | `.env.local` 만 로컬, `.example` 커밋 |

### Git 커밋 관련

| 금지 사항 | 예시 |
|----------|------|
| 환경 파일 커밋 | `.env.local`, `.env` |
| node_modules 커밋 | `node_modules/` |
| 비밀 키 커밋 | API 키, 개인키 |
| 대용량 바이너리 | `.png`, `.exe` (>50MB) |

### 문서 관련

| 금지 사항 | 이유 |
|----------|------|
| 영어 주석 (코드) | 프로젝트 언어는 한국어 |
| 기술 스택 재설명 | 이미 CLAUDE.md에 정의됨 |
| 일반 개발 지식 | LLM이 알고 있음 (공간 낭비) |

---

## 🎯 AI 의사결정 규칙

### 모호한 요구사항 처리

| 상황 | 우선순위 | 선택기준 |
|------|---------|---------|
| 컴포넌트 위치 불명확 | 계층 검증 > 파일명 | Atomic Design 순준 준수 |
| 스타일 규칙 불명확 | shadcn/ui + Tailwind | CLAUDE.md의 기존 패턴 참고 |
| 환경변수 누락 | 개발 환경 기본값 설정 | `.env.local.example` 추가 |

### 에러 발생 시

```typescript
// 1. 에러 타입 파악
// 2. ROADMAP.md의 해당 Task 섹션 참고
// 3. 에러 처리 규칙 적용 (API 429/500+, Notion 403/404)
// 4. 해결 불가능 시 사용자에게 알림
```

---

## 📚 참고 문서

- `CLAUDE.md` - 프로젝트 개요 및 개발 기본 원칙
- `docs/PRD.md` - 상세 요구사항 및 기능 명세 (6개 페이지, 6개 기능)
- `docs/ROADMAP.md` - 5 Phase 로드맵 및 Task 분해 (15개 Task)

---

## 🔄 규칙 업데이트 프로세스

- 새로운 패턴/제약조건 발견 시 이 문서에 추가
- CLAUDE.md와 충돌 시 CLAUDE.md가 우선 (프로젝트 공식 지침)
- 분기별 규칙 검토 및 개선
