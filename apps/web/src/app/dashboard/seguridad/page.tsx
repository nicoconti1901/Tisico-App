import { SeguridadShell } from '@/components/seguridad/seguridad-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ClipboardList, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    title: 'Hallazgos',
    description:
      'Registro de observaciones, no conformidades, incidentes y oportunidades de mejora con asignación, plazos y seguimiento.',
    href: '/dashboard/seguridad/hallazgos',
    icon: ClipboardList,
    available: true,
  },
];

export default function SeguridadPage() {
  return (
    <SeguridadShell
      title="Módulo Seguridad"
      description="Gestión de riesgos, hallazgos y seguimiento de acciones en seguridad e higiene."
      backHref="/dashboard"
      backLabel="Inicio"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.href}
              className="border-amber-200/50 transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {section.available ? (
                  <Link href={section.href}>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Ingresar
                    </Button>
                  </Link>
                ) : (
                  <Button disabled>Próximamente</Button>
                )}
              </CardContent>
            </Card>
          );
        })}

        <Card className="border-dashed bg-slate-50/50">
          <CardHeader>
            <div className="flex items-center gap-3 text-muted-foreground">
              <ShieldAlert className="size-6" />
              <CardTitle className="text-base">Próximas secciones</CardTitle>
            </div>
            <CardDescription>
              Indicadores, auditorías y reportes se incorporarán en pasos
              siguientes del módulo.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </SeguridadShell>
  );
}
