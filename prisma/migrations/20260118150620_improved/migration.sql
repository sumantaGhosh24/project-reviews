/*
  Warnings:

  - You are about to drop the column `ipHash` on the `View` table. All the data in the column will be lost.
  - You are about to drop the `ProjectAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReleaseAnalytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectAnalytics" DROP CONSTRAINT "ProjectAnalytics_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ReleaseAnalytics" DROP CONSTRAINT "ReleaseAnalytics_releaseId_fkey";

-- AlterTable
ALTER TABLE "View" DROP COLUMN "ipHash";

-- DropTable
DROP TABLE "ProjectAnalytics";

-- DropTable
DROP TABLE "ReleaseAnalytics";
