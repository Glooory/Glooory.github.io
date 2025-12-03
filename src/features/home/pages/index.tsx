import PostsTimeline from "@/components/PostsTimeline";
import { getAllPosts } from "@/helpers/post";
import styles from "./styles.module.css";

function HomePage() {
  const posts = getAllPosts();

  return <PostsTimeline classNames={{ root: styles.root }} posts={posts} />;
}

export { HomePage };
