import CategoryTag from "@/components/CategoryTag";
import { Post } from "@/type";
import { formatDate } from "@/utils/date";
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
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.metadata}>
        <span>{formatDate(post.publishedAt)}</span>
        <span>/</span>
        {post.categories.map((category, index) => (
          <CategoryTag key={index} category={category} />
        ))}
      </div>
      <PostContent />
    </article>
  );
};

export default BlogPage;
