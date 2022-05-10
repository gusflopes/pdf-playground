/*
  Warnings:

  - The values [P_399_Transferencia] on the enum `Parser` will be removed. If these variants are still used in the database, this will fail.
  - The values [TRANF] on the enum `TransactionTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Parser_new" AS ENUM ('P_399_TEDC', 'P_399_TRANSF', 'P_341_PIX', 'P_748_TED');
ALTER TABLE "batches" ALTER COLUMN "parser" TYPE "Parser_new" USING ("parser"::text::"Parser_new");
ALTER TYPE "Parser" RENAME TO "Parser_old";
ALTER TYPE "Parser_new" RENAME TO "Parser";
DROP TYPE "Parser_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionTypes_new" AS ENUM ('PIX', 'DOC', 'TEDC', 'TEDD', 'TRANSF');
ALTER TABLE "batches" ALTER COLUMN "transaction_type" TYPE "TransactionTypes_new" USING ("transaction_type"::text::"TransactionTypes_new");
ALTER TYPE "TransactionTypes" RENAME TO "TransactionTypes_old";
ALTER TYPE "TransactionTypes_new" RENAME TO "TransactionTypes";
DROP TYPE "TransactionTypes_old";
COMMIT;
