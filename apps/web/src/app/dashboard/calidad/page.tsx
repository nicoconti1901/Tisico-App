import {
  CalidadFutureCard,
  CalidadSectionCard,
} from '@/components/calidad/calidad-section-card';
import { CalidadShell, calidadTrail } from '@/components/calidad/calidad-shell';
import { ClipboardCheck, HardHat, Layers } from 'lucide-react';

const sections = [
  {
    title: 'Seguimiento de obras / servicios',
    description:
      'Control y registro de trabajos en obra, servicios contratados y mantenimientos especializados.',
    href: '/dashboard/calidad/seguimiento',
    icon: HardHat,
    available: true,
  },
];

export default function CalidadPage() {
  return (
    <CalidadShell
      title="Módulo Calidad"
      description="Planificación, seguimiento de obras y control de mantenimientos de calidad."
      trail={calidadTrail({ label: 'Módulo Calidad' })}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <CalidadSectionCard key={section.href} {...section} />
        ))}

        <CalidadFutureCard
          icon={Layers}
          title="Próximas secciones"
          description="Plan mensual, retorno diario y otras áreas de calidad se incorporarán en pasos siguientes."
        />

        <CalidadFutureCard
          icon={ClipboardCheck}
          title="Indicadores y reportes"
          description="Tableros de avance y métricas del módulo — en desarrollo."
        />
      </div>
    </CalidadShell>
  );
}
