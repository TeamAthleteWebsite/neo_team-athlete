-- CreateTable
CREATE TABLE "public"."SmallGroupCreditPeriod" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "allocated" INTEGER NOT NULL,
    "consumed" INTEGER NOT NULL DEFAULT 0,
    "expired" INTEGER NOT NULL DEFAULT 0,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SmallGroupCreditPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmallGroupCreditPeriod_contractId_year_month_key" ON "public"."SmallGroupCreditPeriod"("contractId", "year", "month");

-- AddForeignKey
ALTER TABLE "public"."SmallGroupCreditPeriod" ADD CONSTRAINT "SmallGroupCreditPeriod_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
