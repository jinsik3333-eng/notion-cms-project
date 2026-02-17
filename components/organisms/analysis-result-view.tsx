"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnalysisResult, AnalysisCategory } from "@/lib/types/analysis";

/**
 * 점수에 따른 색상 클래스 반환
 * 80+ 초록, 60-79 노랑, 0-59 빨강
 */
function getScoreColorClass(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

/**
 * 점수에 따른 Badge variant 반환
 */
function getScoreBadgeClass(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
}

/**
 * 종합 점수 평가 문구 반환
 */
function getOverallGrade(score: number): string {
  if (score >= 80) return "우수";
  if (score >= 70) return "양호";
  if (score >= 60) return "보통";
  return "개선 필요";
}

// 분석 카테고리 메타데이터
const CATEGORY_META: Record<AnalysisCategory, { label: string; icon: string }> = {
  logicStructure: { label: "논리구조", icon: "🧠" },
  jobSuitability: { label: "직무적합성", icon: "🎯" },
  differentiation: { label: "차별성", icon: "✨" },
  writingQuality: { label: "문장력", icon: "📝" },
  interviewerPerspective: { label: "면접관 시선", icon: "👔" },
};

interface AnalysisResultViewProps {
  // 실제 분석 결과 데이터 (API 연동 후 Zustand store에서 주입)
  result?: AnalysisResult;
}

/**
 * 분석 결과 뷰 컴포넌트 (Organism)
 *
 * F002: 5가지 관점 AI 분석 결과 표시
 * F003: 분석 결과 구조화된 표시
 *
 * TODO: Zustand store에서 실제 분석 결과 데이터 주입 (Phase 1)
 */
export function AnalysisResultView({ result }: AnalysisResultViewProps) {
  const router = useRouter();

  // 분석 결과가 없는 경우 (직접 URL 접근 등)
  if (!result) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-xl font-semibold">분석 결과가 없습니다.</p>
        <p className="text-muted-foreground">
          자소서를 입력하고 분석을 시작해 주세요.
        </p>
        <Link href="/analyze">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            자소서 분석하러 가기
          </Button>
        </Link>
      </div>
    );
  }

  const analysisEntries = Object.entries(result.analyses) as [
    AnalysisCategory,
    AnalysisResult["analyses"][AnalysisCategory]
  ][];

  return (
    <div className="space-y-8">
      {/* 종합 평가 섹션 */}
      <Card className="border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">종합 평가</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {/* 원형 점수 표시 */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${result.overallScore * 2.51} 251`}
                strokeLinecap="round"
                className={cn(
                  result.overallScore >= 80
                    ? "stroke-green-500"
                    : result.overallScore >= 60
                    ? "stroke-yellow-500"
                    : "stroke-red-500"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-3xl font-bold", getScoreColorClass(result.overallScore))}>
                {result.overallScore}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>

          {/* 평가 등급 */}
          <Badge className={cn("text-sm px-3 py-1", getScoreBadgeClass(result.overallScore))}>
            {getOverallGrade(result.overallScore)}
          </Badge>

          {/* 종합 요약 */}
          <p className="text-center text-muted-foreground max-w-xl">
            {result.summary}
          </p>

          <p className="text-xs text-muted-foreground">
            분석 완료: {new Date(result.analyzedAt).toLocaleString("ko-KR")}
          </p>
        </CardContent>
      </Card>

      {/* 5가지 분석 결과 카드 */}
      <div className="grid md:grid-cols-2 gap-4">
        {analysisEntries.map(([category, analysis]) => {
          const meta = CATEGORY_META[category];
          return (
            <Card key={category} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{meta.icon}</span>
                    <CardTitle className="text-lg">{meta.label}</CardTitle>
                  </div>
                  {/* 항목별 점수 */}
                  <Badge className={cn("text-base font-bold", getScoreBadgeClass(analysis.score))}>
                    {analysis.score}점
                  </Badge>
                </div>
                {/* 점수 바 */}
                <div className="h-2 rounded-full bg-muted mt-2">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      analysis.score >= 80
                        ? "bg-green-500"
                        : analysis.score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    )}
                    style={{ width: `${analysis.score}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* 피드백 */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysis.feedback}
                </p>

                {/* 개선 제안 */}
                <div>
                  <p className="text-sm font-semibold mb-2">개선 제안</p>
                  <ul className="space-y-1">
                    {analysis.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">
                          {i + 1}.
                        </span>
                        <span className="text-muted-foreground">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() => router.push("/analyze")}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          다시 분석하기
        </Button>
        <Button onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
