/*
  Warnings:

  - The values [special] on the enum `ColorTone` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `height` on the `figure_common` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ColorTone_new" AS ENUM ('other', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'black', 'white', 'gray', 'pink', 'brown', 'gold', 'silver', 'copper');
ALTER TABLE "paint_detail" ALTER COLUMN "colorTone" TYPE "ColorTone_new" USING ("colorTone"::text::"ColorTone_new");
ALTER TYPE "ColorTone" RENAME TO "ColorTone_old";
ALTER TYPE "ColorTone_new" RENAME TO "ColorTone";
DROP TYPE "public"."ColorTone_old";
COMMIT;

-- AlterEnum
ALTER TYPE "LiquidProductType" ADD VALUE 'other';

-- AlterEnum
ALTER TYPE "PaintApplicationMethod" ADD VALUE 'other';

-- AlterEnum
ALTER TYPE "PaintFinish" ADD VALUE 'other';

-- AlterEnum
ALTER TYPE "PaintSpecialPorperty" ADD VALUE 'none';

-- AlterEnum
ALTER TYPE "ResinType" ADD VALUE 'none';

-- AlterTable
ALTER TABLE "figure_common" DROP COLUMN "height",
ADD COLUMN     "heightCm" INTEGER;

-- AlterTable
ALTER TABLE "liquid_product_common" ALTER COLUMN "volumeMl" SET DATA TYPE DOUBLE PRECISION;
