-- ============================================================
-- Phase 7-8: resumes + analysis_results 테이블 생성
-- 자소서 분석 히스토리 저장 및 공유 기능 지원
-- ============================================================

-- 1. resumes 테이블 생성
-- 자소서 원문과 공유 관련 메타데이터를 저장
CREATE TABLE IF NOT EXISTS resumes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 자소서 원문 (50~5000자)
  original_text TEXT NOT NULL,

  -- 사용자 지정 제목 (없으면 원문 앞 30자 자동 생성)
  title         VARCHAR(200),

  -- 즐겨찾기 여부
  is_bookmarked BOOLEAN DEFAULT FALSE,

  -- 공유 기능 (Phase 8)
  share_token      VARCHAR(32) UNIQUE,          -- UUID 기반 공유 토큰
  is_share_public  BOOLEAN DEFAULT FALSE,        -- 공개 여부
  share_expires_at TIMESTAMP WITH TIME ZONE,     -- 만료 일시 (NULL = 무제한)
  share_view_count INT DEFAULT 0,                -- 조회수
  last_shared_at   TIMESTAMP WITH TIME ZONE,     -- 마지막 공유 시간

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE resumes IS '사용자의 자소서 분석 히스토리 테이블';
COMMENT ON COLUMN resumes.share_token IS 'UUID 기반 32자 공유 토큰 (/share/[token])';
COMMENT ON COLUMN resumes.share_expires_at IS '공유 만료 일시. NULL이면 무제한';


-- 2. analysis_results 테이블 생성
-- 5가지 관점 분석 결과를 resumes와 1:1로 저장
CREATE TABLE IF NOT EXISTS analysis_results (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id   UUID NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,

  -- 5가지 관점별 점수 (0~100)
  logic_structure_score         INT NOT NULL CHECK (logic_structure_score BETWEEN 0 AND 100),
  job_suitability_score         INT NOT NULL CHECK (job_suitability_score BETWEEN 0 AND 100),
  differentiation_score         INT NOT NULL CHECK (differentiation_score BETWEEN 0 AND 100),
  writing_quality_score         INT NOT NULL CHECK (writing_quality_score BETWEEN 0 AND 100),
  interviewer_perspective_score INT NOT NULL CHECK (interviewer_perspective_score BETWEEN 0 AND 100),

  -- 종합 점수 (5가지 평균)
  overall_score INT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),

  -- 전체 분석 데이터 (JSONB): 피드백, 개선 제안 포함
  -- 구조: { logicStructure: { score, feedback, suggestions[] }, ... , summary, analyzedAt }
  analysis_data JSONB NOT NULL,

  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE analysis_results IS '5가지 관점 분석 결과 테이블 (resumes와 1:1)';
COMMENT ON COLUMN analysis_results.analysis_data IS 'Gemini API 응답 전체 JSONB (피드백, 개선제안 포함)';


-- 3. 인덱스 생성
-- 사용자별 최신순 조회 (대시보드 기본 정렬)
CREATE INDEX IF NOT EXISTS idx_resumes_user_created
  ON resumes(user_id, created_at DESC);

-- 사용자별 점수순 조회 (정렬 옵션)
CREATE INDEX IF NOT EXISTS idx_resumes_user_score
  ON resumes(user_id, (
    SELECT overall_score FROM analysis_results WHERE resume_id = resumes.id
  ));

-- 공유 토큰 조회 (/share/[token] 페이지 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_resumes_share_token
  ON resumes(share_token)
  WHERE share_token IS NOT NULL;

-- 즐겨찾기 필터
CREATE INDEX IF NOT EXISTS idx_resumes_bookmarked
  ON resumes(user_id, is_bookmarked)
  WHERE is_bookmarked = TRUE;

-- analysis_results 점수 인덱스 (정렬 지원)
CREATE INDEX IF NOT EXISTS idx_analysis_results_overall_score
  ON analysis_results(overall_score DESC);


-- 4. resumes RLS 활성화
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 자소서만 조회
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 자소서만 삽입 (user_id 자동 검증)
CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 자소서만 수정
CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 자소서만 삭제
CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- 공개 공유 자소서는 누구나 조회 가능 (Phase 8 공유 기능)
-- 만료 여부도 DB 레벨에서 체크
CREATE POLICY "Anyone can view public shared resumes"
  ON resumes FOR SELECT
  USING (
    is_share_public = TRUE
    AND share_token IS NOT NULL
    AND (share_expires_at IS NULL OR share_expires_at > NOW())
  );


-- 5. analysis_results RLS 활성화
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- 자소서 소유자만 분석 결과 조회
CREATE POLICY "Users can view own analysis results"
  ON analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM resumes
      WHERE resumes.id = analysis_results.resume_id
        AND resumes.user_id = auth.uid()
    )
  );

-- 자소서 소유자만 분석 결과 삽입
CREATE POLICY "Users can insert own analysis results"
  ON analysis_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM resumes
      WHERE resumes.id = analysis_results.resume_id
        AND resumes.user_id = auth.uid()
    )
  );

-- 자소서 소유자만 분석 결과 수정
CREATE POLICY "Users can update own analysis results"
  ON analysis_results FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM resumes
      WHERE resumes.id = analysis_results.resume_id
        AND resumes.user_id = auth.uid()
    )
  );

-- 공개 공유된 자소서의 분석 결과는 누구나 조회 가능
CREATE POLICY "Anyone can view public shared analysis results"
  ON analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM resumes
      WHERE resumes.id = analysis_results.resume_id
        AND resumes.is_share_public = TRUE
        AND resumes.share_token IS NOT NULL
        AND (resumes.share_expires_at IS NULL OR resumes.share_expires_at > NOW())
    )
  );

-- 6. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_resumes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resumes_updated_at_trigger
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_resumes_updated_at();


-- 7. 공유 조회수 증가 함수 (RLS 우회 - SECURITY DEFINER)
-- 공개 공유 페이지에서 조회수를 증가할 때 사용
-- 만료된 링크나 비공개 링크는 카운트하지 않음
CREATE OR REPLACE FUNCTION increment_share_view_count(p_share_token VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE resumes
  SET share_view_count = share_view_count + 1
  WHERE share_token = p_share_token
    AND is_share_public = TRUE
    AND (share_expires_at IS NULL OR share_expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
