import { CieActivityType } from '@prisma/client';

export const CIE_WORK_GROUP_LABELS: Record<string, string> = {
  G1: 'Grupo 1 — Cristian',
  G2: 'Grupo 2 — Guille',
};

export const CIE_ACTIVITY_LABELS: Record<CieActivityType, string> = {
  LIMPIEZA: 'Limpieza',
  INSPECCION_VISUAL: 'Inspección visual',
  PRUEBA_ELEMENTOS: 'Prueba de elementos',
  CALIBRACION: 'Calibración',
};

export const CIE_RETURN_STATUS_LABELS: Record<string, string> = {
  TERM: 'Terminada',
  CONT: 'Continúa',
  CANC: 'Cancelada',
  FDM: 'Pendiente por falta de materiales',
  FMO: 'Pendiente por falta de mano de obra',
  INSP: 'Pendiente por inspección',
  FCL: 'Pendiente por factores climáticos',
  SEG: 'Pendiente por seguridad',
  CTR: 'Pendiente por contratista',
  EPT: 'Demora en entrega de permiso de trabajo',
  EDE: 'Demora en entrega de equipo',
  FEM: 'Pendiente por falta de equipamiento',
  PGR: 'Pendiente por programación',
  IOOM: 'Intervención de otros oficios — Mecánica',
  IOOX: 'Intervención de otros oficios — Metalurgia',
  IOOE: 'Intervención de otros oficios — Electricidad',
  IOOI: 'Intervención de otros oficios — Instrumentos',
  PP0: 'Pendiente por prioridad 0',
  PLN: 'Pendiente por planificación',
  CONM: 'Pendiente por conexión mecánica',
  CONE: 'Pendiente por conexión eléctrica',
  CALC: 'Pendiente por cálculo',
  PTD: 'Pendiente por permiso de trabajo',
};

export const CIE_RETURN_REQUIRES_OBSERVATION: Set<string> = new Set([
  'CONT',
  'CANC',
  'FDM',
  'FMO',
  'INSP',
  'FCL',
  'SEG',
  'CTR',
  'EPT',
  'EDE',
  'FEM',
  'PGR',
  'IOOM',
  'IOOX',
  'IOOE',
  'IOOI',
  'PP0',
  'PLN',
  'CONM',
  'CONE',
  'CALC',
  'PTD',
]);

/**
 * Fechas calendario (sin hora). Prisma/PostgreSQL @db.Date se leen como medianoche UTC;
 * usar siempre componentes UTC para evitar desfase de un día en zonas UTC−X.
 */
export function formatDateOnly(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

export function getBusinessDaysOfMonth(
  year: number,
  month: number,
  holidayDates: Set<string>,
): Date[] {
  const days: Date[] = [];
  const cursor = new Date(Date.UTC(year, month - 1, 1));
  while (cursor.getUTCMonth() === month - 1) {
    if (!isWeekend(cursor) && !holidayDates.has(formatDateOnly(cursor))) {
      days.push(new Date(cursor));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

export function getBusinessDayDate(
  year: number,
  month: number,
  businessDayIndex: number,
  holidayDates: Set<string>,
): Date | null {
  const days = getBusinessDaysOfMonth(year, month, holidayDates);
  return days[businessDayIndex - 1] ?? null;
}

export function addBusinessDays(
  start: Date,
  delta: number,
  holidayDates: Set<string>,
): Date {
  const step = delta >= 0 ? 1 : -1;
  let remaining = Math.abs(delta);
  const cursor = new Date(start);
  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + step);
    if (!isWeekend(cursor) && !holidayDates.has(formatDateOnly(cursor))) {
      remaining--;
    }
  }
  return cursor;
}

export function nearestBusinessDay(
  date: Date,
  holidayDates: Set<string>,
  direction: 1 | -1 = 1,
): Date {
  const cursor = new Date(date);
  while (isWeekend(cursor) || holidayDates.has(formatDateOnly(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() + direction);
  }
  return cursor;
}
