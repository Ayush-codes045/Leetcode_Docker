-- DropForeignKey
ALTER TABLE "testCases" DROP CONSTRAINT "testCases_problemId_fkey";

-- AlterTable
ALTER TABLE "testCases" ALTER COLUMN "problemId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "testCases" ADD CONSTRAINT "testCases_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
