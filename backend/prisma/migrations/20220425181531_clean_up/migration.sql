/*
  Warnings:

  - You are about to drop the column `file_id` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the `receipts_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "receipts" DROP CONSTRAINT "receipts_file_id_fkey";

-- DropForeignKey
ALTER TABLE "receipts_data" DROP CONSTRAINT "receipts_data_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "receipts_data" DROP CONSTRAINT "receipts_data_receipt_id_fkey";

-- AlterTable
ALTER TABLE "receipts" DROP COLUMN "file_id";

-- DropTable
DROP TABLE "receipts_data";

-- CreateTable
CREATE TABLE "receipt_files" (
    "id" TEXT NOT NULL,
    "receipt_id" TEXT NOT NULL,
    "batch_id" TEXT,
    "account_id" TEXT,
    "path" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "ext" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipt_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "receipt_files_receipt_id_key" ON "receipt_files"("receipt_id");

-- AddForeignKey
ALTER TABLE "receipt_files" ADD CONSTRAINT "receipt_files_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_files" ADD CONSTRAINT "receipt_files_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_files" ADD CONSTRAINT "receipt_files_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
