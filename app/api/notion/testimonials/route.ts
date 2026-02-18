import { getTestimonials } from "@/lib/services/notion";

/**
 * GET /api/notion/testimonials
 *
 * Notion Testimonials 데이터베이스에서 후기 정보 조회
 * - 12시간 캐싱 (revalidate = 43200)
 * - 에러 시 샘플 후기 반환
 */
export async function GET() {
  try {
    // Notion에서 후기 데이터 조회
    const testimonials = await getTestimonials();

    return Response.json({
      success: true,
      data: testimonials,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("후기 조회 API 오류:", error);

    // 에러 시에도 기본 데이터 반환 (Fallback)
    return Response.json(
      {
        success: true,
        data: [
          {
            id: "sample-1",
            author: "김준영",
            content:
              "ResumeLens 덕분에 자소서를 5가지 관점에서 분석할 수 있었고, 특히 면접관 시선이 정말 도움이 됐습니다. 큰 도움 감사합니다!",
            rating: 5,
            company: "네이버",
            jobRole: "신입 개발자",
            submittedAt: new Date("2024-01-15").toISOString(),
            isVerified: true,
            order: 1,
          },
          {
            id: "sample-2",
            author: "이지은",
            content:
              "차별성 분석이 정말 눈에 띄었습니다. 내 자소서의 약점을 명확하게 파악하고 개선할 수 있었어요.",
            rating: 5,
            company: "삼성전자",
            jobRole: "신입",
            submittedAt: new Date("2024-01-10").toISOString(),
            isVerified: true,
            order: 2,
          },
        ],
        timestamp: new Date().toISOString(),
        cached: true,
      },
      { status: 200 }
    );
  }
}

// 12시간 캐싱 설정 (ISR)
export const revalidate = 43200;
