import {
  CalidadFutureCard,
  CalidadSectionCard,
} from '@/components/calidad/calidad-section-card';
import { CalidadShell, calidadTrail } from '@/components/calidad/calidad-shell';
import { Flame, Wrench } from 'lucide-react';

const BASE = '/dashboard/calidad/seguimiento';

const sections = [
  {
    title: 'Mantenimiento de sistemas contra incendios',
    description:
      'Gestión de mantenimientos preventivos y correctivos de instalaciones contra incendio.',
    href: `${BASE}/incendios`,
    icon: Flame,
    available: true,
    badge: 'Activo',
  },
];

export default function SeguimientoPage() {
  return (
    <CalidadShell
      title="Seguimiento de obras / servicios"
      description="Accesos al seguimiento operativo de trabajos y servicios bajo control de calidad."
      trail={calidadTrail({ label: 'Seguimiento' })}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <CalidadSectionCard key={section.href} {...section} />
        ))}

        <CalidadFutureCard
          icon={Wrench}
          title="Otras líneas de seguimiento"
          description="Nuevas categorías de obra y servicio se habilitarán según avance del proyecto."
        />
      </div>
    </CalidadShell>
  );
}
