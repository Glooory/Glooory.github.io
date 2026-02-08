import { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkPage from "@/features/work/pages";
import { getAllWorks } from "@/helpers/work";
import { Post } from "@/type";
import { appConfig } from "../../../../app.config.mjs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const posts: Post[] = getAllWorks();
  const decodedSlug = decodeURIComponent(slug);
  const post = posts.find(
    (post) => post.encodedFileName === slug || post.fileName === slug || post.fileName === decodedSlug
  );

  if (!post) {
    return {};
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/work/${decodedSlug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [`${appConfig.author}`],
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
