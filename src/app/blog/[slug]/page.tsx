import { notFound } from "next/navigation";
import { getAllPosts } from "@/helpers/post";
import { Post } from "@/type";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts: Post[] = getAllPosts();
  const postPath = posts.find((post) => post.encodedFileName === slug || post.fileName === slug)?.filePath;

  if (!postPath) {
    return notFound();
  }

  const post = await import(`@/posts/${postPath}`);
  const { default: Post } = post;

  return (
    <article className="markdown-content">
      <Post />
    </article>
  );
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return [...posts.map((post) => ({ slug: post.encodedFileName })), ...posts.map((post) => ({ slug: post.fileName }))];
}

export const dynamicParams = false;
