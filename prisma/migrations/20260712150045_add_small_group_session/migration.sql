-- CreateEnum
CREATE TYPE "public"."SmallGroupSessionStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."SmallGroupSession" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "status" "public"."SmallGroupSessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SmallGroupSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SmallGroupSession_coachId_idx" ON "public"."SmallGroupSession"("coachId");

-- CreateIndex
CREATE INDEX "SmallGroupSession_startAt_idx" ON "public"."SmallGroupSession"("startAt");

-- AddForeignKey
ALTER TABLE "public"."SmallGroupSession" ADD CONSTRAINT "SmallGroupSession_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
