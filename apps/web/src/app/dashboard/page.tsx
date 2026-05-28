import { DashboardModules } from '@/components/home/dashboard-modules';
import { ROLE_LABELS } from '@/lib/auth-types';
import { getSession } from '@/lib/session';

export default async function DashboardHomePage() {
  const user = await getSession();
  const firstName = user?.name?.split(' ')[0] ?? 'equipo';

  return (
    <DashboardModules
      userName={firstName}
      roleLabel={user ? ROLE_LABELS[user.role] : ''}
    />
  );
}
