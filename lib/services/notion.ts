import type { PricingPlan, Testimonial, ContentPage } from "@/types";

/**
 * Notion API 서비스 (Mock 데이터 기반)
 *
 * 실제 Notion API는 환경 변수 설정 후 구현
 * 현재는 기본 데이터를 반환하여 API 구조 검증
 */

/**
 * 가격표 조회 함수
 */
export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    // TODO: 실제 Notion API 연동 시 활성화
    // const dbId = process.env.NOTION_PRICING_DB_ID;
    // const response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {...})
    // return response.json().results.map(mapToPricingPlan);

    // 기본 데이터 반환
    return [
      {
        id: "free-plan",
        name: "무료 플랜",
        price: 0,
        features: ["자소서 5가지 관점 분석", "무제한 분석", "실시간 피드백"],
        description: "무료로 자소서를 분석해 보세요.",
        isPopular: true,
        order: 1,
      },
      {
        id: "pro-plan",
        name: "프로 플랜",
        price: 9900,
        features: [
          "자소서 5가지 관점 분석",
          "무제한 분석",
          "분석 결과 저장",
          "우선 지원",
        ],
        description: "프리미엄 기능과 함께 더 나은 경험을 누리세요.",
        isPopular: false,
        order: 2,
      },
    ];
  } catch (error) {
    console.error("가격표 조회 실패:", error);
    // Fallback: 기본 무료 플랜 반환
    return [
      {
        id: "free-plan",
        name: "무료 플랜",
        price: 0,
        features: ["자소서 5가지 관점 분석", "무제한 분석"],
        description: "무료로 자소서를 분석해 보세요.",
        isPopular: true,
        order: 1,
      },
    ];
  }
}

/**
 * 후기 조회 함수
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    // TODO: 실제 Notion API 연동 시 활성화

    // 기본 데이터 반환
    return [
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
      {
        id: "sample-3",
        author: "박수진",
        content:
          "자소서 분석은 여러 번 해봤는데, ResumeLens의 구체적인 피드백이 가장 도움이 많이 됐습니다.",
        rating: 4,
        company: "라인",
        jobRole: "경력직",
        submittedAt: new Date("2024-01-05").toISOString(),
        isVerified: true,
        order: 3,
      },
    ];
  } catch (error) {
    console.error("후기 조회 실패:", error);
    // Fallback: 샘플 후기 반환
    return [
      {
        id: "sample-1",
        author: "김준영",
        content:
          "ResumeLens 덕분에 자소서를 5가지 관점에서 분석할 수 있었고, 특히 면접관 시선이 정말 도움이 됐습니다.",
        rating: 5,
        company: "네이버",
        jobRole: "신입 개발자",
        submittedAt: new Date("2024-01-15").toISOString(),
        isVerified: true,
        order: 1,
      },
    ];
  }
}

/**
 * 콘텐츠 페이지 조회 함수
 */
export async function getContentPage(slug: string): Promise<ContentPage | null> {
  try {
    // TODO: 실제 Notion API 연동 시 활성화

    // 샘플 데이터
    const contentMap: Record<string, ContentPage> = {
      about: {
        id: "about-1",
        pageName: "서비스 소개",
        slug: "about",
        content: `# ResumeLens에 대해

ResumeLens는 Claude AI로 자소서를 5가지 관점에서 분석하여 합격 가능성을 높이는 서비스입니다.

## 핵심 기능

1. **논리구조 분석**: 자소서의 논리적 흐름을 점검합니다.
2. **직무적합성 분석**: 지원 직무와의 부합도를 평가합니다.
3. **차별성 분석**: 다른 지원자와의 차별화 포인트를 찾습니다.
4. **문장력 분석**: 글의 품질과 표현력을 개선합니다.
5. **면접관 시선**: 실제 면접관의 관점에서 평가합니다.

## 사용 방법

1. 홈 페이지에서 자소서를 입력합니다.
2. 분석 시작 버튼을 클릭합니다.
3. 약 30초 후 5가지 분석 결과를 확인합니다.
4. 개선 제안을 참고하여 자소서를 수정합니다.`,
        metaDescription: "ResumeLens 서비스 소개 페이지입니다.",
        publishedAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-02-18").toISOString(),
        isPublished: true,
      },
    };

    return contentMap[slug] || null;
  } catch (error) {
    console.error(`콘텐츠 페이지 조회 실패 (${slug}):`, error);
    return null;
  }
}
