import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile-form';
import { Suspense } from 'react';

export const metadata = {
  title: '프로필 관리 | ResumeLens',
  description: '사용자 프로필 정보를 관리합니다',
};

/**
 * 인증된 사용자 정보를 가져와 ProfileForm에 전달하는 내부 컴포넌트
 * Suspense 경계 내에서 실행되어야 함 (동적 데이터 접근)
 */
async function ProfilePageContent() {
  const supabase = await createClient();

  // 현재 사용자 정보 조회
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">프로필 관리</h1>
          <p className="mt-2 text-gray-600">자신의 프로필 정보를 입력하고 관리하세요.</p>
        </div>

        <ProfileForm userId={user.id} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    // 인증 상태(캐시 불가 데이터) 조회를 Suspense 경계 내에서 실행
    <Suspense>
      <ProfilePageContent />
    </Suspense>
  );
}
