import { getAllPosts, getPostsGroupedByCategory } from "./post";

const blogsRelativePath = "content/blogs";

export const getAllBlogs = (isNewestFirst = true) => {
  return getAllPosts(blogsRelativePath, isNewestFirst);
};

export const getBlogsGroupedByCategory = () => {
  return getPostsGroupedByCategory(blogsRelativePath);
};
