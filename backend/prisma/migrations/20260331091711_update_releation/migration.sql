/*
  Warnings:

  - You are about to drop the column `bandaiGunplaDetailId` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `figureCommonId` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `liquidProductCommonId` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `paintDetailId` on the `item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemId]` on the table `bandai_gunpla_detail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `figure_common` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `liquid_product_common` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `paint_detail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `bandai_gunpla_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `figure_common` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `liquid_product_common` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `paint_detail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_bandaiGunplaDetailId_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_figureCommonId_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_liquidProductCommonId_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_paintDetailId_fkey";

-- DropIndex
DROP INDEX "item_bandaiGunplaDetailId_key";

-- DropIndex
DROP INDEX "item_figureCommonId_key";

-- DropIndex
DROP INDEX "item_liquidProductCommonId_key";

-- DropIndex
DROP INDEX "item_paintDetailId_key";

-- AlterTable
ALTER TABLE "bandai_gunpla_detail" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "figure_common" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "item" DROP COLUMN "bandaiGunplaDetailId",
DROP COLUMN "figureCommonId",
DROP COLUMN "liquidProductCommonId",
DROP COLUMN "paintDetailId";

-- AlterTable
ALTER TABLE "liquid_product_common" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "paint_detail" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bandai_gunpla_detail_itemId_key" ON "bandai_gunpla_detail"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "figure_common_itemId_key" ON "figure_common"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "liquid_product_common_itemId_key" ON "liquid_product_common"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "paint_detail_itemId_key" ON "paint_detail"("itemId");

-- AddForeignKey
ALTER TABLE "figure_common" ADD CONSTRAINT "figure_common_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bandai_gunpla_detail" ADD CONSTRAINT "bandai_gunpla_detail_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liquid_product_common" ADD CONSTRAINT "liquid_product_common_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paint_detail" ADD CONSTRAINT "paint_detail_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
