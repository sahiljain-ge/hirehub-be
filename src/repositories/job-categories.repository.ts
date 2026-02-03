import db from "../config/prisma.js";

const findAllJobCategories = () => {
  return db.jobCategory.findMany({});
};

export { findAllJobCategories };
