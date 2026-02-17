import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWrapper } from "@/components/templates/page-wrapper";
import {
  ArrowRight,
  Brain,
  FileText,
  Star,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResumeLens - AI 자소서 분석 서비스",
  description:
    "Claude AI로 자소서를 5가지 관점(논리구조, 직무적합성, 차별성, 문장력, 면접관 시선)에서 분석하여 합격 가능성을 높이세요.",
};

/**
 * 랜딩 페이지 - 서비스 소개 및 자소서 분석 진입점
 */
export default function HomePage() {
  return (
    <PageWrapper>
      {/* 히어로 섹션 */}
      <section className="space-y-6 text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          AI로{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            자소서 분석
          </span>
          하고{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            합격
          </span>
          하세요
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Claude AI가 논리구조, 직무적합성, 차별성, 문장력, 면접관 시선 —
          5가지 관점에서 동시에 분석하여 맞춤 개선 제안을 제공합니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/analyze">
            <Button size="lg" className="w-full sm:w-auto">
              지금 무료로 분석하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              서비스 소개 보기
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          회원가입 없이 무료로 사용 가능 · 분석 결과는 서버에 저장되지 않습니다
        </p>
      </section>

      {/* 5가지 분석 관점 소개 */}
      <section className="mb-16">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold">5가지 관점으로 분석합니다</h2>
          <p className="text-muted-foreground">
            단순한 맞춤법 검사가 아닌, 면접관의 시선으로 자소서를 평가합니다
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: "🧠",
              title: "논리구조",
              desc: "자소서의 전개 방식이 논리적인지, 스토리라인이 일관성 있는지 분석합니다.",
            },
            {
              icon: "🎯",
              title: "직무적합성",
              desc: "지원 직무에 맞는 역량과 경험이 효과적으로 표현되고 있는지 평가합니다.",
            },
            {
              icon: "✨",
              title: "차별성",
              desc: "다른 지원자와 구별되는 독창적인 경험과 관점이 담겨 있는지 확인합니다.",
            },
            {
              icon: "📝",
              title: "문장력",
              desc: "표현이 명확하고 설득력 있는지, 적절한 어휘를 사용했는지 점검합니다.",
            },
            {
              icon: "👔",
              title: "면접관 시선",
              desc: "실제 면접관이 읽을 때 어떻게 느낄지, 추가 질문이 생길 부분은 어디인지 분석합니다.",
            },
            {
              icon: "📊",
              title: "종합 평가",
              desc: "5가지 관점의 점수를 종합하여 전체적인 자소서 완성도와 개선 우선순위를 제시합니다.",
            },
          ].map((item) => (
            <Card key={item.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <span className="text-3xl mb-2">{item.icon}</span>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="mb-16">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold">3단계로 간단하게</h2>
          <p className="text-muted-foreground">
            복잡한 절차 없이 자소서 분석을 시작하세요
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: FileText,
              title: "자소서 입력",
              desc: "분석할 자소서 텍스트를 입력하세요. 최소 50자, 최대 5,000자까지 가능합니다.",
            },
            {
              step: "02",
              icon: Brain,
              title: "AI 분석",
              desc: "Claude AI가 5가지 관점에서 자소서를 동시에 분석합니다. 약 30초가 소요됩니다.",
            },
            {
              step: "03",
              icon: CheckCircle2,
              title: "결과 확인",
              desc: "각 항목별 점수, 피드백, 개선 제안을 확인하고 자소서를 발전시키세요.",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 주요 특징 */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">ResumeLens만의 특징</h2>
            <div className="space-y-3">
              {[
                "회원가입 없이 즉시 사용 가능",
                "분석 결과는 서버에 저장되지 않아 개인정보 안전",
                "5가지 관점의 상세한 점수와 피드백 제공",
                "각 항목별 3가지 구체적인 개선 제안",
                "비개발자도 Notion으로 콘텐츠 직접 관리",
                "무제한 자소서 분석 (MVP 기간 무료)",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-muted-foreground italic">
                &quot;이전에는 자소서를 몇 번이나 고쳐도 어디가 문제인지 몰랐는데,
                ResumeLens를 통해 논리구조와 차별성이 부족했다는 것을 알게 됐어요.
                수정 후 서류 합격률이 크게 올랐습니다!&quot;
              </p>
              <div>
                <p className="font-semibold text-sm">김지원</p>
                <p className="text-xs text-muted-foreground">IT 대기업 신입 합격</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 md:p-12 text-white text-center space-y-4">
        <h2 className="text-3xl font-bold">지금 바로 자소서를 분석해보세요</h2>
        <p className="text-blue-100 max-w-xl mx-auto">
          무료로 시작하고, 합격에 한 발짝 더 가까워지세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/analyze">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              무료로 분석 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white text-white bg-transparent hover:bg-white/10"
            >
              가격표 보기
            </Button>
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
