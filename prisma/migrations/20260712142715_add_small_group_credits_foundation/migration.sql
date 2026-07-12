-- AlterTable
ALTER TABLE "public"."Contract" ADD COLUMN     "smallGroupCreditsPerMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "smallGroupSupplement" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "selectedSmallGroupCredits" INTEGER;
