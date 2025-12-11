export default async function Page() {
  const page = await import(`@/features/works/pages/index.mdx`);
  const { default: Page } = page;

  return (
    <article className="markdown-content">
      <Page />
    </article>
  );
}
