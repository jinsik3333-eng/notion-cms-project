import { getContentPage } from "@/lib/services/notion";

/**
 * GET /api/notion/content?slug=about
 *
 * Notion ContentPages 데이터베이스에서 특정 콘텐츠 페이지 조회
 * - 6시간 캐싱 (revalidate = 21600)
 * - slug 쿼리 파라미터 필수
 * - 404 시 null 반환
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  // slug 파라미터 필수 검증
  if (!slug) {
    return Response.json(
      {
        success: false,
        error: "slug 파라미터가 필요합니다.",
      },
      { status: 400 }
    );
  }

  try {
    // Notion에서 콘텐츠 페이지 조회
    const contentPage = await getContentPage(slug);

    if (!contentPage) {
      return Response.json(
        {
          success: false,
          error: `페이지를 찾을 수 없습니다: ${slug}`,
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: contentPage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`콘텐츠 조회 API 오류 (${slug}):`, error);

    return Response.json(
      {
        success: false,
        error: "콘텐츠 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// 6시간 캐싱 설정 (ISR)
export const revalidate = 21600;
