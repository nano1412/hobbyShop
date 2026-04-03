/*
  Warnings:

  - You are about to drop the `BandaiGunplaDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FigureCommon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemOnUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LiquidProductCommon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaintDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BandaiGunplaDetail" DROP CONSTRAINT "BandaiGunplaDetail_itemId_fkey";

-- DropForeignKey
ALTER TABLE "FigureCommon" DROP CONSTRAINT "FigureCommon_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ItemOnUser" DROP CONSTRAINT "ItemOnUser_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemOnUser" DROP CONSTRAINT "ItemOnUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "LiquidProductCommon" DROP CONSTRAINT "LiquidProductCommon_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PaintDetail" DROP CONSTRAINT "PaintDetail_itemId_fkey";

-- DropTable
DROP TABLE "BandaiGunplaDetail";

-- DropTable
DROP TABLE "CategoryDetail";

-- DropTable
DROP TABLE "FigureCommon";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "ItemOnUser";

-- DropTable
DROP TABLE "LiquidProductCommon";

-- DropTable
DROP TABLE "PaintDetail";

-- CreateTable
CREATE TABLE "category_detail" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "category_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailPath" TEXT,
    "brand" TEXT NOT NULL,
    "stockQty" INTEGER NOT NULL,
    "storePriceThb" DOUBLE PRECISION NOT NULL,
    "msrpPrice" DOUBLE PRECISION,
    "msrpCurrency" "Currency",
    "releaseYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "figure_common" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "fromSerie" TEXT,
    "height" DOUBLE PRECISION,

    CONSTRAINT "figure_common_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bandai_gunpla_detail" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "grade" "GunplaGrade" NOT NULL,
    "exclusivity" "GunplaExclusivity" NOT NULL DEFAULT 'none',

    CONSTRAINT "bandai_gunpla_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liquid_product_common" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "liquidProductType" "LiquidProductType" NOT NULL,
    "resinType" "ResinType",
    "volumeMl" INTEGER NOT NULL,

    CONSTRAINT "liquid_product_common_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paint_detail" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "colorTone" "ColorTone" NOT NULL,
    "paintSpecialPorperty" "PaintSpecialPorperty",
    "paintApplicationMethod" "PaintApplicationMethod" NOT NULL,
    "paintFinish" "PaintFinish",

    CONSTRAINT "paint_detail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "item_categoryId_brand_idx" ON "item"("categoryId", "brand");

-- CreateIndex
CREATE UNIQUE INDEX "figure_common_itemId_key" ON "figure_common"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "bandai_gunpla_detail_itemId_key" ON "bandai_gunpla_detail"("itemId");

-- CreateIndex
CREATE INDEX "bandai_gunpla_detail_grade_idx" ON "bandai_gunpla_detail"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "liquid_product_common_itemId_key" ON "liquid_product_common"("itemId");

-- CreateIndex
CREATE INDEX "liquid_product_common_liquidProductType_idx" ON "liquid_product_common"("liquidProductType");

-- CreateIndex
CREATE UNIQUE INDEX "paint_detail_itemId_key" ON "paint_detail"("itemId");

-- CreateIndex
CREATE INDEX "paint_detail_colorTone_paintApplicationMethod_paintFinish_idx" ON "paint_detail"("colorTone", "paintApplicationMethod", "paintFinish");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category_detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "figure_common" ADD CONSTRAINT "figure_common_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bandai_gunpla_detail" ADD CONSTRAINT "bandai_gunpla_detail_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liquid_product_common" ADD CONSTRAINT "liquid_product_common_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paint_detail" ADD CONSTRAINT "paint_detail_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
