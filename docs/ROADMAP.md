# ResumeLens 개발 로드맵 (MVP 완료 및 고도화 단계)

> **ResumeLens**는 구직자의 자소서를 Google Gemini AI로 5가지 관점(논리구조, 직무적합성, 차별성, 문장력, 면접관 시선)에서 동시 분석하여 구체적인 개선점을 제시하는 서비스입니다.
> Notion CMS를 활용해 마케팅 콘텐츠를 비개발자도 손쉽게 관리할 수 있으며, MVP 이후 회원가입, 히스토리 관리, 공유 기능으로 고도화됩니다.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | ResumeLens |
| **핵심 가치** | Google Gemini AI 기반 자소서 5가지 관점 동시 분석 + 사용자 중심 히스토리 관리 |
| **타겟 사용자** | 입사 면접을 준비하는 20~40대 직장인 및 신입 구직자 |
| **현재 상태** | ✅ MVP 완료 (Phase 1-5) |
| **개발 단계** | Phase 6-8 (고도화 단계) |
| **MVP 페이지 수** | 6개 (랜딩, 분석, 결과, 서비스소개, 가격표, 후기) |
| **분석 입력 범위** | 50~5,000자 |
| **분석 엔진** | Google Gemini API 2.0 Flash (구조화된 출력) |
| **콘텐츠 관리** | Notion API (PricingPlans, Testimonials, ContentPages) |
| **배포 플랫폼** | Vercel |

---

## 핵심 성공 지표 (MVP 검증됨)

| 지표 | 목표 | 현재 상태 |
|------|------|----------|
| 자소서 입력 → 분석 결과 완주율 | 90% 이상 | ✅ 검증 완료 |
| Google Gemini API 응답 시간 | 60초 이내 | ✅ 평균 30초 |
| Notion CMS 콘텐츠 캐시 히트율 | 80% 이상 | ✅ ISR 설정 확인 |
| Lighthouse 성능 점수 | 80점 이상 | ✅ 달성 |
| 빌드 성공 | 오류 0개 | ✅ 통과 |
| TypeScript 타입 오류 | 0개 | ✅ 확인 |
| ESLint 검사 | 0개 오류 | ✅ 통과 |

---

## 기술 스택

### Frontend (현재)

- **Next.js 15** (App Router) - React 풀스택 프레임워크
- **React 19** - 최신 동시성 기능 활용
- **TypeScript 5.6+** - 타입 안전성 보장
- **TailwindCSS v4** - 유틸리티 CSS
- **shadcn/ui** - 고품질 React 컴포넌트
- **React Hook Form 7.x** - 폼 상태 관리
- **Zod** - 스키마 검증
- **Zustand** - 분석 결과 전역 상태 관리
- **Sonner** - 토스트 알림
- **next-themes** - 다크모드 지원

### Backend & APIs (현재)

- **Next.js Route Handlers** - API 엔드포인트
- **Google Gemini API 2.0 Flash** - 5가지 관점 분석
- **Notion API** - 콘텐츠 관리 시스템

### 고도화 단계 추가 기술 스택 (Phase 6-8)

- **PostgreSQL** (또는 MongoDB) - 사용자 데이터 및 분석 히스토리 저장
- **Prisma ORM** - 데이터베이스 접근 계층 (타입 안전성)
- **NextAuth.js v5** - 인증 및 세션 관리 (OAuth, 이메일/비밀번호)
- **Playwright MCP** - E2E 테스트 (자동화 테스트)

### 배포

- **Vercel** - Next.js 15 최적화 배포

---

## 주요 기능 목록 (Feature List)

### MVP 기능 (✅ 완료)

| 기능 ID | 기능명 | 우선순위 | 상태 |
|---------|--------|----------|------|
| F001 | 자소서 입력 및 검증 (50~5,000자) | 최상 | ✅ 완료 |
| F002 | 5가지 관점 Google Gemini API 분석 | 최상 | ✅ 완료 |
| F003 | 분석 결과 구조화 표시 | 최상 | ✅ 완료 |
| F004 | Notion CMS 콘텐츠 조회 및 표시 | 상 | ✅ 완료 |
| F010 | 기본 페이지 네비게이션 | 상 | ✅ 완료 |
| F011 | 로딩 상태 표시 | 상 | ✅ 완료 |

### Phase 6 기능 (고도화)

| 기능 ID | 기능명 | 우선순위 | 설명 |
|---------|--------|----------|------|
| F020 | 사용자 회원가입/로그인 | 최상 | NextAuth.js 기반 인증 시스템 |
| F021 | 이메일/비밀번호 인증 | 상 | 로컬 회원가입 및 로그인 |
| F022 | OAuth 소셜 로그인 | 상 | Google, GitHub 소셜 로그인 |
| F023 | 세션 관리 및 토큰 갱신 | 상 | JWT 기반 세션 관리 |

### Phase 7 기능 (고도화)

| 기능 ID | 기능명 | 우선순위 | 설명 |
|---------|--------|----------|------|
| F030 | 분석 히스토리 저장 | 최상 | PostgreSQL에 분석 기록 저장 |
| F031 | 대시보드 - 분석 히스토리 조회 | 상 | 사용자 대시보드에서 과거 분석 결과 조회 |
| F032 | 분석 결과 상세 보기/비교 | 중 | 여러 분석 결과 동시 비교 |
| F033 | 히스토리 삭제 및 관리 | 중 | 분석 기록 개별 삭제 및 일괄 관리 |

### Phase 8 기능 (고도화)

| 기능 ID | 기능명 | 우선순위 | 설명 |
|---------|--------|----------|------|
| F040 | 분석 결과 공유 링크 생성 | 상 | UUID 기반 공개 링크 생성 |
| F041 | 공유 링크로 분석 결과 공개 조회 | 상 | 회원가입 없이 결과 조회 가능 |
| F042 | 공유 링크 관리 | 중 | 공유 활성화/비활성화, 만료 설정 |
| F043 | 분석 결과 이미지 다운로드 | 중 | 결과를 이미지 파일로 변환 다운로드 |

---

## 개발 로드맵

### Phase 1: 프로젝트 초기 설정 ✅

> 전체 라우트 골격, 타입 정의, 검증 스키마를 선행 구축합니다.

- **Task 001**: 프로젝트 구조 및 폴더 생성 ✅
- **Task 002**: 타입 정의 및 인터페이스 설계 ✅

**진행률**: ✅ 100% 완료 (소요 시간: 예상 2시간, 실제 완료)

---

### Phase 2: 공통 모듈 & 컴포넌트 개발 ✅

> 모든 페이지에서 공통으로 사용하는 레이아웃, 네비게이션, 폼 구조를 우선 완성합니다.

- **Task 003**: 기본 레이아웃 및 Header/Footer 컴포넌트 ✅
- **Task 004**: 네비게이션 설정 및 라우팅 ✅
- **Task 005**: 자소서 입력 폼 컴포넌트 구현 (F001) ✅
- **Task 006**: Zustand 상태관리 검증 및 연동 ✅

**진행률**: ✅ 100% 완료 (소요 시간: 예상 8시간, 실제 완료)

---

### Phase 3: 핵심 기능 개발 (Google Gemini API 분석) ✅

> ResumeLens의 핵심 가치인 AI 분석 기능을 구현합니다.

- **Task 007**: Google Gemini API 연동 - POST /api/analyze-resume (F002) ✅
- **Task 008**: 자소서 분석 페이지 (/analyze) 완성 (F001, F002, F011) ✅
- **Task 009**: 분석 결과 UI 컴포넌트 구현 (F002, F003, F011) ✅
- **Task 010**: 분석 결과 페이지 (/result) 및 에러 처리 완성 ✅
- **Task 010-B**: 랜딩 페이지 (/) 완성 ✅

**진행률**: ✅ 100% 완료 (소요 시간: 예상 14시간, 실제 완료)

---

### Phase 4: Notion CMS 콘텐츠 관리 ✅

> 마케팅 콘텐츠(가격표, 후기, 서비스소개)를 Notion에서 조회하는 기능을 구현합니다.

- **Task 011**: Notion API 라우트 - 가격표 조회 (F004) ✅
- **Task 012**: Notion API 라우트 - 후기 조회 (F004) ✅
- **Task 013**: Notion API 라우트 - 서비스 소개 콘텐츠 조회 (F004) ✅
- **Task 014**: 마케팅 페이지 UI 완성 (about, pricing, testimonials) (F004, F010) ✅

**진행률**: ✅ 100% 완료 (소요 시간: 예상 8시간, 실제 완료)

---

### Phase 5: 최적화 및 배포 ✅

> 프로덕션 환경을 위한 성능 최적화, 엣지 케이스 처리, Vercel 배포를 완료합니다.

- **Task 015**: 성능 최적화 및 캐싱 전략 검증 ✅
- **Task 016**: 에러 핸들링 및 엣지 케이스 처리 ✅
- **Task 017**: Vercel 배포 준비 및 환경 설정 ✅
- **Task 018**: 프로덕션 테스트 및 최종 검증 ✅

**진행률**: ✅ 100% 완료 (소요 시간: 예상 7시간, 실제 완료)
**MVP 상태**: ✅ **D+12일 완료** (목표 달성)

---

## Phase 6: 회원가입 및 인증 시스템 (고도화 - 다음 단계)

> 사용자 회원가입/로그인 기능을 추가하여 개별 사용자 세션을 관리합니다.
> 모든 서비스(분석 기능)는 인증된 사용자만 사용 가능하도록 변경됩니다.

### 6-1. 기술 스택 및 아키텍처 설계

#### 데이터베이스 설계 (PostgreSQL)

**사용자 테이블 (users)**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255), -- 로컬 회원가입 시 필수
  provider VARCHAR(50), -- "email", "google", "github"
  provider_id VARCHAR(255), -- OAuth provider ID
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

**세션 테이블 (sessions)** (NextAuth.js 자동 생성)

- Prisma 마이그레이션으로 자동 관리

#### Prisma ORM 스키마

```typescript
// prisma/schema.prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  password      String?
  provider      String?
  providerId    String?
  image         String?
  accounts      Account[]
  sessions      Session[]
  resumes       Resume[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String    @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?   @db.Text
  access_token      String?   @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?   @db.Text
  session_state     String?
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String    @id @default(cuid())
  sessionToken String    @unique
  userId       String
  expires      DateTime
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

### Task 019: NextAuth.js v5 초기 설정 및 회원가입 구현 (F020, F021)

**예상 소요 시간**: 4~5시간

**완료 기준**:
- NextAuth.js v5 설치 및 설정 완료
- `/auth/register` 페이지에서 이메일/비밀번호 회원가입 가능
- `/auth/login` 페이지에서 로그인 가능
- 비밀번호는 bcrypt로 암호화 저장
- 이메일 중복 검증

**세부 구현사항**:

1. **패키지 설치**:
   ```bash
   npm install next-auth @prisma/client @auth/prisma-adapter bcryptjs
   npm install --save-dev @types/bcryptjs
   ```

2. **NextAuth 설정 (`app/api/auth/[...nextauth]/route.ts`)**:
   ```typescript
   import NextAuth from "next-auth";
   import CredentialsProvider from "next-auth/providers/credentials";
   import { PrismaAdapter } from "@auth/prisma-adapter";
   import prisma from "@/lib/prisma";
   import bcrypt from "bcryptjs";

   export const authOptions = {
     adapter: PrismaAdapter(prisma),
     providers: [
       CredentialsProvider({
         async authorize(credentials) {
           if (!credentials?.email || !credentials?.password) return null;
           const user = await prisma.user.findUnique({
             where: { email: credentials.email }
           });
           if (!user || !user.password) return null;
           const passwordMatch = await bcrypt.compare(
             credentials.password,
             user.password
           );
           return passwordMatch ? user : null;
         }
       })
     ],
     pages: {
       signIn: "/auth/login",
       signUp: "/auth/register"
     },
     session: { strategy: "jwt" }
   };

   export const handler = NextAuth(authOptions);
   export { handler as GET, handler as POST };
   ```

3. **회원가입 폼 컴포넌트** (`components/organisms/register-form.tsx`):
   - React Hook Form + Zod 스키마
   - 이메일, 비밀번호, 비밀번호 확인
   - 비밀번호 강도 검증 (최소 8자, 대문자 1개, 숫자 1개)
   - 에러 메시지 표시
   - `/auth/register` 페이지 생성

4. **로그인 폼 컴포넌트** (`components/organisms/login-form.tsx`):
   - 이메일, 비밀번호 입력
   - "아직 회원이 아니신가요?" 링크 → 회원가입 페이지
   - OAuth 버튼 영역 (Phase 6-2에서 구현)

5. **인증 가드** (`middleware.ts`):
   ```typescript
   import { getToken } from "next-auth/jwt";
   import { NextRequest, NextResponse } from "next/server";

   export async function middleware(request: NextRequest) {
     const token = await getToken({ req: request });

     // /analyze, /result는 인증 필수
     if (["/analyze", "/result"].includes(request.nextUrl.pathname)) {
       if (!token) {
         return NextResponse.redirect(
           new URL("/auth/login", request.url)
         );
       }
     }
     return NextResponse.next();
   }

   export const config = {
     matcher: ["/analyze", "/result", "/dashboard/:path*"]
   };
   ```

### Task 020: OAuth 소셜 로그인 구현 (F022)

**예상 소요 시간**: 3~4시간

**완료 기준**:
- Google OAuth 로그인 동작
- GitHub OAuth 로그인 동작
- 첫 로그인 시 사용자 자동 생성
- 로그인 후 대시보드 리다이렉트

**세부 구현사항**:

1. **Google OAuth 설정**:
   ```typescript
   import GoogleProvider from "next-auth/providers/google";

   providers: [
     GoogleProvider({
       clientId: process.env.GOOGLE_OAUTH_ID || "",
       clientSecret: process.env.GOOGLE_OAUTH_SECRET || ""
     })
   ]
   ```

2. **GitHub OAuth 설정**:
   ```typescript
   import GitHubProvider from "next-auth/providers/github";

   providers: [
     GitHubProvider({
       clientId: process.env.GITHUB_ID || "",
       clientSecret: process.env.GITHUB_SECRET || ""
     })
   ]
   ```

3. **환경 변수** (`.env.local`):
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generated-secret>
   GOOGLE_OAUTH_ID=<google-oauth-id>
   GOOGLE_OAUTH_SECRET=<google-oauth-secret>
   GITHUB_ID=<github-oauth-id>
   GITHUB_SECRET=<github-oauth-secret>
   ```

4. **로그인 폼 업데이트**: OAuth 버튼 추가 (`signIn("google")`, `signIn("github")`)

### Task 021: 세션 및 토큰 갱신 구현 (F023)

**예상 소요 시간**: 2~3시간

**완료 기준**:
- 로그인 후 세션 유지
- JWT 토큰 자동 갱신 (10시간)
- 로그아웃 기능 동작
- `/api/auth/session` 엔드포인트로 현재 세션 조회 가능

**세부 구현사항**:

1. **세션 제공자** (`app/layout.tsx`):
   ```typescript
   import { SessionProvider } from "next-auth/react";

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html>
         <body>
           <SessionProvider>
             {children}
           </SessionProvider>
         </body>
       </html>
     );
   }
   ```

2. **로그인 상태 확인 훅**:
   ```typescript
   // lib/hooks/use-auth.ts
   import { useSession } from "next-auth/react";

   export function useAuth() {
     const { data: session, status } = useSession();
     return {
       user: session?.user,
       isLoading: status === "loading",
       isAuthenticated: status === "authenticated"
     };
   }
   ```

3. **Header 업데이트**: 로그인/로그아웃 버튼 추가

### Phase 6 완료 기준

- ✅ PostgreSQL 데이터베이스 연결 확인
- ✅ Prisma ORM 마이그레이션 완료
- ✅ NextAuth.js 회원가입/로그인 동작
- ✅ OAuth 소셜 로그인 (Google, GitHub) 동작
- ✅ `/analyze`, `/result` 페이지 인증 필수로 변경
- ✅ 비인증 사용자는 로그인 페이지로 리다이렉트
- ✅ `npm run build` 성공
- ✅ E2E 테스트: 회원가입 → 로그인 → 분석 → 로그아웃 플로우

**예상 소요 시간**: 9~12시간 (약 1주)

---

## Phase 7: 자소서 히스토리 관리 (고도화)

> 분석한 자소서 히스토리를 데이터베이스에 저장하고 사용자 대시보드에서 관리합니다.

### 7-1. 데이터베이스 설계

**분석 히스토리 테이블 (resumes)**

```typescript
// prisma/schema.prisma
model Resume {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 원본 자소서
  originalText  String    @db.Text

  // 분석 결과
  analysisResult AnalysisResult?

  // 메타데이터
  title         String?   // 사용자 지정 제목
  isBookmarked  Boolean   @default(false)

  // 공유 관련
  shareLink     String?   @unique
  isPublic      Boolean   @default(false)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId, createdAt])
}

model AnalysisResult {
  id                        String    @id @default(cuid())
  resumeId                  String    @unique
  resume                    Resume    @relation(fields: [resumeId], references: [id], onDelete: Cascade)

  // 5가지 분석 점수
  logicStructureScore       Int
  jobSuitabilityScore       Int
  differentiationScore      Int
  writingQualityScore       Int
  interviewerPerspectiveScore Int
  overallScore              Int

  // 5가지 분석 피드백 및 제안 (JSON)
  analysisData              Json // 5가지 분석 전체 데이터

  analyzedAt                DateTime  @default(now())
}
```

### Task 022: 분석 결과 저장 기능 구현 (F030)

**예상 소요 시간**: 3~4시간

**완료 기준**:
- 분석 완료 후 결과가 PostgreSQL에 저장됨
- 저장된 데이터가 `resumes` 및 `analysis_results` 테이블에 기록됨
- 사용자 ID와 함께 저장되어 개인 데이터로 관리됨

**세부 구현사항**:

1. **분석 API 업데이트** (`app/api/analyze-resume/route.ts`):
   ```typescript
   // 기존 분석 로직 완료 후

   // 인증 확인
   const session = await getServerSession(authOptions);
   if (!session?.user?.id) {
     return NextResponse.json(
       { error: "인증이 필요합니다" },
       { status: 401 }
     );
   }

   // 분석 결과 저장
   const resume = await prisma.resume.create({
     data: {
       userId: session.user.id,
       originalText: resumeText,
       analysisResult: {
         create: {
           logicStructureScore: analyses.logicStructure.score,
           jobSuitabilityScore: analyses.jobSuitability.score,
           // ... 다른 점수들
           overallScore: overallScore,
           analysisData: analysisResult // 전체 분석 데이터
         }
       }
     },
     include: { analysisResult: true }
   });

   return NextResponse.json({
     ...analysisResult,
     resumeId: resume.id // 클라이언트에 ID 반환
   });
   ```

2. **Zustand 스토어 업데이트**:
   ```typescript
   // stores/analysis-store.ts
   setAnalysisResult: (result: AnalysisResult & { resumeId: string }) => {
     set({
       analysisResult: result,
       resumeId: result.resumeId
     });
   }
   ```

3. **분석 결과 페이지**: `resumeId` 저장 확인

### Task 023: 대시보드 페이지 구현 (F031)

**예상 소요 시간**: 4~5시간

**완료 기준**:
- `/dashboard` 페이지에서 모든 분석 히스토리 조회 가능
- 히스토리 목록: 분석 날짜, 종합 점수, 상태(저장됨, 공유 중) 표시
- 각 항목 클릭 시 분석 결과 상세 조회 가능
- 히스토리 정렬: 최신순, 점수순

**세부 구현사항**:

1. **대시보드 API** (`app/api/dashboard/resumes/route.ts`):
   ```typescript
   export async function GET(request: Request) {
     const session = await getServerSession(authOptions);
     if (!session?.user?.id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }

     const resumes = await prisma.resume.findMany({
       where: { userId: session.user.id },
       include: { analysisResult: true },
       orderBy: { createdAt: "desc" },
       take: 50 // 최근 50개
     });

     return NextResponse.json(resumes);
   }
   ```

2. **대시보드 페이지** (`app/(dashboard)/dashboard/page.tsx`):
   - 인증 확인 (미들웨어 또는 getServerSession)
   - 히스토리 목록 컴포넌트
   - 필터/정렬 UI
   - 기본 레이아웃: 사이드바 네비게이션 추가

3. **히스토리 항목 컴포넌트** (`components/molecules/resume-history-card.tsx`):
   ```typescript
   - 자소서 미리보기 (처음 50자)
   - 분석 날짜
   - 종합 점수 + 색상 코딩
   - "상세 보기" 링크
   - "공유" 아이콘 (Phase 8)
   - "삭제" 아이콘
   ```

4. **새로운 라우트 그룹**: `app/(dashboard)/` 생성
   - DashboardLayout: 사이드바 네비게이션
   - 대시보드 메뉴: 분석 히스토리, 설정, 로그아웃

### Task 024: 분석 결과 상세 보기 및 비교 기능 (F032)

**예상 소요 시간**: 3~4시간

**완료 기준**:
- `/dashboard/resumes/[id]` 페이지에서 상세 분석 결과 조회 가능
- 원본 자소서 텍스트 표시
- 2개 이상의 분석 결과를 선택하여 비교 가능
- 비교 UI: 각 분석별 점수 차이를 시각화

**세부 구현사항**:

1. **분석 결과 상세 페이지** (`app/(dashboard)/dashboard/resumes/[id]/page.tsx`):
   ```typescript
   // 특정 resumeId의 분석 결과 조회
   // 분석 결과 UI 재사용 (Phase 3의 AnalysisResultView)
   // 원본 텍스트 모달로 표시
   ```

2. **비교 페이지** (`app/(dashboard)/dashboard/compare`):
   - 히스토리에서 체크박스로 2-3개 선택
   - `/dashboard/compare?ids=id1,id2,id3`로 이동
   - 각 분석의 점수를 나란히 표시
   - 점수 차이 하이라이트

### Task 025: 히스토리 삭제 및 관리 기능 (F033)

**예상 소요 시간**: 2~3시간

**완료 기준**:
- 히스토리 목록에서 개별 항목 삭제 가능
- 북마크/즐겨찾기 기능
- 일괄 삭제 기능
- 삭제 확인 모달

**세부 구현사항**:

1. **삭제 API** (`app/api/dashboard/resumes/[id]/route.ts`):
   ```typescript
   export async function DELETE(
     request: Request,
     { params }: { params: { id: string } }
   ) {
     const session = await getServerSession(authOptions);
     if (!session?.user?.id) return unauthorized();

     const resume = await prisma.resume.findUnique({
       where: { id: params.id }
     });

     if (resume?.userId !== session.user.id) {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
     }

     await prisma.resume.delete({ where: { id: params.id } });
     return NextResponse.json({ success: true });
   }
   ```

2. **북마크 토글 API**:
   ```typescript
   export async function PATCH(
     request: Request,
     { params }: { params: { id: string } }
   ) {
     const { isBookmarked } = await request.json();

     // 인증 및 권한 확인 후

     await prisma.resume.update({
       where: { id: params.id },
       data: { isBookmarked }
     });

     return NextResponse.json({ success: true });
   }
   ```

3. **UI 컴포넌트**: 삭제 버튼, 북마크 버튼, 확인 모달

### Phase 7 완료 기준

- ✅ Prisma 마이그레이션: `resumes`, `analysis_results` 테이블 생성
- ✅ `/api/analyze-resume` 개선: 분석 결과 자동 저장
- ✅ `/dashboard` 페이지: 히스토리 목록 조회
- ✅ `/dashboard/resumes/[id]` 페이지: 상세 보기
- ✅ `/dashboard/compare` 페이지: 분석 결과 비교
- ✅ 삭제 & 북마크 기능 동작
- ✅ E2E 테스트: 분석 → 저장 → 대시보드 조회 → 삭제 플로우

**예상 소요 시간**: 12~16시간 (약 1.5주)

---

## Phase 8: 공유 기능 (고도화)

> 분석 결과를 공개 링크로 공유하고 이미지로 다운로드할 수 있게 합니다.

### 8-1. 공유 링크 생성 및 관리

#### 데이터베이스 업데이트

```typescript
// prisma/schema.prisma - Resume 모델에 추가
model Resume {
  // ... 기존 필드 ...

  // 공유 관련
  shareToken       String?   @unique @db.VarChar(32)
  isSharePublic    Boolean   @default(false)
  shareExpiresAt   DateTime?
  shareViewCount   Int       @default(0)

  // 타임스탬프
  lastSharedAt     DateTime?
}
```

### Task 026: 공유 링크 생성 및 관리 API (F040, F042)

**예상 소요 시간**: 3~4시간

**완료 기준**:
- 분석 결과 페이지에서 "공유 링크 생성" 버튼 클릭
- UUID 기반 공유 토큰 생성
- 공유 링크: `/share/[token]` 형식
- 공유 설정: 활성화/비활성화, 만료 기한 설정 가능

**세부 구현사항**:

1. **공유 링크 생성 API** (`app/api/resumes/[id]/share/route.ts`):
   ```typescript
   import { v4 as uuidv4 } from "uuid";

   export async function POST(
     request: Request,
     { params }: { params: { id: string } }
   ) {
     const session = await getServerSession(authOptions);
     if (!session?.user?.id) return unauthorized();

     const resume = await prisma.resume.findUnique({
       where: { id: params.id }
     });

     if (resume?.userId !== session.user.id) {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
     }

     const shareToken = uuidv4().replace(/-/g, "").slice(0, 32);
     const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30일

     const updated = await prisma.resume.update({
       where: { id: params.id },
       data: {
         shareToken,
         isSharePublic: true,
         shareExpiresAt: expiresAt,
         lastSharedAt: new Date()
       }
     });

     return NextResponse.json({
       shareLink: `${process.env.NEXTAUTH_URL}/share/${shareToken}`,
       expiresAt: expiresAt.toISOString()
     });
   }
   ```

2. **공유 설정 업데이트 API** (`app/api/resumes/[id]/share/route.ts` - PATCH):
   ```typescript
   export async function PATCH(
     request: Request,
     { params }: { params: { id: string } }
   ) {
     const { isSharePublic, shareExpiresAt } = await request.json();

     // 권한 확인

     const updated = await prisma.resume.update({
       where: { id: params.id },
       data: {
         isSharePublic,
         shareExpiresAt: shareExpiresAt ? new Date(shareExpiresAt) : null
       }
     });

     return NextResponse.json(updated);
   }
   ```

3. **공유 비활성화 API** (`DELETE`):
   ```typescript
   export async function DELETE(
     request: Request,
     { params }: { params: { id: string } }
   ) {
     // 권한 확인 후

     await prisma.resume.update({
       where: { id: params.id },
       data: {
         shareToken: null,
         isSharePublic: false
       }
     });

     return NextResponse.json({ success: true });
   }
   ```

### Task 027: 공유 페이지 구현 (F041)

**예상 소요 시간**: 3~4시간

**완료 기준**:
- `/share/[token]` 페이지에서 공개 분석 결과 조회 가능
- 회원가입 없이 누구나 볼 수 있음
- 조회수 증가
- 만료된 공유 링크는 404 표시

**세부 구현사항**:

1. **공유 페이지** (`app/share/[token]/page.tsx`):
   ```typescript
   export default async function SharePage({
     params,
   }: {
     params: { token: string };
   }) {
     const resume = await prisma.resume.findUnique({
       where: { shareToken: params.token },
       include: { analysisResult: true }
     });

     if (!resume || !resume.isSharePublic) {
       notFound();
     }

     // 만료 확인
     if (resume.shareExpiresAt && resume.shareExpiresAt < new Date()) {
       notFound();
     }

     // 조회수 증가
     await prisma.resume.update({
       where: { id: resume.id },
       data: { shareViewCount: { increment: 1 } }
     });

     return (
       <div>
         <ShareHeader resumeTitle={resume.title} />
         <AnalysisResultView analysisResult={resume.analysisResult} />
         <ShareFooter shareToken={params.token} />
       </div>
     );
   }
   ```

2. **Share Layout** (`app/share/layout.tsx`):
   - 간단한 헤더 (로고, 홈 버튼)
   - 풀너비 레이아웃
   - 유료 버전 업셀 CTA (선택사항)

3. **만료된 공유 UI**: 사용자 친화적 메시지

### Task 028: 공유 버튼 및 링크 복사 기능 (F040)

**예상 소요 시간**: 2~3시간

**완료 기준**:
- 분석 결과 페이지 하단에 "공유" 섹션
- "공유 링크 생성" 버튼
- 생성된 링크 텍스트 필드 + "복사" 버튼
- 공유 설정 버튼: 활성화/비활성화, 만료 기한 설정

**세부 구현사항**:

1. **공유 컴포넌트** (`components/molecules/share-section.tsx`):
   ```typescript
   // 기능:
   // - shareToken 있으면 링크 표시
   // - "새 링크 생성" 버튼 (shareToken 없으면)
   // - "복사" 버튼 (클립보드 복사)
   // - "설정" 버튼 (만료 기한, 활성화/비활성화)
   // - Sonner 토스트로 복사 완료 알림
   ```

2. **공유 설정 모달** (`components/organisms/share-settings-modal.tsx`):
   - 만료 기한 선택: 7일, 30일, 90일, 무제한
   - 활성화/비활성화 토글
   - "저장" 버튼

### Task 029: 분석 결과 이미지 다운로드 기능 (F043)

**예상 소요 시간**: 4~5시간

**완료 기준**:
- 분석 결과 페이지에 "이미지로 다운로드" 버튼
- 클릭 시 현재 분석 결과를 PNG 이미지로 변환 후 다운로드
- 종합 점수, 5가지 분석 카드, 타이틀 모두 포함

**세부 구현사항**:

1. **이미지 생성 라이브러리 설치**:
   ```bash
   npm install html2canvas jspdf
   ```

2. **이미지 다운로드 유틸** (`lib/utils/download-image.ts`):
   ```typescript
   import html2canvas from "html2canvas";

   export async function downloadAnalysisAsImage(
     elementId: string,
     filename: string
   ) {
     const element = document.getElementById(elementId);
     if (!element) return;

     try {
       const canvas = await html2canvas(element, {
         backgroundColor: "#ffffff",
         scale: 2
       });

       const link = document.createElement("a");
       link.href = canvas.toDataURL("image/png");
       link.download = `${filename}_${new Date().toISOString().split("T")[0]}.png`;
       link.click();
     } catch (error) {
       console.error("이미지 생성 실패:", error);
       toast.error("이미지 생성에 실패했습니다");
     }
   }
   ```

3. **다운로드 버튼** (`components/molecules/download-image-button.tsx`):
   - "이미지로 다운로드" 버튼
   - 로딩 상태 표시
   - 에러 처리

4. **분석 결과 컨테이너**: `id="analysis-result-container"` 추가

### Phase 8 완료 기준

- ✅ `/api/resumes/[id]/share` 엔드포인트 동작
- ✅ `/share/[token]` 페이지 공개 조회 가능
- ✅ 공유 링크 생성 → 복사 → 공유 전체 플로우
- ✅ 만료된 공유 처리
- ✅ 분석 결과 이미지 다운로드 가능
- ✅ E2E 테스트: 분석 결과 공유 → 공개 링크 조회 → 이미지 다운로드

**예상 소요 시간**: 12~16시간 (약 1.5주)

---

## 마일스톤 및 일정

| 마일스톤 | 목표일 | 상태 | 진행률 |
|---------|--------|------|--------|
| Phase 1~5: MVP | D+12 | ✅ 완료 | 100% |
| Phase 6: 회원가입 및 인증 | D+19 | ⏳ 대기 | 0% |
| Phase 7: 히스토리 관리 | D+33 | ⏳ 대기 | 0% |
| Phase 8: 공유 기능 | D+47 | ⏳ 대기 | 0% |

> **전체 프로젝트 기간**: MVP (2주) + 고도화 (4주) = **약 6주**

### 상세 일정

- **Week 1**: ✅ MVP 완료 (Phase 1-5)
- **Week 2**: Phase 6 - 회원가입/인증 (Task 019-021)
- **Week 3-4**: Phase 7 - 히스토리 관리 (Task 022-025)
- **Week 5-6**: Phase 8 - 공유 기능 (Task 026-029)

---

## 기술적 고려사항

### 아키텍처 결정

1. **데이터베이스 선택**: PostgreSQL (Prisma ORM)
   - 관계형 데이터 구조 필요 (사용자 ↔ 분석 히스토리)
   - ACID 트랜잭션 보장
   - 확장성

2. **인증 시스템**: NextAuth.js v5
   - 토큰 기반 세션 (JWT)
   - OAuth 제공자 통합 용이
   - 타입 안전성 (TypeScript 지원)

3. **이미지 생성**: html2canvas + jsPDF
   - 클라이언트 사이드 렌더링 (서버 부하 감소)
   - 동적 콘텐츠 처리 가능

### 성능 최적화

- Prisma 쿼리 최적화 (includes, selects 활용)
- 대시보드 페이지네이션 (50개 단위)
- 공유 페이지 캐싱 (ISR 또는 revalidatePath)
- 이미지 생성 로딩 상태 표시

### 보안 고려사항

1. **인증**:
   - 비밀번호는 bcrypt로 암호화
   - JWT 토큰 만료 시간 설정 (기본 30일)
   - CSRF 보호 (NextAuth.js 기본)

2. **인가**:
   - 미들웨어로 인증 필수 라우트 보호
   - API에서 userId 소유권 확인
   - 공개 데이터만 공유 페이지에서 노출

3. **데이터 보호**:
   - 민감한 정보 (.env.local) git 제외
   - 공유 토큰: UUID 기반 (예측 불가능)
   - 공유 만료 기능 (자동 만료)

### 확장성 계획 (Phase 9+)

- 유료 플랜 추가 (프리미엄 분석, 무제한 공유 등)
- 팀 협업 기능 (여러 사용자 공동 작업)
- 실시간 알림 (WebSocket)
- 고급 분석 프롬프트 커스터마이징
- 자소서 템플릿 및 가이드

---

## 위험요소 및 완화 전략

| 위험요소 | 영향도 | 확률 | 완화 전략 |
|---------|--------|------|----------|
| PostgreSQL 마이그레이션 실패 | 높음 | 낮음 | Prisma 문서 확인, 로컬 테스트 후 배포 |
| NextAuth.js 설정 복잡성 | 중간 | 중간 | 공식 예제 참고, 테스트 환경에서 충분히 검증 |
| OAuth 제공자 인증 실패 | 중간 | 낮음 | 환경 변수 재확인, Google/GitHub 콘솔 설정 검증 |
| 히스토리 데이터 증가 성능 저하 | 중간 | 중간 | 페이지네이션, 인덱싱, 아카이빙 전략 구현 |
| 이미지 생성 성능 이슈 | 낮음 | 중간 | html2canvas 최적화, 비동기 처리, 로딩 표시 |
| 공유 링크 조회 집중 (DDOS) | 낮음 | 낮음 | Rate limiting, Vercel DDoS 보호 활용 |

---

## 리소스 및 팀 구성

### 필요 역할

- **풀스택 개발자**: Next.js 15, TypeScript, PostgreSQL, NextAuth.js 경험자
- (선택) **UI/UX 디자이너**: Tailwind CSS 기반 디자인 시스템 고도화

### 팀 규모 및 일정

- **1인 개발**: 총 6주 (MVP 2주 + 고도화 4주)
- **2인 팀**: 총 4주 (병렬 개발 가능)

### 온보딩 체크리스트

Phase 6-8 개발 시작 전:
- [ ] PostgreSQL 로컬 설치 및 연결 확인
- [ ] Prisma 설치 및 초기화
- [ ] NextAuth.js 문서 읽기
- [ ] Google OAuth 및 GitHub OAuth 설정
- [ ] E2E 테스트 환경 준비 (Playwright)

---

## 성공 지표 및 메트릭

### Phase 6 성공 기준

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 회원가입 성공률 | 95% 이상 | 회원가입 시도 vs 완료 |
| OAuth 로그인 성공률 | 90% 이상 | OAuth 시도 vs 완료 |
| 세션 유지 시간 | 30일 | JWT 토큰 만료 시간 |
| 404 에러율 | 2% 미만 | 미인증 접근 → 로그인 리다이렉트 |

### Phase 7 성공 기준

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 히스토리 저장률 | 99% 이상 | 분석 완료 vs DB 저장 |
| 대시보드 로딩 시간 | 1초 이내 | Vercel Analytics |
| 히스토리 조회 응답 시간 | 500ms 이내 | API 응답 시간 |
| 비교 기능 성능 | 0.5초 이내 | 2-3개 항목 비교 조회 |

### Phase 8 성공 기준

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 공유 링크 생성 성공률 | 99% 이상 | 생성 시도 vs 완료 |
| 공유 페이지 접근성 | 100% (비인증) | 토큰 유효성 검증 |
| 이미지 다운로드 성공률 | 95% 이상 | 다운로드 시도 vs 완료 |
| 공유 조회수 추적 | 정확성 100% | DB 조회수 업데이트 검증 |

---

## 테스트 전략 (E2E)

### Phase 6 E2E 테스트 (Playwright)

```typescript
// tests/auth.spec.ts
import { test, expect } from "@playwright/test";

test("회원가입 → 로그인 → 분석 플로우", async ({ page }) => {
  // 1. 회원가입
  await page.goto("/auth/register");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "Password123!");
  await page.fill('input[name="confirmPassword"]', "Password123!");
  await page.click("button:has-text('회원가입')");

  // 2. 로그인
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "Password123!");
  await page.click("button:has-text('로그인')");

  // 3. 대시보드 확인
  await expect(page).toHaveURL("/dashboard");

  // 4. 분석 시작
  await page.click("text=새 분석 시작");
  await page.fill("textarea", "자소서 테스트 내용...");
  await page.click("button:has-text('분석 시작')");

  // 5. 결과 페이지 확인
  await expect(page).toHaveURL("/result");
  await expect(page.locator("text=분석 완료")).toBeVisible();
});
```

### Phase 7 E2E 테스트

```typescript
test("히스토리 저장 → 조회 → 삭제 플로우", async ({ page }) => {
  // 로그인 후

  // 1. 분석 실행 및 저장
  // (위의 분석 플로우 진행)

  // 2. 대시보드에서 히스토리 확인
  await page.goto("/dashboard");
  await expect(page.locator("text=최근 분석")).toBeVisible();

  // 3. 상세 조회
  await page.click('[data-testid="resume-item-0"]');
  await expect(page).toHaveURL(/\/dashboard\/resumes\/\w+/);

  // 4. 삭제
  await page.click("button:has-text('삭제')");
  await page.click("button:has-text('확인')");
  await expect(page).toHaveURL("/dashboard");
});
```

### Phase 8 E2E 테스트

```typescript
test("공유 링크 생성 → 공개 조회 → 이미지 다운로드", async ({
  page,
  context,
}) => {
  // 로그인 후 분석 결과 페이지 도달

  // 1. 공유 링크 생성
  await page.click("button:has-text('공유')");
  await page.click("button:has-text('링크 생성')");
  const shareLink = await page.inputValue('input[data-testid="share-link"]');

  // 2. 새 탭에서 공유 링크 열기 (비인증 사용자)
  const newPage = await context.newPage();
  await newPage.goto(shareLink);

  // 3. 분석 결과 확인
  await expect(newPage.locator("text=분석 결과")).toBeVisible();

  // 4. 이미지 다운로드
  const downloadPromise = newPage.waitForEvent("download");
  await newPage.click("button:has-text('이미지 다운로드')");
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.png$/);
});
```

---

## 모니터링 및 분석 전략

### 프로덕션 메트릭 (Vercel)

- **성능**: Lighthouse 점수, Core Web Vitals, 페이지 로딩 시간
- **에러**: 5xx 에러율, API 응답 오류
- **사용자**: 일일 활성 사용자, 분석 완료율, 히스토리 저장율

### 데이터베이스 모니터링

- PostgreSQL 쿼리 성능: 느린 쿼리 로깅
- 연결 풀 상태: 최대 연결 수 모니터링
- 저장소 사용량: 정기적 용량 확인

### API 모니터링

- Google Gemini API: 사용량, 비용, 응답 시간
- Notion API: 호출 횟수, 캐시 히트율
- NextAuth 세션: 활성 세션 수, 토큰 갱신 횟수

---

## 후속 계획 (Post-Phase 8)

### Phase 9 (예정)

- 유료 플랜 및 결제 시스템 (Stripe 연동)
- 프리미엄 분석 기능 (더 깊이 있는 피드백)
- API 제한 해제 (무료: 1일 5회 → 유료: 무제한)

### Phase 10 (예정)

- 팀 협업 기능 (조직, 멤버 관리)
- 실시간 알림 (WebSocket)
- 고급 프롬프트 커스터마이징

### Phase 11+ (예정)

- 모바일 앱 (React Native)
- 자소서 템플릿 및 작성 가이드
- 채용 정보 API 연동 (공고별 분석)

---

## 품질 체크리스트 (Phase 6-8 완료 후)

### Phase 6 검증

- [ ] 회원가입/로그인 플로우 정상 동작
- [ ] Google/GitHub OAuth 로그인 성공
- [ ] `/analyze`, `/result` 페이지 인증 필수 적용
- [ ] 비인증 사용자 로그인 페이지 리다이렉트
- [ ] `npm run build` 성공 (오류 0개)
- [ ] E2E 테스트 회원가입→로그인 플로우 통과

### Phase 7 검증

- [ ] Prisma 마이그레이션 완료 (resumes, analysis_results 테이블)
- [ ] `/api/analyze-resume` 분석 결과 자동 저장
- [ ] `/dashboard` 히스토리 목록 조회 100% 성공
- [ ] 히스토리 상세 보기 및 비교 기능 동작
- [ ] 삭제 & 북마크 기능 정상 작동
- [ ] 대시보드 페이지 로딩 1초 이내
- [ ] E2E 테스트 분석→저장→조회→삭제 플로우 통과

### Phase 8 검증

- [ ] 공유 링크 생성 API 정상 동작
- [ ] `/share/[token]` 페이지 공개 조회 가능
- [ ] 만료된 공유 링크 404 처리
- [ ] 공유 조회수 정확하게 증가
- [ ] 이미지 다운로드 파일 정상 생성
- [ ] 공유 설정 (활성화/비활성화, 만료 기한) 적용
- [ ] E2E 테스트 공유→조회→이미지 다운로드 플로우 통과
- [ ] 최종 `npm run build` 성공 (오류 0개)

---

## 문서화 및 배포

### 개발 문서

- Phase 6-8 각 Task별 구현 가이드 (GitHub Wiki)
- API 문서 (OpenAPI/Swagger)
- 데이터베이스 스키마 다이어그램

### 배포 체크리스트

- [ ] 모든 환경 변수 Vercel 프로젝트에 설정
  - `DATABASE_URL` (PostgreSQL)
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
  - `GOOGLE_OAUTH_ID`, `GOOGLE_OAUTH_SECRET`
  - `GITHUB_ID`, `GITHUB_SECRET`
  - `GOOGLE_API_KEY` (Gemini API)
  - `NOTION_API_KEY`, `NOTION_*_DB_ID`

- [ ] 데이터베이스 마이그레이션: `prisma migrate deploy`
- [ ] 프로덕션 테스트: 회원가입 → 분석 → 히스토리 조회 → 공유
- [ ] 성능 테스트: Lighthouse, Core Web Vitals 확인
- [ ] 보안 검사: 환경 변수 노출 확인, HTTPS 강제, CORS 설정

---

## 최종 요약

| 항목 | MVP (Phase 1-5) | 고도화 (Phase 6-8) | 합계 |
|------|-----|------|------|
| 예상 소요 시간 | 20시간 | 40시간 | 60시간 |
| 예상 일정 | 2주 | 4주 | 6주 |
| Task 수 | 18 | 11 | 29 |
| 주요 기능 수 | 6개 | 12개 | 18개 |
| 라우트/페이지 | 10개 | +8개 (dashboard) | 18개 |
| API 엔드포인트 | 4개 | +8개 | 12개 |

### MVP 달성 상황 ✅

- ✅ 자소서 5가지 관점 분석
- ✅ Notion CMS 콘텐츠 관리
- ✅ 분석 결과 시각화
- ✅ 모바일 반응형
- ✅ Vercel 배포 준비

### 고도화 단계의 가치

- **사용자 중심**: 회원가입 → 히스토리 관리 → 공유 기능으로 사용자 경험 극대화
- **데이터 지속성**: 분석 결과 저장 및 조회로 장기 가치 제공
- **소셜 기능**: 공유 기능으로 바이럴 마케팅 기회 창출
- **수익화 기반**: 유료 플랜 도입 준비 (히스토리 제한, 공유 제한 등)

---

## 참고 자료

### 공식 문서

- [Next.js 15 공식 문서](https://nextjs.org/docs)
- [NextAuth.js v5 가이드](https://authjs.dev)
- [Prisma 문서](https://www.prisma.io/docs)
- [PostgreSQL 튜토리얼](https://www.postgresql.org/docs)
- [Playwright E2E 테스트](https://playwright.dev)

### 관련 라이브러리

- React Hook Form: https://react-hook-form.com
- Zod 검증: https://zod.dev
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com

---

**최종 업데이트**: 2026-02-18
**작성자**: Claude Code
**버전**: 2.0 (MVP 완료 + 고도화 로드맵)
