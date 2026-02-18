import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AnalysisResultView } from '@/components/molecules/analysis-result-view';
import { AnalysisData } from '@/lib/types/resume';
import { Eye, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const supabase = await createClient();

  const { data: resume } = await supabase
    .from('resumes')
    .select('title, original_text')
    .eq('share_token', token)
    .eq('is_share_public', true)
    .single();

  if (!resume) {
    return { title: '공유된 분석 결과 | ResumeLens' };
  }

  const title = resume.title || resume.original_text?.slice(0, 30) + '...';
  return {
    title: `${title} | ResumeLens 자소서 분석`,
    description: '자소서 AI 분석 결과를 확인하세요',
  };
}

/**
 * 공유 페이지 콘텐츠 컴포넌트
 * Suspense 경계 내에서 Supabase 조회 + 조회수 증가
 */
async function ShareContent({ paramsPromise }: { paramsPromise: Promise<{ token: string }> }) {
  const { token } = await paramsPromise;
  const supabase = await createClient();

  // 공유 토큰으로 자소서 + 분석 결과 조회
  // RLS 정책: is_share_public = TRUE AND share_token IS NOT NULL AND (만료 미도달)
  const { data: resume, error } = await supabase
    .from('resumes')
    .select(
      `
      id,
      title,
      original_text,
      created_at,
      share_token,
      is_share_public,
      share_expires_at,
      share_view_count,
      analysis_results (
        overall_score,
        analyzed_at,
        analysis_data
      )
    `
    )
    .eq('share_token', token)
    .eq('is_share_public', true)
    .single();

  // 공유 자소서 없음 → 404
  if (error || !resume) {
    notFound();
  }

  // 만료 확인 (RLS가 처리하지만 이중 확인)
  if (resume.share_expires_at && new Date(resume.share_expires_at) < new Date()) {
    notFound();
  }

  // 조회수 증가 (SECURITY DEFINER 함수 — RLS 우회하여 카운트 증가)
  await supabase.rpc('increment_share_view_count', { p_share_token: token });

  // 분석 결과 파싱 (Supabase JOIN은 배열로 반환될 수 있음)
  const analysisResult = Array.isArray(resume.analysis_results)
    ? resume.analysis_results[0]
    : resume.analysis_results;

  const analysisData = analysisResult?.analysis_data as AnalysisData | undefined;

  const formattedDate = new Date(resume.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* 자소서 메타 정보 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2">
          {resume.title || resume.original_text?.slice(0, 40) + '...'}
        </h1>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate} 분석
          </span>
          {analysisResult && (
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {/* 조회수는 increment 직후라 +1 표시 */}
              {(resume.share_view_count ?? 0) + 1}회 조회됨
            </span>
          )}
        </div>
      </div>

      {/* 분석 결과 표시 */}
      {analysisData ? (
        <AnalysisResultView analysisData={analysisData} />
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>분석 결과를 불러올 수 없습니다</p>
        </div>
      )}

      {/* 하단 CTA */}
      <div className="mt-10 p-6 border rounded-xl text-center bg-muted/20">
        <p className="font-medium mb-1">내 자소서도 AI로 분석해보세요</p>
        <p className="text-sm text-muted-foreground mb-4">
          5가지 관점(논리구조, 직무적합성, 차별성, 문장력, 면접관 시선)에서 동시 분석
        </p>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          무료로 분석 시작하기
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}

/**
 * 공개 공유 페이지
 * - 로그인 없이 누구나 접근 가능
 * - cacheComponents 모드 대응: params Promise를 Suspense 내 컴포넌트에 직접 전달
 */
export default function SharePage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* 공유 페이지 헤더 */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight hover:text-primary transition-colors"
          >
            ResumeLens
          </Link>
          <Link
            href="/analyze"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            나도 분석해보기
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* 메인 콘텐츠 (Suspense로 데이터 로딩) */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ShareContent paramsPromise={params} />
      </Suspense>

      {/* 공유 페이지 푸터 */}
      <footer className="border-t mt-16 py-6 text-center text-xs text-muted-foreground">
        <p>
          <Link href="/" className="hover:text-foreground transition-colors">
            ResumeLens
          </Link>{' '}
          · AI 자소서 분석 서비스
        </p>
      </footer>
    </div>
  );
}
