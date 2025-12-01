import dayjs from "dayjs";
import { getPostsGroupedByYear } from "@/helpers/post";
import styles from "./styles.module.css";

function HomePage() {
  const postsGroupedByYear = getPostsGroupedByYear();

  return (
    <div className={styles.blogs}>
      {Object.keys(postsGroupedByYear)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => {
          const posts = postsGroupedByYear[year];
          return (
            <section key={year}>
              <h4>
                <span>{year}</span>
              </h4>
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
}

export { HomePage };
