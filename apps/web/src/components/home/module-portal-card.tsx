'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
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

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex h-full min-h-[500px] flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-950/70 md:min-h-[520px]',
        'shadow-[0_24px_60px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl',
        'transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_36px_70px_-16px_rgba(0,0,0,0.65)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-400 via-blue-500 to-blue-800" />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(125,211,252,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.35) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute -left-16 bottom-0 size-72 rounded-full bg-sky-500/15 blur-3xl transition-all duration-700 group-hover:bg-sky-400/25" />

      <CardBackgroundIcons icons={theme.backgroundIcons} />

      {/* Velo interno para legibilidad del texto */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/50 to-slate-950/30" />

      <div className="relative z-10 flex h-full flex-1 flex-col p-8 md:p-10">
        {/* Cabecera — altura fija */}
        <div className="flex h-10 shrink-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-500/10 text-sky-300">
            <AccentIcon className="size-5" />
          </div>
          <span className="font-mono text-xs font-bold tracking-widest text-sky-400/90">
            {theme.code} · 0{index + 1}
          </span>
        </div>

        {/* Cuerpo — áreas con altura mínima para alinear entre cards */}
        <div className="flex flex-1 flex-col pt-8">
          <p className="h-4 shrink-0 text-[11px] font-bold uppercase tracking-[0.3em] text-sky-400">
            {tagline}
          </p>

          <h2 className="mt-3 min-h-10 shrink-0 text-4xl font-black leading-none tracking-tight text-white md:min-h-12 md:text-5xl">
            {title}
          </h2>

          <p className="mt-4 min-h-[4.75rem] max-w-sm shrink-0 text-base leading-relaxed text-slate-300 md:min-h-[5.25rem]">
            {description}
          </p>

          {/* Items anclados al mismo nivel en ambas cards */}
          <ul className="mt-auto grid shrink-0 grid-cols-2 gap-2 pt-8">
            {features.map((f) => (
              <li
                key={f}
                className="flex min-h-10 items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-100/90 backdrop-blur-sm"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-sky-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer — altura fija */}
        <div className="mt-8 flex shrink-0 items-center justify-between border-t border-white/10 pt-6">
          <span className="text-sm font-bold text-slate-400 transition-colors group-hover:text-white">
            Ingresar al módulo
          </span>
          <span className="flex size-13 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg transition-all duration-500 group-hover:bg-sky-500 group-hover:text-white">
            <ArrowUpRight className="size-5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
