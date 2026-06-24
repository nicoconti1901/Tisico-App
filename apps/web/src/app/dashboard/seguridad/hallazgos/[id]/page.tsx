import { FindingDetailPanel } from '@/components/findings/finding-detail-panel';
import { SeguridadShell } from '@/components/seguridad/seguridad-shell';
import type { AssignableUser, Finding } from '@/lib/findings-types';
import { fetchWithAuth } from '@/lib/session';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HallazgoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [finding, users] = await Promise.all([
    fetchWithAuth<Finding>(`/findings/${id}`),
    fetchWithAuth<AssignableUser[]>('/findings/assignable-users'),
  ]);

  return (
    <SeguridadShell
      title={finding.code}
      description={finding.title}
      backHref="/dashboard/seguridad/hallazgos"
      backLabel="Hallazgos"
    >
      <FindingDetailPanel initialFinding={finding} users={users} />
    </SeguridadShell>
  );
}
