/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "scope" TEXT;
