import type { Metadata } from "next";
import { PageWrapper } from "@/components/templates/page-wrapper";
import { AnalysisResultView } from "@/components/organisms/analysis-result-view";

export const metadata: Metadata = {
  title: "분석 결과 | ResumeLens",
  description:
    "5가지 관점의 자소서 분석 결과를 확인하고 개선 제안을 받아보세요.",
};

/**
 * 분석 결과 페이지
 * F002: 5가지 관점 AI 분석 결과 표시
 * F003: 분석 결과 구조화된 표시
 * F011: 로딩 상태 표시
 */
export default function ResultPage() {
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
        <AnalysisResultView />
      </div>
    </PageWrapper>
  );
}
