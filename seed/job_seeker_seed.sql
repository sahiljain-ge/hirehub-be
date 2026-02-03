-- SQL Seed Data for Job Seekers
-- Inserts 5 Users and their corresponding Job Seeker Profiles

-- 1. Insert Users (Role: JOB_SEEKER)
-- Passwords are placeholders (e.g., hashed 'password123')
INSERT INTO "User" ("id", "email", "password", "role", "is_verified", "created_at", "updated_at")
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'alice.seeker@hirehub.com', '$2b$10$epG/J.yv8..', 'JOB_SEEKER', true, NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'bob.seeker@hirehub.com', '$2b$10$epG/J.yv8..', 'JOB_SEEKER', true, NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'charlie.seeker@hirehub.com', '$2b$10$epG/J.yv8..', 'JOB_SEEKER', true, NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'diana.seeker@hirehub.com', '$2b$10$epG/J.yv8..', 'JOB_SEEKER', true, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'evan.seeker@hirehub.com', '$2b$10$epG/J.yv8..', 'JOB_SEEKER', true, NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

-- 2. Insert Job Seeker Profiles
-- Linked to the users created above by ID
INSERT INTO "JobSeeker" ("id", "user_id", "first_name", "last_name", "resume_url", "experience_level", "bio")
VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alice', 'Johnson', 'https://hirehub.com/resumes/alice.pdf', 'FRESHER', 'Recent Computer Science graduate with a passion for full-stack development. Eager to learn and contribute to open source projects.'),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Bob', 'Smith', 'https://hirehub.com/resumes/bob.pdf', 'INTERMEDIATE', 'Mid-level developer specializing in backend systems and database optimization. Experienced with Node.js and PostgreSQL.'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Charlie', 'Brown', 'https://hirehub.com/resumes/charlie.pdf', 'EXPERT', 'Senior Software Engineer with 10+ years of experience in distributed systems and cloud architecture. Mentor and technical leader.'),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Diana', 'Prince', 'https://hirehub.com/resumes/diana.pdf', 'NO_EXP', 'Enthusiastic learner transitioning into tech from a design background. Currently completing a coding bootcamp.'),
('50eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Evan', 'Wright', 'https://hirehub.com/resumes/evan.pdf', 'FRESHER', 'Frontend developer with a keen eye for UI/UX. Proficient in React and Tailwind CSS.')
ON CONFLICT ("user_id") DO NOTHING;
