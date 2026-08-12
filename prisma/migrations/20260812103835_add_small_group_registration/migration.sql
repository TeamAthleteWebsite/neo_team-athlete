-- CreateTable
CREATE TABLE "public"."SmallGroupRegistration" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SmallGroupRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SmallGroupRegistration_clientId_idx" ON "public"."SmallGroupRegistration"("clientId");

-- CreateIndex
CREATE INDEX "SmallGroupRegistration_sessionId_idx" ON "public"."SmallGroupRegistration"("sessionId");

-- CreateIndex
CREATE INDEX "SmallGroupRegistration_contractId_idx" ON "public"."SmallGroupRegistration"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "SmallGroupRegistration_sessionId_clientId_key" ON "public"."SmallGroupRegistration"("sessionId", "clientId");

-- AddForeignKey
ALTER TABLE "public"."SmallGroupRegistration" ADD CONSTRAINT "SmallGroupRegistration_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."SmallGroupSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmallGroupRegistration" ADD CONSTRAINT "SmallGroupRegistration_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmallGroupRegistration" ADD CONSTRAINT "SmallGroupRegistration_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
