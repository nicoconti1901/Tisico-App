import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type CalidadBreadcrumb = {
  href?: string;
  label: string;
};

type CalidadShellProps = {
  title: string;
  description?: string;
  trail: CalidadBreadcrumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function CalidadShell({
  title,
  description,
  trail,
  actions,
  children,
}: CalidadShellProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            {trail.map((item, index) => (
              <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? <ChevronRight className="size-3.5 shrink-0" /> : null}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

const CALIDAD_TRAIL_ROOT: CalidadBreadcrumb[] = [
  { href: '/dashboard', label: 'Inicio' },
  { href: '/dashboard/calidad', label: 'Calidad' },
];

export function calidadTrail(...segments: CalidadBreadcrumb[]): CalidadBreadcrumb[] {
  return [...CALIDAD_TRAIL_ROOT, ...segments];
}
