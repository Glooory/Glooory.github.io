import { notFound } from "next/navigation";
import PostsTimeline from "@/components/PostsTimeline";
import { getBlogsGroupedByCategory } from "@/helpers/blog";
import styles from "./styles.module.css";

function CategoryPostsPage(params: { category: string }) {
  const { category } = params;
  const posts = getBlogsGroupedByCategory()[category];

  if (!posts) {
    return notFound();
  }

  return <PostsTimeline classNames={{ root: styles.root }} pathSegment="blog" title={category} posts={posts} />;
}

export { CategoryPostsPage };
