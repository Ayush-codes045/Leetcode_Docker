/*
  Warnings:

  - You are about to drop the `_SubmissionTotestCases` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `submissionId` to the `testCases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_SubmissionTotestCases" DROP CONSTRAINT "_SubmissionTotestCases_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubmissionTotestCases" DROP CONSTRAINT "_SubmissionTotestCases_B_fkey";

-- AlterTable
ALTER TABLE "testCases" ADD COLUMN     "submissionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_SubmissionTotestCases";

-- AddForeignKey
ALTER TABLE "testCases" ADD CONSTRAINT "testCases_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
