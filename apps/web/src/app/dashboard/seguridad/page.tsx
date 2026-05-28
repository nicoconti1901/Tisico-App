import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function SeguridadPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
        <ShieldAlert className="size-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Seguridad</h1>
        <p className="text-muted-foreground">
          El módulo de hallazgos y seguimiento se implementará en el próximo
          paso del proyecto.
        </p>
      </div>
      <Link href="/dashboard">
        <Button variant="outline">
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
}
