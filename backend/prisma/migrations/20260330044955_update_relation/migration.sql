/*
  Warnings:

  - You are about to drop the column `itemId` on the `bandai_gunpla_detail` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `figure_common` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `liquid_product_common` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `paint_detail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[figureCommonId]` on the table `item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bandaiGunplaDetailId]` on the table `item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[liquidProductCommonId]` on the table `item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paintDetailId]` on the table `item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bandaiGunplaDetailId` to the `item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `figureCommonId` to the `item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liquidProductCommonId` to the `item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paintDetailId` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bandai_gunpla_detail" DROP CONSTRAINT "bandai_gunpla_detail_itemId_fkey";

-- DropForeignKey
ALTER TABLE "figure_common" DROP CONSTRAINT "figure_common_itemId_fkey";

-- DropForeignKey
ALTER TABLE "liquid_product_common" DROP CONSTRAINT "liquid_product_common_itemId_fkey";

-- DropForeignKey
ALTER TABLE "paint_detail" DROP CONSTRAINT "paint_detail_itemId_fkey";

-- DropIndex
DROP INDEX "bandai_gunpla_detail_itemId_key";

-- DropIndex
DROP INDEX "figure_common_itemId_key";

-- DropIndex
DROP INDEX "liquid_product_common_itemId_key";

-- DropIndex
DROP INDEX "paint_detail_itemId_key";

-- AlterTable
ALTER TABLE "bandai_gunpla_detail" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "figure_common" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "item" ADD COLUMN     "bandaiGunplaDetailId" INTEGER NOT NULL,
ADD COLUMN     "figureCommonId" INTEGER NOT NULL,
ADD COLUMN     "liquidProductCommonId" INTEGER NOT NULL,
ADD COLUMN     "paintDetailId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "liquid_product_common" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "paint_detail" DROP COLUMN "itemId";

-- CreateIndex
CREATE UNIQUE INDEX "item_figureCommonId_key" ON "item"("figureCommonId");

-- CreateIndex
CREATE UNIQUE INDEX "item_bandaiGunplaDetailId_key" ON "item"("bandaiGunplaDetailId");

-- CreateIndex
CREATE UNIQUE INDEX "item_liquidProductCommonId_key" ON "item"("liquidProductCommonId");

-- CreateIndex
CREATE UNIQUE INDEX "item_paintDetailId_key" ON "item"("paintDetailId");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_figureCommonId_fkey" FOREIGN KEY ("figureCommonId") REFERENCES "figure_common"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_bandaiGunplaDetailId_fkey" FOREIGN KEY ("bandaiGunplaDetailId") REFERENCES "bandai_gunpla_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_liquidProductCommonId_fkey" FOREIGN KEY ("liquidProductCommonId") REFERENCES "liquid_product_common"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_paintDetailId_fkey" FOREIGN KEY ("paintDetailId") REFERENCES "paint_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
