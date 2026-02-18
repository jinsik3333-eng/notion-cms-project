'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShareSettingsModal } from '@/components/organisms/share-settings-modal';
import { Share2, Copy, Check, Settings, Eye, X } from 'lucide-react';
import { ShareExpiresIn, SHARE_EXPIRES_LABEL } from '@/lib/types/resume';

interface ShareSectionProps {
  resumeId: string;
  isSharePublic: boolean;
  shareToken: string | null;
  shareExpiresAt: string | null;
  shareViewCount: number;
  onShareCreate: (expiresIn: string) => Promise<string>;
  onShareUpdate: (updates: { is_share_public?: boolean; expiresIn?: string }) => Promise<void>;
  onShareDisable: () => Promise<void>;
}

/**
 * 공유 섹션 컴포넌트
 * - 공유 링크 없음: "공유 링크 생성" 버튼
 * - 공유 링크 있음: 링크 표시 + 복사 버튼 + 설정 버튼
 * - 공유 비활성화 시 "공유 중지됨" 표시
 */
export function ShareSection({
  isSharePublic,
  shareToken,
  shareExpiresAt,
  shareViewCount,
  onShareCreate,
  onShareUpdate,
  onShareDisable,
}: ShareSectionProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localSharePublic, setLocalSharePublic] = useState(isSharePublic);
  const [localShareToken, setLocalShareToken] = useState(shareToken);
  const [localExpiresAt, setLocalExpiresAt] = useState(shareExpiresAt);

  const shareLink = localShareToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${localShareToken}`
    : null;

  // 공유 링크 생성
  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const link = await onShareCreate('month'); // 기본 30일
      // 링크에서 토큰 추출
      const token = link.split('/share/')[1];
      setLocalShareToken(token);
      setLocalSharePublic(true);
      setLocalExpiresAt(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    } catch {
      // 에러는 상위에서 처리
    } finally {
      setIsCreating(false);
    }
  };

  // 링크 복사
  const handleCopy = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 공유 비활성화
  const handleDisable = async () => {
    await onShareDisable();
    setLocalShareToken(null);
    setLocalSharePublic(false);
    setLocalExpiresAt(null);
  };

  // 공유 설정 저장
  const handleSettingsSave = async (updates: { is_share_public?: boolean; expiresIn?: ShareExpiresIn }) => {
    await onShareUpdate(updates);
    if (typeof updates.is_share_public === 'boolean') {
      setLocalSharePublic(updates.is_share_public);
    }
    if (updates.expiresIn) {
      // 만료일 로컬 업데이트 (대략적)
      const days = updates.expiresIn === 'week' ? 7 : updates.expiresIn === 'month' ? 30 : 90;
      setLocalExpiresAt(
        updates.expiresIn === 'never'
          ? null
          : new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
      );
    }
    setShowSettings(false);
  };

  // 만료일 포맷
  const formatExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return '무제한';
    const date = new Date(expiresAt);
    const diff = date.getTime() - Date.now();
    if (diff < 0) return '만료됨';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days}일 후 만료`;
  };

  return (
    <div className="border rounded-xl p-4 bg-muted/20">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">공유</span>

        {/* 조회수 */}
        {localSharePublic && shareViewCount > 0 && (
          <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {shareViewCount}회 조회됨
          </span>
        )}
      </div>

      {!localShareToken ? (
        /* 공유 링크 없음: 생성 버튼 */
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreate}
            disabled={isCreating}
            className="gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            {isCreating ? '생성 중...' : '공유 링크 생성'}
          </Button>
          <span className="text-xs text-muted-foreground">
            링크를 생성하면 누구나 이 분석 결과를 볼 수 있습니다
          </span>
        </div>
      ) : (
        /* 공유 링크 있음 */
        <div className="space-y-2">
          {/* 공개 상태 뱃지 */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                localSharePublic ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            {localSharePublic ? '공개 중' : '비공개'}
            {localExpiresAt && (
              <span className="ml-1">· {formatExpiry(localExpiresAt)}</span>
            )}
          </div>

          {/* 링크 입력 + 복사 버튼 */}
          {localSharePublic && shareLink && (
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={shareLink}
                className="text-xs h-8 font-mono"
                onClick={e => (e.target as HTMLInputElement).select()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex-shrink-0 gap-1 h-8 px-3"
              >
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {isCopied ? '복사됨' : '복사'}
              </Button>
            </div>
          )}

          {/* 설정 + 비활성화 버튼 */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="gap-1 h-7 text-xs"
            >
              <Settings className="h-3 w-3" />
              공유 설정
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisable}
              className="gap-1 h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
              공유 중지
            </Button>
          </div>
        </div>
      )}

      {/* 공유 설정 모달 */}
      {showSettings && (
        <ShareSettingsModal
          isSharePublic={localSharePublic}
          currentExpiresAt={localExpiresAt}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
