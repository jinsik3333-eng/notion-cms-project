import { create } from "zustand";
import type { AnalysisResult } from "@/lib/types/analysis";

/**
 * 자소서 분석 결과 전역 상태 (Zustand)
 *
 * F002: 분석 결과를 클라이언트 메모리에만 저장 (서버 저장 없음)
 * F003: 분석 결과 페이지에서 결과 표시
 * F011: 분석 로딩 상태 관리
 */

interface AnalysisState {
  // 현재 분석 중인 자소서 텍스트
  resumeText: string;
  // 최신 분석 결과 (서버 미저장, 메모리에만 유지)
  analysisResult: AnalysisResult | null;
  // 분석 로딩 상태
  isAnalyzing: boolean;

  // 액션
  setResumeText: (text: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  // 분석 결과 초기화
  clearAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  resumeText: "",
  analysisResult: null,
  isAnalyzing: false,

  setResumeText: (text) => set({ resumeText: text }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  // 새 분석 시작 시 이전 결과 초기화
  clearAnalysis: () =>
    set({ resumeText: "", analysisResult: null, isAnalyzing: false }),
}));
