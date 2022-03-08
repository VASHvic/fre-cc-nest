/*
  Warnings:

  - You are about to drop the column `desrciption` on the `bookmarks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "desrciption",
ADD COLUMN     "description" TEXT;
