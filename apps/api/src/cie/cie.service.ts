import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CieWorkGroup, Prisma } from '@prisma/client';
import { AuthUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import {
  CIE_ACTIVITY_LABELS,
  CIE_RETURN_REQUIRES_OBSERVATION,
  CIE_RETURN_STATUS_LABELS,
  CIE_WORK_GROUP_LABELS,
  addBusinessDays,
  formatDateOnly,
  getBusinessDayDate,
  getBusinessDaysOfMonth,
  isWeekend,
  nearestBusinessDay,
  parseDateOnly,
} from './cie.constants';
import {
  ExtendCieHorizonDto,
  SubmitCieDayReturnsDto,
  UpdateCieTaskDto,
} from './dto/cie.dto';
import { cieTaskInclude, toCieTaskResponse } from './cie.mapper';

@Injectable()
export class CieService {
  constructor(private readonly prisma: PrismaService) {}

  getMeta() {
    return {
      workGroups: Object.entries(CIE_WORK_GROUP_LABELS).map(([id, label]) => ({
        id,
        label,
      })),
      activityTypes: Object.entries(CIE_ACTIVITY_LABELS).map(([id, label]) => ({
        id,
        label,
      })),
      returnStatuses: Object.entries(CIE_RETURN_STATUS_LABELS).map(
        ([id, label]) => ({
          id,
          label,
          requiresObservation: CIE_RETURN_REQUIRES_OBSERVATION.has(id),
        }),
      ),
    };
  }

  async getConfig() {
    const config = await this.prisma.cieScheduleConfig.findUnique({
      where: { id: 'default' },
    });
    return config ?? { horizonEndYear: 2028 };
  }

  async getDayView(group: CieWorkGroup, dateIso: string) {
    const holidaySet = await this.getHolidaySet();
    const date = parseDateOnly(dateIso);
    const businessDate = nearestBusinessDay(date, holidaySet, 1);
    const dateKey = formatDateOnly(businessDate);

    const tasks = await this.prisma.cieScheduledTask.findMany({
      where: { workGroup: group, scheduledDate: businessDate },
      include: cieTaskInclude,
      orderBy: [{ sortOrder: 'asc' }],
    });

    const businessDays = getBusinessDaysOfMonth(
      businessDate.getUTCFullYear(),
      businessDate.getUTCMonth() + 1,
      holidaySet,
    );
    const businessDayIndex =
      businessDays.findIndex((d) => formatDateOnly(d) === dateKey) + 1;

    const prev = addBusinessDays(businessDate, -1, holidaySet);
    const next = addBusinessDays(businessDate, 1, holidaySet);

    const monthTasks = await this.prisma.cieScheduledTask.findMany({
      where: {
        workGroup: group,
        year: businessDate.getUTCFullYear(),
        month: businessDate.getUTCMonth() + 1,
      },
      select: {
        scheduledDate: true,
        returns: { select: { returnDate: true, status: true } },
      },
    });

    const tasksByDate = new Map<string, typeof monthTasks>();
    for (const task of monthTasks) {
      const key = formatDateOnly(task.scheduledDate);
      if (!tasksByDate.has(key)) tasksByDate.set(key, []);
      tasksByDate.get(key)!.push(task);
    }

    return {
      group,
      groupLabel: CIE_WORK_GROUP_LABELS[group],
      date: dateKey,
      businessDayIndex: businessDayIndex || null,
      isHoliday: holidaySet.has(dateIso),
      isWeekend: isWeekend(date),
      navigation: {
        previous: formatDateOnly(prev),
        next: formatDateOnly(next),
      },
      tasks: tasks.map((t) => toCieTaskResponse(t, dateKey)),
      summary: {
        total: tasks.length,
        withReturn: tasks.filter((t) =>
          t.returns.some((r) => formatDateOnly(r.returnDate) === dateKey),
        ).length,
        completed: tasks.filter((t) =>
          t.returns.some(
            (r) =>
              formatDateOnly(r.returnDate) === dateKey && r.status === 'TERM',
          ),
        ).length,
      },
      monthOverview: businessDays.map((d, i) => {
        const dayKey = formatDateOnly(d);
        const dayTasks = tasksByDate.get(dayKey) ?? [];
        return {
          date: dayKey,
          businessDayIndex: i + 1,
          hasTasks: dayTasks.length > 0,
          returnStatus: this.getDayReturnStatus(dayTasks, dayKey),
        };
      }),
    };
  }

  async getMonthView(group: CieWorkGroup, year: number, month: number) {
    const holidaySet = await this.getHolidaySet();
    const businessDays = getBusinessDaysOfMonth(year, month, holidaySet);

    const tasks = await this.prisma.cieScheduledTask.findMany({
      where: { workGroup: group, year, month },
      include: cieTaskInclude,
    });

    const byDate = new Map<string, typeof tasks>();
    for (const task of tasks) {
      const key = formatDateOnly(task.scheduledDate);
      if (!byDate.has(key)) byDate.set(key, []);
      byDate.get(key)!.push(task);
    }

    return {
      group,
      year,
      month,
      days: businessDays.map((d, i) => {
        const key = formatDateOnly(d);
        const dayTasks = byDate.get(key) ?? [];
        return {
          date: key,
          businessDayIndex: i + 1,
          taskCount: dayTasks.length,
          totalHours: dayTasks.reduce((s, t) => s + t.durationHours, 0),
          returnsSubmitted: dayTasks.filter((t) => t.returns.length > 0).length,
        };
      }),
    };
  }

  async updateTask(id: string, dto: UpdateCieTaskDto) {
    const task = await this.prisma.cieScheduledTask.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Tarea no encontrada');

    const holidaySet = await this.getHolidaySet();
    let scheduledDate = task.scheduledDate;
    let isRescheduled = task.isRescheduled;
    let originalScheduledDate = task.originalScheduledDate;

    if (dto.scheduledDate) {
      const newDate = nearestBusinessDay(
        parseDateOnly(dto.scheduledDate),
        holidaySet,
        1,
      );
      if (formatDateOnly(newDate) !== formatDateOnly(task.scheduledDate)) {
        if (!dto.rescheduleReason?.trim()) {
          throw new BadRequestException(
            'Indicá el motivo del cambio de fecha (ej. factores climáticos)',
          );
        }
        if (!originalScheduledDate) {
          originalScheduledDate = task.scheduledDate;
        }
        scheduledDate = newDate;
        isRescheduled = true;
      }
    }

    const updated = await this.prisma.cieScheduledTask.update({
      where: { id },
      data: {
        workOrder: dto.workOrder,
        equipment: dto.equipment,
        plant: dto.plant,
        description: dto.description,
        durationHours: dto.durationHours,
        activityTypes: dto.activityTypes,
        scheduledDate,
        year: scheduledDate.getUTCFullYear(),
        month: scheduledDate.getUTCMonth() + 1,
        isRescheduled,
        originalScheduledDate,
        rescheduleReason: dto.rescheduleReason ?? task.rescheduleReason,
      },
      include: cieTaskInclude,
    });

    return toCieTaskResponse(updated, formatDateOnly(scheduledDate));
  }

  async submitDayReturns(dto: SubmitCieDayReturnsDto, user: AuthUser) {
    const holidaySet = await this.getHolidaySet();
    const returnDate = nearestBusinessDay(
      parseDateOnly(dto.date),
      holidaySet,
      1,
    );
    const dateKey = formatDateOnly(returnDate);

    for (const item of dto.returns) {
      if (
        CIE_RETURN_REQUIRES_OBSERVATION.has(item.status) &&
        !item.observations?.trim()
      ) {
        throw new BadRequestException(
          `La tarea requiere observaciones para el estado ${item.status}`,
        );
      }
    }

    await this.prisma.$transaction(
      dto.returns.map((item) =>
        this.prisma.cieTaskReturn.upsert({
          where: {
            scheduledTaskId_returnDate: {
              scheduledTaskId: item.scheduledTaskId,
              returnDate,
            },
          },
          create: {
            scheduledTaskId: item.scheduledTaskId,
            returnDate,
            status: item.status,
            observations: item.observations,
            submittedById: user.id,
          },
          update: {
            status: item.status,
            observations: item.observations,
            submittedById: user.id,
          },
        }),
      ),
    );

    return this.getDayView(dto.group, dateKey);
  }

  async extendHorizon(dto: ExtendCieHorizonDto) {
    const config = await this.prisma.cieScheduleConfig.upsert({
      where: { id: 'default' },
      create: { horizonEndYear: dto.endYear },
      update: { horizonEndYear: dto.endYear },
    });

    const currentMax = await this.prisma.cieScheduledTask.aggregate({
      _max: { year: true },
    });
    const startYear = (currentMax._max.year ?? 2025) + 1;
    if (startYear <= dto.endYear) {
      await this.generateScheduleForYears(startYear, dto.endYear);
    }

    return config;
  }

  async generateScheduleForYears(startYear: number, endYear: number) {
    const templates = await this.prisma.cieTaskTemplate.findMany();
    const holidaySet = await this.getHolidaySet();
    const batch: Prisma.CieScheduledTaskCreateManyInput[] = [];

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        for (const tmpl of templates) {
          const date = getBusinessDayDate(
            year,
            month,
            tmpl.businessDayIndex,
            holidaySet,
          );
          if (!date) continue;

          const exists = await this.prisma.cieScheduledTask.findFirst({
            where: {
              templateId: tmpl.id,
              year,
              month,
            },
          });
          if (exists) continue;

          batch.push({
            templateId: tmpl.id,
            workGroup: tmpl.workGroup,
            scheduledDate: date,
            year,
            month,
            businessDayIndex: tmpl.businessDayIndex,
            sortOrder: tmpl.sortOrder,
            programOrder: tmpl.programOrder,
            workOrder: tmpl.workOrder,
            equipment: tmpl.equipment,
            plant: tmpl.plant,
            description: tmpl.description,
            company: tmpl.company,
            durationHours: tmpl.durationHours,
            activityTypes: tmpl.activityTypes,
          });
        }
      }
    }

    if (batch.length) {
      await this.prisma.cieScheduledTask.createMany({ data: batch });
    }

    return { created: batch.length };
  }

  private getDayReturnStatus(
    dayTasks: { returns: { returnDate: Date; status: string }[] }[],
    dateKey: string,
  ): 'programmed' | 'saved_term' | 'saved_open' | null {
    if (dayTasks.length === 0) return null;

    const returnsForDay = dayTasks.map((task) =>
      task.returns.find((r) => formatDateOnly(r.returnDate) === dateKey),
    );

    const savedCount = returnsForDay.filter(Boolean).length;
    if (savedCount === 0) return 'programmed';
    if (savedCount < dayTasks.length) return 'saved_open';
    if (returnsForDay.every((r) => r?.status === 'TERM')) return 'saved_term';
    return 'saved_open';
  }

  private async getHolidaySet(): Promise<Set<string>> {
    const holidays = await this.prisma.cieHoliday.findMany();
    return new Set(holidays.map((h) => formatDateOnly(h.date)));
  }
}
