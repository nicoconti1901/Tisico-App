'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

export type ModulePortalCardProps = {
  title: string;
  tagline: string;
  description: string;
  href: string;
  icon: LucideIcon;
  features: string[];
  variant: 'security' | 'quality';
  index: number;
};

export function ModulePortalCard({
  title,
  tagline,
  description,
  href,
  icon: Icon,
  features,
  variant,
  index,
}: ModulePortalCardProps) {
  const isSecurity = variant === 'security';

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-h-[420px] flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-500 md:min-h-[480px] md:p-10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isSecurity
          ? 'border-orange-500/20 bg-linear-to-br from-orange-950 via-zinc-950 to-zinc-900 text-white hover:border-orange-400/40 hover:shadow-[0_0_80px_-12px_rgba(251,146,60,0.45)]'
          : 'border-sky-500/20 bg-linear-to-br from-sky-950 via-zinc-950 to-indigo-950 text-white hover:border-sky-400/40 hover:shadow-[0_0_80px_-12px_rgba(56,189,248,0.45)]',
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Mesh / glow layers */}
      <div
        className={cn(
          'pointer-events-none absolute -right-16 -top-16 size-64 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125',
          isSecurity ? 'bg-orange-500/30' : 'bg-sky-500/30',
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110',
          isSecurity ? 'bg-red-600/20' : 'bg-indigo-500/25',
        )}
      />

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Watermark icon */}
      <Icon
        className={cn(
          'pointer-events-none absolute -bottom-6 -right-6 size-48 opacity-[0.07] transition-all duration-700 group-hover:scale-110 group-hover:opacity-[0.12] md:size-56',
        )}
        strokeWidth={1}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              'flex size-16 items-center justify-center rounded-2xl border backdrop-blur-sm transition-transform duration-500 group-hover:scale-105 md:size-20',
              isSecurity
                ? 'border-orange-400/30 bg-orange-500/20 text-orange-200'
                : 'border-sky-400/30 bg-sky-500/20 text-sky-200',
            )}
          >
            <Icon className="size-8 md:size-9" strokeWidth={1.5} />
          </div>
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm',
              isSecurity
                ? 'border-orange-400/30 bg-orange-500/10 text-orange-200'
                : 'border-sky-400/30 bg-sky-500/10 text-sky-200',
            )}
          >
            Módulo {index + 1}
          </span>
        </div>

        <div className="mt-10 flex flex-1 flex-col">
          <p
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.25em]',
              isSecurity ? 'text-orange-300/80' : 'text-sky-300/80',
            )}
          >
            {tagline}
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
            {description}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-sm font-medium text-white/50">
            Tocá para ingresar
          </span>
          <span
            className={cn(
              'flex size-12 items-center justify-center rounded-full border transition-all duration-500',
              'group-hover:translate-x-1 group-hover:-translate-y-1',
              isSecurity
                ? 'border-orange-400/40 bg-orange-500/20 text-orange-100 group-hover:bg-orange-500 group-hover:text-white'
                : 'border-sky-400/40 bg-sky-500/20 text-sky-100 group-hover:bg-sky-500 group-hover:text-white',
            )}
          >
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
