import type { SiteConfig } from "@/types";

/**
 * ResumeLens 사이트 기본 설정 상수
 */
export const siteConfig: SiteConfig = {
  name: "ResumeLens",
  description:
    "Claude AI로 자소서를 5가지 관점(논리구조, 직무적합성, 차별성, 문장력, 면접관 시선)에서 분석하여 합격 가능성을 높이세요.",
  url: "https://resumelens.vercel.app",
  ogImage: "https://resumelens.vercel.app/og-image.png",
  mailSupport: "support@resumelens.kr",
  links: {
    github: "https://github.com/resumelens",
  },
};
