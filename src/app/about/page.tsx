export default async function Page() {
  const post = await import(`@content/about.mdx`);
  const { default: Post } = post;

  return (
    <article className="markdown-content">
      <Post />
    </article>
  );
}
