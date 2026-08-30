/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `Enquiry` table. All the data in the column will be lost.
  - The `needs` column on the `Enquiry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Enquiry" DROP COLUMN "logoUrl",
ADD COLUMN     "logoName" TEXT,
DROP COLUMN "needs",
ADD COLUMN     "needs" TEXT[];

-- CreateTable
CREATE TABLE "StockItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "low" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StockItem_pkey" PRIMARY KEY ("id")
);
