import { getTestimonials } from "@/lib/services/notion";
import { PageWrapper } from "@/components/templates/page-wrapper";
import { TestimonialCard } from "@/components/molecules/testimonial-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

/**
 * 후기 페이지
 *
 * - Notion Testimonials 데이터베이스에서 데이터 조회
 * - 후기 카드를 그리드로 표시
 * - 별점과 검증 배지 표시
 */
export const metadata: Metadata = {
  title: "후기 | ResumeLens",
  description: "ResumeLens 사용자들의 후기를 확인하세요.",
};

export default async function TestimonialsPage() {
  // Notion에서 후기 데이터 조회
  const testimonials = await getTestimonials();

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">사용자 후기</h1>
          <p className="text-lg text-muted-foreground">
            ResumeLens를 사용한 분들의 실제 후기를 확인하세요
          </p>
        </div>

        {/* 후기 카드 그리드 */}
        {testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>후기가 없습니다.</p>
          </div>
        )}

        {/* 통계 섹션 */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto py-8">
          <div className="text-center">
            <div className="text-3xl font-bold">{testimonials.length}+</div>
            <p className="text-sm text-muted-foreground">사용자 후기</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {(
                testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
              ).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">평균 별점</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {testimonials.filter((t) => t.isVerified).length}
            </div>
            <p className="text-sm text-muted-foreground">검증된 후기</p>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="bg-muted/30 rounded-lg p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">당신도 ResumeLens를 경험해 보세요</h2>
          <p className="text-muted-foreground">
            수천 명의 사용자가 이미 자소서 분석으로 합격을 획득했습니다.
          </p>
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
