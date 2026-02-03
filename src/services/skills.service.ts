import { findAllSkills } from "../repositories/skills.repository.js";

const listSkills = async () => {
  return findAllSkills();
};

export { listSkills };
