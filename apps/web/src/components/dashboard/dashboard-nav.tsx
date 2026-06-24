'use client';

import { Button } from '@/components/ui/button';
import { COMPANY_PLATFORM_NAME, ROLE_LABELS, type User } from '@/lib/auth-types';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type DashboardNavProps = {
  user: User;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/dashboard';

  const links = [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/dashboard/seguridad', label: 'Seguridad' },
    { href: '/dashboard/calidad', label: 'Calidad' },
  ];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Brand strip */}
      <div className="h-1 bg-linear-to-r from-blue-950 via-blue-600 to-blue-400" />

      <div
        className={cn(
          'border-b shadow-[0_4px_24px_-8px_rgba(0,30,80,0.12)]',
          isHome
            ? 'border-white/10 bg-slate-950/40 backdrop-blur-xl'
            : 'border-slate-200/90 bg-white',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
          <Link
            href="/dashboard"
            className="group flex min-w-0 items-center gap-4"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-linear-to-br from-blue-600/30 to-blue-900/10 opacity-0 blur transition-opacity group-hover:opacity-100" />
              <div className="relative flex size-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-950/5">
                <Image
                  src="/logoTisico.jpg"
                  alt="Tisico"
                  width={44}
                  height={44}
                  className="size-10 object-contain p-0.5"
                />
              </div>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.28em] text-blue-600">
                Tisico
              </p>
              <p
                className={cn(
                  'truncate text-base font-bold tracking-tight',
                  isHome ? 'text-white' : 'text-slate-950',
                )}
              >
                {COMPANY_PLATFORM_NAME}
              </p>
            </div>
          </Link>

          <nav
            className={cn(
              'hidden items-center rounded-full border p-1 md:flex',
              isHome
                ? 'border-white/15 bg-slate-950/50'
                : 'border-slate-200 bg-slate-50/80',
            )}
          >
            {links.map((link) => {
              const isActive =
                link.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300',
                    isActive
                      ? 'bg-slate-950 text-white shadow-md shadow-slate-900/20'
                      : isHome
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-600 hover:text-slate-950',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                'hidden items-center gap-3 rounded-full border pl-1.5 pr-4 py-1.5 sm:flex',
                isHome
                  ? 'border-white/15 bg-slate-950/50'
                  : 'border-slate-200 bg-slate-50',
              )}
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-blue-700 to-blue-950 text-xs font-bold text-white shadow-inner">
                {getInitials(user.name)}
              </div>
              <div className="text-left leading-tight">
                <p
                  className={cn(
                    'max-w-[140px] truncate text-sm font-bold',
                    isHome ? 'text-white' : 'text-slate-950',
                  )}
                >
                  {user.name}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                  {ROLE_LABELS[user.role]}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className={cn(
                'h-9 gap-1.5 px-3 font-semibold shadow-sm hover:border-blue-700 hover:bg-blue-700 hover:text-white',
                isHome
                  ? 'border-white/20 bg-slate-950/60 text-slate-200'
                  : 'border-slate-300 bg-white text-slate-700',
              )}
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
