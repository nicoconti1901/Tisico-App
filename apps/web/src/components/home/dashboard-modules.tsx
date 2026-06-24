'use client';

import { ModulePortalCard } from '@/components/home/module-portal-card';
import {
  COMPANY_PLATFORM_NAME,
  COMPANY_TAGLINE,
} from '@/lib/auth-types';
import { MousePointerClick } from 'lucide-react';
import Image from 'next/image';

const modules = [
  {
    title: 'Seguridad',
    tagline: 'Gestión de riesgos',
    description:
      'Registrá y da seguimiento a hallazgos: no conformidades, observaciones, accidentes y acciones correctivas.',
    href: '/dashboard/seguridad',
    variant: 'security' as const,
    features: ['Hallazgos', 'NC & Observaciones', 'Seguimiento', 'Acciones'],
  },
  {
    title: 'Calidad',
    tagline: 'Mantenimiento planificado',
    description:
      'Consultá la planificación mensual de trabajos y registrá el retorno diario de tareas completadas.',
    href: '/dashboard/calidad',
    variant: 'quality' as const,
    features: ['Plan mensual', 'Retorno diario', 'Equipos', 'Avance'],
  },
];

type DashboardModulesProps = {
  accessLabel: string;
};

/** Superficie glass unificada sobre la foto de fondo */
const glassPanel =
  'rounded-3xl border border-white/15 bg-slate-950/55 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl';

export function DashboardModules({ accessLabel }: DashboardModulesProps) {
  const now = new Date();

  return (
    <div className="space-y-10 md:space-y-12">
      <header className={`relative overflow-hidden ${glassPanel}`}>
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-blue-500/10 to-transparent" />

        <div className="relative grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="absolute -inset-3 rounded-2xl bg-blue-500/20 blur-lg" />
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-2.5 shadow-lg">
                <Image
                  src="/logoTisico.jpg"
                  alt="Tisico"
                  width={128}
                  height={128}
                  className="size-28 object-contain md:size-32"
                  priority
                />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-sky-400">
                {COMPANY_PLATFORM_NAME}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl md:leading-[1.05]">
                Centro de{' '}
                <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                  operaciones
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                Seleccioná el módulo con el que vas a trabajar hoy. Gestioná{' '}
                {COMPANY_TAGLINE.toLowerCase()} desde un solo lugar.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div
              className={`w-full p-5 md:w-56 ${glassPanel} rounded-2xl border-white/10 bg-slate-900/50`}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Perfil de acceso
              </p>
              <p className="mt-2 text-xl font-black text-white">{accessLabel}</p>
            </div>
            <p className="text-right text-xs font-semibold capitalize text-slate-400">
              {now.toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </header>

      <div className={`${glassPanel} px-8 py-6 md:px-10`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 h-1 w-12 rounded-full bg-linear-to-r from-sky-400 to-blue-600" />
            <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              Accesos a módulos
            </h2>
            <p className="mt-1 max-w-lg text-slate-300">
              Dos entornos de trabajo. Elegí el área en la que vas a operar hoy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {modules.map((module, index) => (
              <span
                key={module.title}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-300"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-white/10 font-mono text-[10px] font-bold text-sky-300">
                  {index + 1}
                </span>
                {module.title}
              </span>
            ))}
            <span className="hidden items-center gap-1.5 text-xs font-medium text-sky-400/90 sm:inline-flex">
              <MousePointerClick className="size-3.5" aria-hidden />
              Clic en la tarjeta
            </span>
          </div>
        </div>
      </div>

      <section
        aria-label="Módulos de la plataforma"
        className="grid auto-rows-fr gap-7 lg:grid-cols-2 lg:gap-9"
      >
        {modules.map((module, index) => (
          <ModulePortalCard key={module.title} {...module} index={index} />
        ))}
      </section>

      <footer className="flex items-center justify-center gap-3 pt-2">
        <div className="h-px w-12 bg-linear-to-r from-transparent to-sky-500/60" />
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
          Tisico · {COMPANY_TAGLINE}
        </p>
        <div className="h-px w-12 bg-linear-to-l from-transparent to-sky-500/60" />
      </footer>
    </div>
  );
}
