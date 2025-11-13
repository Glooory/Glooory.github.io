import fs from "node:fs";
import path from "node:path";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await import(`@/posts/${slug}.mdx`);
  const { default: Post } = post;

  return (
    <article className="markdown-content">
      <Post />
    </article>
  );
}

export function generateStaticParams() {
  const posts = fs.readdirSync(path.join("src", "posts"));
  return posts
    .filter((post) => post.endsWith(".md") || post.endsWith(".mdx"))
    .map((post) => ({ slug: post.replace(/\.mdx?$/i, "") }));
}

export const dynamicParams = false;
