'use client';

import { FindingStatusBadge } from '@/components/findings/finding-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ACTION_STATUS_LABELS,
  ACTION_TYPE_LABELS,
  FINDING_PRIORITY_LABELS,
  FINDING_STATUS_LABELS,
  FINDING_TYPE_LABELS,
  FIVE_WHYS_DEFAULT_QUESTIONS,
  type AssignableUser,
  type Finding,
  type FindingStatus,
} from '@/lib/findings-types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Tab = 'datos' | 'acciones' | 'investigacion' | 'adjuntos' | 'observaciones' | 'historial';

type FindingDetailPanelProps = {
  initialFinding: Finding;
  users: AssignableUser[];
};

export function FindingDetailPanel({
  initialFinding,
  users,
}: FindingDetailPanelProps) {
  const router = useRouter();
  const [finding, setFinding] = useState(initialFinding);
  const [tab, setTab] = useState<Tab>('datos');
  const [note, setNote] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [newStatus, setNewStatus] = useState<FindingStatus>(finding.status);
  const [loading, setLoading] = useState(false);
  const [fiveWhys, setFiveWhys] = useState(
    finding.fiveWhysSteps.length
      ? finding.fiveWhysSteps
      : FIVE_WHYS_DEFAULT_QUESTIONS.map((q, i) => ({
          id: `new-${i}`,
          level: i + 1,
          question: q,
          answer: '',
        })),
  );
  const [rootCause, setRootCause] = useState(finding.rootCause ?? '');
  const [rootCauseMeasures, setRootCauseMeasures] = useState(
    finding.rootCauseMeasures ?? '',
  );

  const tabs: { id: Tab; label: string; show?: boolean }[] = [
    { id: 'datos', label: 'Datos' },
    { id: 'acciones', label: 'Acciones' },
    {
      id: 'investigacion',
      label: '5 porqués',
      show: finding.type === 'INCIDENTE',
    },
    { id: 'adjuntos', label: 'Adjuntos' },
    { id: 'observaciones', label: 'Observaciones' },
    { id: 'historial', label: 'Historial' },
  ];

  async function refreshFinding() {
    const response = await fetch(`/api/findings/${finding.id}`);
    if (response.ok) {
      const data = (await response.json()) as Finding;
      setFinding(data);
    }
    router.refresh();
  }

  async function changeStatus() {
    setLoading(true);
    const response = await fetch(`/api/findings/${finding.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, comment: statusComment }),
    });
    setLoading(false);
    if (response.ok) await refreshFinding();
  }

  async function addNote() {
    if (!note.trim()) return;
    setLoading(true);
    const response = await fetch(`/api/findings/${finding.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note }),
    });
    setLoading(false);
    if (response.ok) {
      setNote('');
      await refreshFinding();
    }
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    const response = await fetch(`/api/findings/${finding.id}/attachments`, {
      method: 'POST',
      body: formData,
    });
    setLoading(false);
    if (response.ok) await refreshFinding();
  }

  async function saveFiveWhys() {
    setLoading(true);
    const response = await fetch(`/api/findings/${finding.id}/five-whys`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        steps: fiveWhys.map((s) => ({
          level: s.level,
          question: s.question,
          answer: s.answer,
        })),
        rootCause,
        rootCauseMeasures,
      }),
    });
    setLoading(false);
    if (response.ok) await refreshFinding();
  }

  async function downloadAttachment(attachmentId: string) {
    const response = await fetch(
      `/api/findings/${finding.id}/attachments/${attachmentId}/url`,
    );
    if (!response.ok) return;
    const data = (await response.json()) as { url: string };
    window.open(data.url, '_blank');
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-200/60 bg-amber-50/30">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-sm font-bold text-amber-800">
              {finding.code}
            </p>
            <h2 className="text-xl font-black text-slate-950">{finding.title}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">
                {FINDING_TYPE_LABELS[finding.type]}
              </Badge>
              <FindingStatusBadge status={finding.status} />
              <Badge variant="secondary">
                {FINDING_PRIORITY_LABELS[finding.priority]}
              </Badge>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Reportó:</strong> {finding.reporterName}
              {finding.reporterPosition
                ? ` (${finding.reporterPosition})`
                : ''}
            </p>
            <p>
              <strong>Email reportante:</strong> {finding.reporterEmail}
            </p>
            <p>
              <strong>Tratamiento:</strong> {finding.assignee.name}
            </p>
            <p className="text-xs">
              Registrado en sistema por: {finding.createdBy.name}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs
          .filter((t) => t.show !== false)
          .map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                tab === t.id
                  ? 'bg-amber-600 text-white'
                  : 'text-muted-foreground hover:bg-slate-100',
              )}
            >
              {t.label}
            </button>
          ))}
      </div>

      {tab === 'datos' && (
        <Card>
          <CardHeader>
            <CardTitle>Información del hallazgo</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
            <Field label="Descripción" value={finding.description} full />
            <Field label="Reportante" value={finding.reporterName} />
            <Field label="Email reportante" value={finding.reporterEmail} />
            <Field label="Cargo / área" value={finding.reporterPosition} />
            <Field label="Área" value={finding.area} />
            <Field label="Sector" value={finding.sector} />
            <Field label="Ubicación" value={finding.locationDetail} full />
            <Field
              label="Fecha del evento"
              value={
                finding.occurredAt
                  ? new Date(finding.occurredAt).toLocaleString('es-AR')
                  : null
              }
            />
            <div className="sm:col-span-2">
              <p className="mb-2 font-semibold">Notificados en copia</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {finding.viewers.map((v) => (
                  <li key={v.id}>
                    {v.name} — {v.email} (usuario del sistema)
                  </li>
                ))}
                {finding.externalNotificationEmails.map((r) => (
                  <li key={r.email}>
                    {r.name ? `${r.name} — ` : ''}
                    {r.email} (correo manual)
                  </li>
                ))}
                {finding.viewers.length === 0 &&
                finding.externalNotificationEmails.length === 0 ? (
                  <li>—</li>
                ) : null}
              </ul>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 font-semibold">Datos específicos</p>
              <pre className="overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs">
                {JSON.stringify(finding.typeDetails, null, 2)}
              </pre>
            </div>
            <div className="sm:col-span-2 rounded-lg border p-4">
              <p className="font-semibold">Cambiar estado</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <select
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(e.target.value as FindingStatus)
                  }
                >
                  {Object.entries(FINDING_STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Comentario del cambio (opcional)"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                />
              </div>
              <Button
                className="mt-3 bg-amber-600 hover:bg-amber-700"
                onClick={changeStatus}
                disabled={loading}
              >
                Actualizar estado
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'acciones' && (
        <Card>
          <CardHeader>
            <CardTitle>Acciones correctivas / preventivas</CardTitle>
            <CardDescription>Plazos y responsables asignados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {finding.actions.length === 0 ? (
              <p className="text-muted-foreground">Sin acciones registradas</p>
            ) : (
              finding.actions.map((action) => (
                <div
                  key={action.id}
                  className="rounded-lg border p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{ACTION_TYPE_LABELS[action.type]}</Badge>
                    <Badge variant="outline">
                      {ACTION_STATUS_LABELS[action.status]}
                    </Badge>
                    <span className="text-muted-foreground">
                      Vence:{' '}
                      {new Date(action.dueDate).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <p className="mt-2">{action.description}</p>
                  <p className="mt-1 text-muted-foreground">
                    Responsable: {action.responsible.name}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'investigacion' && finding.type === 'INCIDENTE' && (
        <Card>
          <CardHeader>
            <CardTitle>Análisis de causa raíz — 5 porqués</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fiveWhys.map((step, index) => (
              <div key={step.level}>
                <Label>
                  {index + 1}. {step.question}
                </Label>
                <Textarea
                  className="mt-1"
                  value={step.answer}
                  onChange={(e) =>
                    setFiveWhys((current) =>
                      current.map((s) =>
                        s.level === step.level
                          ? { ...s, answer: e.target.value }
                          : s,
                      ),
                    )
                  }
                />
              </div>
            ))}
            <div>
              <Label>Causa raíz</Label>
              <Textarea
                className="mt-1"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
              />
            </div>
            <div>
              <Label>Medidas establecidas</Label>
              <Textarea
                className="mt-1"
                value={rootCauseMeasures}
                onChange={(e) => setRootCauseMeasures(e.target.value)}
              />
            </div>
            <Button
              onClick={saveFiveWhys}
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Guardar investigación
            </Button>
          </CardContent>
        </Card>
      )}

      {tab === 'adjuntos' && (
        <Card>
          <CardHeader>
            <CardTitle>Archivos adjuntos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadFile(file);
              }}
            />
            {finding.attachments.length === 0 ? (
              <p className="text-muted-foreground">Sin adjuntos</p>
            ) : (
              <ul className="space-y-2">
                {finding.attachments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <span>
                      {a.fileName}
                      <span className="block text-xs text-muted-foreground">
                        {a.uploadedBy.name} ·{' '}
                        {new Date(a.createdAt).toLocaleString('es-AR')}
                      </span>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadAttachment(a.id)}
                    >
                      Descargar
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'observaciones' && (
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Agregar observación..."
              />
              <Button
                onClick={addNote}
                disabled={loading}
                className="shrink-0 bg-amber-600 hover:bg-amber-700"
              >
                Agregar
              </Button>
            </div>
            {finding.notes.map((n) => (
              <div key={n.id} className="rounded-lg border p-3 text-sm">
                <p>{n.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {n.author.name} ·{' '}
                  {new Date(n.createdAt).toLocaleString('es-AR')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === 'historial' && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de estados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {finding.statusHistory.map((h) => (
              <div key={h.id} className="rounded-lg border p-3 text-sm">
                <p className="font-semibold">
                  {h.fromStatus
                    ? FINDING_STATUS_LABELS[h.fromStatus]
                    : '—'}{' '}
                  → {FINDING_STATUS_LABELS[h.toStatus]}
                </p>
                {h.comment ? (
                  <p className="mt-1 text-muted-foreground">{h.comment}</p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {h.changedBy.name} ·{' '}
                  {new Date(h.createdAt).toLocaleString('es-AR')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  full,
}: {
  label: string;
  value: string | null | undefined;
  full?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1">{value || '—'}</p>
    </div>
  );
}
