-- GitHub OAuth 지원을 위한 handle_new_user 트리거 함수 업데이트
--
-- 지원하는 OAuth 프로바이더별 raw_user_meta_data 구조:
--
-- Google OAuth:
--   { "name": "홍길동", "full_name": "홍길동", "email": "...", "avatar_url": "https://lh3.googleusercontent.com/..." }
--
-- GitHub OAuth:
--   { "user_name": "github-username", "name": "홍길동", "email": "...", "avatar_url": "https://avatars.githubusercontent.com/..." }
--
-- 이메일/비밀번호:
--   { "full_name": "홍길동" } (회원가입 시 옵션으로 전달)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    -- 이메일: auth.users.email 우선, 없으면 메타데이터에서 추출 (GitHub private email 대응)
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', ''),
    -- full_name 우선순위:
    --   1. full_name (이메일 가입 또는 Google)
    --   2. name (Google 또는 GitHub 실명)
    --   3. user_name (GitHub 닉네임)
    --   4. 빈 문자열 (나중에 프로필 페이지에서 입력)
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'name', ''),
      NULLIF(NEW.raw_user_meta_data->>'user_name', ''),
      ''
    ),
    -- avatar_url: Google 또는 GitHub 프로필 이미지
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;  -- 중복 삽입 방지 (트리거 + 코드 동시 실행 대비)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
