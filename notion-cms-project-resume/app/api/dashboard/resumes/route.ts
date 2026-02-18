import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/dashboard/resumes
 * 로그인 사용자의 자소서 히스토리 조회 (분석 결과 포함)
 *
 * 쿼리 파라미터:
 * - sort: 'latest' | 'oldest' | 'score_high' | 'score_low' (기본: latest)
 * - bookmarked: 'true' | 'false' (즐겨찾기 필터)
 * - limit: 숫자 (기본: 20, 최대: 50)
 * - offset: 숫자 (기본: 0, 페이지네이션)
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') ?? 'latest';
  const bookmarked = searchParams.get('bookmarked');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
  const offset = parseInt(searchParams.get('offset') ?? '0');

  // 기본 쿼리: analysis_results JOIN 포함
  let query = supabase
    .from('resumes')
    .select(
      `
      id,
      user_id,
      original_text,
      title,
      is_bookmarked,
      share_token,
      is_share_public,
      share_expires_at,
      share_view_count,
      last_shared_at,
      created_at,
      updated_at,
      analysis_results (
        id,
        overall_score,
        logic_structure_score,
        job_suitability_score,
        differentiation_score,
        writing_quality_score,
        interviewer_perspective_score,
        analyzed_at
      )
    `,
      { count: 'exact' }
    )
    .eq('user_id', user.id);

  // 즐겨찾기 필터
  if (bookmarked === 'true') {
    query = query.eq('is_bookmarked', true);
  }

  // 정렬
  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'score_high':
      // analysis_results.overall_score 기준 내림차순 (Supabase 중첩 정렬)
      query = query.order('created_at', { ascending: false }); // fallback
      break;
    case 'score_low':
      query = query.order('created_at', { ascending: false }); // fallback
      break;
    default: // 'latest'
      query = query.order('created_at', { ascending: false });
  }

  // 페이지네이션
  query = query.range(offset, offset + limit - 1);

  const { data: resumes, count, error } = await query;

  if (error) {
    console.error('히스토리 조회 오류:', error);
    return NextResponse.json({ error: '히스토리를 불러오는데 실패했습니다' }, { status: 500 });
  }

  // 점수 기반 정렬 (클라이언트 측 정렬 - DB 중첩 정렬 한계 보완)
  // Supabase JOIN 결과가 단일 객체 또는 배열 양쪽으로 올 수 있어 타입 추론이 never가 될 수 있음
  type AnyResume = (typeof resumes)[number] & {
    analysis_results: { overall_score?: number } | { overall_score?: number }[] | null;
  };

  const getScore = (item: AnyResume): number => {
    const ar = item.analysis_results;
    if (!ar) return 0;
    if (Array.isArray(ar)) return ar[0]?.overall_score ?? 0;
    return (ar as { overall_score?: number }).overall_score ?? 0;
  };

  let sortedResumes = (resumes ?? []) as AnyResume[];
  if (sort === 'score_high') {
    sortedResumes = sortedResumes.sort((a, b) => getScore(b) - getScore(a));
  } else if (sort === 'score_low') {
    sortedResumes = sortedResumes.sort((a, b) => getScore(a) - getScore(b));
  }

  return NextResponse.json({ resumes: sortedResumes, total: count ?? 0 });
}
