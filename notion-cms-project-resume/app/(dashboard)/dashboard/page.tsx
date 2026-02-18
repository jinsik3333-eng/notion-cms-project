'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ResumeHistoryCard,
  ResumeHistoryCardSkeleton,
  DeleteConfirmModal,
} from '@/components/molecules/resume-history-card';
import { ResumeSortOption } from '@/lib/types/resume';
import { PlusCircle, Bookmark, ArrowUpDown } from 'lucide-react';

interface AnalysisResultSummary {
  overall_score: number;
  analyzed_at: string;
}

interface ResumeItem {
  id: string;
  title: string | null;
  original_text: string;
  is_bookmarked: boolean;
  is_share_public: boolean;
  share_token: string | null;
  share_view_count: number;
  created_at: string;
  analysis_results: AnalysisResultSummary | AnalysisResultSummary[] | null;
}

/**
 * 대시보드 메인 페이지 - 자소서 분석 히스토리 목록
 */
export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<ResumeSortOption>('latest');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 히스토리 목록 조회
  const fetchResumes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        sort,
        ...(bookmarkedOnly && { bookmarked: 'true' }),
        limit: '20',
      });

      const res = await fetch(`/api/dashboard/resumes?${params}`);
      if (!res.ok) throw new Error('목록 조회 실패');

      const data = await res.json();
      setResumes(data.resumes ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError('히스토리를 불러오는데 실패했습니다. 새로고침 해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [sort, bookmarkedOnly]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // 북마크 토글
  const handleBookmarkToggle = async (id: string, isBookmarked: boolean) => {
    const res = await fetch(`/api/dashboard/resumes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_bookmarked: isBookmarked }),
    });

    if (res.ok) {
      setResumes(prev =>
        prev.map(r => (r.id === id ? { ...r, is_bookmarked: isBookmarked } : r))
      );
    }
  };

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const res = await fetch(`/api/dashboard/resumes/${deleteTarget}`, { method: 'DELETE' });
    if (res.ok) {
      setResumes(prev => prev.filter(r => r.id !== deleteTarget));
      setTotal(prev => prev - 1);
    }

    setIsDeleting(false);
    setDeleteTarget(null);
  };

  // analysis_results가 배열이면 첫 번째 요소 반환 (Supabase JOIN 결과)
  const getAnalysisResult = (item: ResumeItem): AnalysisResultSummary | null => {
    if (!item.analysis_results) return null;
    if (Array.isArray(item.analysis_results)) return item.analysis_results[0] ?? null;
    return item.analysis_results;
  };

  const sortOptions: { value: ResumeSortOption; label: string }[] = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'score_high', label: '점수 높은순' },
    { value: 'score_low', label: '점수 낮은순' },
  ];

  return (
    <>
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">나의 자소서 분석</h1>
          <p className="text-muted-foreground text-sm mt-1">
            총 {total}개의 분석 결과가 저장되어 있습니다
          </p>
        </div>
        <Button asChild>
          <Link href="/analyze">
            <PlusCircle className="h-4 w-4 mr-2" />
            새 분석
          </Link>
        </Button>
      </div>

      {/* 필터 & 정렬 영역 */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {/* 즐겨찾기 필터 */}
        <Button
          variant={bookmarkedOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBookmarkedOnly(prev => !prev)}
          className="gap-1.5"
        >
          <Bookmark className="h-3.5 w-3.5" />
          즐겨찾기만
        </Button>

        {/* 정렬 옵션 */}
        <div className="flex items-center gap-1 ml-auto">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex gap-1">
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  sort === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-red-500 mb-3">{error}</p>
          <Button variant="outline" onClick={fetchResumes}>다시 시도</Button>
        </div>
      )}

      {/* 목록 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResumeHistoryCardSkeleton key={i} />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-lg font-semibold mb-2">
            {bookmarkedOnly ? '즐겨찾기한 분석이 없습니다' : '아직 분석한 자소서가 없습니다'}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            자소서를 분석하면 결과가 자동으로 저장됩니다
          </p>
          <Button asChild>
            <Link href="/analyze">자소서 분석 시작하기</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map(resume => (
              <ResumeHistoryCard
                key={resume.id}
                id={resume.id}
                title={resume.title}
                originalText={resume.original_text}
                isBookmarked={resume.is_bookmarked}
                isSharePublic={resume.is_share_public}
                shareToken={resume.share_token}
                shareViewCount={resume.share_view_count}
                createdAt={resume.created_at}
                analysisResult={getAnalysisResult(resume)}
                onBookmarkToggle={handleBookmarkToggle}
                onDelete={id => setDeleteTarget(id)}
              />
            ))}
          </div>

          {/* 비교 버튼 안내 */}
          {resumes.length >= 2 && (
            <div className="mt-8 p-4 border rounded-lg bg-muted/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">분석 결과 비교</p>
                <p className="text-xs text-muted-foreground">여러 자소서의 분석 결과를 나란히 비교해보세요</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/compare?ids=${resumes.slice(0, 2).map(r => r.id).join(',')}`}>
                  비교하기
                </Link>
              </Button>
            </div>
          )}
        </>
      )}

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  );
}
