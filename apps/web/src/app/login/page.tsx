import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,rgba(37,99,235,0.14),transparent)]" />

      <header className="relative z-10 border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logoTisico.jpg"
            alt="Tisico"
            width={36}
            height={36}
            className="size-9 rounded-lg object-contain"
          />
          <span className="text-sm font-bold text-slate-950">Tisico</span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
            <Image
              src="/logoTisico.jpg"
              alt="Tisico"
              width={80}
              height={80}
              className="size-20 object-contain"
            />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
            Plataforma SHE
          </p>
        </div>
        <Suspense
          fallback={
            <div className="text-muted-foreground">Cargando...</div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
