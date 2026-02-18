"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/templates/page-wrapper";
import { AnalysisResultView } from "@/components/organisms/analysis-result-view";
import { useAnalysisStore } from "@/stores/analysis-store";

/**
 * 분석 결과 페이지
 * F002: 5가지 관점 AI 분석 결과 표시
 * F003: 분석 결과 구조화된 표시
 * F011: 로딩 상태 표시
 */
export default function ResultPage() {
  const router = useRouter();
  const analysisResult = useAnalysisStore((state) => state.analysisResult);

  // 분석 결과가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!analysisResult) {
      router.replace("/");
    }
  }, [analysisResult, router]);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">분석 결과</h1>
          <p className="text-muted-foreground">
            5가지 관점의 분석 결과와 개선 제안을 확인하세요.
          </p>
        </div>

        {/* 분석 결과 뷰 컴포넌트 (Organism) */}
        <AnalysisResultView result={analysisResult || undefined} />
      </div>
    </PageWrapper>
  );
}
