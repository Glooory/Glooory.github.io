import dayjs from "dayjs";
import Header from "@/components/Header";
import { Post } from "@/type";
import { getAllPosts } from "@/utils/mdx";
import styles from "./styles.module.css";

function getPosts(): Post[] {
  const posts = getAllPosts();

  return [...posts]
    .sort((a, b) => {
      return dayjs(a.publishedAt).unix() - dayjs(b.publishedAt).unix();
    })
    .reverse();
}

function getGroupedPosts(): Record<string, Post[]> {
  const posts = getPosts();
  const groupedPosts: Record<string, Post[]> = {};

  posts.forEach((post) => {
    const year = dayjs(post.publishedAt).year();
    if (!groupedPosts[year]) {
      groupedPosts[year] = [];
    }
    groupedPosts[year].push(post);
  });

  return groupedPosts;
}

function HomePage() {
  const postsData = getGroupedPosts();

  return (
    <main className={styles.root}>
      <Header />
      <div className={styles.blogs}>
        {Object.entries(postsData).map(([year, posts]) => {
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
    </main>
  );
}

export { HomePage };
