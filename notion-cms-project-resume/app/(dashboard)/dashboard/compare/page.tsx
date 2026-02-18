import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { CompareContent } from '@/components/organisms/compare-content';

/**
 * 자소서 분석 결과 비교 페이지
 * URL: /dashboard/compare?ids=id1,id2,id3
 * 최대 3개까지 비교 가능
 *
 * cacheComponents 모드 대응:
 * useSearchParams()를 사용하는 클라이언트 컴포넌트를 Suspense로 감쌈
 */
export default function ComparePage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            대시보드
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">분석 결과 비교</h1>
        </div>
      </div>

      {/* 클라이언트 컴포넌트 (useSearchParams 사용) → Suspense로 감쌈 */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <CompareContent />
      </Suspense>
    </div>
  );
}
