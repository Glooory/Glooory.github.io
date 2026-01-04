import { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkPage from "@/features/work/pages";
import { getAllWorks } from "@/helpers/work";
import { Post } from "@/type";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  return {
    alternates: {
      canonical: `/work/${decodedSlug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const posts: Post[] = getAllWorks();
  const decodedSlug = decodeURIComponent(slug);
  const post = posts.find(
    (post) => post.encodedFileName === slug || post.fileName === slug || post.fileName === decodedSlug
  );

  if (!post) {
    return notFound();
  }

  return <WorkPage postPath={post.filePath} post={post} />;
}

export function generateStaticParams() {
  const posts = getAllWorks();
  const encodedPosts: { slug: string }[] = posts.map((post) => ({ slug: post.encodedFileName }));
  const nonEncodedPosts: { slug: string }[] = posts.map((post) => ({ slug: post.fileName }));
  return [...encodedPosts, ...nonEncodedPosts];
}

export const dynamicParams = false;
