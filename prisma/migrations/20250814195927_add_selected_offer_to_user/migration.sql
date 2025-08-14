/*
  Warnings:

  - You are about to drop the column `offerId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_offerId_fkey";

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "offerId",
ADD COLUMN     "selectedOfferId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_selectedOfferId_fkey" FOREIGN KEY ("selectedOfferId") REFERENCES "public"."Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
