/*
  Warnings:

  - You are about to drop the column `aboueMe` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "aboueMe",
ADD COLUMN     "aboutMe" TEXT;
