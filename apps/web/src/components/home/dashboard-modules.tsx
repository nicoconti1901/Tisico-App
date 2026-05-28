'use client';

import { ModulePortalCard } from '@/components/home/module-portal-card';
import { ClipboardCheck, ShieldAlert, Sparkles } from 'lucide-react';

const modules = [
  {
    title: 'Seguridad',
    tagline: 'Gestión de riesgos',
    description:
      'Registrá y da seguimiento a hallazgos: no conformidades, observaciones, accidentes y acciones correctivas.',
    href: '/dashboard/seguridad',
    icon: ShieldAlert,
    variant: 'security' as const,
    features: ['Hallazgos', 'NC & Observaciones', 'Seguimiento', 'Acciones'],
  },
  {
    title: 'Calidad',
    tagline: 'Mantenimiento planificado',
    description:
      'Consultá la planificación mensual de trabajos y registrá el retorno diario de tareas completadas.',
    href: '/dashboard/calidad',
    icon: ClipboardCheck,
    variant: 'quality' as const,
    features: ['Plan mensual', 'Retorno diario', 'Equipos', 'Avance'],
  },
];

type DashboardModulesProps = {
  userName: string;
  roleLabel: string;
};

export function DashboardModules({ userName, roleLabel }: DashboardModulesProps) {
  return (
    <div className="relative -mx-2 min-h-[calc(100vh-8rem)] px-2 md:-mx-4 md:px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -left-32 top-0 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 size-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 size-64 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-10 pb-8 pt-2">
        <header className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <Sparkles className="size-3.5 text-primary" />
            Centro de operaciones SHE
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Hola, {userName}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Elegí un módulo para comenzar —{' '}
              <span className="font-medium text-foreground">{roleLabel}</span>
            </p>
          </div>
        </header>

        <section
          aria-label="Módulos de la plataforma"
          className="grid gap-6 lg:grid-cols-2 lg:gap-8"
        >
          {modules.map((module, index) => (
            <ModulePortalCard key={module.title} {...module} index={index} />
          ))}
        </section>
      </div>
    </div>
  );
}
