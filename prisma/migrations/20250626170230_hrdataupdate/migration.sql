/*
  Warnings:

  - Added the required column `password` to the `HRdata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HRdata" ADD COLUMN     "password" TEXT NOT NULL;
