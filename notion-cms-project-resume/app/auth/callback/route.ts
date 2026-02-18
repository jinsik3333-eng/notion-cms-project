import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * OAuth 콜백 처리 라우트
 * - Google 로그인 후 Supabase가 이 URL로 리다이렉트
 * - authorization_code를 세션으로 교환
 * - 성공: /protected/profile?provider=google 로 이동
 * - 실패: /auth/login?error=oauth_failed 로 이동
 * - 이미 로그인된 사용자: /protected 로 이동
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get('code');
  const provider = searchParams.get('provider');
  // Supabase가 에러 발생 시 error 파라미터로 전달
  const oauthError = searchParams.get('error');

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

  // 이미 로그인된 사용자 확인
  const {
    data: { user: existingUser },
  } = await supabase.auth.getUser();
  if (existingUser) {
    return NextResponse.redirect(`${origin}/protected`);
  }

  // authorization_code → 세션 교환
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error('코드 교환 실패:', exchangeError.message);
    return NextResponse.redirect(
      `${origin}/auth/login?error=oauth_failed&message=${encodeURIComponent(exchangeError.message)}`
    );
  }

  // 성공: Google 로그인이면 프로필 페이지로, 일반이면 protected 홈으로
  if (provider === 'google') {
    return NextResponse.redirect(`${origin}/protected/profile?provider=google`);
  }

  return NextResponse.redirect(`${origin}/protected`);
}
