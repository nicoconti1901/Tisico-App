import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/session';
import { ArrowRight, Shield, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 size-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-32 bottom-10 size-80 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b bg-card/50 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Tisico
            </p>
            <h1 className="text-xl font-bold">Plataforma SHE</h1>
          </div>
          <Link href="/login">
            <Button>Ingresar</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-16">
        <section className="max-w-2xl space-y-6">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Automatizá la gestión de Seguridad y Calidad
          </h2>
          <p className="text-lg text-muted-foreground">
            Plataforma interna para tu empresa. Accedé con tu cuenta para
            ingresar a los módulos operativos.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Acceder a la plataforma
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card/60 p-6 backdrop-blur-sm">
            <Shield className="size-8 text-orange-500" />
            <h3 className="mt-4 font-semibold">Seguridad</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Hallazgos, no conformidades y seguimiento de acciones.
            </p>
          </div>
          <div className="rounded-2xl border bg-card/60 p-6 backdrop-blur-sm">
            <ClipboardList className="size-8 text-sky-500" />
            <h3 className="mt-4 font-semibold">Calidad</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Planificación de mantenimientos y retorno diario.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
