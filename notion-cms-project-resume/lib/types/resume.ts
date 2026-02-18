/**
 * 자소서 히스토리 및 분석 결과 타입 정의
 * DB 스키마 (resumes, analysis_results 테이블)와 1:1 대응
 */

// ============================================================
// 분석 결과 세부 항목 타입 (Gemini API 응답 구조)
// ============================================================

export interface AnalysisCategory {
  score: number;         // 0~100 점수
  feedback: string;      // 200~300자 피드백
  suggestions: string[]; // 2~3개 개선 제안
}

export interface AnalysisData {
  logicStructure: AnalysisCategory;         // 논리구조
  jobSuitability: AnalysisCategory;         // 직무적합성
  differentiation: AnalysisCategory;        // 차별성
  writingQuality: AnalysisCategory;         // 문장력
  interviewerPerspective: AnalysisCategory; // 면접관 시선
  overallScore: number;                     // 종합 점수 (0~100)
  summary: string;                          // 종합 평가 (200~300자)
  analyzedAt: string;                       // ISO8601 분석 완료 시간
}

// ============================================================
// DB 테이블 타입 (analysis_results)
// ============================================================

export interface AnalysisResult {
  id: string;
  resume_id: string;
  logic_structure_score: number;
  job_suitability_score: number;
  differentiation_score: number;
  writing_quality_score: number;
  interviewer_perspective_score: number;
  overall_score: number;
  analysis_data: AnalysisData; // JSONB → 파싱된 객체
  analyzed_at: string;
}

// ============================================================
// DB 테이블 타입 (resumes)
// ============================================================

export interface Resume {
  id: string;
  user_id: string;
  original_text: string;
  title: string | null;
  is_bookmarked: boolean;
  share_token: string | null;
  is_share_public: boolean;
  share_expires_at: string | null; // ISO8601 또는 null
  share_view_count: number;
  last_shared_at: string | null;
  created_at: string;
  updated_at: string;
}

// analysis_results JOIN 포함 타입 (대시보드 목록용)
export interface ResumeWithAnalysis extends Resume {
  analysis_results: AnalysisResult | null;
}

// ============================================================
// API 요청/응답 타입
// ============================================================

// POST /api/analyze-resume 요청
export interface AnalyzeResumeRequest {
  resumeText: string;
}

// POST /api/analyze-resume 응답 (분석 결과 + 저장된 resume ID)
export interface AnalyzeResumeResponse extends AnalysisData {
  resumeId: string; // 저장된 resumes 테이블 row ID
}

// GET /api/dashboard/resumes 응답 (목록)
export interface DashboardResumesResponse {
  resumes: ResumeWithAnalysis[];
  total: number;
}

// PATCH /api/dashboard/resumes/[id] 요청
export interface UpdateResumeRequest {
  title?: string;
  is_bookmarked?: boolean;
}

// POST /api/resumes/[id]/share 요청
export interface CreateShareRequest {
  expiresIn: 'week' | 'month' | 'quarter' | 'never'; // 7일 / 30일 / 90일 / 무제한
}

// POST /api/resumes/[id]/share 응답
export interface CreateShareResponse {
  shareLink: string;
  shareToken: string;
  expiresAt: string | null; // ISO8601 또는 null (무제한)
}

// PATCH /api/resumes/[id]/share 요청
export interface UpdateShareRequest {
  is_share_public?: boolean;
  expiresIn?: 'week' | 'month' | 'quarter' | 'never';
}

// ============================================================
// 클라이언트 상태 타입
// ============================================================

// 대시보드 정렬 옵션
export type ResumeSortOption = 'latest' | 'oldest' | 'score_high' | 'score_low';

// 대시보드 필터 옵션
export interface ResumesFilter {
  sort: ResumeSortOption;
  bookmarkedOnly: boolean;
  searchQuery: string;
}

// 공유 만료 옵션
export type ShareExpiresIn = 'week' | 'month' | 'quarter' | 'never';

export const SHARE_EXPIRES_LABEL: Record<ShareExpiresIn, string> = {
  week: '7일',
  month: '30일',
  quarter: '90일',
  never: '무제한',
};

// 점수 등급 계산 헬퍼
export function getScoreGrade(score: number): '우수' | '양호' | '보통' | '개선필요' {
  if (score >= 80) return '우수';
  if (score >= 60) return '양호';
  if (score >= 40) return '보통';
  return '개선필요';
}

// 점수별 색상 클래스 (Tailwind)
export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

// 점수별 배경 색상 클래스 (Tailwind)
export function getScoreBgClass(score: number): string {
  if (score >= 80) return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
  if (score >= 60) return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
  return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
}

// 만료 기한 계산 헬퍼
export function calculateExpiresAt(expiresIn: ShareExpiresIn): Date | null {
  const now = new Date();
  switch (expiresIn) {
    case 'week':    return new Date(now.getTime() + 7  * 24 * 60 * 60 * 1000);
    case 'month':   return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    case 'quarter': return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    case 'never':   return null;
  }
}

// 분석 카테고리 라벨
export const ANALYSIS_CATEGORY_LABELS: Record<keyof Omit<AnalysisData, 'overallScore' | 'summary' | 'analyzedAt'>, string> = {
  logicStructure: '논리구조',
  jobSuitability: '직무적합성',
  differentiation: '차별성',
  writingQuality: '문장력',
  interviewerPerspective: '면접관 시선',
};
