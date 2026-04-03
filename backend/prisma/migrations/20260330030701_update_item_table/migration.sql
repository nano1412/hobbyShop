/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `BandaiGunplaDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `FigureCommon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `LiquidProductCommon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `PaintDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BandaiGunplaDetail_itemId_key" ON "BandaiGunplaDetail"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "FigureCommon_itemId_key" ON "FigureCommon"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "LiquidProductCommon_itemId_key" ON "LiquidProductCommon"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "PaintDetail_itemId_key" ON "PaintDetail"("itemId");
