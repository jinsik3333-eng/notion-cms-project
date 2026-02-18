'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkCheck, Share2, Trash2, Eye } from 'lucide-react';
import { getScoreColorClass, getScoreGrade } from '@/lib/types/resume';

interface AnalysisResultSummary {
  overall_score: number;
  analyzed_at: string;
}

interface ResumeCardProps {
  id: string;
  title: string | null;
  originalText: string;
  isBookmarked: boolean;
  isSharePublic: boolean;
  shareToken: string | null;
  shareViewCount: number;
  createdAt: string;
  analysisResult: AnalysisResultSummary | null;
  onBookmarkToggle: (id: string, isBookmarked: boolean) => Promise<void>;
  onDelete: (id: string) => void;
}

/**
 * 대시보드 히스토리 카드 컴포넌트
 * 분석 날짜, 종합 점수, 공유 상태, 즐겨찾기 표시
 */
export function ResumeHistoryCard({
  id,
  title,
  originalText,
  isBookmarked,
  isSharePublic,
  shareToken,
  shareViewCount,
  createdAt,
  analysisResult,
  onBookmarkToggle,
  onDelete,
}: ResumeCardProps) {
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkLoading(true);
    try {
      await onBookmarkToggle(id, !isBookmarked);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
  };

  const score = analysisResult?.overall_score ?? null;
  const displayTitle = title || originalText.replace(/\s+/g, ' ').slice(0, 30) + '...';

  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group relative">
      <Link href={`/dashboard/resumes/${id}`} className="block">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* 제목 */}
              <h3 className="font-medium text-sm leading-tight truncate group-hover:text-primary transition-colors">
                {displayTitle}
              </h3>
              {/* 날짜 */}
              <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
            </div>

            {/* 종합 점수 */}
            {score !== null && (
              <div className="flex-shrink-0 text-right">
                <div className={`text-2xl font-bold tabular-nums ${getScoreColorClass(score)}`}>
                  {score}
                </div>
                <div className="text-xs text-muted-foreground">{getScoreGrade(score)}</div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* 자소서 미리보기 */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {originalText.replace(/\s+/g, ' ')}
          </p>

          {/* 배지 영역 */}
          <div className="flex items-center gap-2 flex-wrap">
            {isSharePublic && shareToken && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Share2 className="h-3 w-3" />
                공유 중
              </Badge>
            )}
            {isSharePublic && shareViewCount > 0 && (
              <Badge variant="outline" className="text-xs gap-1">
                <Eye className="h-3 w-3" />
                {shareViewCount}회 조회
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>

      {/* 액션 버튼 (호버 시 표시) */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* 북마크 토글 */}
        <button
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
          title={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* 삭제 */}
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

/**
 * 스켈레톤 카드 (로딩 상태)
 */
export function ResumeHistoryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
          </div>
          <div className="h-8 w-10 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1.5 mb-3">
          <div className="h-3 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 삭제 확인 모달
 */
export function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      {/* 모달 */}
      <div className="relative bg-background border rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        <h3 className="font-semibold text-lg mb-2">분석 결과 삭제</h3>
        <p className="text-sm text-muted-foreground mb-6">
          이 자소서 분석 결과를 삭제하시겠습니까?
          <br />
          삭제 후에는 복구할 수 없습니다.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </div>
    </div>
  );
}
