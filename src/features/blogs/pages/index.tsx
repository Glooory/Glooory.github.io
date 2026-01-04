import PostsTimeline from "@/components/PostsTimeline";
import { getAllBlogs } from "@/helpers/blog";
import styles from "./styles.module.css";

function BlogsPage() {
  const posts = getAllBlogs();

  return <PostsTimeline classNames={{ root: styles.root }} pathSegment="blog" posts={posts} />;
}

export { BlogsPage };
