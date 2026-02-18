import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { hasEnvVars } from '../utils';

/**
 * Supabase 세션 갱신 + 보호된 라우트 접근 제어
 *
 * Next.js 16 Fluid Compute에서는 proxy.ts를 사용합니다.
 * (middleware.ts 대신 - 두 파일이 동시에 존재하면 빌드 에러 발생)
 *
 * 역할:
 * 1. 모든 요청에서 Supabase 세션 토큰을 자동 갱신 (필수)
 * 2. /protected/* 접근 시 미인증 사용자를 로그인 페이지로 리다이렉트
 * 3. 이미 로그인한 사용자가 /auth/login, /auth/sign-up 접근 시 보호된 홈으로 리다이렉트
 *
 * 주의: createServerClient와 auth.getClaims() 사이에 코드를 추가하지 말 것.
 * 세션이 임의로 종료되는 버그 발생 가능.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip proxy check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { pathname } = request.nextUrl;

  // 보호된 라우트: 미인증 사용자를 로그인 페이지로 리다이렉트
  const isProtectedRoute =
    pathname.startsWith('/protected') || pathname.startsWith('/dashboard');

  if (isProtectedRoute) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/auth/login';
      // 로그인 후 원래 페이지로 돌아오기 위해 next 파라미터 추가
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 인증된 사용자가 로그인/회원가입 페이지 접근 시 보호된 홈으로 리다이렉트
  const authOnlyPaths = ['/auth/login', '/auth/sign-up'];
  if (authOnlyPaths.includes(pathname) && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/protected';
    return NextResponse.redirect(redirectUrl);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
