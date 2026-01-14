import { getAllPosts } from "./post";

const worksRelativePath = "content/works";

export const getAllWorks = (isNewestFirst = true) => {
  return getAllPosts(worksRelativePath, isNewestFirst);
};
