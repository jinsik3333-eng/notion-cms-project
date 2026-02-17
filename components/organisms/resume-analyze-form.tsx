"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { resumeSchema, type ResumeInput } from "@/lib/validations/resume";
import { cn } from "@/lib/utils";

// 분석 진행 단계 메시지 (F011: 로딩 상태 표시)
const ANALYSIS_STEPS = [
  "논리구조 분석 중...",
  "직무적합성 분석 중...",
  "차별성 분석 중...",
  "문장력 분석 중...",
  "면접관 시선 분석 중...",
];

/**
 * 자소서 분석 폼 (Organism)
 *
 * F001: 자소서 입력 및 검증 (50-5,000자)
 * F002: 5가지 관점 AI 분석 요청
 * F011: 로딩 상태 표시
 */
export function ResumeAnalyzeForm() {
  const router = useRouter();
  // 분석 로딩 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // 현재 분석 단계 메시지 인덱스
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const form = useForm<ResumeInput>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      resumeText: "",
    },
  });

  const resumeText = form.watch("resumeText");
  const charCount = resumeText?.length ?? 0;

  /**
   * 분석 단계 메시지를 순환하는 타이머 시작
   */
  function startStepRotation(): ReturnType<typeof setInterval> {
    let index = 0;
    return setInterval(() => {
      index = (index + 1) % ANALYSIS_STEPS.length;
      setCurrentStepIndex(index);
    }, 2000);
  }

  /**
   * 자소서 분석 제출 핸들러
   */
  async function onSubmit(data: ResumeInput) {
    setIsAnalyzing(true);
    setCurrentStepIndex(0);

    // 분석 단계 메시지 순환 시작
    const stepTimer = startStepRotation();

    try {
      // TODO: Claude API 연동 구현 예정 (Phase 1)
      // const response = await fetch("/api/analyze-resume", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ resumeText: data.resumeText }),
      // });

      // 개발 중 임시 딜레이 (실제 API 연동 전)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success("분석이 완료되었습니다!");
      // 분석 결과 페이지로 이동
      router.push("/result");
    } catch (error) {
      console.error("분석 요청 실패:", error);
      toast.error("분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      clearInterval(stepTimer);
      setIsAnalyzing(false);
    }
  }

  /**
   * 분석 취소 핸들러
   */
  function handleCancel() {
    setIsAnalyzing(false);
    toast.info("분석이 취소되었습니다.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="resumeText"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                자소서 내용
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="분석할 자소서 텍스트를 여기에 붙여넣으세요.&#10;&#10;예) 저는 대학 시절 동아리 운영진으로서..."
                  className="min-h-[300px] resize-y text-sm leading-relaxed"
                  disabled={isAnalyzing}
                />
              </FormControl>
              {/* 글자 수 카운터 */}
              <div className="flex items-center justify-between">
                <FormMessage />
                <span
                  className={cn(
                    "text-xs ml-auto",
                    charCount < 50 || charCount > 5000
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {charCount.toLocaleString()} / 5,000자
                </span>
              </div>
            </FormItem>
          )}
        />

        {/* 입력 안내 */}
        <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1">
          <p>최소 50자 이상, 최대 5,000자까지 입력 가능합니다.</p>
          <p>분석에 약 30초가 소요됩니다.</p>
          <p>입력한 자소서 내용은 서버에 저장되지 않습니다.</p>
        </div>

        {/* 로딩 상태 표시 (F011) */}
        {isAnalyzing && (
          <div className="flex flex-col items-center gap-3 py-4">
            <LoadingSpinner />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              {ANALYSIS_STEPS[currentStepIndex]}
            </p>
            <p className="text-xs text-muted-foreground">
              약 30초가 소요됩니다...
            </p>
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isAnalyzing || charCount < 50 || charCount > 5000}
            className="flex-1"
          >
            {isAnalyzing ? "분석 중..." : "분석 시작"}
          </Button>

          {/* 취소 버튼 (로딩 중에만 표시) */}
          {isAnalyzing && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              취소
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
