# Roadmap Architect 메모리

## 프로젝트 컨텍스트

- **프로젝트**: ResumeLens (자소서 AI 분석 서비스)
- **PRD 위치**: `docs/PRD.md`
- **ROADMAP 위치**: `docs/ROADMAP.md`
- **상태**: ROADMAP.md 최초 생성 완료 (2026-02-17)

## 확인된 기존 구현 사항 (Phase 1 완료)

- `stores/analysis-store.ts` - Zustand 분석 상태 스토어 작성됨
- `lib/types/analysis.ts` - AnalysisResult, CategoryAnalysis 타입 정의됨
- `lib/validations/resume.ts` - resumeSchema Zod 검증 (50~5,000자) 작성됨
- `types/index.ts` - PricingPlan, Testimonial, ContentPage 타입 정의됨
- `app/(marketing)/` 라우트 그룹 6개 페이지 폴더 생성됨

## 로드맵 패턴: API+CMS 통합 프로젝트

### 효과적인 Phase 구분

1. **Phase 1 (기반)**: 타입, 검증 스키마, 폴더 구조 - 항상 최우선
2. **Phase 2 (공통)**: 레이아웃, 네비게이션, 공통 컴포넌트 - 모든 페이지 의존
3. **Phase 3 (핵심 기능)**: 서비스 핵심 가치(여기선 Claude API 분석) - 비즈니스 가치 최우선
4. **Phase 4 (부가 기능)**: 마케팅/CMS 연동(Notion) - 핵심 이후 처리
5. **Phase 5 (완성)**: 최적화, 에러 처리, 배포

### 노션 CMS 캐싱 표준 패턴

- PricingPlans: `revalidate = 86400` (24시간, 변경 빈도 낮음)
- Testimonials: `revalidate = 43200` (12시간)
- ContentPages: `revalidate = 21600` (6시간, 변경 빈도 중간)

## 노력 추정 범위 (1인 풀스택 개발자 기준)

- Route Handler (API) 구현: 2~3시간/엔드포인트
- 복합 UI 컴포넌트 (카드, 차트 등): 3~5시간
- 레이아웃 + 네비게이션: 3~4시간
- 폼 컴포넌트 (React Hook Form + Zod): 3~4시간
- 배포 설정 (Vercel + 환경변수): 1~2시간
- **총 MVP (Claude API + Notion CMS + 6페이지)**: 15~20시간 = 약 1~2주

## 참고 파일

- 상세 Phase 패턴: `patterns.md` (추후 작성 예정)
