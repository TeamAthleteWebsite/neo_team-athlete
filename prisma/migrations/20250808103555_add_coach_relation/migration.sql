-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
