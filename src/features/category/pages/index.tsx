import { notFound } from "next/navigation";
import PostsTimeline from "@/components/PostsTimeline";
import { getAllCategories } from "@/helpers/post";
import styles from "./styles.module.css";

function CategoryPostsPage(params: { category: string }) {
  const { category } = params;
  const posts = getAllCategories()[category];

  if (!posts) {
    return notFound();
  }

  return <PostsTimeline classNames={{ root: styles.root }} title={category} posts={posts} />;
}

export { CategoryPostsPage };
