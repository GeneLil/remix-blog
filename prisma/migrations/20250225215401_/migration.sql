/*
  Warnings:

  - You are about to drop the `_PostToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "likes" TEXT[],
ADD COLUMN     "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "posts" TEXT[];

-- DropTable
DROP TABLE "_PostToTag";
