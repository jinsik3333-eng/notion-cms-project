import Link from 'next/link';
import { Link2Off } from 'lucide-react';

/**
 * 공유 링크 없음 / 만료 / 비공개 상태 표시 페이지
 */
export default function ShareNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <header className="border-b bg-background/95">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href="/" className="font-bold text-lg tracking-tight">
            ResumeLens
          </Link>
        </div>
      </header>

      {/* 404 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="mb-4 text-muted-foreground">
          <Link2Off className="h-12 w-12 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold mb-2">공유 링크를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6 max-w-sm">
          이 공유 링크가 만료되었거나, 비공개로 변경되었거나, 존재하지 않습니다.
        </p>
        <Link
          href="/"
          className="text-sm text-primary hover:underline underline-offset-4"
        >
          ResumeLens 홈으로 이동
        </Link>
      </main>
    </div>
  );
}
