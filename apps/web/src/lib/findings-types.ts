import type { Role, User } from './auth-types';

export type FindingType =
  | 'OBSERVACION'
  | 'NO_CONFORMIDAD'
  | 'INCIDENTE'
  | 'OPORTUNIDAD_MEJORA';

export type FindingStatus =
  | 'ABIERTO'
  | 'EN_TRATAMIENTO'
  | 'ACCION_PENDIENTE'
  | 'CERRADO';

export type FindingPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type ActionType = 'CORRECTIVA' | 'PREVENTIVA';

export type CorrectiveActionStatus =
  | 'PENDIENTE'
  | 'EN_CURSO'
  | 'COMPLETADA'
  | 'VENCIDA';

export type UserSummary = Pick<User, 'id' | 'name' | 'email' | 'role'>;

export type ExternalNotificationEmail = {
  email: string;
  name: string | null;
};

export type CorrectiveAction = {
  id: string;
  type: ActionType;
  description: string;
  dueDate: string;
  status: CorrectiveActionStatus;
  responsible: UserSummary;
  completedAt: string | null;
  createdAt: string;
};

export type FiveWhysStep = {
  id: string;
  level: number;
  question: string;
  answer: string;
};

export type FindingAttachment = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: UserSummary;
  createdAt: string;
};

export type FindingNote = {
  id: string;
  content: string;
  author: UserSummary;
  createdAt: string;
};

export type FindingStatusHistory = {
  id: string;
  fromStatus: FindingStatus | null;
  toStatus: FindingStatus;
  comment: string | null;
  changedBy: UserSummary;
  createdAt: string;
};

export type Finding = {
  id: string;
  code: string;
  type: FindingType;
  status: FindingStatus;
  priority: FindingPriority;
  title: string;
  description: string;
  area: string | null;
  sector: string | null;
  locationDetail: string | null;
  occurredAt: string | null;
  typeDetails: Record<string, unknown>;
  rootCause: string | null;
  rootCauseMeasures: string | null;
  reporterName: string;
  reporterEmail: string;
  reporterPosition: string | null;
  /** Usuario del sistema que registró (auditoría) */
  createdBy: UserSummary;
  assignee: UserSummary;
  viewers: UserSummary[];
  externalNotificationEmails: ExternalNotificationEmail[];
  actions: CorrectiveAction[];
  fiveWhysSteps: FiveWhysStep[];
  attachments: FindingAttachment[];
  notes: FindingNote[];
  statusHistory: FindingStatusHistory[];
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const FINDING_TYPE_LABELS: Record<FindingType, string> = {
  OBSERVACION: 'Observación',
  NO_CONFORMIDAD: 'No Conformidad',
  INCIDENTE: 'Incidente',
  OPORTUNIDAD_MEJORA: 'Oportunidad de mejora',
};

export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  ABIERTO: 'Abierto',
  EN_TRATAMIENTO: 'En tratamiento',
  ACCION_PENDIENTE: 'Acción pendiente',
  CERRADO: 'Cerrado',
};

export const FINDING_PRIORITY_LABELS: Record<FindingPriority, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
};

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  CORRECTIVA: 'Correctiva',
  PREVENTIVA: 'Preventiva',
};

export const ACTION_STATUS_LABELS: Record<CorrectiveActionStatus, string> = {
  PENDIENTE: 'Pendiente',
  EN_CURSO: 'En curso',
  COMPLETADA: 'Completada',
  VENCIDA: 'Vencida',
};

export const FIVE_WHYS_DEFAULT_QUESTIONS = [
  '¿Por qué ocurrió el incidente?',
  '¿Por qué sucedió eso?',
  '¿Por qué se permitió esa condición?',
  '¿Por qué no se detectó antes?',
  '¿Cuál es la causa raíz?',
];

export type AssignableUser = UserSummary;
