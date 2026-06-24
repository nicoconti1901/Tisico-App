import {
  CalidadSectionCard,
} from '@/components/calidad/calidad-section-card';
import { CalidadShell, calidadTrail } from '@/components/calidad/calidad-shell';
import { FileCheck, Shield } from 'lucide-react';

const BASE = '/dashboard/calidad/seguimiento/incendios';

const alternatives = [
  {
    title: 'CILP',
    description:
      'Certificado de Instalación y Línea de Protección — registro y seguimiento de mantenimiento CILP.',
    href: `${BASE}/cilp`,
    icon: FileCheck,
    available: true,
  },
  {
    title: 'CIE',
    description:
      'Certificado de Instalación y Equipamiento — registro y seguimiento de mantenimiento CIE.',
    href: `${BASE}/cie`,
    icon: Shield,
    available: true,
  },
];

export default function IncendiosPage() {
  return (
    <CalidadShell
      title="Mantenimiento de sistemas contra incendios"
      description="Elegí el tipo de certificación o línea de trabajo para continuar."
      trail={calidadTrail(
        { href: '/dashboard/calidad/seguimiento', label: 'Seguimiento' },
        { label: 'Sistemas contra incendios' },
      )}
    >
      <div className="mb-6 rounded-xl border border-sky-200/60 bg-sky-50/50 px-5 py-4 text-sm text-sky-900">
        <p className="font-semibold">Dos alternativas de ingreso</p>
        <p className="mt-1 text-sky-800/80">
          CILP y CIE son flujos independientes dentro del mismo mantenimiento.
          El contenido operativo se definirá en el próximo paso.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {alternatives.map((alt) => (
          <CalidadSectionCard key={alt.href} {...alt} />
        ))}
      </div>
    </CalidadShell>
  );
}
