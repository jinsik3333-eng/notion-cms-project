import { LoginForm } from '@/components/login-form';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* LoginForm에서 useSearchParams를 사용하므로 Suspense 필요 */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
