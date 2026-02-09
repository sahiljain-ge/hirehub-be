-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "otp" TEXT;
