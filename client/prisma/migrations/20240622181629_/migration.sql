/*
  Warnings:

  - Made the column `problemId` on table `testCases` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "testCases" DROP CONSTRAINT "testCases_problemId_fkey";

-- AlterTable
ALTER TABLE "testCases" ALTER COLUMN "problemId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "testCases" ADD CONSTRAINT "testCases_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
