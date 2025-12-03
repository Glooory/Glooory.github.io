import dayjs from "dayjs";
import clsx from "clsx";
import { groupPostsByYear } from "@/helpers/post";
import { Post } from "@/type";
import styles from "./styles.module.css";

export interface PostsTimelineProps {
  classNames?: {
    root?: string;
  };
  title?: string;
  posts: Post[];
}

const PostsTimeline = (props: PostsTimelineProps) => {
  const { classNames, title, posts } = props;
  const postsGroupedByYear = groupPostsByYear(posts);

  return (
    <div className={clsx(styles.root, classNames?.root)}>
      {title && <h4>{title}</h4>}
      {Object.keys(postsGroupedByYear)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => {
          const posts = postsGroupedByYear[year];
          return (
            <section key={year}>
              <h4>{year}</h4>
              <div className={styles.posts}>
                {posts.map((post) => {
                  return (
                    <div key={post.title} className={styles.post}>
                      <a href={`/post/${post.slug}`}>
                        <div>
                          <span className={styles.date}>{dayjs(post.publishedAt).format("MM-DD")}</span>
                          <span className={styles.slash}> / </span>
                          {post.title}
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
    </div>
  );
};

export default PostsTimeline;
