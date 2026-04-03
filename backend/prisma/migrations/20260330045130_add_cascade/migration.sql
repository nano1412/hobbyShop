-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_liquidProductCommonId_fkey";

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_liquidProductCommonId_fkey" FOREIGN KEY ("liquidProductCommonId") REFERENCES "liquid_product_common"("id") ON DELETE CASCADE ON UPDATE CASCADE;
