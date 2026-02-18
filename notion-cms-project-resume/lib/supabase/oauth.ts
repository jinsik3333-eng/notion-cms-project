import { createClient } from '@/lib/supabase/client';

/**
 * Google OAuth 로그인
 * - Supabase Auth signInWithOAuth 사용
 * - 성공 시 /auth/callback 경유 → /protected 리다이렉트
 * - Google 계정의 이름(name), 이메일, 프로필 이미지를 자동으로 profiles 테이블에 저장
 */
export async function signInWithGoogle(): Promise<{ error: Error | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // 콜백 URL: Supabase가 authorization_code를 교환하는 경로
      redirectTo: `${window.location.origin}/auth/callback`,
      // Google 계정 선택 화면 항상 표시 (다중 계정 환경 대응)
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    return { error: new Error(error.message) };
  }

  // signInWithOAuth는 브라우저를 Google로 리다이렉트하므로
  // 이 코드 이후는 실행되지 않음 (Google 로그인 완료 후 /auth/callback으로 돌아옴)
  return { error: null };
}

/**
 * GitHub OAuth 로그인
 * - Supabase Auth signInWithOAuth 사용
 * - 성공 시 /auth/callback 경유 → /protected 리다이렉트
 * - GitHub 계정의 이름, 이메일, 프로필 이미지를 자동으로 profiles 테이블에 저장
 *
 * Supabase 대시보드 설정 필요:
 * Authentication > Providers > GitHub 활성화
 * GitHub OAuth App에서 Client ID, Client Secret 발급 후 입력
 */
export async function signInWithGitHub(): Promise<{ error: Error | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      // 콜백 URL: Supabase가 authorization_code를 교환하는 경로
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: new Error(error.message) };
  }

  // signInWithOAuth는 브라우저를 GitHub로 리다이렉트하므로
  // 이 코드 이후는 실행되지 않음
  return { error: null };
}
