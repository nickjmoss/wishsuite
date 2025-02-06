/*
  Warnings:

  - You are about to drop the column `visibility` on the `wishlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wishlist" DROP COLUMN "visibility",
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false;
