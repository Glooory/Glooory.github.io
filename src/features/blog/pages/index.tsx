import { Post } from "@/type";
import styles from "./styles.module.css";

export interface BlogPageProps {
  postPath: string;
  post: Post;
}

const BlogPage = async (props: BlogPageProps) => {
  const { postPath, post } = props;

  const { default: PostContent } = await import(`@/posts/${postPath}`);

  return (
    <article className={styles.post}>
      <h1>{post.title}</h1>
      <PostContent />
    </article>
  );
};

export default BlogPage;
