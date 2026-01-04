import CategoryTag from "@/components/CategoryTag";
import TableOfContents from "@/components/TableOfContents";
import { getHeadings } from "@/helpers/post";
import { Post } from "@/type";
import { formatDate } from "@/utils/date";
import styles from "./styles.module.css";

export interface WorkPageProps {
  postPath: string;
  post: Post;
}

const WorkPage = async (props: WorkPageProps) => {
  const { postPath, post } = props;

  const { default: PostContent } = await import(`@/data/works/${postPath}`);
  const headings = await getHeadings(post.content);

  return (
    <>
      <article className={styles.post}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.metadata}>
          <span>{formatDate(post.publishedAt)}</span>
          {!!post.categories?.length && <span>/</span>}
          {post.categories?.map((category, index) => (
            <CategoryTag key={index} category={category} />
          ))}
        </div>
        <PostContent />
      </article>
      <TableOfContents headings={headings} />
    </>
  );
};

export default WorkPage;
