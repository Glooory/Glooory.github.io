import styles from "./styles.module.css";

async function AboutPage() {
  const post = await import(`@content/about.mdx`);
  const { default: Post } = post;

  return (
    <article className={styles.page}>
      <Post />
    </article>
  );
}

export { AboutPage };
