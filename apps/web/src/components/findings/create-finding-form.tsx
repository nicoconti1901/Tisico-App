'use client';

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
import type { User } from '@/lib/auth-types';
import {
  FIVE_WHYS_DEFAULT_QUESTIONS,
  FINDING_TYPE_LABELS,
  type AssignableUser,
  type FindingType,
} from '@/lib/findings-types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ActionDraft = {
  type: 'CORRECTIVA' | 'PREVENTIVA';
  description: string;
  dueDate: string;
  responsibleId: string;
};

type CreateFindingFormProps = {
  /** Valores sugeridos al abrir el formulario (editables) */
  reporterDefaults: Pick<User, 'name' | 'email'>;
  users: AssignableUser[];
  defaultNotificationEmails: string[];
};

const findingTypes: FindingType[] = [
  'OBSERVACION',
  'NO_CONFORMIDAD',
  'INCIDENTE',
  'OPORTUNIDAD_MEJORA',
];

export function CreateFindingForm({
  reporterDefaults,
  users,
  defaultNotificationEmails,
}: CreateFindingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState<FindingType | null>(null);

  const [reporterName, setReporterName] = useState(reporterDefaults.name);
  const [reporterEmail, setReporterEmail] = useState(reporterDefaults.email);
  const [reporterPosition, setReporterPosition] = useState('');
  const [notificationEmails, setNotificationEmails] = useState<string[]>(
    defaultNotificationEmails,
  );
  const [manualEmail, setManualEmail] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIA');
  const [area, setArea] = useState('');
  const [sector, setSector] = useState('');
  const [locationDetail, setLocationDetail] = useState('');
  const [occurredAt, setOccurredAt] = useState('');

  const [typeDetails, setTypeDetails] = useState<Record<string, string>>({});
  const [assigneeId, setAssigneeId] = useState('');
  const [viewerIds, setViewerIds] = useState<string[]>([]);
  const [actions, setActions] = useState<ActionDraft[]>([]);
  const [fiveWhys, setFiveWhys] = useState(
    FIVE_WHYS_DEFAULT_QUESTIONS.map((q, i) => ({
      level: i + 1,
      question: q,
      answer: '',
    })),
  );
  const [rootCause, setRootCause] = useState('');
  const [rootCauseMeasures, setRootCauseMeasures] = useState('');

  function updateDetail(key: string, value: string) {
    setTypeDetails((c) => ({ ...c, [key]: value }));
  }

  function toggleViewer(id: string) {
    setViewerIds((current) =>
      current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id],
    );
  }

  function addManualEmail() {
    const email = manualEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    setNotificationEmails((current) =>
      current.includes(email) ? current : [...current, email],
    );
    setManualEmail('');
  }

  function removeNotificationEmail(email: string) {
    setNotificationEmails((current) => current.filter((e) => e !== email));
  }

  function addAction() {
    setActions((c) => [
      ...c,
      {
        type: 'CORRECTIVA',
        description: '',
        dueDate: '',
        responsibleId: assigneeId || users[0]?.id || '',
      },
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type) {
      setError('Seleccioná un tipo de hallazgo');
      return;
    }
    setLoading(true);
    setError('');

    const payload = {
      type,
      title,
      description,
      priority,
      reporterName,
      reporterEmail,
      reporterPosition: reporterPosition || undefined,
      area: area || undefined,
      sector: sector || undefined,
      locationDetail: locationDetail || undefined,
      occurredAt: occurredAt || undefined,
      typeDetails: buildTypeDetails(type, typeDetails),
      assigneeId,
      viewerIds,
      notificationEmails,
      actions: actions.filter((a) => a.description && a.dueDate),
      fiveWhysSteps:
        type === 'INCIDENTE'
          ? fiveWhys.filter((s) => s.answer.trim())
          : undefined,
      rootCause: type === 'INCIDENTE' ? rootCause || undefined : undefined,
      rootCauseMeasures:
        type === 'INCIDENTE' ? rootCauseMeasures || undefined : undefined,
    };

    const response = await fetch('/api/findings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError((data as { message?: string }).message ?? 'Error al crear');
      return;
    }

    router.push(`/dashboard/seguridad/hallazgos/${(data as { id: string }).id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>1. Tipo de hallazgo</CardTitle>
          <CardDescription>
            Cada tipo tiene campos específicos de seguridad e higiene
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {findingTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setTypeDetails({});
              }}
              className={cn(
                'rounded-xl border p-4 text-left transition-all',
                type === t
                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/30'
                  : 'border-slate-200 hover:border-amber-300',
              )}
            >
              <p className="font-bold text-slate-950">
                {FINDING_TYPE_LABELS[t]}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      {type ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>2. Datos del reportante</CardTitle>
              <CardDescription>
                Persona que reporta el hallazgo. Podés editar estos datos; no
                tienen que coincidir con el usuario con el que ingresaste.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Nombre *</Label>
                <Input
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Cargo / área</Label>
                <Input
                  value={reporterPosition}
                  onChange={(e) => setReporterPosition(e.target.value)}
                  placeholder="Ej: Técnico SHE, Supervisor de planta"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Información general</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Título *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Descripción *</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Prioridad</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica</option>
                  </select>
                </div>
                <div>
                  <Label>Fecha del evento</Label>
                  <Input
                    type="datetime-local"
                    value={occurredAt}
                    onChange={(e) => setOccurredAt(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Área / sector</Label>
                  <Input value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
                <div>
                  <Label>Subsector</Label>
                  <Input
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Ubicación detallada</Label>
                  <Input
                    value={locationDetail}
                    onChange={(e) => setLocationDetail(e.target.value)}
                    placeholder="Ej: Nave 2, línea de envasado"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <TypeSpecificFields
            type={type}
            details={typeDetails}
            onChange={updateDetail}
          />

          {type === 'INCIDENTE' ? (
            <Card>
              <CardHeader>
                <CardTitle>Investigación — 5 porqués</CardTitle>
                <CardDescription>
                  Completá la cadena causal para llegar a la causa raíz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fiveWhys.map((step, index) => (
                  <div key={step.level} className="space-y-2">
                    <Label>
                      {index + 1}. {step.question}
                    </Label>
                    <Textarea
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
                      placeholder="Respuesta..."
                    />
                  </div>
                ))}
                <div>
                  <Label>Causa raíz identificada</Label>
                  <Textarea
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Medidas correctivas / preventivas</Label>
                  <Textarea
                    value={rootCauseMeasures}
                    onChange={(e) => setRootCauseMeasures(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Asignación y notificaciones</CardTitle>
              <CardDescription>
                El correo se enviará desde la cuenta institucional de hallazgos
                (cuando esté configurada). El responsable recibe asignación de
                tratamiento; el resto recibe copia solo para conocimiento.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div>
                <Label>Responsable de tratamiento *</Label>
                <select
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Usuarios del sistema en copia (conocimiento)</Label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {users
                    .filter((u) => u.id !== assigneeId)
                    .map((u) => (
                      <label
                        key={u.id}
                        className="flex items-center gap-2 rounded-lg border p-3 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={viewerIds.includes(u.id)}
                          onChange={() => toggleViewer(u.id)}
                        />
                        <span>
                          {u.name}
                          <span className="block text-xs text-muted-foreground">
                            {u.email}
                          </span>
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              <div>
                <Label>Correos adicionales (manuales o genéricos)</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Podés agregar cualquier correo, esté o no registrado en la
                  plataforma. Los genéricos del servidor aparecen precargados.
                </p>
                <div className="mt-2 flex gap-2">
                  <Input
                    type="email"
                    placeholder="correo@empresa.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addManualEmail();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addManualEmail}
                  >
                    Agregar
                  </Button>
                </div>
                {notificationEmails.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {notificationEmails.map((email) => (
                      <li
                        key={email}
                        className="inline-flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-xs font-medium"
                      >
                        {email}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeNotificationEmail(email)}
                          aria-label={`Quitar ${email}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sin correos adicionales
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Acciones con plazo</CardTitle>
                <CardDescription>
                  Correctivas o preventivas con vencimiento asignado al
                  responsable
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addAction}>
                Agregar acción
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {actions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sin acciones programadas (opcional)
                </p>
              ) : (
                actions.map((action, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2"
                  >
                    <div>
                      <Label>Tipo</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                        value={action.type}
                        onChange={(e) =>
                          setActions((c) =>
                            c.map((a, i) =>
                              i === index
                                ? {
                                    ...a,
                                    type: e.target.value as ActionDraft['type'],
                                  }
                                : a,
                            ),
                          )
                        }
                      >
                        <option value="CORRECTIVA">Correctiva</option>
                        <option value="PREVENTIVA">Preventiva</option>
                      </select>
                    </div>
                    <div>
                      <Label>Vencimiento</Label>
                      <Input
                        type="date"
                        value={action.dueDate}
                        onChange={(e) =>
                          setActions((c) =>
                            c.map((a, i) =>
                              i === index
                                ? { ...a, dueDate: e.target.value }
                                : a,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Descripción</Label>
                      <Textarea
                        value={action.description}
                        onChange={(e) =>
                          setActions((c) =>
                            c.map((a, i) =>
                              i === index
                                ? { ...a, description: e.target.value }
                                : a,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Responsable de la acción</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                        value={action.responsibleId}
                        onChange={(e) =>
                          setActions((c) =>
                            c.map((a, i) =>
                              i === index
                                ? { ...a, responsibleId: e.target.value }
                                : a,
                            ),
                          )
                        }
                      >
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {error ? (
            <p className="text-sm font-medium text-destructive">{error}</p>
          ) : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {loading ? 'Registrando...' : 'Registrar y notificar'}
            </Button>
          </div>
        </>
      ) : null}
    </form>
  );
}

function TypeSpecificFields({
  type,
  details,
  onChange,
}: {
  type: FindingType;
  details: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos específicos — {FINDING_TYPE_LABELS[type]}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {type === 'OBSERVACION' && (
          <>
            <div>
              <Label>Categoría *</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={details.observationCategory ?? ''}
                onChange={(e) => onChange('observationCategory', e.target.value)}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="CONDICION">Condición insegura</option>
                <option value="COMPORTAMIENTO">Comportamiento inseguro</option>
                <option value="DOCUMENTACION">Documentación</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div>
              <Label>¿Requiere seguimiento?</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={details.requiresFollowUp ?? 'false'}
                onChange={(e) => onChange('requiresFollowUp', e.target.value)}
              >
                <option value="false">No</option>
                <option value="true">Sí</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Acción inmediata tomada</Label>
              <Textarea
                value={details.immediateActionTaken ?? ''}
                onChange={(e) =>
                  onChange('immediateActionTaken', e.target.value)
                }
              />
            </div>
          </>
        )}

        {type === 'NO_CONFORMIDAD' && (
          <>
            <div>
              <Label>Proceso afectado *</Label>
              <Input
                value={details.processAffected ?? ''}
                onChange={(e) => onChange('processAffected', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Norma / procedimiento de referencia *</Label>
              <Input
                value={details.standardReference ?? ''}
                onChange={(e) => onChange('standardReference', e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Evidencia / descripción del incumplimiento</Label>
              <Textarea
                value={details.evidenceDescription ?? ''}
                onChange={(e) => onChange('evidenceDescription', e.target.value)}
              />
            </div>
            <div>
              <Label>¿Requiere acción correctiva?</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={details.requiresCorrectiveAction ?? 'true'}
                onChange={(e) =>
                  onChange('requiresCorrectiveAction', e.target.value)
                }
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </>
        )}

        {type === 'INCIDENTE' && (
          <>
            <div>
              <Label>Clasificación *</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={details.incidentClass ?? ''}
                onChange={(e) => onChange('incidentClass', e.target.value)}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="CASI_ACCIDENTE">Casi accidente</option>
                <option value="ACCIDENTE_SIN_LESION">Accidente sin lesión</option>
                <option value="ACCIDENTE_CON_LESION">Accidente con lesión</option>
                <option value="DANO_MATERIAL">Daño material</option>
              </select>
            </div>
            <div>
              <Label>Personas involucradas</Label>
              <Input
                value={details.personsInvolved ?? ''}
                onChange={(e) => onChange('personsInvolved', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Acciones inmediatas *</Label>
              <Textarea
                value={details.immediateActions ?? ''}
                onChange={(e) => onChange('immediateActions', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Descripción de lesión</Label>
              <Textarea
                value={details.injuryDescription ?? ''}
                onChange={(e) => onChange('injuryDescription', e.target.value)}
              />
            </div>
            <div>
              <Label>Equipo involucrado</Label>
              <Input
                value={details.equipmentInvolved ?? ''}
                onChange={(e) => onChange('equipmentInvolved', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Testigos</Label>
              <Input
                value={details.witnesses ?? ''}
                onChange={(e) => onChange('witnesses', e.target.value)}
              />
            </div>
          </>
        )}

        {type === 'OPORTUNIDAD_MEJORA' && (
          <>
            <div className="sm:col-span-2">
              <Label>Situación actual *</Label>
              <Textarea
                value={details.currentSituation ?? ''}
                onChange={(e) => onChange('currentSituation', e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Mejora propuesta *</Label>
              <Textarea
                value={details.proposedImprovement ?? ''}
                onChange={(e) => onChange('proposedImprovement', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Beneficio esperado</Label>
              <Textarea
                value={details.expectedBenefit ?? ''}
                onChange={(e) => onChange('expectedBenefit', e.target.value)}
              />
            </div>
            <div>
              <Label>Notas de implementación</Label>
              <Textarea
                value={details.implementationNotes ?? ''}
                onChange={(e) =>
                  onChange('implementationNotes', e.target.value)
                }
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function buildTypeDetails(
  type: FindingType,
  details: Record<string, string>,
): Record<string, unknown> {
  const boolKeys = ['requiresFollowUp', 'requiresCorrectiveAction'];
  const result: Record<string, unknown> = { ...details };
  for (const key of boolKeys) {
    if (key in result) {
      result[key] = result[key] === 'true';
    }
  }
  return result;
}
