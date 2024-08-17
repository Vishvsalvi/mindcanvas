/*
  Warnings:

  - You are about to drop the column `socialLinks` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "socialLinks",
ADD COLUMN     "githubLink" TEXT,
ADD COLUMN     "instagramLink" TEXT,
ADD COLUMN     "linkedinLink" TEXT,
ADD COLUMN     "twitterLink" TEXT;
