import type { Metadata } from "next";
import { PageWrapper } from "@/components/templates/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "가격표 | ResumeLens",
  description:
    "ResumeLens의 가격 정보를 확인하세요. MVP 기간 동안 무료로 이용 가능합니다.",
};

/**
 * 가격표 페이지
 * F004: Notion CMS 콘텐츠 조회 및 표시
 * F010: 페이지 네비게이션
 *
 * TODO: Notion PricingPlans 데이터베이스에서 동적 로딩으로 교체 예정
 */
export default function PricingPage() {
  return (
    <PageWrapper>
      <div className="space-y-12">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">가격표</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            현재 MVP 기간으로 모든 기능을 무료로 이용하실 수 있습니다.
          </p>
        </div>

        {/* 플랜 카드 */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* 무료 플랜 */}
          <Card className="border-2 border-blue-600 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-3">현재 플랜</Badge>
            </div>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">무료</CardTitle>
              <CardDescription>MVP 기간 한정 무료 제공</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₩0</span>
                <span className="text-muted-foreground ml-1">/월</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {[
                  "자소서 분석 무제한",
                  "5가지 관점 동시 분석",
                  "각 항목별 점수 (0-100)",
                  "상세 피드백 및 개선 제안",
                  "분석 결과 미저장 (개인정보 보호)",
                  "회원가입 불필요",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/analyze" className="block">
                <Button className="w-full">
                  지금 시작하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 프로 플랜 (예정) */}
          <Card className="opacity-70">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">프로</CardTitle>
              <CardDescription>출시 예정</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₩9,900</span>
                <span className="text-muted-foreground ml-1">/월</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {[
                  "무료 플랜의 모든 기능",
                  "분석 히스토리 저장 (최근 30개)",
                  "분석 결과 PDF 다운로드",
                  "맞춤형 분석 리포트",
                  "우선 고객 지원",
                  "베타 기능 선행 이용",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline" disabled>
                출시 예정
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 안내 문구 */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>MVP 기간 종료 후 가격 정책이 변경될 수 있습니다.</p>
          <p>
            문의사항이 있으시면{" "}
            <a href="mailto:support@resumelens.kr" className="text-blue-600 hover:underline">
              support@resumelens.kr
            </a>
            로 연락해 주세요.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
