# ResumeLens

Claude AI로 자소서를 5가지 관점(논리구조, 직무적합성, 차별성, 문장력, 면접관 시선)에서 동시 분석하고 개선점을 제시하는 서비스입니다. Notion CMS를 활용하여 비개발자도 마케팅 콘텐츠를 직접 관리할 수 있습니다.

## 프로젝트 개요

**목적**: 구직자의 자소서를 AI로 분석하여 합격 가능성 향상
**범위**: 자소서 분석 + Notion CMS 콘텐츠 관리
**사용자**: 입사 면접을 준비하는 20~40대 직장인 및 신입 구직자

## 주요 페이지

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 랜딩 페이지 | `/` | 서비스 소개 및 자소서 분석 진입점 |
| 자소서 분석 | `/analyze` | 자소서 입력 및 분석 요청 |
| 분석 결과 | `/result` | 5가지 분석 결과 카드 표시 |
| 서비스 소개 | `/about` | Notion CMS 콘텐츠 |
| 가격표 | `/pricing` | Notion CMS 콘텐츠 |
| 후기 | `/testimonials` | Notion CMS 콘텐츠 |

## 핵심 기능

- **F001**: 자소서 입력 및 검증 (50-5,000자)
- **F002**: 5가지 관점 Claude API 분석
- **F003**: 분석 결과 구조화된 표시
- **F004**: Notion CMS 콘텐츠 조회
- **F010**: 페이지 네비게이션
- **F011**: 로딩 상태 표시

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5.6+
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **APIs**: Claude API, Notion API
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Theme**: next-themes

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 API 키 입력

# 3. 개발 서버 실행
npm run dev
```

개발 서버는 http://localhost:3000 에서 실행됩니다.

## 환경 변수

`.env.local.example` 파일을 참고하여 `.env.local` 파일을 생성하세요.

| 변수명 | 설명 |
|--------|------|
| `ANTHROPIC_API_KEY` | Claude API 키 |
| `NOTION_API_KEY` | Notion 통합 API 키 |
| `NOTION_PRICING_DB_ID` | Notion PricingPlans DB ID |
| `NOTION_TESTIMONIALS_DB_ID` | Notion Testimonials DB ID |
| `NOTION_CONTENT_DB_ID` | Notion ContentPages DB ID |

## 주요 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버 실행
npm run lint         # ESLint 검사
npm run lint -- --fix  # ESLint 자동 수정
```

## 개발 상태

- [x] 기본 프로젝트 구조 설정 (Atomic Design, 라우터 그룹)
- [x] ResumeLens 6개 페이지 구조 (랜딩, 분석, 결과, 소개, 가격표, 후기)
- [x] 핵심 설정 파일 (site.ts, nav.ts, types)
- [x] 자소서 입력 검증 스키마 (Zod)
- [x] 분석 결과 타입 정의
- [ ] Phase 1: Claude API 자소서 분석 기능 구현
- [ ] Phase 2: Notion API 콘텐츠 관리 기능 구현
- [ ] Phase 3: UI/UX 최적화 및 배포

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항 및 기술 명세
- [개발 가이드](./CLAUDE.md) - Claude Code 개발 지침
