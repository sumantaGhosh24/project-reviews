/*
  Warnings:

  - Made the column `image` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ImageTarget" AS ENUM ('PROJECT', 'RELEASE');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "image" SET DEFAULT 'https://w3bkow2cit.ufs.sh/f/jLzp5qrLYh1KWP2CB5X5THxLaA1rNpE8DRtju7ZhPmKs2MoF';

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "target" "ImageTarget" NOT NULL,
    "targetId" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT 'https://w3bkow2cit.ufs.sh/f/jLzp5qrLYh1KWP2CB5X5THxLaA1rNpE8DRtju7ZhPmKs2MoF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Image_target_targetId_idx" ON "Image"("target", "targetId");
