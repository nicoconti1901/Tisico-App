'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Layers, MousePointerClick } from 'lucide-react';
import Link from 'next/link';
import {
  moduleAccentIcons,
  moduleThemes,
  type ModuleTheme,
} from './module-themes';

export type ModulePortalCardProps = {
  title: string;
  tagline: string;
  description: string;
  href: string;
  features: string[];
  variant: keyof typeof moduleThemes;
  index: number;
};

function CardBackgroundIcons({ icons }: { icons: ModuleTheme['backgroundIcons'] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {icons.map(({ Icon, className }, i) => (
        <Icon
          key={i}
          className={cn(
            'absolute transition-transform duration-700 group-hover:scale-105',
            className,
          )}
        />
      ))}
    </div>
  );
}

export function ModulePortalCard({
  title,
  tagline,
  description,
  href,
  features,
  variant,
  index,
}: ModulePortalCardProps) {
  const theme = moduleThemes[variant];
  const AccentIcon = moduleAccentIcons[variant];
  const { accent } = theme;

  return (
    <Link
      href={href}
      aria-label={`Abrir módulo de ${title}`}
      className={cn(
        'group relative flex h-full min-h-[500px] cursor-pointer flex-col overflow-hidden rounded-3xl border bg-slate-950/70 md:min-h-[520px]',
        'border-white/15 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl',
        'transition-all duration-500 hover:-translate-y-2 hover:border-white/25 hover:shadow-[0_36px_70px_-16px_rgba(0,0,0,0.65)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4',
        accent.ring,
      )}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1 bg-linear-to-r',
          accent.topBar,
        )}
      />

      {/* Badge de acceso — siempre visible */}
      <div
        className={cn(
          'absolute right-6 top-6 z-20 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm',
          accent.badge,
        )}
      >
        <Layers className="size-3 shrink-0" aria-hidden />
        Acceso
      </div>

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(125,211,252,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.35) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className={cn(
          'absolute -left-16 bottom-0 size-72 rounded-full blur-3xl transition-all duration-700',
          accent.glow,
        )}
      />

      <CardBackgroundIcons icons={theme.backgroundIcons} />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/50 to-slate-950/30" />

      <div className="relative z-10 flex h-full flex-1 flex-col p-8 md:p-10">
        <div className="flex h-10 shrink-0 items-center gap-3 pr-24">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-lg border',
              accent.icon,
            )}
          >
            <AccentIcon className="size-5" />
          </div>
          <span className="font-mono text-xs font-bold tracking-widest text-slate-400">
            Módulo {index + 1} · {theme.code}
          </span>
        </div>

        <div className="flex flex-1 flex-col pt-8">
          <p
            className={cn(
              'h-4 shrink-0 text-[11px] font-bold uppercase tracking-[0.3em]',
              accent.tagline,
            )}
          >
            {tagline}
          </p>

          <h2 className="mt-3 min-h-10 shrink-0 text-4xl font-black leading-none tracking-tight text-white md:min-h-12 md:text-5xl">
            {title}
          </h2>

          <p className="mt-4 min-h-[4.75rem] max-w-sm shrink-0 text-base leading-relaxed text-slate-300 md:min-h-[5.25rem]">
            {description}
          </p>

          <ul className="mt-auto grid shrink-0 grid-cols-2 gap-2 pt-8">
            {features.map((f) => (
              <li
                key={f}
                className={cn(
                  'flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold backdrop-blur-sm',
                  accent.feature,
                )}
              >
                <span className={cn('size-1.5 shrink-0 rounded-full', accent.dot)} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA principal — barra tipo botón */}
        <div className="mt-8 shrink-0 space-y-3">
          <div
            className={cn(
              'flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 transition-all duration-500',
              accent.cta,
              accent.ctaHover,
            )}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <MousePointerClick
                className="size-4 shrink-0 opacity-80"
                aria-hidden
              />
              <span className="truncate text-sm font-bold">
                Abrir módulo de {theme.moduleName}
              </span>
            </span>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/95 text-slate-950 shadow-md transition-all duration-500 group-hover:translate-x-0.5 group-hover:bg-white">
              <ArrowRight className="size-5" strokeWidth={2.5} />
            </span>
          </div>
          <p className="text-center text-[11px] font-medium text-slate-500 transition-colors group-hover:text-slate-400">
            Entorno de trabajo independiente
          </p>
        </div>
      </div>
    </Link>
  );
}
