import { CieSupervisorPanel } from '@/components/cie/cie-supervisor-panel';
import { CalidadShell, calidadTrail } from '@/components/calidad/calidad-shell';
import type { CieMeta } from '@/lib/cie-types';
import { fetchWithAuth } from '@/lib/session';

export default async function CiePage() {
  const meta = await fetchWithAuth<CieMeta>('/cie/meta');

  return (
    <CalidadShell
      title="CIE — Seguimiento de servicios"
      description="Cronograma diario por grupo de trabajo, reprogramación y retorno de tareas."
      trail={calidadTrail(
        { href: '/dashboard/calidad/seguimiento', label: 'Seguimiento' },
        {
          href: '/dashboard/calidad/seguimiento/incendios',
          label: 'Sistemas contra incendios',
        },
        { label: 'CIE' },
      )}
    >
      <CieSupervisorPanel initialMeta={meta} />
    </CalidadShell>
  );
}
