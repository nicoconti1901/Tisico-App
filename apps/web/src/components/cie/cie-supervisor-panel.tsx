'use client';

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
  CIE_ACTIVITY_LABELS,
  type CieActivityType,
  type CieDayView,
  type CieMeta,
  type CieReturnStatus,
  type CieTask,
  type CieWorkGroup,
} from '@/lib/cie-types';
import { cn } from '@/lib/utils';
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CloudUpload,
  Pencil,
  Save,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type ReturnDraft = {
  status: CieReturnStatus;
  observations: string;
};

type TaskVisualState = 'programmed' | 'saved_term' | 'saved_open' | 'dirty';

const CALENDAR_DAY_STYLES: Record<
  TaskVisualState | 'no_tasks',
  { button: string; hover: string }
> = {
  no_tasks: {
    button: 'bg-slate-100 text-slate-400',
    hover: 'hover:bg-slate-200',
  },
  programmed: {
    button: 'bg-slate-300 text-slate-800',
    hover: 'hover:bg-slate-400',
  },
  saved_term: {
    button: 'bg-emerald-500 text-white',
    hover: 'hover:bg-emerald-600',
  },
  saved_open: {
    button: 'bg-amber-400 text-amber-950',
    hover: 'hover:bg-amber-500',
  },
  dirty: {
    button: 'bg-orange-500 text-white',
    hover: 'hover:bg-orange-600',
  },
};

const TASK_STATE_STYLES: Record<
  TaskVisualState,
  { card: string; border: string; bar: string; badge: string; label: string }
> = {
  programmed: {
    card: 'border-slate-200 bg-slate-50/80',
    border: 'border-l-slate-400',
    bar: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    label: 'Programada',
  },
  saved_term: {
    card: 'border-emerald-300/80 bg-emerald-50/90',
    border: 'border-l-emerald-500',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    label: 'Terminada',
  },
  saved_open: {
    card: 'border-amber-300/80 bg-amber-50/90',
    border: 'border-l-amber-500',
    bar: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    label: 'No terminada',
  },
  dirty: {
    card: 'border-orange-400/90 bg-orange-50/40 ring-2 ring-orange-300/50',
    border: 'border-l-orange-500',
    bar: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-900 border-orange-400',
    label: 'Cambios sin guardar',
  },
};

function isReturnDraftDirty(
  draft: ReturnDraft | undefined,
  baseline: ReturnDraft | undefined,
): boolean {
  const current = draft ?? { status: 'TERM' as CieReturnStatus, observations: '' };
  const base = baseline ?? { status: 'TERM' as CieReturnStatus, observations: '' };
  return (
    current.status !== base.status ||
    current.observations.trim() !== base.observations.trim()
  );
}

function getTaskVisualState(
  task: CieTask,
  draft: ReturnDraft | undefined,
  baseline: ReturnDraft | undefined,
  touched = false,
): TaskVisualState {
  const isDirty = isReturnDraftDirty(draft, baseline);

  if (isDirty || (!task.return && touched)) return 'dirty';
  if (!task.return) return 'programmed';
  return task.return.status === 'TERM' ? 'saved_term' : 'saved_open';
}

function statusRequiresObservation(meta: CieMeta, status: CieReturnStatus) {
  return meta.returnStatuses.find((s) => s.id === status)?.requiresObservation ?? false;
}

function validateReturnDraft(meta: CieMeta, draft: ReturnDraft): string | null {
  if (
    statusRequiresObservation(meta, draft.status) &&
    !draft.observations.trim()
  ) {
    return 'Indicá el motivo u observaciones para este estado';
  }
  return null;
}

function shouldSubmitTaskReturn(
  task: CieTask,
  draft: ReturnDraft | undefined,
  baseline: ReturnDraft | undefined,
  touched: boolean,
): boolean {
  if (isReturnDraftDirty(draft, baseline)) return true;
  return !task.return && touched;
}

/** Estado agregado del día — alineado con la API y los borradores locales */
function computeDayReturnStatus(
  tasks: CieTask[],
  returnDrafts: Record<string, ReturnDraft>,
  savedBaselines: Record<string, ReturnDraft>,
  touchedReturns: Set<string>,
): TaskVisualState | null {
  if (tasks.length === 0) return null;

  let pendingCount = 0;
  let savedCount = 0;
  let allTerm = true;

  for (const task of tasks) {
    const draft = returnDrafts[task.id];
    const baseline = savedBaselines[task.id];
    const touched = touchedReturns.has(task.id);

    if (shouldSubmitTaskReturn(task, draft, baseline, touched)) {
      pendingCount++;
      continue;
    }

    if (!task.return) {
      allTerm = false;
      continue;
    }

    savedCount++;
    if (task.return.status !== 'TERM') allTerm = false;
  }

  if (pendingCount > 0) return 'dirty';
  if (savedCount === 0) return 'programmed';
  if (savedCount < tasks.length) return 'saved_open';
  if (allTerm) return 'saved_term';
  return 'saved_open';
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function CieSupervisorPanel({
  initialMeta,
  initialDate,
}: {
  initialMeta: CieMeta;
  initialDate?: string;
}) {
  const [meta] = useState(initialMeta);
  const [group, setGroup] = useState<CieWorkGroup>('G1');
  const [date, setDate] = useState(initialDate ?? todayIso());
  const [dayView, setDayView] = useState<CieDayView | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [returnDrafts, setReturnDrafts] = useState<Record<string, ReturnDraft>>(
    {},
  );
  /** Último retorno guardado en servidor — base para detectar cambios */
  const [savedBaselines, setSavedBaselines] = useState<
    Record<string, ReturnDraft>
  >({});
  const [touchedReturns, setTouchedReturns] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [daySavedAt, setDaySavedAt] = useState<string | null>(null);

  const markReturnTouched = useCallback((taskId: string) => {
    setTouchedReturns((prev) => {
      if (prev.has(taskId)) return prev;
      const next = new Set(prev);
      next.add(taskId);
      return next;
    });
    setFieldErrors((prev) => {
      if (!prev[taskId]) return prev;
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
    setSubmitError(null);
  }, []);
  const [editingTask, setEditingTask] = useState<CieTask | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editActivities, setEditActivities] = useState<CieActivityType[]>([]);

  const loadDay = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/cie/day?group=${group}&date=${date}`,
    );
    if (res.ok) {
      const data = (await res.json()) as CieDayView;
      setDayView(data);
      setDate(data.date);
      const drafts: Record<string, ReturnDraft> = {};
      const baselines: Record<string, ReturnDraft> = {};
      for (const task of data.tasks) {
        const baseline: ReturnDraft = task.return
          ? {
              status: task.return.status,
              observations: task.return.observations ?? '',
            }
          : { status: 'TERM', observations: '' };
        baselines[task.id] = baseline;
        drafts[task.id] = { ...baseline };
      }
      setReturnDrafts(drafts);
      setSavedBaselines(baselines);
      setTouchedReturns(new Set());
      setSubmitError(null);
      setFieldErrors({});
      setDaySavedAt(null);
    }
    setLoading(false);
  }, [group, date]);

  useEffect(() => {
    void loadDay();
  }, [loadDay]);

  function openEdit(task: CieTask) {
    setEditingTask(task);
    setEditDate(task.scheduledDate.slice(0, 10));
    setEditReason(task.rescheduleReason ?? '');
    setEditActivities(task.activityTypes);
  }

  async function saveEdit() {
    if (!editingTask) return;
    setSaving(true);
    const res = await fetch(`/api/cie/tasks/${editingTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduledDate: editDate,
        rescheduleReason: editReason || undefined,
        activityTypes: editActivities,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setEditingTask(null);
      await loadDay();
    }
  }

  function toggleActivity(type: CieActivityType) {
    setEditActivities((current) =>
      current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type],
    );
  }

  async function submitReturns() {
    if (!dayView) return;

    const tasksToSubmit = dayView.tasks.filter((task) =>
      shouldSubmitTaskReturn(
        task,
        returnDrafts[task.id],
        savedBaselines[task.id],
        touchedReturns.has(task.id),
      ),
    );

    if (tasksToSubmit.length === 0) {
      setSubmitError('No hay retornos nuevos o modificados para guardar.');
      return;
    }

    const nextFieldErrors: Record<string, string> = {};
    for (const task of tasksToSubmit) {
      const draft = returnDrafts[task.id] ?? {
        status: 'TERM' as CieReturnStatus,
        observations: '',
      };
      const error = validateReturnDraft(meta, draft);
      if (error) nextFieldErrors[task.id] = error;
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setSubmitError(
        'Completá las observaciones obligatorias en las tareas marcadas antes de guardar.',
      );
      return;
    }

    setSaving(true);
    setSubmitError(null);
    setFieldErrors({});

    const returns = tasksToSubmit.map((task) => {
      const draft = returnDrafts[task.id] ?? {
        status: 'TERM' as CieReturnStatus,
        observations: '',
      };
      return {
        scheduledTaskId: task.id,
        status: draft.status,
        observations: draft.observations.trim() || undefined,
      };
    });

    const res = await fetch('/api/cie/returns/day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group, date: dayView.date, returns }),
    });
    setSaving(false);

    if (res.ok) {
      const data = (await res.json()) as CieDayView;
      setDayView(data);
      const drafts: Record<string, ReturnDraft> = {};
      const baselines: Record<string, ReturnDraft> = {};
      for (const task of data.tasks) {
        const baseline: ReturnDraft = task.return
          ? {
              status: task.return.status,
              observations: task.return.observations ?? '',
            }
          : { status: 'TERM', observations: '' };
        baselines[task.id] = baseline;
        drafts[task.id] = { ...baseline };
      }
      setReturnDrafts(drafts);
      setSavedBaselines(baselines);
      setTouchedReturns(new Set());
      setDaySavedAt(new Date().toLocaleTimeString('es-AR'));
      return;
    }

    const body = (await res.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const apiMessage = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;
    setSubmitError(apiMessage ?? 'No se pudo guardar el retorno del día.');
  }

  const taskStats = useMemo(() => {
    if (!dayView) return null;
    let programmed = 0;
    let savedTerm = 0;
    let savedOpen = 0;
    let dirty = 0;
    for (const task of dayView.tasks) {
      const state = getTaskVisualState(
        task,
        returnDrafts[task.id],
        savedBaselines[task.id],
        touchedReturns.has(task.id),
      );
      if (state === 'programmed') programmed++;
      else if (state === 'saved_term') savedTerm++;
      else if (state === 'saved_open') savedOpen++;
      else dirty++;
    }
    return { programmed, savedTerm, savedOpen, dirty, total: dayView.tasks.length };
  }, [dayView, returnDrafts, savedBaselines, touchedReturns]);

  const pendingSubmitCount = useMemo(() => {
    if (!dayView) return 0;
    return dayView.tasks.filter((task) =>
      shouldSubmitTaskReturn(
        task,
        returnDrafts[task.id],
        savedBaselines[task.id],
        touchedReturns.has(task.id),
      ),
    ).length;
  }, [dayView, returnDrafts, savedBaselines, touchedReturns]);

  const hasUnsavedChanges = pendingSubmitCount > 0;

  const activeDayCalendarStatus = useMemo(() => {
    if (!dayView?.tasks.length) return null;
    return computeDayReturnStatus(
      dayView.tasks,
      returnDrafts,
      savedBaselines,
      touchedReturns,
    );
  }, [dayView, returnDrafts, savedBaselines, touchedReturns]);

  const statusLabel = (id: CieReturnStatus) =>
    meta.returnStatuses.find((s) => s.id === id)?.label ?? id;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {meta.workGroups.map((g) => (
          <Button
            key={g.id}
            variant={group === g.id ? 'default' : 'outline'}
            className={group === g.id ? 'bg-sky-600 hover:bg-sky-700' : ''}
            onClick={() => setGroup(g.id)}
          >
            {g.label}
          </Button>
        ))}
      </div>

      <Card className="border-sky-200/60">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="size-5 text-sky-600" />
                {dayView ? formatDisplayDate(dayView.date) : 'Cargando...'}
              </CardTitle>
              {dayView?.businessDayIndex ? (
                <CardDescription>
                  {dayView.businessDayIndex}° día hábil del mes ·{' '}
                  {dayView.summary.total} tarea(s)
                </CardDescription>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="px-2"
                disabled={!dayView || loading}
                onClick={() => dayView && setDate(dayView.navigation.previous)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-40"
              />
              <Button
                variant="outline"
                size="sm"
                className="px-2"
                disabled={!dayView || loading}
                onClick={() => dayView && setDate(dayView.navigation.next)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {dayView && dayView.monthOverview.length > 0 ? (
          <CardContent className="border-t pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Días hábiles del mes
            </p>
            <div className="flex flex-wrap gap-1">
              {dayView.monthOverview.map((d) => {
                const isSelected = d.date === dayView.date;
                const dayState: TaskVisualState | 'no_tasks' =
                  isSelected && activeDayCalendarStatus
                    ? activeDayCalendarStatus
                    : d.returnStatus ?? 'no_tasks';
                const dayStyles = CALENDAR_DAY_STYLES[dayState];
                const statusLabel =
                  dayState === 'no_tasks'
                    ? 'Sin tareas'
                    : TASK_STATE_STYLES[dayState].label;

                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setDate(d.date)}
                    className={cn(
                      'size-8 rounded-md text-xs font-semibold transition-colors',
                      dayStyles.button,
                      !isSelected && dayStyles.hover,
                      isSelected &&
                        'ring-2 ring-sky-700 ring-offset-2 shadow-sm',
                    )}
                    title={`${d.businessDayIndex}° hábil — ${statusLabel}`}
                  >
                    {d.businessDayIndex}
                  </button>
                );
              })}
            </div>
          </CardContent>
        ) : null}
      </Card>

      {taskStats ? (
        <div className="flex flex-col gap-3 rounded-xl border border-sky-200/60 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3 text-xs">
            {(
              [
                'programmed',
                'saved_term',
                'saved_open',
                'dirty',
              ] as TaskVisualState[]
            ).map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 font-medium text-slate-700"
              >
                <span
                  className={cn('size-3 rounded-full', TASK_STATE_STYLES[key].bar)}
                />
                {TASK_STATE_STYLES[key].label}
                <span className="text-muted-foreground">
                  ({key === 'programmed'
                    ? taskStats.programmed
                    : key === 'saved_term'
                      ? taskStats.savedTerm
                      : key === 'saved_open'
                        ? taskStats.savedOpen
                        : taskStats.dirty}
                  )
                </span>
              </span>
            ))}
          </div>
          {daySavedAt ? (
            <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="size-3.5" />
              Retorno guardado hoy a las {daySavedAt}
            </p>
          ) : hasUnsavedChanges ? (
            <p className="text-xs font-medium text-orange-700">
              Hay cambios pendientes de guardar
            </p>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <p className="text-center text-muted-foreground">Cargando tareas...</p>
      ) : dayView?.tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay tareas programadas para este día.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {dayView?.tasks.map((task) => {
            const visualState = getTaskVisualState(
              task,
              returnDrafts[task.id],
              savedBaselines[task.id],
              touchedReturns.has(task.id),
            );
            const styles = TASK_STATE_STYLES[visualState];
            const draft = returnDrafts[task.id] ?? {
              status: 'TERM' as CieReturnStatus,
              observations: '',
            };
            const needsObservation = statusRequiresObservation(meta, draft.status);
            const observationError = fieldErrors[task.id];

            return (
            <Card
              key={task.id}
              className={cn(
                'overflow-hidden border-l-4 transition-colors',
                styles.border,
                styles.card,
                task.isRescheduled && visualState !== 'dirty' && 'ring-1 ring-violet-300/60',
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                          styles.badge,
                        )}
                      >
                        {styles.label}
                      </span>
                      {task.isRescheduled ? (
                        <Badge variant="outline" className="border-violet-300 text-violet-800">
                          Editada / reprogramada
                        </Badge>
                      ) : null}
                      {visualState === 'dirty' ? (
                        <Badge variant="outline" className="border-orange-400 text-orange-800">
                          Pendiente de guardar
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {task.workOrder ? (
                        <Badge variant="outline">{task.workOrder}</Badge>
                      ) : null}
                      {task.plant ? (
                        <Badge variant="secondary">{task.plant}</Badge>
                      ) : null}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {task.durationHours}h
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-base leading-snug">
                      {task.description}
                    </CardTitle>
                    {task.equipment ? (
                      <CardDescription>Equipo: {task.equipment}</CardDescription>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {task.activityTypes.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800"
                        >
                          {CIE_ACTIVITY_LABELS[a]}
                        </span>
                      ))}
                    </div>
                    {task.isRescheduled ? (
                      <p className="mt-2 text-xs text-amber-700">
                        Reprogramada
                        {task.originalScheduledDate
                          ? ` (era ${task.originalScheduledDate.slice(0, 10)})`
                          : ''}
                        {task.rescheduleReason ? ` — ${task.rescheduleReason}` : ''}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(task)}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent
                className={cn(
                  'grid gap-3 border-t pt-4 sm:grid-cols-2',
                  visualState === 'saved_term' && 'border-emerald-200/60 bg-emerald-50/30',
                  visualState === 'saved_open' && 'border-amber-200/60 bg-amber-50/30',
                  visualState === 'programmed' && 'border-slate-200 bg-white/60',
                  visualState === 'dirty' && 'border-orange-200/60 bg-white/80',
                )}
              >
                <div>
                  <Label className="text-xs">Retorno del día</Label>
                  <select
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                    value={draft.status}
                    onFocus={() => markReturnTouched(task.id)}
                    onChange={(e) => {
                      markReturnTouched(task.id);
                      const status = e.target.value as CieReturnStatus;
                      setReturnDrafts((c) => ({
                        ...c,
                        [task.id]: {
                          ...(c[task.id] ?? {
                            status: 'TERM' as CieReturnStatus,
                            observations: '',
                          }),
                          status,
                        },
                      }));
                    }}
                  >
                    {meta.returnStatuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} — {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs">
                    Observaciones
                    {needsObservation ? ' (obligatorio)' : ''}
                  </Label>
                  <Textarea
                    className={cn(
                      'mt-1 bg-white',
                      observationError && 'border-red-500 focus-visible:ring-red-500',
                    )}
                    rows={2}
                    placeholder="Motivo si no finalizó, continuidad, etc."
                    value={draft.observations}
                    onFocus={() => markReturnTouched(task.id)}
                    onChange={(e) => {
                      markReturnTouched(task.id);
                      const observations = e.target.value;
                      setReturnDrafts((c) => ({
                        ...c,
                        [task.id]: {
                          ...(c[task.id] ?? {
                            status: 'TERM' as CieReturnStatus,
                            observations: '',
                          }),
                          observations,
                        },
                      }));
                    }}
                  />
                  {observationError ? (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {observationError}
                    </p>
                  ) : null}
                </div>
                {task.return && visualState !== 'dirty' ? (
                  <p
                    className={cn(
                      'sm:col-span-2 flex items-center gap-1.5 text-xs font-medium',
                      visualState === 'saved_term' ? 'text-emerald-800' : 'text-amber-900',
                    )}
                  >
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    Guardado por {task.return.submittedBy.name} —{' '}
                    {statusLabel(task.return.status)}
                    {task.return.observations
                      ? `: ${task.return.observations}`
                      : ''}
                  </p>
                ) : visualState === 'dirty' ? (
                  <p className="sm:col-span-2 text-xs font-medium text-orange-800">
                    Modificaste el retorno — usá &quot;Enviar retorno del día&quot; para
                    confirmar
                  </p>
                ) : (
                  <p className="sm:col-span-2 text-xs text-slate-500">
                    Sin retorno cargado para este día
                  </p>
                )}
              </CardContent>
            </Card>
            );
          })}

          <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end">
            <div className="sm:mr-auto">
              {submitError ? (
                <p className="text-sm font-medium text-red-600">{submitError}</p>
              ) : hasUnsavedChanges ? (
                <p className="text-sm text-orange-700">
                  {pendingSubmitCount} tarea(s) lista(s) para guardar
                </p>
              ) : null}
            </div>
            <Button
              className={cn(
                'bg-sky-600 hover:bg-sky-700',
                hasUnsavedChanges && 'ring-2 ring-orange-400 ring-offset-2',
              )}
              disabled={saving || !dayView?.tasks.length || !hasUnsavedChanges}
              onClick={() => void submitReturns()}
            >
              {hasUnsavedChanges ? (
                <CloudUpload className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {saving
                ? 'Guardando...'
                : hasUnsavedChanges
                  ? `Guardar retorno (${pendingSubmitCount})`
                  : 'Guardar retorno del día'}
            </Button>
          </div>
        </div>
      )}

      {editingTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <CardHeader>
              <CardTitle>Editar tarea</CardTitle>
              <CardDescription className="line-clamp-2">
                {editingTask.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Fecha de ejecución</Label>
                <Input
                  type="date"
                  className="mt-1"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Motivo del cambio (si cambiás la fecha)</Label>
                <Textarea
                  className="mt-1"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="Ej: Factores climáticos — lluvia"
                />
              </div>
              <div>
                <Label>Descripción específica (actividades)</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {meta.activityTypes.map((a) => (
                    <label
                      key={a.id}
                      className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={editActivities.includes(a.id)}
                        onChange={() => toggleActivity(a.id)}
                      />
                      {a.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingTask(null)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-sky-600 hover:bg-sky-700"
                  disabled={saving}
                  onClick={() => void saveEdit()}
                >
                  Guardar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
