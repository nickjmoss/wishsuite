/*
  Warnings:

  - You are about to drop the column `expirationDate` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `token` table. All the data in the column will be lost.
  - Added the required column `expiration_date` to the `token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token" DROP COLUMN "expirationDate",
DROP COLUMN "userId",
ADD COLUMN     "expiration_date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;
