-- CreateEnum
CREATE TYPE "FindingType" AS ENUM ('OBSERVACION', 'NO_CONFORMIDAD', 'INCIDENTE', 'OPORTUNIDAD_MEJORA');

-- CreateEnum
CREATE TYPE "FindingStatus" AS ENUM ('ABIERTO', 'EN_TRATAMIENTO', 'ACCION_PENDIENTE', 'CERRADO');

-- CreateEnum
CREATE TYPE "FindingPriority" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CORRECTIVA', 'PREVENTIVA');

-- CreateEnum
CREATE TYPE "CorrectiveActionStatus" AS ENUM ('PENDIENTE', 'EN_CURSO', 'COMPLETADA', 'VENCIDA');

-- CreateTable
CREATE TABLE "findings" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "FindingType" NOT NULL,
    "status" "FindingStatus" NOT NULL DEFAULT 'ABIERTO',
    "priority" "FindingPriority" NOT NULL DEFAULT 'MEDIA',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "area" TEXT,
    "sector" TEXT,
    "locationDetail" TEXT,
    "occurredAt" TIMESTAMP(3),
    "typeDetails" JSONB NOT NULL DEFAULT '{}',
    "rootCause" TEXT,
    "rootCauseMeasures" TEXT,
    "reporterId" TEXT NOT NULL,
    "assigneeId" TEXT NOT NULL,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finding_viewers" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "finding_viewers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "five_whys_steps" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "five_whys_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corrective_actions" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "type" "ActionType" NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "CorrectiveActionStatus" NOT NULL DEFAULT 'PENDIENTE',
    "responsibleId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "corrective_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finding_attachments" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finding_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finding_notes" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finding_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finding_status_history" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "fromStatus" "FindingStatus",
    "toStatus" "FindingStatus" NOT NULL,
    "comment" TEXT,
    "changedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finding_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "findings_code_key" ON "findings"("code");

-- CreateIndex
CREATE INDEX "findings_type_idx" ON "findings"("type");

-- CreateIndex
CREATE INDEX "findings_status_idx" ON "findings"("status");

-- CreateIndex
CREATE INDEX "findings_assigneeId_idx" ON "findings"("assigneeId");

-- CreateIndex
CREATE UNIQUE INDEX "finding_viewers_findingId_userId_key" ON "finding_viewers"("findingId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "five_whys_steps_findingId_level_key" ON "five_whys_steps"("findingId", "level");

-- CreateIndex
CREATE INDEX "corrective_actions_dueDate_idx" ON "corrective_actions"("dueDate");

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_viewers" ADD CONSTRAINT "finding_viewers_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "findings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_viewers" ADD CONSTRAINT "finding_viewers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "five_whys_steps" ADD CONSTRAINT "five_whys_steps_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "findings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrective_actions" ADD CONSTRAINT "corrective_actions_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "findings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrective_actions" ADD CONSTRAINT "corrective_actions_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_attachments" ADD CONSTRAINT "finding_attachments_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "findings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_attachments" ADD CONSTRAINT "finding_attachments_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_notes" ADD CONSTRAINT "finding_notes_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "findings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_notes" ADD CONSTRAINT "finding_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_status_history" ADD CONSTRAINT "finding_status_history_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "findings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_status_history" ADD CONSTRAINT "finding_status_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
