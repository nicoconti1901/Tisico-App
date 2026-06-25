-- CreateEnum
CREATE TYPE "CieWorkGroup" AS ENUM ('G1', 'G2');

-- CreateEnum
CREATE TYPE "CieActivityType" AS ENUM ('LIMPIEZA', 'INSPECCION_VISUAL', 'PRUEBA_ELEMENTOS', 'CALIBRACION');

-- CreateEnum
CREATE TYPE "CieReturnStatus" AS ENUM ('TERM', 'CONT', 'CANC', 'FDM', 'FMO', 'INSP', 'FCL', 'SEG', 'CTR', 'EPT', 'EDE', 'FEM', 'PGR', 'IOOM', 'IOOX', 'IOOE', 'IOOI', 'PP0', 'PLN', 'CONM', 'CONE', 'CALC', 'PTD');

-- CreateTable
CREATE TABLE "cie_schedule_config" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "horizonEndYear" INTEGER NOT NULL DEFAULT 2028,
    CONSTRAINT "cie_schedule_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cie_holidays" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "name" TEXT NOT NULL,
    "isBridge" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "cie_holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cie_task_templates" (
    "id" TEXT NOT NULL,
    "workGroup" "CieWorkGroup" NOT NULL,
    "businessDayIndex" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "programOrder" INTEGER,
    "workOrder" TEXT,
    "equipment" TEXT,
    "plant" TEXT,
    "description" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT 'TISICO FIRE&GAS',
    "durationHours" INTEGER NOT NULL DEFAULT 4,
    "activityTypes" "CieActivityType"[],
    CONSTRAINT "cie_task_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cie_scheduled_tasks" (
    "id" TEXT NOT NULL,
    "templateId" TEXT,
    "workGroup" "CieWorkGroup" NOT NULL,
    "scheduledDate" DATE NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "businessDayIndex" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "programOrder" INTEGER,
    "workOrder" TEXT,
    "equipment" TEXT,
    "plant" TEXT,
    "description" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT 'TISICO FIRE&GAS',
    "durationHours" INTEGER NOT NULL,
    "activityTypes" "CieActivityType"[],
    "isRescheduled" BOOLEAN NOT NULL DEFAULT false,
    "originalScheduledDate" DATE,
    "rescheduleReason" TEXT,
    CONSTRAINT "cie_scheduled_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cie_task_returns" (
    "id" TEXT NOT NULL,
    "scheduledTaskId" TEXT NOT NULL,
    "returnDate" DATE NOT NULL,
    "status" "CieReturnStatus" NOT NULL,
    "observations" TEXT,
    "submittedById" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cie_task_returns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cie_holidays_date_key" ON "cie_holidays"("date");

-- CreateIndex
CREATE INDEX "cie_task_templates_workGroup_businessDayIndex_idx" ON "cie_task_templates"("workGroup", "businessDayIndex");

-- CreateIndex
CREATE INDEX "cie_scheduled_tasks_workGroup_scheduledDate_idx" ON "cie_scheduled_tasks"("workGroup", "scheduledDate");

-- CreateIndex
CREATE INDEX "cie_scheduled_tasks_year_month_idx" ON "cie_scheduled_tasks"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "cie_task_returns_scheduledTaskId_returnDate_key" ON "cie_task_returns"("scheduledTaskId", "returnDate");

-- AddForeignKey
ALTER TABLE "cie_scheduled_tasks" ADD CONSTRAINT "cie_scheduled_tasks_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "cie_task_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cie_task_returns" ADD CONSTRAINT "cie_task_returns_scheduledTaskId_fkey" FOREIGN KEY ("scheduledTaskId") REFERENCES "cie_scheduled_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cie_task_returns" ADD CONSTRAINT "cie_task_returns_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Default config row
INSERT INTO "cie_schedule_config" ("id", "horizonEndYear") VALUES ('default', 2028);
