"use client";

import { Logo } from "@/components/atoms/logo";
import { ThemeToggle } from "@/components/atoms/theme-toggle";
import { NavItemComponent } from "@/components/molecules/nav-item";
import { MobileDrawer } from "./mobile-drawer";
import { mainNav } from "@/lib/constants/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * 헤더 (Organism)
 *
 * - Logo + Navigation + ThemeToggle + 분석 시작 CTA 버튼
 * - 모바일: 햄버거 메뉴 + Sheet (CSS 기반 반응형)
 * - MVP: 인증 없는 공개 네비게이션
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo />

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex gap-1">
            {mainNav.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* 자소서 분석 시작 CTA 버튼 (데스크톱) */}
          <Link href="/analyze" className="hidden sm:block">
            <Button size="sm">분석 시작</Button>
          </Link>

          {/* 모바일 네비게이션 */}
          <div className="md:hidden">
            <MobileDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}
