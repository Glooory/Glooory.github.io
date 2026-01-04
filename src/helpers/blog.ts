import { getAllPosts, getPostsGroupedByCategory } from "./post";

const blogsRelativePath = "src/data/blogs";

export const getAllBlogs = (isNewestFirst = true) => {
  return getAllPosts(blogsRelativePath, isNewestFirst);
};

export const getBlogsGroupedByCategory = () => {
  return getPostsGroupedByCategory(blogsRelativePath);
};
