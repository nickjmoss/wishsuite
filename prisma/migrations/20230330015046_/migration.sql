/*
  Warnings:

  - You are about to drop the column `is_published` on the `wishlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wishlist" DROP COLUMN "is_published",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;
