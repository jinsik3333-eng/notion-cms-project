"use client";

import { useTheme } from "next-themes";
import { useTransition } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 다크모드 토글 버튼 (next-themes 연동)
 *
 * - SSR 안전 (next-themes가 자동 처리)
 * - 시스템 테마 인식
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const handleThemeChange = () => {
    startTransition(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeChange}
      disabled={isPending}
      title={`${theme === "dark" ? "라이트" : "다크"} 모드로 전환`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">테마 전환</span>
    </Button>
  );
}
