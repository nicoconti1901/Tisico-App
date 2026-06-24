'use client';

import { FindingStatusBadge } from '@/components/findings/finding-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FINDING_PRIORITY_LABELS,
  FINDING_TYPE_LABELS,
  type Finding,
} from '@/lib/findings-types';
import { Plus } from 'lucide-react';
import Link from 'next/link';

type FindingsListProps = {
  findings: Finding[];
};

export function FindingsList({ findings }: FindingsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/dashboard/seguridad/hallazgos/nuevo">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="size-4" />
            Nuevo hallazgo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de hallazgos</CardTitle>
        </CardHeader>
        <CardContent>
          {findings.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No hay hallazgos registrados. Creá el primero para comenzar.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Código</th>
                    <th className="pb-3 pr-4 font-medium">Tipo</th>
                    <th className="pb-3 pr-4 font-medium">Título</th>
                    <th className="pb-3 pr-4 font-medium">Estado</th>
                    <th className="pb-3 pr-4 font-medium">Prioridad</th>
                    <th className="pb-3 pr-4 font-medium">Responsable</th>
                    <th className="pb-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {findings.map((f) => (
                    <tr key={f.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs font-bold">
                        {f.code}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline">
                          {FINDING_TYPE_LABELS[f.type]}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 max-w-xs truncate font-medium">
                        {f.title}
                      </td>
                      <td className="py-3 pr-4">
                        <FindingStatusBadge status={f.status} />
                      </td>
                      <td className="py-3 pr-4">
                        {FINDING_PRIORITY_LABELS[f.priority]}
                      </td>
                      <td className="py-3 pr-4">{f.assignee.name}</td>
                      <td className="py-3 text-right">
                        <Link href={`/dashboard/seguridad/hallazgos/${f.id}`}>
                          <Button size="sm" variant="outline">
                            Ver
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
