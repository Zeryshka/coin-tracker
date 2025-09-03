/*
  Warnings:

  - Made the column `login` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "login" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
