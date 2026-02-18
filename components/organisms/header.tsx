"use client";

import { Logo } from "@/components/atoms/logo";
import { ThemeToggle } from "@/components/atoms/theme-toggle";
import { NavItemComponent } from "@/components/molecules/nav-item";
import { MobileDrawer } from "./mobile-drawer";
import { mainNav } from "@/lib/constants/nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

/**
 * 헤더 (Organism)
 *
 * - Logo + Navigation + ThemeToggle
 * - 인증 상태에 따라 로그인/로그아웃 버튼 표시
 * - 모바일: 햄버거 메뉴 + Sheet (CSS 기반 반응형)
 */
export function Header() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggingOut(false);
  };

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

          {/* 인증 상태에 따른 버튼 표시 */}
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isAuthenticated && user ? (
            <>
              {/* 로그인된 상태: 사용자 이메일 + 버튼들 */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground px-2">
                  {user.email}
                </span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    대시보드
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      로그아웃 중...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </>
                  )}
                </Button>
              </div>

              {/* 모바일: 햄버거 메뉴 */}
              <div className="sm:hidden">
                <MobileDrawer />
              </div>
            </>
          ) : (
            <>
              {/* 로그인되지 않은 상태 */}
              <Link href="/auth/login" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>

              <Link href="/analyze" className="hidden sm:block">
                <Button size="sm">분석 시작</Button>
              </Link>

              {/* 모바일 네비게이션 */}
              <div className="sm:hidden">
                <MobileDrawer />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
