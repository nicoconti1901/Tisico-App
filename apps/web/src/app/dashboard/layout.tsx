import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-transparent">
      <DashboardNav user={session} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
