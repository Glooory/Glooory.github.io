import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPage from "@/features/blog/pages";
import { getAllPosts } from "@/helpers/post";
import { Post } from "@/type";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  return {
    alternates: {
      canonical: `/blog/${decodedSlug}`,
    },
  };
}

export default async function Page({ params }: Props) {
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
  const encodedPosts: { slug: string }[] = posts.map((post) => ({ slug: post.encodedFileName }));
  const nonEncodedPosts: { slug: string }[] = posts.map((post) => ({ slug: post.fileName }));
  return [...encodedPosts, ...nonEncodedPosts];
}

export const dynamicParams = false;
