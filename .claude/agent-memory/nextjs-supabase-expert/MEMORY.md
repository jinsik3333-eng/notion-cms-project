# nextjs-supabase-expert 에이전트 메모리

## 프로젝트 핵심 정보

**프로젝트**: ResumeLens (Next.js 16 + Supabase)
**실제 앱 위치**: `notion-cms-project-resume/` 서브 디렉토리
**Next.js 버전**: 16.1.6 (Turbopack, Fluid Compute 방식)
**Supabase 프로젝트 ref**: `filoiiiibrhrmupeoeol`
**인증 방식**: Supabase Auth (email/password + Google OAuth + GitHub OAuth)
**클라이언트 패키지**: `@supabase/ssr` (createBrowserClient / createServerClient)

## 확인된 파일 구조 (notion-cms-project-resume 기준)

- `lib/supabase/client.ts` - 브라우저 클라이언트 (createBrowserClient, 동기)
- `lib/supabase/server.ts` - 서버 클라이언트 (createServerClient + await cookies())
- `lib/supabase/proxy.ts` - 세션 갱신 + 라우트 보호 (Next.js 16 미들웨어 역할)
- `lib/supabase/oauth.ts` - Google/GitHub OAuth 함수 (signInWithGoogle, signInWithGitHub)
- `lib/supabase/profile.ts` - 프로필 CRUD 함수
- `lib/types/profile.ts` - Profile, ProfileFormData, ProfileUpdateData 타입
- `proxy.ts` - proxy.ts를 호출하는 진입점 (Next.js 16 Proxy 방식)
- `hooks/use-auth.ts` - 클라이언트 컴포넌트용 인증 훅 (onAuthStateChange)
- `app/auth/callback/route.ts` - OAuth 콜백 처리 (신규/기존 사용자 구분)

## 중요한 Next.js 16 특이사항

### Proxy vs Middleware
- **Next.js 16**은 `middleware.ts` 대신 `proxy.ts`를 사용 (Fluid Compute 방식)
- `middleware.ts`와 `proxy.ts`가 동시에 존재하면 빌드 에러 발생
- 실제 라우트 보호 로직은 `lib/supabase/proxy.ts`의 `updateSession()`에 구현
- `proxy.ts` (루트)는 `updateSession()`을 호출하는 진입점

### getClaims() vs getUser()
- 미들웨어에서는 `auth.getClaims()` 사용 (네트워크 요청 없음, 빠름)
- 서버 컴포넌트 보안 검증에서는 `auth.getUser()` 사용 (서버 검증, 보안)
- `getSession()`은 보안상 사용 금지

## 데이터베이스 현황

### profiles 테이블 (구현 완료)

- PK: `id UUID` → auth.users.id 참조
- 필드: email, full_name, phone, avatar_url, bio, job_role, company, job_field, years_of_experience
- 인덱스: idx_profiles_email, idx_profiles_job_role, idx_profiles_created_at
- RLS: 4개 정책 (SELECT/UPDATE/DELETE/INSERT - 본인만)
- 트리거: updated_at 자동 업데이트, 회원가입/OAuth 시 프로필 자동 생성
- Google/GitHub OAuth raw_user_meta_data 모두 지원 (name, full_name, user_name 우선순위)

## Phase 6 구현 상태 (완료)

- 이메일/비밀번호 회원가입 (`components/sign-up-form.tsx`)
- 이메일/비밀번호 로그인 (`components/login-form.tsx`)
- Google OAuth 로그인/가입 (`lib/supabase/oauth.ts`)
- GitHub OAuth 로그인/가입 (`lib/supabase/oauth.ts`)
- OAuth 콜백 처리 + 신규사용자 감지 (`app/auth/callback/route.ts`)
- 세션 갱신 미들웨어 + 라우트 보호 (`lib/supabase/proxy.ts`)
- 비밀번호 찾기/재설정 (`forgot-password-form.tsx`, `update-password-form.tsx`)
- 프로필 자동 생성 트리거 (모든 OAuth 제공자 지원)
- 클라이언트 인증 훅 (`hooks/use-auth.ts`)

## 중요한 패턴 및 규칙

### Supabase 클라이언트 초기화

- **Client Component**: `createClient()` from `lib/supabase/client.ts` (동기)
- **Server Component / Route Handler**: `await createClient()` from `lib/supabase/server.ts` (비동기)
- Fluid compute 환경: 절대 전역 변수에 클라이언트 저장 금지

### 보호된 라우트 패턴 (서버 컴포넌트)

```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect('/auth/login');
```

### 에러 코드 처리

- `PGRST116`: 행 없음 (single() 사용 시) → null 반환으로 처리
- `23505`: unique 제약 위반 → 중복 이메일/토큰 등

### 환경 변수 규칙

- `NEXT_PUBLIC_SUPABASE_URL` - 클라이언트/서버 공용
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - 클라이언트/서버 공용 (anon key)
- OAuth 자격증명은 Supabase Dashboard에서 설정 (Next.js 앱에 불필요)
- 서비스 역할 키는 절대 `NEXT_PUBLIC_` 접두사 사용 금지

## MCP 활용 지침 요약

상세 내용: `mcp-guide.md` 참조

- **supabase MCP**: DB 상태 확인, 마이그레이션, 로그 디버깅
- **context7**: @supabase/ssr, Next.js 최신 문서 조회
- **sequential-thinking**: 복잡한 RLS 설계, 마이그레이션 계획
- **playwright**: 인증 플로우 E2E 테스트
- **shadcn**: UI 컴포넌트 선택

## Phase 7 & 8 구현 상태 (완료)

### 추가된 파일 목록
- `supabase/migrations/20260220_create_resumes_table.sql` - resumes + analysis_results 테이블 + RLS
- `lib/types/resume.ts` - 전체 타입 정의 (AnalysisData, Resume, ShareExpiresIn 등)
- `app/api/analyze-resume/route.ts` - Gemini API 분석 + Supabase 저장
- `app/api/dashboard/resumes/route.ts` - GET 목록 (정렬/필터/페이지네이션)
- `app/api/dashboard/resumes/[id]/route.ts` - GET/PATCH/DELETE 단건
- `app/api/resumes/[id]/share/route.ts` - POST/PATCH/DELETE 공유 관리
- `app/(dashboard)/layout.tsx` - 대시보드 레이아웃 (Suspense 패턴)
- `app/(dashboard)/dashboard/page.tsx` - 히스토리 목록 (클라이언트)
- `app/(dashboard)/dashboard/resumes/[id]/page.tsx` - 상세 보기 (Suspense 패턴)
- `app/(dashboard)/dashboard/compare/page.tsx` - 비교 페이지 (Suspense 패턴)
- `app/share/[token]/page.tsx` - 공개 공유 페이지 (Suspense 패턴)
- `app/share/[token]/not-found.tsx` - 만료/없음 404 페이지
- `components/molecules/resume-history-card.tsx` - 히스토리 카드
- `components/molecules/analysis-result-view.tsx` - 분석 결과 표시
- `components/molecules/share-section.tsx` - 공유 섹션 (링크 생성/복사)
- `components/molecules/download-image-button.tsx` - 이미지 다운로드 버튼
- `components/organisms/resume-detail-client.tsx` - 상세 페이지 클라이언트 액션
- `components/organisms/share-settings-modal.tsx` - 공유 설정 모달
- `components/organisms/compare-content.tsx` - 비교 콘텐츠 (클라이언트)
- `lib/utils/download-image.ts` - html2canvas 이미지 다운로드 유틸

## Next.js 16 cacheComponents 모드 필수 패턴

### 핵심 규칙 (위반 시 빌드 실패)
- `export const dynamic = 'force-dynamic'` 사용 금지 (cacheComponents와 호환 불가)
- 서버 컴포넌트에서 `await params` / `await searchParams` / Supabase 호출은 반드시 `<Suspense>` 내부에서만 실행
- `useSearchParams()` 사용 클라이언트 컴포넌트도 반드시 `<Suspense>` 내부에서 렌더링

### 올바른 패턴 (params Promise를 Suspense 내 자식 컴포넌트로 전달)
```typescript
// 페이지 컴포넌트 (동기)
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Loader />}>
      <Content paramsPromise={params} />
    </Suspense>
  );
}

// 데이터 페칭 컴포넌트 (비동기, Suspense 내부)
async function Content({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = await paramsPromise; // Suspense 내부에서 안전하게 실행
  const supabase = await createClient();
  // ...
}
```

### 레이아웃 auth 체크 패턴
```typescript
// layout.tsx - 레이아웃은 동기, auth 체크는 Suspense 내 비동기 컴포넌트로 분리
async function DashboardNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  // ...nav 렌더링
}

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Suspense fallback={<NavSkeleton />}>
        <DashboardNav />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}
```

## DB 스키마 현황 (resumes + analysis_results)

- `resumes`: id UUID, user_id FK, original_text, title, is_bookmarked, share_token UNIQUE, is_share_public, share_expires_at, share_view_count, last_shared_at
- `analysis_results`: resume_id UNIQUE FK, 5개 score 컬럼, overall_score, analysis_data JSONB
- RLS: 본인 데이터만 + 공개 공유 정책 (is_share_public + 만료 체크)
- DB 함수: `increment_share_view_count(p_share_token)` SECURITY DEFINER (RLS 우회 조회수 증가)
