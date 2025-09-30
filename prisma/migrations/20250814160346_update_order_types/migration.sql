/*
  Warnings:

  - You are about to drop the column `demoConsentAccepted` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "demoConsentAccepted",
ADD COLUMN     "codeConsentAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "collaborationConsentAccepted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "orderType" SET DEFAULT 'collaboration';
