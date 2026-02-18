import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnalysisResultView } from '@/components/molecules/analysis-result-view';
import { ResumeDetailClient } from '@/components/organisms/resume-detail-client';
import { AnalysisData } from '@/lib/types/resume';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 자소서 분석 결과 상세 데이터 페칭 컴포넌트
 * Suspense 경계 내에서 비동기 Supabase 조회
 */
async function ResumeDetailContent({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = await paramsPromise;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // 자소서 + 분석 결과 조회
  const { data: resume, error } = await supabase
    .from('resumes')
    .select(
      `
      *,
      analysis_results (*)
    `
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !resume) notFound();

  // analysis_results: Supabase JOIN 결과가 배열로 올 수 있음
  const analysisResult = Array.isArray(resume.analysis_results)
    ? resume.analysis_results[0]
    : resume.analysis_results;

  const analysisData = analysisResult?.analysis_data as AnalysisData | undefined;

  const formattedDate = new Date(resume.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            대시보드
          </Link>
        </Button>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </div>

      {/* 제목 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">
          {resume.title || resume.original_text.slice(0, 30) + '...'}
        </h1>
        {analysisResult && (
          <p className="text-muted-foreground text-sm mt-1">
            종합 점수: {analysisResult.overall_score}점
          </p>
        )}
      </div>

      {/* 클라이언트 컴포넌트: 공유/다운로드/삭제 기능 포함 */}
      <ResumeDetailClient
        resumeId={id}
        title={resume.title ?? ''}
        isBookmarked={resume.is_bookmarked}
        isSharePublic={resume.is_share_public}
        shareToken={resume.share_token}
        shareExpiresAt={resume.share_expires_at}
        shareViewCount={resume.share_view_count}
      />

      {/* 분석 결과 */}
      {analysisData ? (
        <div className="mt-6">
          <AnalysisResultView
            analysisData={analysisData}
            containerId="analysis-result-container"
          />
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>분석 결과를 불러올 수 없습니다</p>
        </div>
      )}

      {/* 원본 자소서 (접을 수 있는 섹션) */}
      <details className="mt-6 border rounded-xl overflow-hidden">
        <summary className="flex items-center gap-2 px-5 py-3 cursor-pointer hover:bg-accent transition-colors text-sm font-medium">
          <FileText className="h-4 w-4" />
          원본 자소서 보기
        </summary>
        <div className="px-5 py-4 border-t">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {resume.original_text}
          </p>
        </div>
      </details>
    </>
  );
}

/**
 * 자소서 분석 결과 상세 페이지
 * cacheComponents 모드 대응:
 * - params Promise를 그대로 Suspense 내 컴포넌트로 전달
 * - Supabase 조회는 Suspense 경계 내부에서만 실행
 */
export default function ResumeDetailPage({ params }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ResumeDetailContent paramsPromise={params} />
      </Suspense>
    </div>
  );
}
