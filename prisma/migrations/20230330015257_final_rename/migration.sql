/*
  Warnings:

  - You are about to drop the column `isPublished` on the `wishlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wishlist" DROP COLUMN "isPublished",
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false;
