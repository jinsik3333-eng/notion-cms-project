import { Home, BookOpen, DollarSign, Star } from "lucide-react";
import type { NavItem } from "@/types";

/**
 * ResumeLens 메인 네비게이션 항목
 * PRD 메뉴 구조: 홈, 서비스 소개, 가격표, 후기
 */
export const mainNav: NavItem[] = [
  {
    title: "홈",
    href: "/",
    description: "서비스 소개 및 자소서 분석 시작",
    icon: Home,
  },
  {
    title: "서비스 소개",
    href: "/about",
    description: "ResumeLens 기능 및 사용 방법",
    icon: BookOpen,
  },
  {
    title: "가격표",
    href: "/pricing",
    description: "요금제 안내",
    icon: DollarSign,
  },
  {
    title: "후기",
    href: "/testimonials",
    description: "사용자 합격 후기",
    icon: Star,
  },
];

/**
 * 푸터 링크 (ResumeLens 용)
 */
export const footerNav: NavItem[] = [
  {
    title: "서비스",
    href: "#",
    children: [
      {
        title: "자소서 분석",
        href: "/analyze",
      },
      {
        title: "서비스 소개",
        href: "/about",
      },
    ],
  },
  {
    title: "정보",
    href: "#",
    children: [
      {
        title: "가격표",
        href: "/pricing",
      },
      {
        title: "후기",
        href: "/testimonials",
      },
    ],
  },
];
