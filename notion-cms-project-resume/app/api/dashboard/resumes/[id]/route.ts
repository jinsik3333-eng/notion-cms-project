import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { UpdateResumeRequest } from '@/lib/types/resume';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/dashboard/resumes/[id]
 * 특정 자소서 상세 조회 (분석 결과 전체 포함)
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
  }

  const { data: resume, error } = await supabase
    .from('resumes')
    .select(
      `
      *,
      analysis_results (*)
    `
    )
    .eq('id', id)
    .eq('user_id', user.id) // RLS 외에 소유권 이중 검증
    .single();

  if (error || !resume) {
    return NextResponse.json({ error: '자소서를 찾을 수 없습니다' }, { status: 404 });
  }

  return NextResponse.json(resume);
}

/**
 * PATCH /api/dashboard/resumes/[id]
 * 자소서 메타데이터 수정 (제목, 북마크)
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
  }

  let body: UpdateResumeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다' }, { status: 400 });
  }

  // 허용 필드만 업데이트
  const updateData: Record<string, unknown> = {};
  if (typeof body.title === 'string') {
    updateData.title = body.title.slice(0, 200); // 최대 200자
  }
  if (typeof body.is_bookmarked === 'boolean') {
    updateData.is_bookmarked = body.is_bookmarked;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: '수정할 내용이 없습니다' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('resumes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: '수정에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/dashboard/resumes/[id]
 * 자소서 삭제 (CASCADE로 analysis_results도 함께 삭제)
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
  }

  // 소유권 먼저 확인
  const { data: resume, error: findError } = await supabase
    .from('resumes')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (findError || !resume) {
    return NextResponse.json({ error: '자소서를 찾을 수 없습니다' }, { status: 404 });
  }

  const { error } = await supabase.from('resumes').delete().eq('id', id).eq('user_id', user.id);

  if (error) {
    console.error('자소서 삭제 오류:', error);
    return NextResponse.json({ error: '삭제에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
