/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `category_detail` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "category_detail" ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "category_detail_name_key" ON "category_detail"("name");
