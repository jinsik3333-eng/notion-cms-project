import type { Metadata } from "next";
import { PageWrapper } from "@/components/templates/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "후기 | ResumeLens",
  description:
    "ResumeLens를 통해 자소서를 개선하고 합격한 사용자들의 실제 후기를 확인하세요.",
};

/**
 * 후기 페이지
 * F004: Notion CMS 콘텐츠 조회 및 표시
 * F010: 페이지 네비게이션
 *
 * TODO: Notion Testimonials 데이터베이스에서 동적 로딩으로 교체 예정
 */

// 플레이스홀더 후기 데이터 (Notion CMS 연동 전)
const placeholderTestimonials = [
  {
    author: "김지원",
    company: "네이버",
    jobRole: "신입 개발자",
    rating: 5,
    content:
      "자소서를 몇 번이나 고쳐도 어디가 문제인지 몰랐는데, ResumeLens를 통해 논리구조와 차별성이 부족했다는 걸 알게 됐어요. 수정 후 서류 합격률이 크게 올랐습니다!",
  },
  {
    author: "이서준",
    company: "카카오",
    jobRole: "경력 마케터",
    rating: 5,
    content:
      "직무적합성 분석이 정말 도움이 됐어요. 내가 쓴 내용이 JD와 얼마나 매칭되는지 객관적으로 볼 수 있었습니다. 면접관 시선 분석도 예상치 못한 인사이트를 줬어요.",
  },
  {
    author: "박민서",
    company: "삼성전자",
    jobRole: "신입 기획자",
    rating: 5,
    content:
      "문장력 분석에서 제 자소서가 너무 두루뭉술하게 쓰여있다는 걸 알게 됐어요. 개선 제안대로 구체적인 수치와 성과를 추가했더니 면접 기회가 많아졌습니다.",
  },
  {
    author: "최유나",
    company: "LG전자",
    jobRole: "신입 연구원",
    rating: 4,
    content:
      "5가지 관점으로 동시에 분석해주는 게 정말 편리했어요. 특히 면접관 시선 분석은 실제 면접에서 예상 질문을 파악하는 데도 도움이 됐습니다.",
  },
  {
    author: "정현우",
    company: "현대자동차",
    jobRole: "경력 엔지니어",
    rating: 5,
    content:
      "이직 준비를 하면서 ResumeLens를 사용했는데, 차별성 점수가 낮다는 피드백을 받고 제 강점을 더 명확하게 표현하도록 수정했어요. 덕분에 원하던 회사로 이직 성공했습니다!",
  },
  {
    author: "한지민",
    company: "SK하이닉스",
    jobRole: "신입 설계자",
    rating: 5,
    content:
      "회원가입 없이 바로 사용할 수 있어서 좋았어요. 분석 결과가 생각보다 훨씬 구체적이고 실용적이었습니다. 개선 제안 그대로 따라했더니 자소서 품질이 눈에 띄게 좋아졌어요.",
  },
];

export default function TestimonialsPage() {
  return (
    <PageWrapper>
      <div className="space-y-12">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">사용자 후기</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            ResumeLens로 자소서를 개선하고 꿈의 직장에 합격한 분들의 이야기입니다.
          </p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
          {[
            { label: "분석 완료", value: "1,200+" },
            { label: "평균 점수 향상", value: "+23점" },
            { label: "서류 합격률", value: "78%" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 후기 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {placeholderTestimonials.map((testimonial) => (
            <Card key={testimonial.author} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                {/* 별점 */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {/* 후기 내용 */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                {/* 작성자 정보 */}
                <div className="border-t pt-3">
                  <p className="font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.company} · {testimonial.jobRole}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            나도 합격 후기를 쓸 수 있을까요? 지금 바로 시작해보세요.
          </p>
          <Link href="/analyze">
            <Button size="lg">
              무료로 자소서 분석하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
