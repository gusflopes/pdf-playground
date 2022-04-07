/*
  Warnings:

  - Added the required column `pix` to the `receipts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "pix" TEXT NOT NULL;
