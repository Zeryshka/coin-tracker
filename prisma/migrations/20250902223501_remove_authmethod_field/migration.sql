/*
  Warnings:

  - You are about to drop the column `authMethod` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "authMethod";
