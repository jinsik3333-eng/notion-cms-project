# ResumeLens Next.js + Supabase 에이전트 메모리

## 프로젝트 핵심 정보

- **Next.js 버전**: 16.1.6 (Turbopack, cacheComponents 활성화)
- **Supabase 프로젝트 ID**: `filoiiiibrhrmupeoeol`
- **Supabase URL**: `https://filoiiiibrhrmupeoeol.supabase.co`
- **인증 방식**: Supabase Auth (이메일/비밀번호 + Google OAuth)

## 중요 패턴 및 주의사항

### Next.js 16 + cacheComponents 제약
- `export const dynamic = "force-dynamic"` 사용 불가 (cacheComponents와 충돌)
- 대신 Suspense 경계 내에서 async 서버 컴포넌트 실행 필요:
  ```typescript
  async function PageContent() { /* auth 조회 등 동적 데이터 */ }
  export default function Page() {
    return <Suspense><PageContent /></Suspense>;
  }
  ```
- `useSearchParams()` 사용 컴포넌트는 페이지에서 Suspense로 감싸야 함

### Supabase 클라이언트 사용 패턴
- 브라우저: `createClient()` from `lib/supabase/client.ts`
- 서버: `await createClient()` from `lib/supabase/server.ts`
- 환경변수: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon key 대신 사용)

### Google OAuth 구현 (2026-02-19 완료)
- OAuth 함수: `lib/supabase/oauth.ts` > `signInWithGoogle()`
- 콜백 라우트: `app/auth/callback/route.ts`
- 성공 리다이렉트: `/protected/profile?provider=google`
- 실패 리다이렉트: `/auth/login?error=oauth_failed`
- `prompt: "select_account"` 설정으로 Google 계정 선택 화면 항상 표시

### DB 트리거 (profiles 자동 생성)
- 함수: `public.handle_new_user()`
- Google OAuth `raw_user_meta_data` 구조: `{ name, full_name, email, avatar_url }`
- 트리거가 `full_name` → `name` 순으로 fallback 처리
- `ON CONFLICT (id) DO NOTHING`으로 중복 삽입 방지

### Google 로그인 버튼 구현
- lucide-react에 Google 아이콘 없음 → SVG 직접 삽입
- 4색 Google 공식 SVG (파랑 #4285F4, 초록 #34A853, 노랑 #FBBC05, 빨강 #EA4335)
- `isGoogleLoading` 상태: 브라우저가 Google로 이동 후에도 로딩 상태 유지 (버튼 비활성화)

## 주요 파일 경로

```
lib/supabase/oauth.ts          # Google OAuth signInWithGoogle()
app/auth/callback/route.ts     # OAuth 콜백 처리
components/login-form.tsx      # Google + 이메일 로그인 폼
components/sign-up-form.tsx    # Google + 이메일 가입 폼
supabase/migrations/
  20260218_create_profiles_table.sql
  20260219_update_handle_new_user_for_oauth.sql
docs/GOOGLE_OAUTH_SETUP.md     # Google OAuth 설정 가이드
```

## 설정 가이드 위치
- Google OAuth 설정: `docs/GOOGLE_OAUTH_SETUP.md`
- 환경 변수 템플릿: `.env.local.example`
