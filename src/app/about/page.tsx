export default async function Page() {
  const post = await import(`@/features/about/pages/index.mdx`);
  const { default: Post } = post;

  return (
    <article className="markdown-content">
      <Post />
    </article>
  );
}
