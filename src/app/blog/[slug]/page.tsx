import { notFound } from "next/navigation";
import BlogPage from "@/features/blog/pages";
import { getAllPosts } from "@/helpers/post";
import { Post } from "@/type";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts: Post[] = getAllPosts();
  const decodedSlug = decodeURIComponent(slug);
  const post = posts.find(
    (post) => post.encodedFileName === slug || post.fileName === slug || post.fileName === decodedSlug
  );

  if (!post) {
    return notFound();
  }

  return <BlogPage postPath={post.filePath} post={post} />;
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.fileName }));
}

export const dynamicParams = false;
