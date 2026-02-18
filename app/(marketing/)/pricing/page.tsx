import { getPricingPlans } from "@/lib/services/notion";
import { PageWrapper } from "@/components/templates/page-wrapper";
import { PricingCard } from "@/components/molecules/pricing-card";
import type { Metadata } from "next";

/**
 * 가격표 페이지
 *
 * - Notion PricingPlans 데이터베이스에서 데이터 조회
 * - 플랜 카드를 그리드로 표시
 * - IsPopular 플랜 강조 표시
 */
export const metadata: Metadata = {
  title: "가격표 | ResumeLens",
  description: "ResumeLens의 요금제를 확인하세요.",
};

export default async function PricingPage() {
  // Notion에서 가격표 데이터 조회
  const plans = await getPricingPlans();

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">가격표</h1>
          <p className="text-lg text-muted-foreground">
            당신에게 맞는 요금제를 선택하세요
          </p>
        </div>

        {/* 가격 카드 그리드 */}
        {plans.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>가격 정보를 불러올 수 없습니다.</p>
          </div>
        )}

        {/* FAQ 섹션 (선택) */}
        <div className="mt-16 max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">자주 묻는 질문</h2>
          </div>

          <div className="space-y-4">
            <details className="bg-muted/30 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">
                환불 정책이 있나요?
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                구매 후 7일 이내에 환불을 요청할 수 있습니다.
              </p>
            </details>

            <details className="bg-muted/30 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">
                구독을 취소할 수 있나요?
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                언제든지 구독을 취소할 수 있으며, 다음 결제일에 반영됩니다.
              </p>
            </details>

            <details className="bg-muted/30 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">
                무료 플랜으로 충분한가요?
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                무료 플랜도 모든 핵심 기능을 이용할 수 있습니다. 필요에 따라 업그레이드할 수 있습니다.
              </p>
            </details>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
