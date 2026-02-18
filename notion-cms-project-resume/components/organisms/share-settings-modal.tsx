'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShareExpiresIn, SHARE_EXPIRES_LABEL } from '@/lib/types/resume';
import { X, Globe, Lock } from 'lucide-react';

interface ShareSettingsModalProps {
  isSharePublic: boolean;
  currentExpiresAt: string | null;
  onSave: (updates: { is_share_public?: boolean; expiresIn?: ShareExpiresIn }) => Promise<void>;
  onClose: () => void;
}

const EXPIRES_OPTIONS: ShareExpiresIn[] = ['week', 'month', 'quarter', 'never'];

/**
 * 공유 설정 모달
 * - 공개/비공개 토글
 * - 만료 기한 설정 (7일, 30일, 90일, 무제한)
 */
export function ShareSettingsModal({
  isSharePublic,
  currentExpiresAt,
  onSave,
  onClose,
}: ShareSettingsModalProps) {
  const [localPublic, setLocalPublic] = useState(isSharePublic);
  // 현재 만료일로부터 기간 추정 (초기값)
  const [selectedExpiry, setSelectedExpiry] = useState<ShareExpiresIn>(() => {
    if (!currentExpiresAt) return 'never';
    const days = Math.round(
      (new Date(currentExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (days <= 7) return 'week';
    if (days <= 30) return 'month';
    return 'quarter';
  });
  const [isSaving, setIsSaving] = useState(false);

  // 설정 저장
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        is_share_public: localPublic,
        expiresIn: selectedExpiry,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 모달 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background border rounded-xl shadow-lg w-full max-w-sm p-5">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">공유 설정</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 공개/비공개 토글 */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">공개 설정</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLocalPublic(true)}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                localPublic
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground hover:border-foreground/30'
              }`}
            >
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span>공개</span>
            </button>
            <button
              type="button"
              onClick={() => setLocalPublic(false)}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                !localPublic
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground hover:border-foreground/30'
              }`}
            >
              <Lock className="h-4 w-4 flex-shrink-0" />
              <span>비공개</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {localPublic
              ? '링크를 가진 누구나 분석 결과를 볼 수 있습니다'
              : '링크가 있어도 분석 결과를 볼 수 없습니다'}
          </p>
        </div>

        {/* 만료 기한 선택 */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2 font-medium">링크 만료 기한</p>
          <div className="grid grid-cols-2 gap-2">
            {EXPIRES_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedExpiry(option)}
                className={`p-2.5 rounded-lg border text-sm transition-colors ${
                  selectedExpiry === option
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:border-foreground/30'
                }`}
              >
                {SHARE_EXPIRES_LABEL[option]}
              </button>
            ))}
          </div>
        </div>

        {/* 저장/취소 버튼 */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
