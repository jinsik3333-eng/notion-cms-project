import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { CreateShareRequest, UpdateShareRequest, calculateExpiresAt } from '@/lib/types/resume';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/resumes/[id]/share
 * 공유 링크 생성 (새 토큰 발급)
 */
export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
  }

  // 소유권 확인
  const { data: resume, error: findError } = await supabase
    .from('resumes')
    .select('id, user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (findError || !resume) {
    return NextResponse.json({ error: '자소서를 찾을 수 없습니다' }, { status: 404 });
  }

  let body: CreateShareRequest;
  try {
    body = await request.json();
  } catch {
    body = { expiresIn: 'month' }; // 기본값: 30일
  }

  // 공유 토큰 생성 (32자 랜덤 hex)
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const shareToken = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');

  // 만료 일시 계산
  const expiresAt = calculateExpiresAt(body.expiresIn ?? 'month');

  const { data: updated, error: updateError } = await supabase
    .from('resumes')
    .update({
      share_token: shareToken,
      is_share_public: true,
      share_expires_at: expiresAt?.toISOString() ?? null,
      last_shared_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('share_token, share_expires_at')
    .single();

  if (updateError || !updated) {
    console.error('공유 링크 생성 오류:', updateError);
    return NextResponse.json({ error: '공유 링크 생성에 실패했습니다' }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return NextResponse.json({
    shareLink: `${appUrl}/share/${updated.share_token}`,
    shareToken: updated.share_token,
    expiresAt: updated.share_expires_at,
  });
}

/**
 * PATCH /api/resumes/[id]/share
 * 공유 설정 업데이트 (공개 여부, 만료 기한)
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

  let body: UpdateShareRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};

  if (typeof body.is_share_public === 'boolean') {
    updateData.is_share_public = body.is_share_public;
  }

  if (body.expiresIn !== undefined) {
    const expiresAt = calculateExpiresAt(body.expiresIn);
    updateData.share_expires_at = expiresAt?.toISOString() ?? null;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: '수정할 내용이 없습니다' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('resumes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('share_token, is_share_public, share_expires_at')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: '공유 설정 업데이트에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/resumes/[id]/share
 * 공유 비활성화 (토큰 제거 + 공개 해제)
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

  const { error } = await supabase
    .from('resumes')
    .update({
      share_token: null,
      is_share_public: false,
      share_expires_at: null,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: '공유 해제에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
