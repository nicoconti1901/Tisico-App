import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CorrectiveActionStatus,
  FindingStatus,
  FindingType,
  Prisma,
} from '@prisma/client';
import { AuthUser } from '../auth/decorators/current-user.decorator';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import {
  CreateCorrectiveActionDto,
  CreateFindingDto,
  CreateFindingNoteDto,
  UpdateCorrectiveActionDto,
  UpdateFindingStatusDto,
  UpdateFiveWhysDto,
} from './dto/finding.dto';
import {
  FINDING_STATUS_LABELS,
  FINDING_TYPE_LABELS,
  findingInclude,
  toFindingResponse,
} from './findings.mapper';

@Injectable()
export class FindingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
  ) {}

  async listAssignableUsers() {
    const users = await this.prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    });
    return users;
  }

  listNotificationDefaults() {
    const raw =
      this.config.get<string>('FINDINGS_DEFAULT_NOTIFICATION_EMAILS') ?? '';
    const emails = raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0 && e.includes('@'));

    return {
      emails: [...new Set(emails)],
      description:
        'Correos genéricos de notificación (configurables en el servidor)',
    };
  }

  async findAll() {
    const findings = await this.prisma.finding.findMany({
      include: findingInclude,
      orderBy: { createdAt: 'desc' },
    });
    return findings.map(toFindingResponse);
  }

  async findById(id: string) {
    const finding = await this.prisma.finding.findUnique({
      where: { id },
      include: findingInclude,
    });
    if (!finding) {
      throw new NotFoundException('Hallazgo no encontrado');
    }
    return toFindingResponse(finding);
  }

  async create(dto: CreateFindingDto, reporter: AuthUser) {
    this.validateTypeDetails(dto.type, dto.typeDetails);

    if (dto.type === FindingType.INCIDENTE && dto.fiveWhysSteps?.length) {
      this.validateFiveWhys(dto.fiveWhysSteps);
    }

    const assignee = await this.prisma.user.findFirst({
      where: { id: dto.assigneeId, active: true },
    });
    if (!assignee) {
      throw new BadRequestException('Responsable de tratamiento inválido');
    }

    const viewerIds = (dto.viewerIds ?? []).filter(
      (id) => id !== dto.assigneeId,
    );
    const viewers = await this.prisma.user.findMany({
      where: { id: { in: viewerIds }, active: true },
    });

    const notificationEmails = this.normalizeEmails(dto.notificationEmails);
    if (notificationEmails.includes(assignee.email.toLowerCase())) {
      throw new BadRequestException(
        'El responsable de tratamiento no puede estar en copia de conocimiento',
      );
    }

    const code = await this.generateCode();

    const finding = await this.prisma.$transaction(async (tx) => {
      const created = await tx.finding.create({
        data: {
          code,
          type: dto.type,
          priority: dto.priority,
          title: dto.title,
          description: dto.description,
          area: dto.area,
          sector: dto.sector,
          locationDetail: dto.locationDetail,
          occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined,
          typeDetails: dto.typeDetails as Prisma.InputJsonValue,
          rootCause: dto.rootCause,
          rootCauseMeasures: dto.rootCauseMeasures,
          reporterName: dto.reporterName.trim(),
          reporterEmail: dto.reporterEmail.trim().toLowerCase(),
          reporterPosition: dto.reporterPosition?.trim(),
          reporterId: reporter.id,
          assigneeId: dto.assigneeId,
          viewers: {
            create: viewers.map((v) => ({ userId: v.id })),
          },
          externalRecipients: {
            create: notificationEmails.map((email) => ({ email })),
          },
          statusHistory: {
            create: {
              toStatus: FindingStatus.ABIERTO,
              changedById: reporter.id,
              comment: 'Hallazgo registrado',
            },
          },
          actions: dto.actions?.length
            ? {
                create: dto.actions.map((a) => ({
                  type: a.type,
                  description: a.description,
                  dueDate: new Date(a.dueDate),
                  responsibleId: a.responsibleId,
                })),
              }
            : undefined,
          fiveWhysSteps: dto.fiveWhysSteps?.length
            ? {
                create: dto.fiveWhysSteps.map((s) => ({
                  level: s.level,
                  question: s.question,
                  answer: s.answer,
                })),
              }
            : undefined,
        },
        include: findingInclude,
      });

      return created;
    });

    await this.sendCreationEmails(finding);

    return toFindingResponse(finding);
  }

  async updateStatus(
    id: string,
    dto: UpdateFindingStatusDto,
    user: AuthUser,
  ) {
    const existing = await this.prisma.finding.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Hallazgo no encontrado');
    }

    const finding = await this.prisma.finding.update({
      where: { id },
      data: {
        status: dto.status,
        closedAt: dto.status === FindingStatus.CERRADO ? new Date() : null,
        statusHistory: {
          create: {
            fromStatus: existing.status,
            toStatus: dto.status,
            comment: dto.comment,
            changedById: user.id,
          },
        },
      },
      include: findingInclude,
    });

    return toFindingResponse(finding);
  }

  async addNote(id: string, dto: CreateFindingNoteDto, user: AuthUser) {
    await this.ensureFinding(id);

    await this.prisma.findingNote.create({
      data: {
        findingId: id,
        authorId: user.id,
        content: dto.content,
      },
    });

    return this.findById(id);
  }

  async updateFiveWhys(id: string, dto: UpdateFiveWhysDto) {
    const finding = await this.prisma.finding.findUnique({ where: { id } });
    if (!finding) {
      throw new NotFoundException('Hallazgo no encontrado');
    }
    if (finding.type !== FindingType.INCIDENTE) {
      throw new BadRequestException(
        'Los 5 porqués solo aplican a incidentes',
      );
    }

    this.validateFiveWhys(dto.steps);

    await this.prisma.$transaction(async (tx) => {
      await tx.fiveWhysStep.deleteMany({ where: { findingId: id } });
      await tx.fiveWhysStep.createMany({
        data: dto.steps.map((s) => ({
          findingId: id,
          level: s.level,
          question: s.question,
          answer: s.answer,
        })),
      });
      await tx.finding.update({
        where: { id },
        data: {
          rootCause: dto.rootCause,
          rootCauseMeasures: dto.rootCauseMeasures,
        },
      });
    });

    return this.findById(id);
  }

  async addAction(id: string, dto: CreateCorrectiveActionDto) {
    await this.ensureFinding(id);

    await this.prisma.correctiveAction.create({
      data: {
        findingId: id,
        type: dto.type,
        description: dto.description,
        dueDate: new Date(dto.dueDate),
        responsibleId: dto.responsibleId,
      },
    });

    return this.findById(id);
  }

  async updateAction(
    findingId: string,
    actionId: string,
    dto: UpdateCorrectiveActionDto,
  ) {
    const action = await this.prisma.correctiveAction.findFirst({
      where: { id: actionId, findingId },
    });
    if (!action) {
      throw new NotFoundException('Acción no encontrada');
    }

    await this.prisma.correctiveAction.update({
      where: { id: actionId },
      data: {
        status: dto.status,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        completedAt:
          dto.status === CorrectiveActionStatus.COMPLETADA
            ? new Date()
            : dto.status
              ? null
              : undefined,
      },
    });

    return this.findById(findingId);
  }

  async addAttachment(
    id: string,
    file: Express.Multer.File,
    user: AuthUser,
  ) {
    await this.ensureFinding(id);

    const { key, fileName } = await this.storage.uploadFindingFile(id, file);

    await this.prisma.findingAttachment.create({
      data: {
        findingId: id,
        fileName,
        fileKey: key,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        uploadedById: user.id,
      },
    });

    return this.findById(id);
  }

  async getAttachmentUrl(findingId: string, attachmentId: string) {
    const attachment = await this.prisma.findingAttachment.findFirst({
      where: { id: attachmentId, findingId },
    });
    if (!attachment) {
      throw new NotFoundException('Adjunto no encontrado');
    }

    const url = await this.storage.getSignedDownloadUrl(attachment.fileKey);
    return { url, fileName: attachment.fileName };
  }

  private async ensureFinding(id: string) {
    const finding = await this.prisma.finding.findUnique({ where: { id } });
    if (!finding) {
      throw new NotFoundException('Hallazgo no encontrado');
    }
    return finding;
  }

  private async generateCode() {
    const year = new Date().getFullYear();
    const prefix = `H-${year}-`;
    const last = await this.prisma.finding.findFirst({
      where: { code: { startsWith: prefix } },
      orderBy: { code: 'desc' },
    });

    const next = last
      ? Number.parseInt(last.code.replace(prefix, ''), 10) + 1
      : 1;

    return `${prefix}${String(next).padStart(4, '0')}`;
  }

  private validateTypeDetails(
    type: FindingType,
    details: Record<string, unknown>,
  ) {
    const required: Record<FindingType, string[]> = {
      OBSERVACION: ['observationCategory'],
      NO_CONFORMIDAD: ['processAffected', 'standardReference'],
      INCIDENTE: ['incidentClass', 'immediateActions'],
      OPORTUNIDAD_MEJORA: ['currentSituation', 'proposedImprovement'],
    };

    for (const field of required[type]) {
      if (!details[field]) {
        throw new BadRequestException(
          `Falta el campo requerido para ${FINDING_TYPE_LABELS[type]}: ${field}`,
        );
      }
    }
  }

  private validateFiveWhys(
    steps: { level: number; question: string; answer: string }[],
  ) {
    const levels = steps.map((s) => s.level).sort();
    if (levels.length < 1 || levels[0] < 1 || levels[levels.length - 1] > 5) {
      throw new BadRequestException(
        'Los 5 porqués deben tener entre 1 y 5 niveles',
      );
    }
  }

  private normalizeEmails(emails: string[] | undefined) {
    if (!emails?.length) return [];
    return [
      ...new Set(
        emails
          .map((e) => e.trim().toLowerCase())
          .filter((e) => e.length > 0),
      ),
    ];
  }

  private async sendCreationEmails(
    finding: Awaited<ReturnType<typeof this.prisma.finding.create>>,
  ) {
    const full = await this.prisma.finding.findUnique({
      where: { id: finding.id },
      include: {
        assignee: true,
        viewers: { include: { user: true } },
        externalRecipients: true,
      },
    });
    if (!full) return;

    const baseUrl =
      this.config.get<string>('APP_PUBLIC_URL') ?? 'http://localhost:3000';
    const directLink = `${baseUrl}/dashboard/seguridad/hallazgos/${finding.id}`;
    const summary = finding.description.slice(0, 280);

    const basePayload = {
      findingCode: finding.code,
      findingTitle: finding.title,
      findingType: FINDING_TYPE_LABELS[finding.type] ?? finding.type,
      findingStatus: FINDING_STATUS_LABELS[finding.status] ?? finding.status,
      reporterName: full.reporterName,
      reporterEmail: full.reporterEmail,
      assigneeName: full.assignee.name,
      assigneeEmail: full.assignee.email,
      directLink,
      summary,
      viewerEmails: [] as string[],
    };

    await this.mail.sendFindingNotification({
      ...basePayload,
      isAssignee: true,
      viewerEmails: [],
    });

    const viewerEmails = [
      ...full.viewers.map((v) => v.user.email),
      ...full.externalRecipients.map((r) => r.email),
    ].filter(
      (email, index, all) =>
        all.indexOf(email) === index &&
        email.toLowerCase() !== full.assignee.email.toLowerCase(),
    );

    if (viewerEmails.length) {
      await this.mail.sendFindingNotification({
        ...basePayload,
        isAssignee: false,
        viewerEmails,
      });
    }
  }
}
