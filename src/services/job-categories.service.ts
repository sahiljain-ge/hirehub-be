import { findAllJobCategories } from "../repositories/job-categories.repository.js";

const listJobCategories = async () => {
  return findAllJobCategories();
};

export { listJobCategories };
