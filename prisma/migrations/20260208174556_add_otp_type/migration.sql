-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD');

-- AlterTable
ALTER TABLE "Addresses" RENAME CONSTRAINT "Adresses_pkey" TO "Addresses_pkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp_type" "OTPType";
