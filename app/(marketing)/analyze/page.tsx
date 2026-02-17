import type { Metadata } from "next";
import { PageWrapper } from "@/components/templates/page-wrapper";
import { ResumeAnalyzeForm } from "@/components/organisms/resume-analyze-form";

export const metadata: Metadata = {
  title: "자소서 분석 | ResumeLens",
  description:
    "자소서를 입력하고 Claude AI로 5가지 관점에서 분석 결과를 받아보세요.",
};

/**
 * 자소서 분석 페이지
 * F001: 자소서 입력 및 검증
 * F002: 5가지 관점 AI 분석
 * F011: 로딩 상태 표시
 */
export default function AnalyzePage() {
  return (
    <PageWrapper className="max-w-3xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">자소서 분석</h1>
          <p className="text-muted-foreground">
            분석할 자소서를 입력하세요. Claude AI가 5가지 관점에서 분석합니다.
          </p>
        </div>

        {/* 자소서 입력 폼 컴포넌트 (Organism) */}
        <ResumeAnalyzeForm />
      </div>
    </PageWrapper>
  );
}
