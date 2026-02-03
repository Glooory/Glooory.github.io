import styles from "./styles.module.css";

export default async function Page() {
  const post = await import(`@content/about.mdx`);
  const { default: Post } = post;

  return (
    <article className={styles.page}>
      <Post />
    </article>
  );
}
