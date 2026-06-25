export type CieWorkGroup = 'G1' | 'G2';

export type CieActivityType =
  | 'LIMPIEZA'
  | 'INSPECCION_VISUAL'
  | 'PRUEBA_ELEMENTOS'
  | 'CALIBRACION';

export type CieReturnStatus =
  | 'TERM'
  | 'CONT'
  | 'CANC'
  | 'FDM'
  | 'FMO'
  | 'INSP'
  | 'FCL'
  | 'SEG'
  | 'CTR'
  | 'EPT'
  | 'EDE'
  | 'FEM'
  | 'PGR'
  | 'IOOM'
  | 'IOOX'
  | 'IOOE'
  | 'IOOI'
  | 'PP0'
  | 'PLN'
  | 'CONM'
  | 'CONE'
  | 'CALC'
  | 'PTD';

export type CieTask = {
  id: string;
  workGroup: CieWorkGroup;
  scheduledDate: string;
  businessDayIndex: number;
  workOrder: string | null;
  equipment: string | null;
  plant: string | null;
  description: string;
  company: string;
  durationHours: number;
  activityTypes: CieActivityType[];
  isRescheduled: boolean;
  originalScheduledDate: string | null;
  rescheduleReason: string | null;
  return: {
    id: string;
    status: CieReturnStatus;
    observations: string | null;
    submittedBy: { id: string; name: string };
    submittedAt: string;
  } | null;
};

export type CieDayView = {
  group: CieWorkGroup;
  groupLabel: string;
  date: string;
  businessDayIndex: number | null;
  navigation: { previous: string; next: string };
  tasks: CieTask[];
  summary: { total: number; withReturn: number; completed: number };
  monthOverview: {
    date: string;
    businessDayIndex: number;
    hasTasks: boolean;
    /** null = sin tareas; programmed = sin retorno; saved_term = todo TERM; saved_open = pendiente o no terminado */
    returnStatus: 'programmed' | 'saved_term' | 'saved_open' | null;
  }[];
};

export type CieMeta = {
  workGroups: { id: CieWorkGroup; label: string }[];
  activityTypes: { id: CieActivityType; label: string }[];
  returnStatuses: {
    id: CieReturnStatus;
    label: string;
    requiresObservation: boolean;
  }[];
};

export const CIE_ACTIVITY_LABELS: Record<CieActivityType, string> = {
  LIMPIEZA: 'Limpieza',
  INSPECCION_VISUAL: 'Inspección visual',
  PRUEBA_ELEMENTOS: 'Prueba de elementos',
  CALIBRACION: 'Calibración',
};
