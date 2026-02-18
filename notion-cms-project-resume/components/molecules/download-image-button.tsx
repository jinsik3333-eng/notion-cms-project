'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { downloadElementAsImage } from '@/lib/utils/download-image';

interface DownloadImageButtonProps {
  /** 캡처할 DOM 요소의 ID */
  targetId: string;
  /** 다운로드 파일명 (확장자 제외) */
  filename: string;
  className?: string;
}

/**
 * 분석 결과 이미지 다운로드 버튼
 * - html2canvas로 분석 결과 컨테이너를 PNG로 변환
 * - 다운로드 중 로딩 상태 표시
 */
export function DownloadImageButton({ targetId, filename, className }: DownloadImageButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadElementAsImage(targetId, filename);
      toast.success('이미지 다운로드가 완료되었습니다');
    } catch (error) {
      console.error('이미지 다운로드 오류:', error);
      toast.error('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isDownloading}
      className={`gap-1.5 ${className ?? ''}`}
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isDownloading ? '생성 중...' : '이미지 저장'}
    </Button>
  );
}
