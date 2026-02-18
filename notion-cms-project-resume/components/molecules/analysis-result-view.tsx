import { AnalysisData, getScoreColorClass, getScoreBgClass, ANALYSIS_CATEGORY_LABELS } from '@/lib/types/resume';

interface AnalysisResultViewProps {
  analysisData: AnalysisData;
  /** 이미지 다운로드용 컨테이너 ID */
  containerId?: string;
}

/**
 * 분석 결과 표시 컴포넌트
 * 종합 점수 + 5가지 관점 카드
 * 공유 페이지 / 상세 페이지 / 대시보드 비교 페이지에서 공통 사용
 */
export function AnalysisResultView({ analysisData, containerId }: AnalysisResultViewProps) {
  const categories = [
    'logicStructure',
    'jobSuitability',
    'differentiation',
    'writingQuality',
    'interviewerPerspective',
  ] as const;

  return (
    <div id={containerId} className="space-y-6">
      {/* 종합 점수 섹션 */}
      <div className="rounded-xl border bg-card p-6 text-center">
        <div className="text-sm text-muted-foreground mb-1">종합 점수</div>
        <div className={`text-6xl font-bold tabular-nums mb-2 ${getScoreColorClass(analysisData.overallScore)}`}>
          {analysisData.overallScore}
        </div>
        <div className="text-sm font-medium mb-4">
          {analysisData.overallScore >= 80
            ? '우수'
            : analysisData.overallScore >= 60
            ? '양호'
            : analysisData.overallScore >= 40
            ? '보통'
            : '개선필요'}
        </div>
        {/* 5가지 점수 미니 바 */}
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {categories.map(key => {
            const cat = analysisData[key];
            return (
              <div key={key} className="text-center">
                <div className={`text-sm font-semibold tabular-nums ${getScoreColorClass(cat.score)}`}>
                  {cat.score}
                </div>
                <div className="h-1 rounded-full bg-muted mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cat.score >= 80
                        ? 'bg-green-500'
                        : cat.score >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 leading-tight">
                  {ANALYSIS_CATEGORY_LABELS[key].split('').slice(0, 2).join('')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 종합 평가 */}
      {analysisData.summary && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">종합 평가</h3>
          <p className="text-sm leading-relaxed">{analysisData.summary}</p>
        </div>
      )}

      {/* 5가지 관점 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(key => {
          const cat = analysisData[key];
          const label = ANALYSIS_CATEGORY_LABELS[key];

          return (
            <div
              key={key}
              className={`rounded-xl border p-5 ${getScoreBgClass(cat.score)}`}
            >
              {/* 카드 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{label}</h3>
                <span className={`text-xl font-bold tabular-nums ${getScoreColorClass(cat.score)}`}>
                  {cat.score}
                </span>
              </div>

              {/* 점수 바 */}
              <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    cat.score >= 80
                      ? 'bg-green-500'
                      : cat.score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>

              {/* 피드백 */}
              <p className="text-xs leading-relaxed text-foreground/80 mb-3">{cat.feedback}</p>

              {/* 개선 제안 */}
              {cat.suggestions && cat.suggestions.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1.5 text-foreground/60">개선 제안</p>
                  <ul className="space-y-1">
                    {cat.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs flex gap-1.5">
                        <span className="text-foreground/40 flex-shrink-0">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
