import { getContentPage } from "@/lib/services/notion";
import { PageWrapper } from "@/components/templates/page-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

/**
 * 서비스 소개 페이지
 *
 * - Notion CMS에서 "about" slug의 콘텐츠 조회
 * - 마크다운 형식의 콘텐츠 표시
 * - 자소서 분석 시작 CTA 버튼
 */
export const metadata: Metadata = {
  title: "서비스 소개 | ResumeLens",
  description: "ResumeLens의 기능과 사용 방법을 알아보세요.",
};

export default async function AboutPage() {
  // Notion에서 서비스 소개 콘텐츠 조회
  const content = await getContentPage("about");

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">서비스 소개</h1>
          <p className="text-lg text-muted-foreground">
            ResumeLens에 대해 알아보세요
          </p>
        </div>

        {/* 콘텐츠 */}
        {content ? (
          <div className="prose prose-sm dark:prose-invert max-w-3xl mx-auto">
            <div className="bg-muted/30 rounded-lg p-8 space-y-4">
              {content.content.split("\n").map((line, index) => {
                if (line.startsWith("# ")) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-6">
                      {line.replace("# ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h3 key={index} className="text-xl font-semibold mt-4">
                      {line.replace("## ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <li key={index} className="ml-6 text-muted-foreground">
                      {line.replace("- ", "")}
                    </li>
                  );
                }
                if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
                  return (
                    <li key={index} className="ml-6 text-muted-foreground">
                      {line.replace(/^\d\. /, "")}
                    </li>
                  );
                }
                if (line.trim() === "") {
                  return <div key={index} />;
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>콘텐츠를 불러올 수 없습니다.</p>
          </div>
        )}

        {/* CTA 버튼 */}
        <div className="flex justify-center pt-8">
          <Link href="/analyze">
            <Button size="lg">
              자소서 분석 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
