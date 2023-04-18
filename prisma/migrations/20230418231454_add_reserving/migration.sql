-- AlterTable
ALTER TABLE "item" ADD COLUMN     "reserver_id" TEXT;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_reserver_id_fkey" FOREIGN KEY ("reserver_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
