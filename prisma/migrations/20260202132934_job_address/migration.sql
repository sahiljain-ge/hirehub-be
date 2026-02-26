/*
  Warnings:

  - Added the required column `address_id` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_qualifications` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MIN_QUALIFICATION" AS ENUM ('MASTERS', 'BACHELORS', 'DIPLOMA', 'HIGH_SCHOOL', 'HIGHER_SECONDARY');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "address_id" INTEGER NOT NULL,
ADD COLUMN     "min_qualifications" "MIN_QUALIFICATION" NOT NULL;

-- CreateTable
CREATE TABLE "Adresses" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,

    CONSTRAINT "Adresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Adresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
