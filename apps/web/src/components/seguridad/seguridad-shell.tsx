import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type SeguridadShellProps = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function SeguridadShell({
  title,
  description,
  backHref = '/dashboard/seguridad',
  backLabel = 'Seguridad',
  actions,
  children,
}: SeguridadShellProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Inicio
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href={backHref}
              className="hover:text-foreground transition-colors"
            >
              {backLabel}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-foreground">{title}</span>
          </nav>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function SeguridadBackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900',
      )}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}
