'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ResumeWithAnalysis,
  AnalysisData,
  getScoreColorClass,
  ANALYSIS_CATEGORY_LABELS,
} from '@/lib/types/resume';
import { Loader2 } from 'lucide-react';

/**
 * 비교 페이지 콘텐츠 (클라이언트 컴포넌트)
 * - useSearchParams()로 ids 파라미터 읽기
 * - API를 통해 각 자소서 데이터 조회
 * - 반드시 Suspense 내에서 사용해야 함 (useSearchParams 제약)
 */
export function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids') ?? '';
  const resumeIds = ids
    .split(',')
    .map(id => id.trim())
    .filter(Boolean)
    .slice(0, 3);

  const [resumes, setResumes] = useState<ResumeWithAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resumeIds.length < 2) {
      setError('비교할 자소서를 2개 이상 선택해주세요');
      setIsLoading(false);
      return;
    }

    // 각 자소서 상세 조회
    const fetchResumes = async () => {
      try {
        const results = await Promise.all(
          resumeIds.map(id =>
            fetch(`/api/dashboard/resumes/${id}`).then(res => {
              if (!res.ok) throw new Error(`${id} 조회 실패`);
              return res.json() as Promise<ResumeWithAnalysis>;
            })
          )
        );
        setResumes(results);
      } catch {
        setError('자소서를 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  const categories = [
    'logicStructure',
    'jobSuitability',
    'differentiation',
    'writingQuality',
    'interviewerPerspective',
  ] as const;

  const getAnalysis = (resume: ResumeWithAnalysis): AnalysisData | null => {
    const ar = resume.analysis_results;
    if (!ar) return null;
    return ar.analysis_data as AnalysisData;
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{error}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/dashboard">대시보드로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  if (resumes.length < 2) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>비교할 자소서를 찾을 수 없습니다</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/dashboard">대시보드로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">{resumes.length}개 자소서 비교</p>

      {/* 비교 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground w-32">
                항목
              </th>
              {resumes.map(resume => (
                <th key={resume.id} className="p-3 text-left">
                  <Link
                    href={`/dashboard/resumes/${resume.id}`}
                    className="text-sm font-semibold hover:text-primary transition-colors line-clamp-1"
                  >
                    {resume.title || resume.original_text.slice(0, 20) + '...'}
                  </Link>
                  <p className="text-xs text-muted-foreground font-normal mt-0.5">
                    {new Date(resume.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 종합 점수 행 */}
            <tr className="border-t bg-muted/30">
              <td className="p-3 text-sm font-semibold">종합 점수</td>
              {resumes.map(resume => {
                const analysis = getAnalysis(resume);
                const score = analysis?.overallScore ?? null;
                return (
                  <td key={resume.id} className="p-3">
                    {score !== null ? (
                      <span
                        className={`text-2xl font-bold tabular-nums ${getScoreColorClass(score)}`}
                      >
                        {score}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 5가지 관점 행 */}
            {categories.map((key, idx) => (
              <tr key={key} className={`border-t ${idx % 2 === 1 ? 'bg-muted/10' : ''}`}>
                <td className="p-3 text-sm font-medium">{ANALYSIS_CATEGORY_LABELS[key]}</td>
                {resumes.map(resume => {
                  const analysis = getAnalysis(resume);
                  const cat = analysis?.[key];
                  return (
                    <td key={resume.id} className="p-3 align-top">
                      {cat ? (
                        <div>
                          <span
                            className={`text-lg font-bold tabular-nums ${getScoreColorClass(cat.score)}`}
                          >
                            {cat.score}
                          </span>
                          {/* 점수 바 */}
                          <div className="h-1 rounded-full bg-muted mt-1 mb-2 overflow-hidden w-24">
                            <div
                              className={`h-full rounded-full ${
                                cat.score >= 80
                                  ? 'bg-green-500'
                                  : cat.score >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${cat.score}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {cat.feedback}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 대시보드 다른 항목 선택 안내 */}
      <div className="mt-8 p-4 border rounded-lg text-sm text-center text-muted-foreground">
        다른 분석 결과와 비교하려면{' '}
        <Link href="/dashboard" className="text-primary hover:underline">
          대시보드
        </Link>
        에서 항목을 선택하세요.
      </div>
    </>
  );
}
