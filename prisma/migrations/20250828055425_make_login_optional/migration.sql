-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "login" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
