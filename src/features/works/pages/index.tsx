import PostsTimeline from "@/components/PostsTimeline";
import { getAllWorks } from "@/helpers/work";
import styles from "./styles.module.css";

function WorksPage() {
  const posts = getAllWorks();

  return <PostsTimeline classNames={{ root: styles.root }} pathSegment="work" posts={posts} />;
}

export { WorksPage };
