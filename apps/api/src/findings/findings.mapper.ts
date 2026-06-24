import {
  CorrectiveAction,
  Finding,
  FindingAttachment,
  FindingExternalRecipient,
  FindingNote,
  FindingStatusHistory,
  FindingViewer,
  FiveWhysStep,
  User,
} from '@prisma/client';

type UserSummary = Pick<User, 'id' | 'name' | 'email' | 'role'>;

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export const findingInclude = {
  reporter: { select: userSelect },
  assignee: { select: userSelect },
  viewers: {
    include: { user: { select: userSelect } },
  },
  externalRecipients: true,
  actions: {
    include: { responsible: { select: userSelect } },
    orderBy: { dueDate: 'asc' as const },
  },
  fiveWhysSteps: { orderBy: { level: 'asc' as const } },
  attachments: {
    include: { uploadedBy: { select: userSelect } },
    orderBy: { createdAt: 'desc' as const },
  },
  notes: {
    include: { author: { select: userSelect } },
    orderBy: { createdAt: 'desc' as const },
  },
  statusHistory: {
    include: { changedBy: { select: userSelect } },
    orderBy: { createdAt: 'desc' as const },
  },
};

type FindingWithRelations = Finding & {
  reporter: UserSummary;
  assignee: UserSummary;
  viewers: (FindingViewer & { user: UserSummary })[];
  externalRecipients: FindingExternalRecipient[];
  actions: (CorrectiveAction & { responsible: UserSummary })[];
  fiveWhysSteps: FiveWhysStep[];
  attachments: (FindingAttachment & { uploadedBy: UserSummary })[];
  notes: (FindingNote & { author: UserSummary })[];
  statusHistory: (FindingStatusHistory & { changedBy: UserSummary })[];
};

export function toFindingResponse(finding: FindingWithRelations) {
  return {
    id: finding.id,
    code: finding.code,
    type: finding.type,
    status: finding.status,
    priority: finding.priority,
    title: finding.title,
    description: finding.description,
    area: finding.area,
    sector: finding.sector,
    locationDetail: finding.locationDetail,
    occurredAt: finding.occurredAt,
    typeDetails: finding.typeDetails,
    rootCause: finding.rootCause,
    rootCauseMeasures: finding.rootCauseMeasures,
    reporterName: finding.reporterName,
    reporterEmail: finding.reporterEmail,
    reporterPosition: finding.reporterPosition,
    createdBy: finding.reporter,
    assignee: finding.assignee,
    viewers: finding.viewers.map((v) => v.user),
    externalNotificationEmails: finding.externalRecipients.map((r) => ({
      email: r.email,
      name: r.name,
    })),
    actions: finding.actions.map((a) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      dueDate: a.dueDate,
      status: a.status,
      responsible: a.responsible,
      completedAt: a.completedAt,
      createdAt: a.createdAt,
    })),
    fiveWhysSteps: finding.fiveWhysSteps,
    attachments: finding.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
      uploadedBy: a.uploadedBy,
      createdAt: a.createdAt,
    })),
    notes: finding.notes.map((n) => ({
      id: n.id,
      content: n.content,
      author: n.author,
      createdAt: n.createdAt,
    })),
    statusHistory: finding.statusHistory.map((h) => ({
      id: h.id,
      fromStatus: h.fromStatus,
      toStatus: h.toStatus,
      comment: h.comment,
      changedBy: h.changedBy,
      createdAt: h.createdAt,
    })),
    closedAt: finding.closedAt,
    createdAt: finding.createdAt,
    updatedAt: finding.updatedAt,
  };
}

export const FINDING_TYPE_LABELS: Record<string, string> = {
  OBSERVACION: 'Observación',
  NO_CONFORMIDAD: 'No Conformidad',
  INCIDENTE: 'Incidente',
  OPORTUNIDAD_MEJORA: 'Oportunidad de mejora',
};

export const FINDING_STATUS_LABELS: Record<string, string> = {
  ABIERTO: 'Abierto',
  EN_TRATAMIENTO: 'En tratamiento',
  ACCION_PENDIENTE: 'Acción pendiente',
  CERRADO: 'Cerrado',
};
