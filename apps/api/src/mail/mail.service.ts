import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export type FindingEmailPayload = {
  findingCode: string;
  findingTitle: string;
  findingType: string;
  findingStatus: string;
  reporterName: string;
  reporterEmail: string;
  assigneeName: string;
  assigneeEmail: string;
  viewerEmails: string[];
  directLink: string;
  summary: string;
  isAssignee: boolean;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get('SMTP_PORT') ?? 587),
        secure: this.config.get('SMTP_SECURE') === 'true',
        auth: { user, pass },
      });
    } else {
      this.logger.warn(
        'SMTP no configurado — los correos se registrarán en consola (modo desarrollo)',
      );
    }
  }

  async sendFindingNotification(payload: FindingEmailPayload) {
    const from =
      this.config.get<string>('SMTP_FROM') ??
      this.config.get<string>('SMTP_USER') ??
      'hallazgos@tisico.local';

    const subject = payload.isAssignee
      ? `[Tisico SHE] Asignación de tratamiento — ${payload.findingCode}`
      : `[Tisico SHE] Notificación de hallazgo — ${payload.findingCode}`;

    const responsibilityBlock = payload.isAssignee
      ? `<p style="color:#b45309;font-weight:bold;">Sos el responsable exclusivo del tratamiento de este hallazgo.</p>`
      : `<p style="color:#475569;">Recibís esta notificación solo para conocimiento. No tenés responsabilidad de tratamiento.</p>`;

    const html = `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:0 auto;color:#0f172a;">
        <h2 style="color:#1e40af;margin-bottom:4px;">${payload.findingCode} — ${payload.findingTitle}</h2>
        <p style="color:#64748b;margin-top:0;">Tipo: ${payload.findingType} · Estado: ${payload.findingStatus}</p>
        ${responsibilityBlock}
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0 0 8px;"><strong>Reportado por:</strong> ${payload.reporterName} (${payload.reporterEmail})</p>
          <p style="margin:0 0 8px;"><strong>Responsable de tratamiento:</strong> ${payload.assigneeName}</p>
          <p style="margin:0;"><strong>Resumen:</strong> ${payload.summary}</p>
        </div>
        <a href="${payload.directLink}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
          Ver hallazgo en la plataforma
        </a>
        <p style="margin-top:24px;font-size:12px;color:#94a3b8;">
          Notificación enviada desde la cuenta institucional de hallazgos SHE.<br />
          Tisico · Plataforma SHE
        </p>
      </div>
    `;

    const recipients = payload.isAssignee
      ? [payload.assigneeEmail]
      : payload.viewerEmails;

    for (const to of recipients) {
      await this.sendMail({ from, to, subject, html });
    }
  }

  private async sendMail(options: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    if (!this.transporter) {
      this.logger.log(
        `[DEV MAIL] Para: ${options.to} | Asunto: ${options.subject}`,
      );
      return;
    }

    await this.transporter.sendMail(options);
    this.logger.log(`Correo enviado a ${options.to}`);
  }
}
