/*
  Warnings:

  - You are about to drop the `Adresses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_job_id_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_seeker_id_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_employer_id_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_company_id_fkey";

-- DropForeignKey
ALTER TABLE "JobSeeker" DROP CONSTRAINT "JobSeeker_user_id_fkey";

-- DropForeignKey
ALTER TABLE "JobSeekerSkill" DROP CONSTRAINT "JobSeekerSkill_seeker_id_fkey";

-- DropForeignKey
ALTER TABLE "JobSeekerSkill" DROP CONSTRAINT "JobSeekerSkill_skill_id_fkey";

-- DropForeignKey
ALTER TABLE "JobSkill" DROP CONSTRAINT "JobSkill_job_id_fkey";

-- DropForeignKey
ALTER TABLE "JobSkill" DROP CONSTRAINT "JobSkill_skill_id_fkey";

-- RenameTable
ALTER TABLE "Adresses" RENAME TO "Addresses";

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeeker" ADD CONSTRAINT "JobSeeker_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_seeker_id_fkey" FOREIGN KEY ("seeker_id") REFERENCES "JobSeeker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerSkill" ADD CONSTRAINT "JobSeekerSkill_seeker_id_fkey" FOREIGN KEY ("seeker_id") REFERENCES "JobSeeker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerSkill" ADD CONSTRAINT "JobSeekerSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSkill" ADD CONSTRAINT "JobSkill_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSkill" ADD CONSTRAINT "JobSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
