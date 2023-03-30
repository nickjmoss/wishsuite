-- AlterTable
ALTER TABLE "wishlist" ADD COLUMN     "occasion_id" TEXT;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "occasion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
