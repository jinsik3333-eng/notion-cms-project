import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants/site";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
}

/**
 * ResumeLens 브랜드 로고 컴포넌트
 */
export function Logo({ className = "", variant = "default" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-bold text-lg transition-opacity hover:opacity-80",
        className
      )}
    >
      {/* 로고 아이콘: R 이니셜 */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm",
          variant === "light"
            ? "bg-gradient-to-br from-blue-400 to-purple-600"
            : "bg-gradient-to-br from-blue-500 to-purple-700"
        )}
      >
        RL
      </div>
      <span
        className={cn(
          "hidden sm:inline",
          variant === "light"
            ? "text-gray-700 dark:text-gray-300"
            : "text-foreground"
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
