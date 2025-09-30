/*
  Warnings:

  - Added the required column `url` to the `OrderFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderFile" ADD COLUMN     "url" TEXT NOT NULL;
