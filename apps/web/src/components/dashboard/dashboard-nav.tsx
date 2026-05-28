'use client';

import { Button } from '@/components/ui/button';
import { ROLE_LABELS, type User } from '@/lib/auth-types';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type DashboardNavProps = {
  user: User;
};

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: '/dashboard', label: 'Inicio' },
    ...(user.role === 'ADMIN'
      ? [{ href: '/dashboard/users', label: 'Usuarios' }]
      : []),
  ];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Tisico
            </p>
            <p className="text-sm font-medium">Dashboard</p>
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname === link.href
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
