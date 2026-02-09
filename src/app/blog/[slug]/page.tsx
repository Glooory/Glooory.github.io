import { Metadata } from "next";
import { notFound } from "next/navigation";
import EmptyData from "@/components/EmptyData";
import { NO_CONTENTS_YET_DUMMY_SLUG } from "@/constants/file";
import BlogPage from "@/features/blog/pages";
import { getAllBlogs } from "@/helpers/blog";
import { Post } from "@/type";
import { appConfig } from "../../../../app.config.mjs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const posts: Post[] = getAllBlogs();
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
      canonical: `/blog/${decodedSlug}`,
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
  const posts: Post[] = getAllBlogs();
  const decodedSlug = decodeURIComponent(slug);
  const post = posts.find(
    (post) => post.encodedFileName === slug || post.fileName === slug || post.fileName === decodedSlug
  );

  if (slug === NO_CONTENTS_YET_DUMMY_SLUG) {
    return <EmptyData />;
  }

  if (!post) {
    return notFound();
  }

  return <BlogPage postPath={post.filePath} post={post} />;
}

export function generateStaticParams() {
  const posts = getAllBlogs();
  const encodedPosts: { slug: string }[] = posts.map((post) => ({ slug: post.encodedFileName }));
  const nonEncodedPosts: { slug: string }[] = posts.map((post) => ({ slug: post.fileName }));
  if (posts.length === 0) {
    return [{ slug: NO_CONTENTS_YET_DUMMY_SLUG }];
  }
  return [...encodedPosts, ...nonEncodedPosts];
}

export const dynamicParams = false;
