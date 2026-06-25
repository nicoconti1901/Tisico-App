import { CieActivityType, CieWorkGroup, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { getBusinessDayDate, parseDateOnly } from '../src/cie/cie.constants';

type TemplateJson = {
  workGroup: 'G1' | 'G2';
  businessDayIndex: number;
  sortOrder: number;
  programOrder: number | null;
  workOrder: string | null;
  equipment: string | null;
  plant: string | null;
  description: string;
  company: string;
  durationHours: number;
  activityTypes: string[];
};

type HolidayJson = { date: string; name: string; isBridge: boolean };

export async function seedCie(prisma: PrismaClient) {
  const dataDir = path.join(__dirname, 'data');
  const templates: TemplateJson[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'cie-task-templates.json'), 'utf-8'),
  );
  const holidays: HolidayJson[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'cie-holidays.json'), 'utf-8'),
  );

  await prisma.cieScheduleConfig.upsert({
    where: { id: 'default' },
    create: { horizonEndYear: 2028 },
    update: {},
  });

  for (const h of holidays) {
    await prisma.cieHoliday.upsert({
      where: { date: parseDateOnly(h.date) },
      create: {
        date: parseDateOnly(h.date),
        name: h.name,
        isBridge: h.isBridge,
      },
      update: { name: h.name, isBridge: h.isBridge },
    });
  }

  const holidaySet = new Set(holidays.map((h) => h.date));

  const existingTemplates = await prisma.cieTaskTemplate.count();
  if (existingTemplates === 0) {
    for (const t of templates) {
      await prisma.cieTaskTemplate.create({
        data: {
          workGroup: t.workGroup as CieWorkGroup,
          businessDayIndex: t.businessDayIndex,
          sortOrder: t.sortOrder,
          programOrder: t.programOrder,
          workOrder: t.workOrder,
          equipment: t.equipment,
          plant: t.plant,
          description: t.description,
          company: t.company,
          durationHours: t.durationHours,
          activityTypes: t.activityTypes as CieActivityType[],
        },
      });
    }
  }

  const scheduledCount = await prisma.cieScheduledTask.count();
  if (scheduledCount === 0) {
    const dbTemplates = await prisma.cieTaskTemplate.findMany();
    const batch = [];

    for (let year = 2026; year <= 2028; year++) {
      for (let month = 1; month <= 12; month++) {
        for (const tmpl of dbTemplates) {
          const date = getBusinessDayDate(
            year,
            month,
            tmpl.businessDayIndex,
            holidaySet,
          );
          if (!date) continue;
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

    await prisma.cieScheduledTask.createMany({ data: batch });
    console.log(`CIE: ${dbTemplates.length} plantillas, ${batch.length} tareas programadas (2026-2028)`);
  }
}
