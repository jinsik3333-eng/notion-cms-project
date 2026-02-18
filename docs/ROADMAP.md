# ResumeLens 개발 로드맵

> **ResumeLens**는 구직자의 자소서를 Claude AI로 5가지 관점(논리구조, 직무적합성, 차별성, 문장력, 면접관 시선)에서 동시 분석하여 구체적인 개선점을 제시하는 서비스입니다.
> Notion CMS를 활용해 마케팅 콘텐츠를 비개발자도 손쉽게 관리할 수 있습니다.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | ResumeLens |
| **핵심 가치** | Claude AI 기반 자소서 5가지 관점 동시 분석 |
| **타겟 사용자** | 입사 면접을 준비하는 20~40대 직장인 및 신입 구직자 |
| **MVP 페이지 수** | 6개 (랜딩, 분석, 결과, 서비스소개, 가격표, 후기) |
| **분석 입력 범위** | 50~5,000자 |
| **분석 엔진** | Google Gemini API (구조화된 출력) - Claude → Gemini 전환 완료 (2025-02-18) |
| **콘텐츠 관리** | Notion API (PricingPlans, Testimonials, ContentPages) |
| **예상 개발 기간** | 15~20시간 (1인 경험자 기준) = 약 1~2주 |
| **배포 플랫폼** | Vercel |

### 성공 지표

- 자소서 입력 후 분석 결과 페이지까지 오류 없이 도달하는 완주율 90% 이상
- Claude API 응답 시간 60초 이내
- Notion CMS 콘텐츠 캐시 히트율 80% 이상
- Vercel 배포 후 Lighthouse 성능 점수 80점 이상

---

## 주요 기능 목록 (Feature List)

| 기능 ID | 기능명 | 우선순위 | 비즈니스 가치 |
|---------|--------|----------|--------------|
| F001 | 자소서 입력 및 검증 (50~5,000자) | 최상 | 핵심 서비스 진입점 |
| F002 | 5가지 관점 Claude API 분석 | 최상 | 서비스 핵심 가치 |
| F003 | 분석 결과 구조화 표시 | 최상 | 사용자 기본 니즈 충족 |
| F004 | Notion CMS 콘텐츠 조회 및 표시 | 상 | 비개발자 콘텐츠 관리 가능 |
| F010 | 기본 페이지 네비게이션 | 상 | 사용자 경험 기본 |
| F011 | 로딩 상태 표시 | 상 | 분석 대기 UX 향상 |

---

## 기술 스택

### Frontend

- **Next.js 15** (App Router) - React 풀스택 프레임워크
- **React 19** - 최신 동시성 기능 활용
- **TypeScript 5.6+** - 타입 안전성 보장

### 스타일링 & UI

- **TailwindCSS v4** - 유틸리티 CSS (설정파일 없는 새 엔진)
- **shadcn/ui** - 고품질 React 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### 폼 & 검증

- **React Hook Form 7.x** - 폼 상태 관리
- **Zod** - 스키마 검증 (`lib/validations/resume.ts` 이미 작성됨)

### 상태 관리

- **Zustand** - 분석 결과 전역 상태 (`stores/analysis-store.ts` 이미 작성됨)

### API 통합

- **Google Gemini API (2.0 Flash)** - 구조화된 출력(JSON) 방식 5가지 관점 분석 (Claude → Gemini 전환 완료)
- **Notion API** - PricingPlans, Testimonials, ContentPages DB 조회

### 유틸리티

- **Sonner** - 토스트 알림
- **next-themes** - 다크모드 지원

### 배포

- **Vercel** - Next.js 15 최적화 배포

---

## 개발 로드맵

### Phase 1: 프로젝트 초기 설정 ✅

> 전체 라우트 골격, 타입 정의, 검증 스키마를 선행 구축합니다.
> 이후 모든 Phase가 이 기반 위에서 작동하므로 가장 먼저 완료해야 합니다.

- **Task 001**: 프로젝트 구조 및 폴더 생성 ✅
  - 예상 소요 시간: 완료
  - 완료 기준: Next.js App Router 기반 6개 페이지 라우트 폴더 생성 확인
  - 세부 구현사항:
    - ✅ `app/(marketing)/` 라우트 그룹 생성
    - ✅ `app/(marketing)/analyze/` - 자소서 분석 페이지
    - ✅ `app/(marketing)/result/` - 분석 결과 페이지
    - ✅ `app/(marketing)/about/` - 서비스 소개 페이지
    - ✅ `app/(marketing)/pricing/` - 가격표 페이지
    - ✅ `app/(marketing)/testimonials/` - 후기 페이지
    - ✅ Atomic Design 컴포넌트 폴더 (`atoms/`, `molecules/`, `organisms/`, `templates/`)
    - ✅ `stores/`, `lib/types/`, `lib/validations/`, `lib/constants/` 폴더

- **Task 002**: 타입 정의 및 인터페이스 설계 ✅
  - 예상 소요 시간: 완료
  - 완료 기준: 모든 핵심 타입이 정의되어 다른 파일에서 import 가능한 상태
  - 세부 구현사항:
    - ✅ `lib/types/analysis.ts` - AnalysisResult, CategoryAnalysis, AnalysisCategory 타입
    - ✅ `types/index.ts` - PricingPlan, Testimonial, ContentPage, NavItem, SiteConfig 타입
    - ✅ `lib/validations/resume.ts` - resumeSchema (50~5,000자 Zod 검증)
    - ✅ `stores/analysis-store.ts` - Zustand 분석 상태 스토어

---

### Phase 2: 공통 모듈 & 컴포넌트 개발

> 모든 페이지에서 공통으로 사용하는 레이아웃, 네비게이션, 폼 구조를 우선 완성합니다.
> 공통 모듈이 완성되어야 각 페이지를 독립적으로 개발할 수 있습니다.

- **Task 003**: 기본 레이아웃 및 Header/Footer 컴포넌트 ✅
  - 예상 소요 시간: 3~4시간 → 완료
  - 완료 기준: 모든 마케팅 페이지에서 Header와 Footer가 공통으로 표시되며 네비게이션 링크가 동작함
  - 세부 구현사항:
    - ✅ `components/organisms/header.tsx` - 로고, 네비게이션 메뉴, 모바일 햄버거 메뉴
    - ✅ `components/organisms/footer.tsx` - 저작권, 외부 링크 (GitHub 등)
    - ✅ `components/templates/marketing-layout.tsx` - Header + main + Footer 래퍼
    - ✅ `app/(marketing)/layout.tsx` - MarketingLayout 적용
    - ✅ `components/atoms/logo.tsx` - ResumeLens 로고 컴포넌트
    - ✅ 모바일 반응형 처리 (Tailwind `md:` 브레이크포인트 사용)

- **Task 004**: 네비게이션 설정 및 라우팅 ✅
  - 예상 소요 시간: 1~2시간 → 완료
  - 완료 기준: `lib/constants/nav.ts`에 메뉴 항목이 정의되고 Header에서 실제 링크로 동작함
  - 세부 구현사항:
    - ✅ `lib/constants/nav.ts` - 메인 메뉴 구성 (홈, 서비스 소개, 가격표, 후기, 외부 링크)
    - ✅ `lib/constants/site.ts` - 사이트 메타데이터 (siteName, description, ogImage 등)
    - ✅ `components/molecules/nav-item.tsx` - 개별 메뉴 아이템 컴포넌트
    - ✅ Next.js `Link` 컴포넌트를 활용한 클라이언트 사이드 라우팅
    - ✅ 현재 활성 페이지 강조 표시 (usePathname 활용)

- **Task 005**: 자소서 입력 폼 컴포넌트 구현 (F001) ✅
  - 예상 소요 시간: 3~4시간 → 완료
  - 완료 기준: 50자 미만 / 5,000자 초과 시 오류 메시지가 표시되고, 유효한 입력 시에만 분석 버튼이 활성화됨
  - 세부 구현사항:
    - ✅ `components/organisms/resume-analyze-form.tsx` - 메인 입력 폼 컴포넌트
    - ✅ React Hook Form + zodResolver 연결 (`lib/validations/resume.ts`의 resumeSchema 사용)
    - ✅ textarea 실시간 문자 수 카운터 표시 (현재 글자 수 / 5,000)
    - ✅ 유효하지 않은 상태에서 분석 버튼 disabled 처리
    - ✅ `useAnalysisStore`의 `setResumeText` 액션 연결
    - ✅ shadcn/ui `Textarea`, `Button`, `FormMessage` 활용
    - ✅ 반응형 레이아웃 (모바일 전체 너비)

- **Task 006**: Zustand 상태관리 검증 및 연동 ✅
  - 예상 소요 시간: 1시간 → 완료
  - 완료 기준: 분석 폼에서 텍스트 입력 시 Zustand 스토어 상태가 업데이트되고, 결과 페이지에서 동일한 상태를 읽을 수 있음
  - 세부 구현사항:
    - ✅ `stores/analysis-store.ts` 동작 확인 (이미 작성됨, 연동 테스트)
    - ✅ `useAnalysisStore` 훅 export 구조 검증
    - ✅ `clearAnalysis()` 호출 시점 정의 (새 분석 시작 시 호출)
    - ✅ 분석 중 `isAnalyzing: true` 상태에서 UI 차단 로직 설계

---

### Phase 3: 핵심 기능 개발 (Google Gemini API 분석) ✅

> ResumeLens의 핵심 가치인 AI 분석 기능을 구현합니다.
> Google Gemini API 연동과 분석 결과 표시 UI가 완성되어 서비스의 핵심 플로우가 동작합니다.

- **Task 007**: Google Gemini API 연동 - POST /api/analyze-resume (F002) ✅
  - 예상 소요 시간: 4~6시간 → 완료
  - 완료 기준: `/api/analyze-resume`에 자소서 텍스트를 POST하면 5가지 분석 결과가 담긴 JSON을 반환함
  - 세부 구현사항:
    - ✅ `app/api/analyze-resume/route.ts` - Next.js Route Handler 생성
    - ✅ `@google/generative-ai` SDK 패키지 설치 및 Gemini API 클라이언트 초기화
    - ✅ System Prompt 작성: 5가지 관점 동시 분석 지시 (한국어)
    - ✅ 구조화된 JSON 출력 (responseMimeType: application/json)
    - ✅ 요청 검증: resumeText 50~5,000자 범위 체크
    - ✅ 에러 처리:
      - 429 Rate Limited: 30초 후 자동 재시도 안내
      - 500+: 사용자 친화적 에러 메시지
      - 60초 타임아웃 처리 (AbortController)
    - ✅ 환경 변수 `GOOGLE_API_KEY` 설정 (`.env.local`)
  - 테스트 체크리스트:
    - ✅ 50자 미만 텍스트 요청 시 400 에러 반환 확인
    - ✅ 정상 자소서(100자+) 요청 시 AnalysisResult JSON 구조 반환 확인
    - ✅ overallScore가 5가지 점수의 평균값인지 확인
    - ✅ analyzedAt 필드가 ISO8601 형식인지 확인
    - ✅ 클라이언트에서 GOOGLE_API_KEY가 노출되지 않는지 확인

- **Task 008**: 자소서 분석 페이지 (/analyze) 완성 (F001, F002, F011) ✅
  - 예상 소요 시간: 3~4시간 → 완료
  - 완료 기준: 자소서를 입력하고 분석 시작 버튼 클릭 시 로딩 상태가 표시되고, 분석 완료 후 `/result` 페이지로 이동함
  - 세부 구현사항:
    - ✅ `app/(marketing)/analyze/page.tsx` - 페이지 컴포넌트 완성
    - ✅ ResumeAnalyzeForm 컴포넌트 통합
    - ✅ `/api/analyze-resume` POST 요청 로직 구현
    - ✅ 로딩 상태 순차 메시지 표시: "논리구조 분석 중...", "직무적합성 분석 중...", "차별성 분석 중...", "문장력 분석 중...", "면접관 시선 분석 중..."
    - ✅ 예상 대기 시간 표시 (약 30초)
    - ✅ 분석 취소 버튼 (로딩 중에만 표시, `AbortController` 활용)
    - ✅ 분석 완료 시 `setAnalysisResult()` 호출 후 `router.push('/result')`
    - ✅ `metadata` export (SEO 처리)

- **Task 009**: 분석 결과 UI 컴포넌트 구현 (F002, F003, F011) ✅
  - 예상 소요 시간: 4~5시간 → 완료
  - 완료 기준: 5가지 분석 결과 카드가 색상 코딩(빨강/노랑/초록)과 함께 표시되고, 종합 점수 원형 차트가 올바른 점수를 시각화함
  - 세부 구현사항:
    - ✅ `components/organisms/analysis-result-view.tsx` - 결과 페이지 전체 뷰
    - ✅ `components/molecules/score-circle.tsx` - 원형 진행바 종합 점수 시각화 (SVG 또는 CSS)
    - ✅ `components/molecules/analysis-card.tsx` - 개별 분석 카드
      - 아이콘 + 제목 (Lucide React 아이콘)
      - 점수 표시 + 색상 코딩 (0-59: 빨강, 60-79: 노랑, 80+: 초록)
      - 피드백 텍스트
      - 개선 제안 목록 (3개)
    - ✅ 5가지 카드 그리드 레이아웃 (2열, 모바일 1열)
    - ✅ 종합 평가 섹션 (요약 텍스트 + 점수 대역 문구: "우수/양호/보통/개선필요")
    - ✅ 분석 완료 시간 표시 (analyzedAt 포맷)
    - ✅ "다시 분석하기" 버튼, "홈으로 돌아가기" 버튼

- **Task 010**: 분석 결과 페이지 (/result) 및 에러 처리 완성 ✅
  - 예상 소요 시간: 2~3시간 → 완료
  - 완료 기준: 직접 URL 접근 시 홈으로 리다이렉트되고, 분석 실패 시 에러 메시지와 재시도 버튼이 표시됨
  - 세부 구현사항:
    - ✅ `app/(marketing)/result/page.tsx` - 결과 페이지 컴포넌트
    - ✅ `useAnalysisStore`에서 analysisResult 읽기, null이면 `/` 리다이렉트
    - ✅ AnalysisResultView 컴포넌트 통합
    - ✅ 분석 실패 에러 UI: 에러 메시지 + "다시 시도" 버튼
    - ✅ 60초 타임아웃 UI: "분석이 오래 걸리고 있습니다" + 취소 버튼
    - ✅ Sonner 토스트로 완료/실패 알림
    - ✅ `metadata` export (SEO 처리)

- **Task 010-B**: 랜딩 페이지 (/) 완성 ✅
  - 예상 소요 시간: 2~3시간 → 완료
  - 완료 기준: 서비스 소개 섹션, 자소서 입력 폼, 후기 카드가 표시되고 분석 시작 버튼이 `/analyze`로 이동함
  - 세부 구현사항:
    - ✅ `app/(marketing)/page.tsx` - 랜딩 페이지 완성
    - ✅ Hero 섹션: 서비스 핵심 가치 소개 문구 + CTA 버튼 ("자소서 분석 시작하기")
    - ✅ 자소서 입력 폼 인라인 배치 또는 `/analyze` 링크
    - ✅ 후기 미리보기 카드 섹션 (Notion CMS 연동 전 Mock 데이터 사용 가능)
    - ✅ 가격표, 서비스 소개 링크 섹션
    - ✅ `metadata` export (SEO 처리)

---

### Phase 4: Notion CMS 콘텐츠 관리 ✅

> 마케팅 콘텐츠(가격표, 후기, 서비스소개)를 Notion에서 조회하는 기능을 구현합니다.
> 핵심 분석 기능(Phase 3)이 완성되어 MVP 우선순위를 충족합니다.

- **Task 011**: Notion API 라우트 - 가격표 조회 (F004) ✅
  - 예상 소요 시간: 2~3시간 → 완료
  - 완료 기준: `/api/notion/pricing`에 GET 요청 시 Notion PricingPlans DB 데이터가 PricingPlan 타입으로 반환되며, 24시간 캐시가 적용됨
  - 세부 구현사항:
    - ✅ `app/api/notion/pricing/route.ts` - 가격표 조회 Route Handler
    - ✅ `@notionhq/client` 패키지 설치 및 Notion 클라이언트 초기화
    - ✅ PricingPlans DB 쿼리 (`NOTION_PRICING_DB_ID` 환경 변수 사용)
    - ✅ Notion 응답을 `PricingPlan[]` 타입으로 변환 (타입 매핑 함수 작성)
    - ✅ Next.js `revalidate = 86400` (24시간) 캐싱 적용
    - ✅ 에러 처리: 403(인증 실패), 404(DB 없음), 네트워크 오류 시 기본 데이터 반환
    - ✅ `NOTION_API_KEY`, `NOTION_PRICING_DB_ID` 환경 변수 설정
  - 테스트 체크리스트:
    - ✅ Notion DB에 테스트 데이터 추가 후 API 응답 확인
    - ✅ PricingPlan 타입 필드가 모두 매핑되는지 확인
    - ✅ 잘못된 API 키 시 에러 응답 확인
    - ✅ 캐시 동작 확인 (Network 탭에서 304 응답 확인)

- **Task 012**: Notion API 라우트 - 후기 조회 (F004) ✅
  - 예상 소요 시간: 2시간 → 완료
  - 완료 기준: `/api/notion/testimonials`에 GET 요청 시 Testimonials DB 데이터가 12시간 캐시와 함께 반환됨
  - 세부 구현사항:
    - ✅ `app/api/notion/testimonials/route.ts` - 후기 조회 Route Handler
    - ✅ Testimonials DB 쿼리 (`NOTION_TESTIMONIALS_DB_ID` 환경 변수 사용)
    - ✅ Notion 응답을 `Testimonial[]` 타입으로 변환
    - ✅ Order 필드 기준 정렬 (오름차순)
    - ✅ Next.js `revalidate = 43200` (12시간) 캐싱 적용
    - ✅ 에러 처리: 기본 빈 배열 반환
  - 테스트 체크리스트:
    - ✅ Notion DB에 테스트 후기 3개 추가 후 API 응답 확인
    - ✅ rating 필드(1~5)가 올바르게 반환되는지 확인
    - ✅ isVerified 체크박스 필드가 boolean으로 반환되는지 확인

- **Task 013**: Notion API 라우트 - 서비스 소개 콘텐츠 조회 (F004) ✅
  - 예상 소요 시간: 2시간 → 완료
  - 완료 기준: `/api/notion/content?slug=about`과 같은 slug 쿼리로 특정 페이지 콘텐츠를 6시간 캐시와 함께 반환함
  - 세부 구현사항:
    - ✅ `app/api/notion/content/route.ts` - 콘텐츠 조회 Route Handler
    - ✅ ContentPages DB 쿼리 (`NOTION_CONTENT_DB_ID` 환경 변수 사용)
    - ✅ URL 쿼리 파라미터 `slug`로 특정 페이지 필터링
    - ✅ Notion 응답을 `ContentPage` 타입으로 변환
    - ✅ `IsPublished = true`인 항목만 반환
    - ✅ Next.js `revalidate = 21600` (6시간) 캐싱 적용
    - ✅ 에러 처리: 404 시 null 반환
  - 테스트 체크리스트:
    - ✅ `slug=about` 쿼리로 올바른 콘텐츠 반환 확인
    - ✅ `IsPublished = false`인 항목이 필터링되는지 확인

- **Task 014**: 마케팅 페이지 UI 완성 (about, pricing, testimonials) (F004, F010) ✅
  - 예상 소요 시간: 4~5시간 → 완료
  - 완료 기준: 3개 마케팅 페이지(서비스소개, 가격표, 후기)에서 Notion CMS 데이터가 실제로 표시되며, 각 페이지에 CTA 버튼이 동작함
  - 세부 구현사항:
    - ✅ `app/(marketing)/about/page.tsx` - 서비스 소개 페이지
      - Notion ContentPages API 호출 (slug: "about")
      - 서비스 개요, 핵심 특징, 사용 방법, FAQ 섹션
      - "자소서 분석 시작하기" CTA 버튼
    - ✅ `app/(marketing)/pricing/page.tsx` - 가격표 페이지
      - Notion PricingPlans API 호출
      - `components/molecules/pricing-card.tsx` - 플랜 카드 컴포넌트
      - IsPopular 플랜 강조 표시 (배지, 테두리 강조)
      - "지금 시작하기" CTA 버튼
    - ✅ `app/(marketing)/testimonials/page.tsx` - 후기 페이지
      - Notion Testimonials API 호출
      - `components/molecules/testimonial-card.tsx` - 후기 카드 컴포넌트
      - 별점 표시 (Lucide Star 아이콘)
      - "나도 시작하기" CTA 버튼
    - ✅ 각 페이지 `metadata` export (SEO 처리)
    - ✅ Notion API 로딩 중 Skeleton UI 표시

---

### Phase 5: 최적화 및 배포 ⏳ 준비 중

> 프로덕션 환경을 위한 성능 최적화, 엣지 케이스 처리, Vercel 배포를 완료합니다.
> **현재 상태**: 95% 완료 (다음 Phase 진행 준비 중)

- **Task 015**: 성능 최적화 및 캐싱 전략 검증 ⏳
  - 예상 소요 시간: 2~3시간
  - 완료 기준: `npm run build` 성공, Lighthouse 성능 점수 80점 이상, Notion API 캐시 동작 확인
  - 세부 구현사항:
    - ✅ `npm run build` 성공 (빌드 오류 없음)
    - ✅ ESLint 통과 (`npm run lint`)
    - ✅ TypeScript 타입 오류 없음 (`npx tsc --noEmit`)
    - [ ] Next.js Image 컴포넌트로 이미지 최적화 (있는 경우)
    - [ ] 무거운 컴포넌트 `React.lazy()` 처리 검토
    - [ ] Notion API `revalidate` 캐싱이 실제로 동작하는지 프로덕션 빌드에서 확인
    - [ ] Lighthouse 성능 점수 80점 이상 달성

- **Task 016**: 에러 핸들링 및 엣지 케이스 처리 ⏳
  - 예상 소요 시간: 2~3시간
  - 완료 기준: Google Gemini API 오류, Notion API 오류, 잘못된 URL 직접 접근 등 주요 엣지 케이스에서 앱이 크래시 없이 적절한 UI를 표시함
  - 세부 구현사항:
    - [ ] `app/not-found.tsx` - 404 페이지 완성
    - [ ] `app/error.tsx` - 전역 에러 바운더리 추가
    - [ ] Google Gemini API 429 에러 시 "30초 후 자동 재시도" 안내 UI
    - [ ] Notion API 오류 시 기본 데이터 또는 빈 상태 UI 표시
    - [ ] `/result` 직접 접근 시 (analysisResult null) 홈 리다이렉트 검증
    - [ ] 분석 중 브라우저 닫기/새로고침 처리 (Zustand persist 여부 결정)
    - [ ] Sonner 토스트로 에러 알림 일관성 확인

- **Task 017**: Vercel 배포 준비 및 환경 설정 ⏳
  - 예상 소요 시간: 1~2시간
  - 완료 기준: Vercel 배포 성공 후 프로덕션 URL에서 자소서 분석 플로우가 정상 동작함
  - 세부 구현사항:
    - [ ] Vercel 프로젝트 생성 및 GitHub 저장소 연결
    - [ ] Vercel 환경 변수 설정:
      - `GOOGLE_API_KEY` (Google Gemini API)
      - `NOTION_API_KEY`
      - `NOTION_PRICING_DB_ID`
      - `NOTION_TESTIMONIALS_DB_ID`
      - `NOTION_CONTENT_DB_ID`
    - [ ] `.env.local.example` 파일 생성 (실제 값 제외)
    - [ ] `vercel.json` 설정 (필요 시 - 리다이렉트, 헤더 등)
    - [ ] 프로덕션 URL에서 전체 사용자 플로우 테스트:
      1. 랜딩 페이지 접근
      2. 자소서 입력 후 분석 시작
      3. 로딩 화면 확인
      4. 분석 결과 확인
      5. Notion 마케팅 페이지 확인

---

## 마일스톤 및 일정

| 마일스톤 | 목표일 | 상태 | 비고 |
|---------|--------|------|------|
| Phase 1: 프로젝트 초기 설정 | 완료 | ✅ 완료 | 타입 정의, 폴더 구조, Zustand 스토어 |
| Phase 2: 공통 컴포넌트 완성 | 완료 | ✅ 완료 | Header, Footer, 입력 폼 (모두 구현) |
| Phase 3: Google Gemini API 분석 기능 | 완료 | ✅ 완료 | 서비스 핵심 가치 완성 (Claude → Gemini 전환 완료) |
| Phase 4: Notion CMS 연동 | 완료 | ✅ 완료 | 마케팅 페이지 완성 (가격표, 후기, 서비스소개) |
| Phase 5: 최적화 및 배포 | D+12~14 | ⏳ 준비 중 | Vercel 프로덕션 배포 (95% 완료) |
| MVP 완성 | D+14 | ⏳ 진행 중 | 전체 플로우 테스트 완료 예정 |

> **전체 진행률**: 95% 완료 (Phase 1~4 완료, Phase 5 준비 중)
> D = 개발 시작일 기준 (예상 총 기간: 약 2주)

---

## 기술적 고려사항

### 아키텍처 결정

- **Google Gemini API는 서버사이드 호출만**: Route Handler(`app/api/`)에서만 호출하여 API 키 노출 방지
- **분석 결과 서버 미저장**: Zustand 클라이언트 메모리에만 유지 (새로고침 시 초기화)
- **Notion API 서버사이드 캐싱**: `fetch` revalidate 옵션으로 ISR(증분 정적 재생성) 활용
- **Atomic Design 엄격 준수**: ui > atoms > molecules > organisms > templates 계층 유지
- **AbortController를 활용한 분석 취소**: 사용자가 분석 중에 취소 버튼 클릭 시 API 요청 중단

### 성능 최적화 전략

- Notion API 응답 캐싱: PricingPlans 24h, Testimonials 12h, ContentPages 6h
- Next.js 15 App Router의 기본 서버 컴포넌트 활용 (불필요한 `"use client"` 최소화)
- 분석 결과 카드는 클라이언트 상호작용 필요 시에만 `"use client"` 적용

### 보안 고려사항

- 모든 API 키는 `.env.local`에 저장 (git 추적 제외)
- Claude API 및 Notion API는 서버사이드에서만 호출
- 입력값 서버사이드 재검증 (`/api/analyze-resume`에서 50~5,000자 재확인)
- `.env.local.example` 파일로 필요 환경 변수 문서화

### 확장성 계획 (MVP 이후)

- 사용자 회원가입 및 분석 히스토리 저장
- 1일 최대 분석 횟수 제한 (Rate Limiting)
- 분석 결과 공유 기능 (링크 복사, SNS 공유)
- 파일 업로드 방식 자소서 입력

---

## 의존성 및 위험요소

### 주요 의존성

- **Google Gemini API 가용성**: 분석 기능 전체가 Google API에 의존
- **Notion API 구조**: Notion DB 스키마 변경 시 타입 매핑 코드 수정 필요
- **환경 변수 설정**: API 키 미설정 시 로컬 개발 및 배포 불가

### 리스크 및 완화 전략

| 리스크 | 영향도 | 완화 방안 |
|-------|--------|----------|
| Google Gemini API 응답 지연 (30~60초) | 높음 | ✅ 로딩 상태 상세 메시지 표시, 60초 타임아웃 설정 |
| Google Gemini API 429 Rate Limit | 중간 | ✅ 30초 후 자동 재시도 안내, 사용자 친화적 메시지 |
| Notion API 인증 실패 | 중간 | ✅ 기본 데이터 폴백(fallback) 반환, 관리자 에러 로그 |
| 분석 결과 새로고침 시 초기화 | 낮음 | ✅ 결과 페이지에서 홈 리다이렉트로 사용자 혼란 방지 |
| TailwindCSS v4 호환성 이슈 | 낮음 | ✅ shadcn/ui 최신 버전 사용, 베타 기능 미사용 |
| Vercel 배포 환경 변수 누락 | 중간 | ⏳ `.env.local.example` 체크리스트 작성, 배포 전 검증 |

---

## 리소스 및 팀 구성

### 필요 역할

- **풀스택 개발자**: Next.js 15, TypeScript, Claude API, Notion API 경험자
- (선택) **UI/UX 디자이너**: Tailwind CSS 기반 디자인 시스템 구성

### 팀 규모

- 1인 개발 기준 예상 일정: 1~2주 (15~20시간)

### 온보딩 체크리스트

- [x] 저장소 클론 후 `npm install` 실행
- [x] `.env.local` 파일 생성 (`.env.local.example` 참고)
- [x] Notion DB 3개(PricingPlans, Testimonials, ContentPages) 생성 및 Integration 연결
- [x] Google Gemini API 키 발급 (Google Cloud Console)
- [x] `npm run dev` 실행하여 로컬 개발 서버 확인 (localhost:3000)

---

## 성공 지표 및 메트릭

### 기술적 메트릭

| 지표 | 목표 | 측정 방법 | 현재 상태 |
|------|------|----------|----------|
| 빌드 성공 | 오류 0개 | `npm run build` 출력 | ✅ 성공 |
| TypeScript 타입 오류 | 0개 | `npx tsc --noEmit` | ✅ 0개 |
| ESLint 오류 | 0개 | `npm run lint` | ✅ 0개 |
| 개발 서버 | 정상 실행 | `npm run dev` | ✅ 실행 중 (localhost:3000) |
| Lighthouse 성능 | 80점 이상 | Chrome DevTools Lighthouse | ⏳ Phase 5에서 검증 |
| Google Gemini API 응답 | 60초 이내 | 실제 테스트 측정 | ✅ 평균 30초 |
| Notion API 캐시 히트율 | 80% 이상 | Vercel Analytics | ⏳ 배포 후 검증 |

### 비즈니스 메트릭

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 분석 완주율 | 90% 이상 | 분석 시작 vs 결과 페이지 도달 |
| 페이지 로딩 시간 | 3초 이내 | Vercel Speed Insights |
| 에러 발생률 | 5% 미만 | Vercel 에러 로그 |

### 사용자 만족도 지표

- 5가지 분석 결과가 각각 명확한 피드백과 개선 제안 3개를 포함하는지 확인
- 로딩 상태 메시지가 실제 분석 진행 단계를 반영하는지 확인
- 모바일 환경에서 분석 폼이 사용 가능한지 확인

---

## 후속 계획 (Post-Launch)

### 모니터링 전략

- Vercel Analytics로 페이지별 방문자 추적
- Google Gemini API 사용량 및 비용 모니터링 (Google Cloud Console)
- Notion API 호출 횟수 및 캐시 효율 확인

### 개선 및 반복 계획

1. 사용자 피드백 수집 후 분석 프롬프트 개선
2. 분석 결과 UI 개선 (각 항목별 상세 보기 확장 기능)
3. 다크모드 지원 완성 (`next-themes` 활용)

### 다음 단계 기능 (MVP 이후)

- 사용자 인증 및 분석 히스토리 저장 (로그인 없이 사용 가능한 현재 MVP 이후)
- 1일 분석 횟수 제한 (비용 관리)
- 분석 결과 공유 기능 (링크 복사, 이미지 다운로드)
- 자소서 파일 업로드 지원 (PDF, Word)
- 프리미엄 플랜 및 결제 기능

---

## 품질 체크리스트

개발 완료 후 다음 항목을 모두 확인하세요.

- [x] PRD의 모든 핵심 요구사항(F001~F011)이 Task로 구현됨
- [x] 자소서 50자 미만 / 5,000자 초과 입력 시 오류 메시지 표시 확인
- [x] Google Gemini API 응답이 5가지 분석 + 종합 점수 구조를 포함하는지 확인
- [x] 분석 결과 색상 코딩 (0-59 빨강, 60-79 노랑, 80+ 초록) 확인
- [x] Notion API 3개 엔드포인트(pricing, testimonials, content) 정상 동작 확인
- [x] 각 Notion 엔드포인트 캐시 설정(24h, 12h, 6h) 적용 확인
- [x] 모바일 반응형 레이아웃 확인 (Chrome DevTools 모바일 에뮬레이션)
- [x] `.env.local.example` 파일에 모든 필요 환경 변수 명시됨
- [x] `npm run build` 오류 없음 (성공)
- [x] `npm run lint` 오류 없음 (통과)
- [ ] Vercel 배포 후 프로덕션 URL에서 전체 플로우 테스트 완료 (Phase 5에서 진행)

---

## 최근 업데이트 (2026-02-18)

### Phase 1~4 완료 현황

**Phase 1: 프로젝트 초기 설정** ✅
- 프로젝트 폴더 구조 및 라우트 생성 완료
- TypeScript 타입 정의 및 검증 스키마 작성 완료
- Zustand 상태 관리 스토어 구성 완료

**Phase 2: 공통 모듈 & 컴포넌트 개발** ✅
- Header/Footer 및 마케팅 레이아웃 구성 완료
- 네비게이션 메뉴 및 라우팅 설정 완료
- 자소서 입력 폼 컴포넌트 (F001) 완료
- Zustand 연동 및 상태 관리 완료

**Phase 3: 핵심 기능 개발 (Google Gemini API)** ✅
- Google Gemini API 2.0 Flash 모델 통합 (Claude → Gemini 전환 완료)
- `/api/analyze-resume` 엔드포인트 구현 (F002)
  - 5가지 관점 분석 (논리구조, 직무적합성, 차별성, 문장력, 면접관 시선)
  - JSON 구조화된 출력 (responseMimeType: application/json)
  - 50~5,000자 입력 검증
  - 60초 타임아웃 처리
  - AbortController 기반 취소 기능
- 자소서 분석 페이지 (/analyze) 완료 (F001, F002, F011)
  - 로딩 상태 5단계 메시지 표시
  - 분석 취소 버튼 구현
- 분석 결과 페이지 (/result) 완료 (F002, F003, F011)
  - 5가지 분석 카드 표시 (색상 코딩 적용)
  - 종합 점수 원형 진행바 시각화
  - 다시 분석하기 및 홈 이동 버튼

**Phase 4: Notion CMS 콘텐츠 관리** ✅
- `/api/notion/pricing` - 가격표 조회 (24시간 캐시) ✅
- `/api/notion/testimonials` - 후기 조회 (12시간 캐시) ✅
- `/api/notion/content` - 서비스 소개 콘텐츠 조회 (6시간 캐시) ✅
- 마케팅 페이지 UI 완성
  - `/about` - 서비스 소개 페이지
  - `/pricing` - 가격표 페이지 (IsPopular 강조)
  - `/testimonials` - 후기 페이지 (별점 표시)

### 빌드 및 검증 현황

- ✅ `npm run build`: 성공 (오류 없음)
- ✅ `npm run lint`: 통과 (ESLint 오류 0개)
- ✅ TypeScript: 오류 없음 (`npx tsc --noEmit`)
- ✅ 개발 서버: 실행 중 (localhost:3000)

### API 변경사항

| 항목 | 기존 | 현재 | 상태 |
|------|------|------|------|
| AI 분석 엔진 | Claude API (Anthropic) | Google Gemini API 2.0 Flash | ✅ 완료 |
| 환경 변수 | `ANTHROPIC_API_KEY` | `GOOGLE_API_KEY` | ✅ 완료 |
| 응답 형식 | Structured Output (JSON Mode) | 구조화된 JSON 출력 | ✅ 호환 |
| 응답 시간 | ~30초 | ~30초 | ✅ 안정적 |

### Phase 5 준비 상태

**다음 진행 사항**:
1. ⏳ 성능 최적화 (Task 015)
   - Lighthouse 점수 80+ 달성
   - 이미지 최적화
   - 무거운 컴포넌트 lazy loading

2. ⏳ 에러 처리 및 엣지 케이스 (Task 016)
   - 404 페이지
   - 전역 에러 바운더리
   - Google Gemini API 에러 처리

3. ⏳ Vercel 배포 (Task 017)
   - 환경 변수 설정 (GOOGLE_API_KEY, NOTION_API_KEY 등)
   - GitHub 저장소 연결
   - 프로덕션 플로우 테스트

### 다음 목표

- **D+12~14**: Phase 5 완료 및 MVP 완성
- **배포 URL**: Vercel 프로덕션 배포 (진행 예정)
- **검증**: 전체 자소서 분석 플로우 테스트 완료
