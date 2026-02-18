# MCP 서버 활용 상세 지침

## 1. MCP 서버별 활용 매트릭스

| MCP 서버 | 언제 사용 | 왜 사용 | 핵심 도구 |
|---------|---------|---------|---------|
| **supabase** | DB 작업 전·후, 디버깅 시 | 실제 스키마/로그를 직접 확인 | list_tables, execute_sql, get_logs |
| **context7** | 새 패키지 사용 전, 최신 API 확인 시 | 공식 최신 문서 확보 (환각 방지) | resolve-library-id, query-docs |
| **sequential-thinking** | 복잡한 설계·아키텍처 결정 시 | 단계별 추론으로 오류 감소 | sequentialthinking |
| **playwright** | 인증·폼·결제 플로우 검증 | 브라우저 실제 동작 확인 | browser_navigate, browser_fill_form |
| **shadcn** | 새 UI 컴포넌트 추가 전 | 설치 명령, props 확인 | search_items_in_registries, get_add_command_for_items |

---

## 2. Supabase MCP 도구별 사용 시나리오

### supabase/list_tables
**사용 시점**: 마이그레이션 전후, 컬럼명·타입 의심 시, JOIN 쿼리 설계 전
```bash
# 예시: 사용 전 스키마 확인
mcp-cli info supabase/list_tables
mcp-cli call supabase/list_tables '{}'
```
**확인 포인트**: 컬럼 타입, nullable 여부, 인덱스 존재 여부

### supabase/execute_sql
**사용 시점**: 복잡한 집계 쿼리 테스트, 데이터 검증, 트리거·함수 확인
```bash
# 예시: RLS 정책 적용 확인
mcp-cli call supabase/execute_sql '{
  "query": "SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE tablename = '\''profiles'\'';"
}'

# 예시: 인덱스 존재 확인
mcp-cli call supabase/execute_sql '{
  "query": "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = '\''analyses'\'';"
}'

# 예시: 트리거 목록 확인
mcp-cli call supabase/execute_sql '{
  "query": "SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers WHERE trigger_schema = '\''public'\'';"
}'
```

### supabase/apply_migration
**사용 시점**: 새 테이블, 컬럼 추가, RLS 정책 변경 시
**주의**: 항상 list_migrations로 현재 상태 확인 후 실행
```bash
# 마이그레이션 적용 전 반드시 현재 상태 확인
mcp-cli call supabase/list_migrations '{}'

# 그 후 마이그레이션 적용
mcp-cli call supabase/apply_migration '{
  "name": "add_analyses_table",
  "query": "CREATE TABLE analyses (...)"
}'
```

### supabase/get_logs
**사용 시점**: API 호출 실패, 인증 오류, RLS 차단 의심 시
```bash
# 예시: 최근 에러 로그 확인
mcp-cli call supabase/get_logs '{"service": "api"}'
mcp-cli call supabase/get_logs '{"service": "auth"}'
mcp-cli call supabase/get_logs '{"service": "postgres"}'
```

### supabase/search_docs
**사용 시점**: Supabase 특정 기능(Storage, Realtime, Vector) 사용법 불확실 시
```bash
mcp-cli call supabase/search_docs '{"query": "row level security policies"}'
mcp-cli call supabase/search_docs '{"query": "realtime postgres changes"}'
```

### supabase/generate_typescript_types
**사용 시점**: DB 스키마 변경 후, 타입 동기화 필요 시
```bash
mcp-cli call supabase/generate_typescript_types '{}'
# 결과를 lib/types/database.ts에 저장
```

---

## 3. context7 MCP 활용 패턴

**반드시 사용할 상황:**
- `@supabase/ssr` 최신 API 변경사항 확인
- Next.js 15 Server Actions, cookies() API 변경 확인
- shadcn/ui 최신 컴포넌트 props 확인

```bash
# 1단계: 라이브러리 ID 확인
mcp-cli call context7/resolve-library-id '{"libraryName": "@supabase/ssr"}'
mcp-cli call context7/resolve-library-id '{"libraryName": "next"}'

# 2단계: 특정 주제 문서 조회
mcp-cli call context7/query-docs '{
  "context7CompatibleLibraryID": "/supabase/supabase",
  "query": "createServerClient cookies SSR Next.js 15"
}'
```

---

## 4. sequential-thinking 활용 패턴

**반드시 사용할 상황:**
- 복잡한 RLS 정책 설계 (여러 역할, 공유 링크 등)
- analyses 테이블 스키마 설계 (Phase 6)
- 인증 미들웨어 아키텍처 결정
- 캐싱 전략 수립

```bash
mcp-cli call sequential-thinking/sequentialthinking '{
  "thought": "analyses 테이블에 공유 링크 기능을 추가할 때 RLS 정책을 어떻게 설계해야 하는가?",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 5
}'
```

---

## 5. playwright MCP 활용 패턴

**테스트 대상 플로우:**
- 회원가입 → 이메일 인증 → 로그인
- 로그인 후 보호된 페이지 접근
- 프로필 수정 폼 제출
- 자소서 분석 입력 → 결과 확인

```bash
# 브라우저 시작 및 로그인 테스트
mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/auth/login"}'
mcp-cli call playwright/browser_fill_form '{
  "fields": [
    {"selector": "input[name=email]", "value": "test@example.com"},
    {"selector": "input[name=password]", "value": "password123"}
  ]
}'
mcp-cli call playwright/browser_click '{"selector": "button[type=submit]"}'
mcp-cli call playwright/browser_snapshot '{}'  # 결과 스크린샷
```

---

## 6. shadcn MCP 활용 패턴

**사용 시점**: 새 UI 컴포넌트 추가 전, 설치 명령 확인 전

```bash
# 컴포넌트 검색
mcp-cli call shadcn/search_items_in_registries '{"query": "data table pagination"}'

# 설치 명령 확인
mcp-cli call shadcn/get_add_command_for_items '{"items": ["data-table", "pagination"]}'

# 컴포넌트 예시 조회
mcp-cli call shadcn/get_item_examples_from_registries '{"item": "form"}'
```

---

## 7. 통합 작업 플로우 (새 기능 추가 시)

### 표준 플로우

```
1. [sequential-thinking] 기능 설계 및 아키텍처 결정
   ↓
2. [context7] 관련 라이브러리 최신 API 확인
   ↓
3. [supabase/list_tables] 현재 DB 스키마 확인
   ↓
4. [supabase/apply_migration] DB 변경 적용
   ↓
5. [supabase/execute_sql] 마이그레이션 검증
   ↓
6. [supabase/generate_typescript_types] 타입 재생성
   ↓
7. [shadcn] 필요한 UI 컴포넌트 확인 및 추가
   ↓
8. 코드 구현 (Server Component + API Route)
   ↓
9. [playwright] E2E 테스트로 전체 플로우 검증
```

---

## 8. 기능별 MCP 활용 시나리오

### 시나리오 A: analyses 테이블 추가 (Phase 6)

```bash
# Step 1: 설계 단계
mcp-cli call sequential-thinking/sequentialthinking '{
  "thought": "ResumeLens analyses 테이블 설계 - user_id FK, resume_text TEXT, analysis_data JSONB, is_public BOOLEAN, share_token VARCHAR(32)"
}'

# Step 2: 현재 스키마 확인
mcp-cli call supabase/list_tables '{}'

# Step 3: 마이그레이션 적용
mcp-cli call supabase/apply_migration '{
  "name": "add_analyses_table",
  "query": "CREATE TABLE analyses (...) ..."
}'

# Step 4: RLS 정책 검증
mcp-cli call supabase/execute_sql '{
  "query": "SELECT * FROM pg_policies WHERE tablename = '\''analyses'\'';"
}'

# Step 5: 타입 생성
mcp-cli call supabase/generate_typescript_types '{}'
```

### 시나리오 B: 인증 오류 디버깅

```bash
# Step 1: auth 로그 확인
mcp-cli call supabase/get_logs '{"service": "auth"}'

# Step 2: RLS 정책 확인
mcp-cli call supabase/execute_sql '{
  "query": "SELECT * FROM pg_policies WHERE tablename = '\''profiles'\'';"
}'

# Step 3: 특정 사용자 프로필 존재 확인 (service role 필요)
mcp-cli call supabase/execute_sql '{
  "query": "SELECT id, email, created_at FROM profiles LIMIT 5;"
}'

# Step 4: 문서 확인
mcp-cli call supabase/search_docs '{"query": "auth session cookies SSR"}'
```

### 시나리오 C: 성능 최적화

```bash
# Step 1: 인덱스 현황 확인
mcp-cli call supabase/execute_sql '{
  "query": "SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = '\''public'\'' ORDER BY tablename;"
}'

# Step 2: 느린 쿼리 확인 (pg_stat_statements)
mcp-cli call supabase/execute_sql '{
  "query": "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
}'

# Step 3: 인덱스 추가 마이그레이션
mcp-cli call supabase/apply_migration '{
  "name": "add_performance_indexes",
  "query": "CREATE INDEX CONCURRENTLY idx_analyses_user_created ON analyses(user_id, created_at DESC);"
}'
```

### 시나리오 D: 공유 링크 기능 (Phase 8)

```bash
# Step 1: 복잡한 RLS 설계 (공개 + 사용자 접근)
mcp-cli call sequential-thinking/sequentialthinking '{
  "thought": "공유 링크 RLS: 1) 본인은 항상 조회 가능 2) is_public=true AND share_token IS NOT NULL 이면 비인증 사용자도 조회 가능 - 두 정책의 OR 조건 처리"
}'

# Step 2: 정책 적용
mcp-cli call supabase/apply_migration '{
  "name": "add_share_rls_policy",
  "query": "CREATE POLICY \"공개 공유 조회\" ON analyses FOR SELECT USING (is_public = true AND share_token IS NOT NULL AND (share_expires_at IS NULL OR share_expires_at > NOW()));"
}'

# Step 3: Playwright로 비인증 공유 접근 테스트
mcp-cli call playwright/browser_navigate '{"url": "http://localhost:3000/share/test-token-123"}'
mcp-cli call playwright/browser_snapshot '{}'
```

---

## 9. Supabase 모범지침 체크리스트

### RLS 정책 설계
- [ ] 모든 사용자 데이터 테이블에 `ALTER TABLE t ENABLE ROW LEVEL SECURITY;` 적용
- [ ] 4가지 작업(SELECT/INSERT/UPDATE/DELETE) 각각 별도 정책
- [ ] INSERT 정책에 `WITH CHECK (auth.uid() = user_id)` 포함
- [ ] UPDATE 정책에 USING + WITH CHECK 모두 포함
- [ ] 공개 데이터는 별도 정책으로 분리

### 트랜잭션 처리
```sql
-- Supabase에서 트랜잭션이 필요한 경우 RPC 함수 사용
CREATE OR REPLACE FUNCTION save_analysis_with_history(
  p_user_id UUID,
  p_resume_text TEXT,
  p_analysis_data JSONB
) RETURNS UUID AS $$
DECLARE
  v_analysis_id UUID;
BEGIN
  INSERT INTO analyses (user_id, resume_text, analysis_data)
  VALUES (p_user_id, p_resume_text, p_analysis_data)
  RETURNING id INTO v_analysis_id;

  -- 히스토리 카운터 업데이트 등 추가 작업
  UPDATE profiles
  SET analysis_count = analysis_count + 1
  WHERE id = p_user_id;

  RETURN v_analysis_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 성능 최적화
- [ ] 자주 조회하는 컬럼에 인덱스 (`user_id`, `created_at DESC`, `share_token`)
- [ ] JSONB 컬럼 특정 키 조회 시 GIN 인덱스
- [ ] `SELECT *` 대신 필요한 컬럼만 명시
- [ ] 목록 조회 시 `.limit()` 필수, 기본값 20-50
- [ ] 관련 데이터는 `.select('*, profiles(*)')` JOIN으로 N+1 방지

### 보안
- [ ] service_role 키는 절대 클라이언트 노출 금지
- [ ] API Route에서 항상 `auth.getUser()` 호출 (getSession() 대신)
- [ ] 입력 데이터 서버 사이드 검증 (Zod)
- [ ] share_token은 crypto.randomBytes(16).toString('hex') 사용

### 에러 처리 패턴
```typescript
// 표준 에러 처리 패턴 (profile.ts 방식 준수)
try {
  const { data, error } = await supabase.from('table').select('*');
  if (error) {
    if (error.code === 'PGRST116') return { data: null, error: null }; // 없음
    throw error;
  }
  return { data, error: null };
} catch (error) {
  return { data: null, error: error as Error };
}
```

---

## 10. 문제 해결 가이드

### 문제: RLS가 모든 접근을 차단
1. `mcp-cli call supabase/get_logs '{"service": "postgres"}'` 로 실제 오류 확인
2. `mcp-cli call supabase/execute_sql '{"query": "SELECT * FROM pg_policies WHERE tablename = '\''table_name'\''"}'` 정책 확인
3. `auth.uid()` 함수가 세션 없이 NULL을 반환하는지 확인
4. `context7`로 최신 RLS 문서 재확인

### 문제: Server Component에서 세션 없음
1. `lib/supabase/server.ts`의 `createClient()` 올바르게 `await` 하는지 확인
2. `auth.getUser()` 사용 (getSession() 대신 - 보안상 권장)
3. middleware.ts에서 세션 갱신 처리 확인

### 문제: 실시간 구독 미작동
1. `mcp-cli call supabase/execute_sql '{"query": "SELECT * FROM pg_publication_tables;"}'` 확인
2. 해당 테이블이 Supabase Realtime 활성화 여부 확인
3. RLS 정책이 구독 채널도 허용하는지 확인

### 문제: 마이그레이션 충돌
1. `mcp-cli call supabase/list_migrations '{}'` 현재 상태 확인
2. `IF NOT EXISTS` 조건 항상 포함
3. `CONCURRENTLY` 옵션으로 인덱스 생성 (운영 중 무락)
