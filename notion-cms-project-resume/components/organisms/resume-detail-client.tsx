'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShareSection } from '@/components/molecules/share-section';
import { DownloadImageButton } from '@/components/molecules/download-image-button';
import { Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import { DeleteConfirmModal } from '@/components/molecules/resume-history-card';

interface ResumeDetailClientProps {
  resumeId: string;
  title: string;
  isBookmarked: boolean;
  isSharePublic: boolean;
  shareToken: string | null;
  shareExpiresAt: string | null;
  shareViewCount: number;
}

/**
 * 상세 페이지의 클라이언트 기능 컴포넌트
 * - 북마크 토글
 * - 공유 섹션 (링크 생성/복사/설정)
 * - 이미지 다운로드
 * - 삭제
 */
export function ResumeDetailClient({
  resumeId,
  title,
  isBookmarked: initialBookmarked,
  isSharePublic: initialSharePublic,
  shareToken: initialShareToken,
  shareExpiresAt: initialShareExpiresAt,
  shareViewCount,
}: ResumeDetailClientProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isSharePublic, setIsSharePublic] = useState(initialSharePublic);
  const [shareToken, setShareToken] = useState(initialShareToken);
  const [shareExpiresAt, setShareExpiresAt] = useState(initialShareExpiresAt);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 북마크 토글
  const handleBookmarkToggle = async () => {
    setBookmarkLoading(true);
    try {
      const res = await fetch(`/api/dashboard/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_bookmarked: !isBookmarked }),
      });
      if (res.ok) {
        setIsBookmarked(prev => !prev);
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  // 삭제
  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`/api/dashboard/resumes/${resumeId}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/dashboard');
      router.refresh();
    }
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  // 공유 링크 생성
  const handleShareCreate = async (expiresIn: string) => {
    const res = await fetch(`/api/resumes/${resumeId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresIn }),
    });
    if (res.ok) {
      const data = await res.json();
      setShareToken(data.shareToken);
      setShareExpiresAt(data.expiresAt);
      setIsSharePublic(true);
      return data.shareLink as string;
    }
    throw new Error('공유 링크 생성 실패');
  };

  // 공유 설정 업데이트
  const handleShareUpdate = async (updates: { is_share_public?: boolean; expiresIn?: string }) => {
    const res = await fetch(`/api/resumes/${resumeId}/share`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.is_share_public === 'boolean') setIsSharePublic(data.is_share_public);
      if (data.share_expires_at !== undefined) setShareExpiresAt(data.share_expires_at);
    }
  };

  // 공유 비활성화
  const handleShareDisable = async () => {
    const res = await fetch(`/api/resumes/${resumeId}/share`, { method: 'DELETE' });
    if (res.ok) {
      setShareToken(null);
      setIsSharePublic(false);
      setShareExpiresAt(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 액션 버튼 행 */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 북마크 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleBookmarkToggle}
          disabled={bookmarkLoading}
          className="gap-1.5"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {isBookmarked ? '즐겨찾기됨' : '즐겨찾기'}
        </Button>

        {/* 이미지 다운로드 */}
        <DownloadImageButton
          targetId="analysis-result-container"
          filename={title || `분석결과_${resumeId.slice(0, 8)}`}
        />

        {/* 삭제 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="gap-1.5 text-destructive hover:text-destructive hover:border-destructive ml-auto"
        >
          <Trash2 className="h-4 w-4" />
          삭제
        </Button>
      </div>

      {/* 공유 섹션 */}
      <ShareSection
        resumeId={resumeId}
        isSharePublic={isSharePublic}
        shareToken={shareToken}
        shareExpiresAt={shareExpiresAt}
        shareViewCount={shareViewCount}
        onShareCreate={handleShareCreate}
        onShareUpdate={handleShareUpdate}
        onShareDisable={handleShareDisable}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}
