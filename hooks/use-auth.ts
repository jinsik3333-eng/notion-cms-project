'use client';

import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * 클라이언트 컴포넌트에서 인증 상태를 구독하는 훅
 *
 * 사용 예시:
 * const { user, isLoading, isAuthenticated } = useAuth();
 * if (!isAuthenticated) return <LoginPrompt />;
 *
 * 주의: 보호된 라우트에서는 미들웨어가 이미 인증을 확인하므로
 * 이 훅은 UI 조건부 렌더링용으로만 사용.
 * 보안 검증은 서버 컴포넌트에서 supabase.auth.getUser()를 사용할 것.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 초기 세션 조회
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // 세션 변경 실시간 구독 (로그인/로그아웃 이벤트)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
