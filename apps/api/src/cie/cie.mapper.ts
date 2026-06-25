import { CieScheduledTask, CieTaskReturn, User } from '@prisma/client';
import {
  CIE_RETURN_REQUIRES_OBSERVATION,
  formatDateOnly,
} from './cie.constants';
import { CieReturnStatus } from '@prisma/client';

type UserSummary = Pick<User, 'id' | 'name' | 'email'>;

const userSelect = { id: true, name: true, email: true } as const;

export const cieTaskInclude = {
  returns: {
    include: { submittedBy: { select: userSelect } },
    orderBy: { returnDate: 'desc' as const },
  },
};

type TaskWithReturns = CieScheduledTask & {
  returns: (CieTaskReturn & { submittedBy: UserSummary })[];
};

export function toCieTaskResponse(task: TaskWithReturns, returnDate?: string) {
  const dayReturn = returnDate
    ? task.returns.find(
        (r) => formatDateOnly(r.returnDate) === returnDate,
      )
    : task.returns[0];

  return {
    id: task.id,
    workGroup: task.workGroup,
    scheduledDate: formatDateOnly(task.scheduledDate),
    year: task.year,
    month: task.month,
    businessDayIndex: task.businessDayIndex,
    sortOrder: task.sortOrder,
    programOrder: task.programOrder,
    workOrder: task.workOrder,
    equipment: task.equipment,
    plant: task.plant,
    description: task.description,
    company: task.company,
    durationHours: task.durationHours,
    activityTypes: task.activityTypes,
    isRescheduled: task.isRescheduled,
    originalScheduledDate: task.originalScheduledDate
      ? formatDateOnly(task.originalScheduledDate)
      : null,
    rescheduleReason: task.rescheduleReason,
    return: dayReturn
      ? {
          id: dayReturn.id,
          status: dayReturn.status,
          observations: dayReturn.observations,
          submittedBy: dayReturn.submittedBy,
          submittedAt: dayReturn.submittedAt,
        }
      : null,
  };
}

export function validateReturnObservations(
  status: CieReturnStatus,
  observations?: string,
) {
  if (status === 'TERM') return;
  if (CIE_RETURN_REQUIRES_OBSERVATION.has(status) && !observations?.trim()) {
    throw new Error('Las observaciones son obligatorias si la tarea no finalizó');
  }
}
