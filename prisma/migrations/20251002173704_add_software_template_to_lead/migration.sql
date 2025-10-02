-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "softwareTemplateId" INTEGER;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_softwareTemplateId_fkey" FOREIGN KEY ("softwareTemplateId") REFERENCES "Software"("id") ON DELETE SET NULL ON UPDATE CASCADE;
