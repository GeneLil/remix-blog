-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('AUTHOR', 'ADMIN', 'READER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'READER';
