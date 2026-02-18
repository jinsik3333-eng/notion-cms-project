import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';

/**
 * 대시보드 네비게이션 바
 * Suspense 내부에서 비동기 auth + 프로필 조회
 */
async function DashboardNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // 프로필에서 이름 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name || profile?.email || user.email || '사용자';

  return (
    <>
      <Link href="/dashboard" className="font-bold text-lg text-primary">
        ResumeLens
      </Link>
      <nav className="hidden md:flex items-center gap-4 text-sm flex-1">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          대시보드
        </Link>
        <Link
          href="/protected/profile"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          프로필
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden md:block">{displayName}</span>
        <LogoutButton />
      </div>
    </>
  );
}

/**
 * 대시보드 레이아웃
 * - 상단 네비게이션 바 구조
 * - 인증 확인은 DashboardNav (Suspense 내부)에서 처리
 * - cacheComponents 모드 대응: 비동기 컴포넌트를 Suspense로 감쌈
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
          <Suspense
            fallback={
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            }
          >
            <DashboardNav />
          </Suspense>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
