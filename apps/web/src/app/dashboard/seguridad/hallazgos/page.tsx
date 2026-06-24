import { FindingsList } from '@/components/findings/findings-list';
import { SeguridadShell } from '@/components/seguridad/seguridad-shell';
import type { Finding } from '@/lib/findings-types';
import { fetchWithAuth } from '@/lib/session';

export default async function HallazgosPage() {
  const findings = await fetchWithAuth<Finding[]>('/findings');

  return (
    <SeguridadShell
      title="Hallazgos"
      description="Registro, asignación y seguimiento de observaciones, NC, incidentes y mejoras."
    >
      <FindingsList findings={findings} />
    </SeguridadShell>
  );
}
