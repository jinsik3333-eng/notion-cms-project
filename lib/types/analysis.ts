/**
 * 자소서 분석 관련 타입 정의
 * PRD 데이터 모델 기반
 */

/**
 * 5가지 분석 카테고리 키
 */
export type AnalysisCategory =
  | "logicStructure"
  | "jobSuitability"
  | "differentiation"
  | "writingQuality"
  | "interviewerPerspective";

/**
 * 단일 관점 분석 결과
 */
export interface CategoryAnalysis {
  score: number;        // 0-100 점수
  feedback: string;     // 피드백 텍스트 (200-300자)
  suggestions: string[]; // 개선 제안 (2-3개)
}

/**
 * 5가지 관점 전체 분석 결과
 * Claude API Response 스키마와 일치
 */
export interface AnalysisResult {
  id: string;          // 분석 세션 ID (UUID)
  resumeText: string;  // 원본 자소서 텍스트
  analyses: {
    logicStructure: CategoryAnalysis;        // 논리구조
    jobSuitability: CategoryAnalysis;        // 직무적합성
    differentiation: CategoryAnalysis;      // 차별성
    writingQuality: CategoryAnalysis;        // 문장력
    interviewerPerspective: CategoryAnalysis; // 면접관 시선
  };
  overallScore: number;  // 5가지 점수의 평균 (0-100)
  summary: string;       // 종합 평가 텍스트 (200-300자)
  analyzedAt: string;    // 분석 완료 시간 (ISO8601)
}

/**
 * Claude API 요청 본문
 */
export interface AnalyzeResumeRequest {
  resumeText: string;
  analysisType: "comprehensive"; // 5가지 관점 동시 분석
}

/**
 * Claude API 응답 (성공)
 */
export interface AnalyzeResumeResponse {
  success: true;
  data: AnalysisResult;
}

/**
 * Claude API 응답 (에러)
 */
export interface AnalyzeResumeErrorResponse {
  success: false;
  error: string;
  retryAfter?: number; // 재시도 대기 시간 (초) - 429 에러 시
}
