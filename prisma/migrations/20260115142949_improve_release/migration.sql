/*
  Warnings:

  - Made the column `categoryId` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `githubUrl` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `websiteUrl` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_releaseId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAnalytics" DROP CONSTRAINT "ProjectAnalytics_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Release" DROP CONSTRAINT "Release_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ReleaseAnalytics" DROP CONSTRAINT "ReleaseAnalytics_releaseId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_releaseId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "githubUrl" SET NOT NULL,
ALTER COLUMN "websiteUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE';

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAnalytics" ADD CONSTRAINT "ProjectAnalytics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseAnalytics" ADD CONSTRAINT "ReleaseAnalytics_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;
