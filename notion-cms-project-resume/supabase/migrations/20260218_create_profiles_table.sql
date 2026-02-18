-- 사용자 프로필 테이블 생성
-- 회원가입한 사용자의 추가 정보를 관리합니다

-- 1. profiles 테이블 생성
-- auth.users와 1:1 관계
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  bio TEXT,
  job_role VARCHAR(100),
  company VARCHAR(255),
  job_field VARCHAR(100),
  years_of_experience INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 테이블 주석 추가
COMMENT ON TABLE profiles IS '사용자 프로필 정보 테이블';
COMMENT ON COLUMN profiles.id IS 'Supabase auth.users의 user_id와 동일';
COMMENT ON COLUMN profiles.email IS '사용자 이메일';
COMMENT ON COLUMN profiles.full_name IS '사용자 이름';
COMMENT ON COLUMN profiles.phone IS '전화번호';
COMMENT ON COLUMN profiles.avatar_url IS '프로필 이미지 URL';
COMMENT ON COLUMN profiles.bio IS '자기소개';
COMMENT ON COLUMN profiles.job_role IS '직급 (예: 신입, 경력자, 대학생)';
COMMENT ON COLUMN profiles.company IS '근무 회사';
COMMENT ON COLUMN profiles.job_field IS '직무 분야 (예: 개발, 마케팅, 영업)';
COMMENT ON COLUMN profiles.years_of_experience IS '경력 연수';
COMMENT ON COLUMN profiles.created_at IS '프로필 생성 시간';
COMMENT ON COLUMN profiles.updated_at IS '프로필 수정 시간';

-- 3. 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_job_role ON profiles(job_role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- 4. RLS (Row Level Security) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책 - 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 6. RLS 정책 - 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 7. RLS 정책 - 사용자는 자신의 프로필만 삭제 가능
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- 8. RLS 정책 - 새 사용자가 프로필 생성 가능
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 9. 자동 업데이트 트리거 설정
-- updated_at 칼럼이 자동으로 현재 시간으로 업데이트되도록 함
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at_trigger
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- 10. 회원가입 시 프로필 자동 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
