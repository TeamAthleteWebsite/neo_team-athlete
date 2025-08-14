/*
  Warnings:

  - You are about to drop the column `coachId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_coachId_fkey";

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "coachId",
ADD COLUMN     "offerId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "public"."Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
