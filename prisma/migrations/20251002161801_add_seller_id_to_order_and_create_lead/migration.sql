-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sellerId" INTEGER;

-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "info" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
