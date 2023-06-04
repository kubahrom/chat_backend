-- DropIndex
DROP INDEX "User_email_idx";

-- CreateIndex
CREATE INDEX "User_email_token_idx" ON "User"("email", "token");
