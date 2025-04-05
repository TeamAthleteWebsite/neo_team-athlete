-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('COACH', 'ADMIN', 'CLIENT', 'PROSPECT');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "goal" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "roles" "UserRole"[] DEFAULT ARRAY['PROSPECT']::"UserRole"[],
ADD COLUMN     "weight" INTEGER;
