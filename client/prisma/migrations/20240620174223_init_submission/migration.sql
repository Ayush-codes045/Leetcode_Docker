/*
  Warnings:

  - You are about to drop the column `content` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `verdict` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `description` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "testCaseStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "content",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "verdict",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "testCases" ADD COLUMN     "status" "testCaseStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "_SubmissionTotestCases" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubmissionTotestCases_AB_unique" ON "_SubmissionTotestCases"("A", "B");

-- CreateIndex
CREATE INDEX "_SubmissionTotestCases_B_index" ON "_SubmissionTotestCases"("B");

-- AddForeignKey
ALTER TABLE "_SubmissionTotestCases" ADD CONSTRAINT "_SubmissionTotestCases_A_fkey" FOREIGN KEY ("A") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubmissionTotestCases" ADD CONSTRAINT "_SubmissionTotestCases_B_fkey" FOREIGN KEY ("B") REFERENCES "testCases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
