import { getHeadings } from "@/helpers/post";
import { useMDXComponents } from "@/mdx-components";
import { Post } from "@/type";
import { formatDate } from "@/utils/date";
import CategoryTag from "../CategoryTag";
import TableOfContents from "../TableOfContents";
import styles from "./styles.module.css";

export interface PostContentProps {
  post: Post;
  type: "blog" | "work";
  postPath: string;
}

const PostContent = async (props: PostContentProps) => {
  const { post, type, postPath } = props;

  const { default: PostContentData } = await import(`@content/${type}s/${postPath}`);
  const headings = await getHeadings(post.content);
  const mdxComponents = useMDXComponents();

  return (
    <>
      <article className={styles.post}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.metadata}>
          <span className={styles.date}>
            <span>{`发布于 ${formatDate(post.publishedAt)}`}</span>
            {post.updatedAt && (
              <>
                <span className={styles["date-separator"]}> · </span>
                <span>{`更新于 ${formatDate(post.updatedAt)}`}</span>
              </>
            )}
          </span>
          {!!post.categories?.length && <span>/</span>}
          {post.categories?.map((category, index) => (
            <CategoryTag key={index} category={category} />
          ))}
        </div>
        <PostContentData components={mdxComponents} />
      </article>
      <TableOfContents headings={headings} />
    </>
  );
};

export default PostContent;
