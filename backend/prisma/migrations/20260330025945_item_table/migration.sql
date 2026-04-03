-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('THB', 'JPY', 'CNY', 'USD');

-- CreateEnum
CREATE TYPE "GunplaGrade" AS ENUM ('other', 'NG', 'SD', 'EG', 'HG', 'MG', 'PG', 'RG', 'RE100', 'FM', 'MGSD', 'MEGA');

-- CreateEnum
CREATE TYPE "GunplaExclusivity" AS ENUM ('none', 'gundam_base_limited', 'p_bandai', 'event', 'special_package');

-- CreateEnum
CREATE TYPE "LiquidProductType" AS ENUM ('paint', 'primer', 'solvent', 'thinner', 'cement');

-- CreateEnum
CREATE TYPE "ResinType" AS ENUM ('acrylic', 'lacquer', 'enamel', 'epoxy');

-- CreateEnum
CREATE TYPE "PaintApplicationMethod" AS ENUM ('spray', 'brush', 'air_brush_ready', 'panel_liner');

-- CreateEnum
CREATE TYPE "PaintFinish" AS ENUM ('gloss', 'semi_gloss', 'satin', 'matte');

-- CreateEnum
CREATE TYPE "ColorTone" AS ENUM ('special', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'black', 'white', 'gray', 'pink', 'brown', 'gold', 'silver', 'copper');

-- CreateEnum
CREATE TYPE "PaintSpecialPorperty" AS ENUM ('clear', 'metalic');

-- CreateTable
CREATE TABLE "CategoryDetail" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CategoryDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemOnUser" (
    "itemId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ItemOnUser_pkey" PRIMARY KEY ("itemId","userId")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailPath" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "stockQty" INTEGER NOT NULL,
    "storePriceThb" DOUBLE PRECISION NOT NULL,
    "msrpPrice" DOUBLE PRECISION,
    "msrpCurrency" "Currency",
    "releaseYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FigureCommon" (
    "id" SERIAL NOT NULL,
    "fromSerie" TEXT,
    "height" DOUBLE PRECISION,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "FigureCommon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BandaiGunplaDetail" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "grade" "GunplaGrade" NOT NULL,
    "exclusivity" "GunplaExclusivity" NOT NULL DEFAULT 'none',

    CONSTRAINT "BandaiGunplaDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidProductCommon" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "liquidProductType" "LiquidProductType" NOT NULL,
    "resinType" "ResinType",
    "volumeMl" INTEGER NOT NULL,

    CONSTRAINT "LiquidProductCommon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintDetail" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "colorTone" "ColorTone" NOT NULL,
    "paintSpecialPorperty" "PaintSpecialPorperty",
    "paintApplicationMethod" "PaintApplicationMethod" NOT NULL,
    "paintFinish" "PaintFinish",

    CONSTRAINT "PaintDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemOnUser" ADD CONSTRAINT "ItemOnUser_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOnUser" ADD CONSTRAINT "ItemOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FigureCommon" ADD CONSTRAINT "FigureCommon_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BandaiGunplaDetail" ADD CONSTRAINT "BandaiGunplaDetail_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidProductCommon" ADD CONSTRAINT "LiquidProductCommon_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintDetail" ADD CONSTRAINT "PaintDetail_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
