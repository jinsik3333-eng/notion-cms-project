# Google OAuth 설정 가이드

Google 로그인 기능을 활성화하려면 두 가지 작업이 필요합니다:

1. Google Cloud Console에서 OAuth 자격증명 생성
2. Supabase Dashboard에서 Google Provider 활성화

---

## Step 1: Google Cloud Console 설정

### 1-1. 프로젝트 생성 또는 선택

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 상단 프로젝트 선택기에서 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1-2. OAuth 동의 화면 설정

1. 왼쪽 메뉴 > **API 및 서비스** > **OAuth 동의 화면**
2. **User Type**: 외부 선택 > 만들기
3. 앱 정보 입력:
   - 앱 이름: `ResumeLens`
   - 사용자 지원 이메일: 개발자 이메일 입력
   - 개발자 연락처 이메일: 개발자 이메일 입력
4. 저장 후 계속 > 범위 (스킵) > 테스트 사용자 추가 (선택) > 완료

### 1-3. OAuth 2.0 클라이언트 ID 생성

1. **API 및 서비스** > **사용자 인증 정보** > **+ 사용자 인증 정보 만들기** > **OAuth 클라이언트 ID**
2. 설정:
   - **애플리케이션 유형**: 웹 애플리케이션
   - **이름**: `ResumeLens Web`
   - **승인된 JavaScript 원본**: (비워도 됨)
   - **승인된 리디렉션 URI** (아래 두 URL 모두 추가):
     ```
     https://filoiiiibrhrmupeoeol.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
     > 주의: 첫 번째 URL의 `filoiiiibrhrmupeoeol`은 실제 Supabase 프로젝트 ID입니다.
     > Supabase Dashboard URL에서 확인하세요.
3. **만들기** 클릭
4. 팝업에서 **클라이언트 ID**와 **클라이언트 보안 비밀** 복사 (다음 단계에서 사용)

---

## Step 2: Supabase Dashboard 설정

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택 (`filoiiiibrhrmupeoeol`)
3. 왼쪽 메뉴 > **Authentication** > **Providers**
4. **Google** 찾기 > 토글 활성화
5. 값 입력:
   - **Client ID**: Google Cloud Console에서 복사한 클라이언트 ID
   - **Client Secret**: Google Cloud Console에서 복사한 클라이언트 보안 비밀
   - **Callback URL**: 자동으로 표시됨 (`https://filoiiiibrhrmupeoeol.supabase.co/auth/v1/callback`)
6. **Save** 클릭

---

## Step 3: 로컬 테스트

```bash
# 개발 서버 실행
npm run dev
```

1. `http://localhost:3000/auth/login` 접속
2. **Google로 로그인** 버튼 클릭
3. Google 계정 선택
4. 정상 동작 시: `/protected/profile?provider=google` 로 리다이렉트

---

## 테스트 체크리스트

- [ ] Google Cloud Console에서 OAuth 클라이언트 생성 완료
- [ ] 승인된 리디렉션 URI에 Supabase 콜백 URL 추가
- [ ] 승인된 리디렉션 URI에 `http://localhost:3000/auth/callback` 추가
- [ ] Supabase Dashboard > Google Provider 활성화
- [ ] Client ID, Client Secret 입력
- [ ] 로컬에서 Google 로그인 테스트 성공
- [ ] `/protected/profile?provider=google` 리다이렉트 확인
- [ ] `profiles` 테이블에 Google 계정 정보 자동 저장 확인

---

## 프로덕션 배포 시 추가 설정

Vercel 배포 시 Google Cloud Console에서 프로덕션 도메인도 추가 필요:

```
https://your-production-domain.vercel.app/auth/callback
```

---

## 문제 해결

### "redirect_uri_mismatch" 에러

Google Cloud Console의 **승인된 리디렉션 URI**가 정확히 일치하지 않을 때 발생합니다.

- Supabase 콜백 URL: `https://[project-id].supabase.co/auth/v1/callback`
- 로컬 콜백 URL: `http://localhost:3000/auth/callback`

### "access_denied" 에러

OAuth 동의 화면이 **테스트 모드**일 때 등록되지 않은 Google 계정으로 접근하면 발생합니다.
해결: OAuth 동의 화면에서 테스트 사용자로 이메일 추가

### 프로필이 생성되지 않는 경우

Supabase Dashboard > SQL Editor에서 확인:

```sql
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;
```

`handle_new_user` 트리거가 실행되지 않았다면 수동으로 마이그레이션 적용:

```bash
# 마이그레이션 파일 위치
supabase/migrations/20260219_update_handle_new_user_for_oauth.sql
```
