-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "authMethod" TEXT DEFAULT 'password',
ADD COLUMN     "oauthProvider" TEXT;

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_identifier_token_key" ON "public"."PasswordResetToken"("identifier", "token");
