/**
 * 분석 결과 이미지 다운로드 유틸리티
 * html2canvas를 사용하여 DOM 요소를 PNG로 변환 후 다운로드
 */

/**
 * 특정 DOM 요소를 PNG 이미지로 다운로드
 * @param elementId - 캡처할 요소의 ID
 * @param filename - 다운로드 파일명 (확장자 제외)
 * @throws 요소를 찾을 수 없거나 캡처 실패 시 에러
 */
export async function downloadElementAsImage(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`요소를 찾을 수 없습니다: #${elementId}`);
  }

  // html2canvas 동적 임포트 (클라이언트 전용, SSR 방지)
  const { default: html2canvas } = await import('html2canvas');

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff', // 흰색 배경 고정 (다크모드 방지)
    scale: 2,                   // 레티나 디스플레이 대응 (2배 해상도)
    useCORS: true,              // 외부 이미지 CORS 허용
    logging: false,             // 콘솔 로그 비활성화
    windowWidth: element.scrollWidth + 48, // 좌우 패딩 포함
  });

  // 날짜 포맷 (YYYYMMDD)
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const safeFilename = filename.replace(/[^\w가-힣\-]/g, '_');

  // 다운로드 트리거
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png', 1.0);
  link.download = `${safeFilename}_${dateStr}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
