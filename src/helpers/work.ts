import { getAllPosts } from "./post";

const worksRelativePath = "src/data/works";

export const getAllWorks = (isNewestFirst = true) => {
  return getAllPosts(worksRelativePath, isNewestFirst);
};
