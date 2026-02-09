import { UUID } from 'node:crypto';
import db from '../config/prisma.js';


class JobSeekerRepository {
    async getSkills(seekerId: UUID) {
        try {
            const skills = await db.jobSeekerSkill.findMany({
                where: {
                    seeker_id: seekerId   // get the skills which have seeker id what we got from the auth middleware 
                },
                select: {
                    skill: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            return skills;
        } catch (error) {
            throw error;
        }
    }

    async addSkills(seekerId: UUID, skillIds: number[]) {
        try {
            return await db.jobSeekerSkill.createMany({
                data: skillIds.map((skillId) => ({
                    seeker_id: seekerId,  // creating the data object we have to insert
                    skill_id: skillId,
                })),
                skipDuplicates: true,
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteSkills(seekerId: UUID, skillIds: number[]) {
        try {
            return await db.jobSeekerSkill.deleteMany({
                where: {
                    seeker_id: seekerId,
                    skill_id: {
                        in: skillIds,   // only delete the skills sent from the frontend 
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }


    async deleteSingleSkill(seekerId: UUID, skillId: number) {
        try {
            return await db.jobSeekerSkill.deleteMany({
                where: {
                    seeker_id: seekerId,
                    skill_id: skillId,
                },
            });
        } catch (error) {
            throw error;
        }
    }



}

export default JobSeekerRepository;
