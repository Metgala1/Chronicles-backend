/*
  Warnings:

  - You are about to drop the column `imageAlt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `imageKey` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "imageAlt",
DROP COLUMN "imageKey";
