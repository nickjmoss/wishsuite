/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.
  - Added the required column `deleted_at` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "deletedAt",
ADD COLUMN     "deleted_at" TIMESTAMP(3) NOT NULL;
