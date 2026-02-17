import type { Metadata } from "next";
import { PageWrapper } from "@/components/templates/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서비스 소개 | ResumeLens",
  description:
    "ResumeLens의 기능, 특징, 사용 방법을 알아보세요. Claude AI로 자소서를 5가지 관점에서 분석합니다.",
};

/**
 * 서비스 소개 페이지
 * F004: Notion CMS 콘텐츠 조회 및 표시
 * F010: 페이지 네비게이션
 *
 * TODO: Notion CMS에서 콘텐츠 동적 로딩으로 교체 예정
 */
export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="space-y-16">
        {/* 서비스 개요 */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">ResumeLens 서비스 소개</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            구직자의 자소서를 Claude AI로 5가지 관점에서 분석하여
            합격 가능성을 높이는 서비스입니다.
          </p>
        </section>

        {/* 핵심 특징 */}
        <section>
          <h2 className="text-2xl font-bold mb-6">핵심 특징</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "5가지 관점 동시 분석",
                desc: "논리구조, 직무적합성, 차별성, 문장력, 면접관 시선 — 단 한 번의 분석으로 모든 관점을 확인하세요.",
              },
              {
                title: "구체적인 개선 제안",
                desc: "각 항목별 점수와 피드백뿐만 아니라, 실행 가능한 3가지 개선 제안을 제시합니다.",
              },
              {
                title: "개인정보 보호",
                desc: "분석 결과는 서버에 저장되지 않습니다. 자소서 내용은 분석 후 즉시 삭제됩니다.",
              },
              {
                title: "Notion으로 콘텐츠 관리",
                desc: "가격표, 후기, 서비스 소개 등 마케팅 콘텐츠를 비개발자도 Notion에서 직접 관리할 수 있습니다.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
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
        <section>
          <h2 className="text-2xl font-bold mb-6">사용 방법</h2>
          <ol className="space-y-4">
            {[
              {
                step: 1,
                title: "자소서 입력",
                desc: "분석할 자소서 텍스트를 입력 창에 붙여넣으세요. 50자 이상 5,000자 이하여야 합니다.",
              },
              {
                step: 2,
                title: "분석 시작",
                desc: "'분석 시작' 버튼을 클릭하면 Claude AI가 5가지 관점으로 분석을 시작합니다. 약 30초가 소요됩니다.",
              },
              {
                step: 3,
                title: "결과 확인 및 개선",
                desc: "각 항목별 점수(0-100), 상세 피드백, 개선 제안 3가지를 확인하고 자소서를 수정하세요.",
              },
              {
                step: 4,
                title: "반복 개선",
                desc: "자소서를 수정한 후 다시 분석하여 점수가 향상되었는지 확인하세요.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "자소서 분석 횟수 제한이 있나요?",
                a: "MVP 기간 동안은 무제한으로 분석할 수 있습니다. 향후 플랜에 따라 변경될 수 있습니다.",
              },
              {
                q: "입력한 자소서 내용이 저장되나요?",
                a: "아니요, 입력한 자소서 내용은 분석 목적으로만 사용되며 서버에 저장되지 않습니다.",
              },
              {
                q: "분석 결과는 얼마나 정확한가요?",
                a: "Claude AI(claude-3-5-sonnet 모델)를 사용하며, 실제 인사 담당자의 평가 기준을 기반으로 분석합니다. 참고 자료로 활용하시고, 최종 판단은 본인이 하시기 바랍니다.",
              },
              {
                q: "어떤 종류의 자소서를 분석할 수 있나요?",
                a: "직무 지원 자기소개서, 학교 지원 자기소개서 등 모든 형태의 텍스트 자소서를 분석할 수 있습니다.",
              },
            ].map((item) => (
              <div key={item.q} className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Link href="/analyze">
            <Button size="lg">
              자소서 분석 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </PageWrapper>
  );
}
