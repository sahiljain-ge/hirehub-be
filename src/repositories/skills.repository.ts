import db from "../config/prisma.js";

const findAllSkills = () => {
  return db.skill.findMany({});
};

export { findAllSkills };
