-- Datos editables del reportante
ALTER TABLE "findings" ADD COLUMN "reporterName" TEXT;
ALTER TABLE "findings" ADD COLUMN "reporterEmail" TEXT;
ALTER TABLE "findings" ADD COLUMN "reporterPosition" TEXT;

UPDATE "findings" f
SET
  "reporterName" = u.name,
  "reporterEmail" = u.email
FROM "users" u
WHERE f."reporterId" = u.id;

ALTER TABLE "findings" ALTER COLUMN "reporterName" SET NOT NULL;
ALTER TABLE "findings" ALTER COLUMN "reporterEmail" SET NOT NULL;

-- Destinatarios externos (correos manuales / genéricos)
CREATE TABLE "finding_external_recipients" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "finding_external_recipients_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "finding_external_recipients_findingId_email_key"
ON "finding_external_recipients"("findingId", "email");

ALTER TABLE "finding_external_recipients"
ADD CONSTRAINT "finding_external_recipients_findingId_fkey"
FOREIGN KEY ("findingId") REFERENCES "findings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
