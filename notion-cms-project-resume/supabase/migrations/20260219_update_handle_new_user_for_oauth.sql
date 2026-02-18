-- Google OAuth 지원을 위한 handle_new_user 트리거 함수 업데이트
-- Google raw_user_meta_data 구조:
--   { "name": "홍길동", "full_name": "홍길동", "email": "...", "avatar_url": "..." }
-- 이메일/비밀번호 회원가입: raw_user_meta_data->>'full_name' 사용
-- Google OAuth: raw_user_meta_data->>'name' 또는 'full_name' 모두 지원

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    -- 이메일: auth.users.email 우선, 없으면 메타데이터에서 추출
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', ''),
    -- full_name: full_name 필드 우선, 없으면 name 필드 사용 (Google OAuth)
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    -- avatar_url: Google 프로필 이미지 자동 저장
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;  -- 중복 삽입 방지 (트리거 + 코드 동시 실행 대비)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
