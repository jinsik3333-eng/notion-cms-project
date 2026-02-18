import { getPricingPlans } from "@/lib/services/notion";

/**
 * GET /api/notion/pricing
 *
 * Notion PricingPlans 데이터베이스에서 가격표 정보 조회
 * - 24시간 캐싱 (revalidate = 86400)
 * - 에러 시 기본 무료 플랜 반환
 */
export async function GET() {
  try {
    // Notion에서 가격표 데이터 조회
    const pricingPlans = await getPricingPlans();

    return Response.json({
      success: true,
      data: pricingPlans,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("가격표 조회 API 오류:", error);

    // 에러 시에도 기본 데이터 반환 (Fallback)
    return Response.json(
      {
        success: true,
        data: [
          {
            id: "free-plan",
            name: "무료 플랜",
            price: 0,
            features: ["자소서 5가지 관점 분석", "무제한 분석"],
            description: "무료로 자소서를 분석해 보세요.",
            isPopular: true,
            order: 1,
          },
        ],
        timestamp: new Date().toISOString(),
        cached: true,
      },
      { status: 200 }
    );
  }
}

// 24시간 캐싱 설정 (ISR)
export const revalidate = 86400;
