import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * OAuth 콜백 처리 라우트
 *
 * 역할:
 * - Google/GitHub OAuth 완료 후 Supabase가 이 URL로 리다이렉트
 * - authorization_code를 Supabase 세션으로 교환
 * - 신규 OAuth 사용자: 프로필 설정 페이지로 이동
 * - 기존 OAuth 사용자: 보호된 홈으로 이동
 * - 에러 발생 시: 로그인 페이지로 리다이렉트
 *
 * Supabase 대시보드 설정:
 * Authentication > URL Configuration > Redirect URLs에 등록 필요
 * - http://localhost:3000/auth/callback (개발)
 * - https://your-domain.com/auth/callback (프로덕션)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get('code');
  // Supabase가 에러 발생 시 error 파라미터로 전달
  const oauthError = searchParams.get('error');
  // 로그인 후 돌아갈 페이지 (미들웨어에서 next 파라미터 전달 시 사용)
  const next = searchParams.get('next') ?? '/protected';

  // OAuth 에러 파라미터가 있으면 로그인 페이지로 리다이렉트
  if (oauthError) {
    console.error('OAuth 에러 발생:', oauthError, searchParams.get('error_description'));
    return NextResponse.redirect(
      `${origin}/auth/login?error=oauth_failed&message=${encodeURIComponent(oauthError)}`
    );
  }

  if (!code) {
    // code가 없으면 잘못된 접근
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
  }

  const supabase = await createClient();

  // authorization_code → 세션 교환
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error('코드 교환 실패:', exchangeError.message);
    return NextResponse.redirect(
      `${origin}/auth/login?error=oauth_failed&message=${encodeURIComponent(exchangeError.message)}`
    );
  }

  // 교환 성공 후 사용자 정보 조회
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
  }

  // profiles 테이블에서 full_name이 비어있는지 확인
  // 비어있으면 신규 OAuth 사용자 → 프로필 완성 페이지로 이동
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, created_at')
    .eq('id', user.id)
    .single();

  // 신규 사용자 판단:
  // - 프로필의 full_name이 없거나
  // - 프로필 생성 후 30초 이내 (방금 가입한 사용자)
  const isNewUser =
    !profile?.full_name ||
    (profile?.created_at &&
      Date.now() - new Date(profile.created_at).getTime() < 30_000);

  if (isNewUser) {
    // 신규 OAuth 사용자: 프로필 완성 페이지로 이동
    return NextResponse.redirect(`${origin}/protected/profile?welcome=true`);
  }

  // 기존 사용자: 원래 가려던 페이지 또는 보호된 홈으로 이동
  return NextResponse.redirect(`${origin}${next}`);
}
