import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b bg-card/50 px-6 py-4">
        <Link href="/" className="text-sm font-semibold text-primary">
          ← Tisico
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Suspense fallback={<div className="text-muted-foreground">Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
