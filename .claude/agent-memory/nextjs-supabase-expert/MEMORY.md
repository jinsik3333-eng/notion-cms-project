# nextjs-supabase-expert 에이전트 메모리

## 프로젝트 핵심 정보

**프로젝트**: ResumeLens (Next.js 15 + Supabase)
**Supabase 프로젝트 ref**: `filoiiiibrhrmupeoeol`
**인증 방식**: Supabase Auth (email/password, @supabase/ssr 패키지)
**클라이언트 패키지**: `@supabase/ssr` (createBrowserClient / createServerClient)

## 확인된 파일 구조

- `lib/supabase/client.ts` - 브라우저 클라이언트 (createBrowserClient)
- `lib/supabase/server.ts` - 서버 클라이언트 (createServerClient + cookies)
- `lib/supabase/proxy.ts` - 프록시 클라이언트
- `lib/supabase/profile.ts` - 프로필 CRUD 함수
- `lib/types/profile.ts` - Profile, ProfileFormData, ProfileUpdateData 타입
- `supabase/migrations/20260218_create_profiles_table.sql` - 첫 마이그레이션

## 데이터베이스 현황

### profiles 테이블 (구현 완료)
- PK: `id UUID` → auth.users.id 참조
- 필드: email, full_name, phone, avatar_url, bio, job_role, company, job_field, years_of_experience
- 인덱스: idx_profiles_email, idx_profiles_job_role, idx_profiles_created_at
- RLS: 4개 정책 (SELECT/UPDATE/DELETE/INSERT - 본인만)
- 트리거: updated_at 자동 업데이트, 회원가입 시 프로필 자동 생성

## 중요한 패턴 및 규칙

### Supabase 클라이언트 초기화
- **Client Component**: `createClient()` from `lib/supabase/client.ts` (동기)
- **Server Component / Route Handler**: `await createClient()` from `lib/supabase/server.ts` (비동기)
- Fluid compute 환경: 절대 전역 변수에 클라이언트 저장 금지

### 에러 코드 처리
- `PGRST116`: 행 없음 (single() 사용 시) → null 반환으로 처리
- `23505`: unique 제약 위반 → 중복 이메일/토큰 등

### 환경 변수 규칙
- `NEXT_PUBLIC_SUPABASE_URL` - 클라이언트/서버 공용
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - 클라이언트/서버 공용 (anon key)
- 서비스 역할 키는 절대 `NEXT_PUBLIC_` 접두사 사용 금지

## MCP 활용 지침 요약

상세 내용: `mcp-guide.md` 참조
- **supabase MCP**: DB 상태 확인, 마이그레이션, 로그 디버깅
- **context7**: @supabase/ssr, Next.js 15 최신 문서 조회
- **sequential-thinking**: 복잡한 RLS 설계, 마이그레이션 계획
- **playwright**: 인증 플로우 E2E 테스트
- **shadcn**: UI 컴포넌트 선택

## 향후 구현 예정 (ROADMAP Phase 6-8)

Phase 6: analyses 테이블 추가 (JSONB 분석 데이터, 공유 토큰)
Phase 7: 히스토리 대시보드 (사용자별 분석 목록)
Phase 8: 공유 링크 (`/share/[token]` 공개 페이지)
