import { CreateFindingForm } from '@/components/findings/create-finding-form';
import { SeguridadShell } from '@/components/seguridad/seguridad-shell';
import type { AssignableUser } from '@/lib/findings-types';
import { fetchWithAuth, getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

type NotificationDefaults = {
  emails: string[];
};

export default async function NuevoHallazgoPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const [users, notificationDefaults] = await Promise.all([
    fetchWithAuth<AssignableUser[]>('/findings/assignable-users'),
    fetchWithAuth<NotificationDefaults>('/findings/notification-defaults'),
  ]);

  return (
    <SeguridadShell
      title="Nuevo hallazgo"
      description="Completá el formulario según el tipo. Al registrar se notificará por correo al responsable y a los destinatarios indicados."
      backHref="/dashboard/seguridad/hallazgos"
      backLabel="Hallazgos"
    >
      <CreateFindingForm
        reporterDefaults={{ name: '', email: '' }}
        users={users}
        defaultNotificationEmails={notificationDefaults.emails}
      />
    </SeguridadShell>
  );
}
