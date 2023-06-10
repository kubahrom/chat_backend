/*
  Warnings:

  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_token_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "token";

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
