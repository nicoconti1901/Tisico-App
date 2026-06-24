import { CalidadShell, calidadTrail } from '@/components/calidad/calidad-shell';
import { Button } from '@/components/ui/button';
import { FileCheck } from 'lucide-react';
import Link from 'next/link';

export default function CilpPage() {
  return (
    <CalidadShell
      title="CILP"
      description="Certificado de Instalación y Línea de Protección — sección en preparación."
      trail={calidadTrail(
        { href: '/dashboard/calidad/seguimiento', label: 'Seguimiento' },
        {
          href: '/dashboard/calidad/seguimiento/incendios',
          label: 'Sistemas contra incendios',
        },
        { label: 'CILP' },
      )}
    >
      <div className="mx-auto max-w-lg space-y-6 rounded-2xl border border-sky-200/60 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600">
          <FileCheck className="size-7" />
        </div>
        <p className="text-muted-foreground">
          El flujo operativo de CILP se implementará en el siguiente paso según
          tus indicaciones.
        </p>
        <Link href="/dashboard/calidad/seguimiento/incendios">
          <Button variant="outline">Volver a incendios</Button>
        </Link>
      </div>
    </CalidadShell>
  );
}
