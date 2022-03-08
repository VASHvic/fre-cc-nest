/*
  Warnings:

  - You are about to drop the column `desciption` on the `bookmarks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_userId_fkey";

-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "desciption",
ADD COLUMN     "desrciption" TEXT;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
