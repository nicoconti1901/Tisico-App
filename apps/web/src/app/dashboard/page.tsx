import { DashboardHomeShell } from '@/components/home/dashboard-home-shell';
import { DashboardModules } from '@/components/home/dashboard-modules';
import { ROLE_LABELS } from '@/lib/auth-types';
import { getSession } from '@/lib/session';

export default async function DashboardHomePage() {
  const user = await getSession();

  return (
    <DashboardHomeShell>
      <DashboardModules
        accessLabel={user ? ROLE_LABELS[user.role] : 'Gestión integral'}
      />
    </DashboardHomeShell>
  );
}
