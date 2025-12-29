import { Metadata } from "next";
import { CategoryPostsPage } from "@/features/category/pages";
import { getAllCategories } from "@/helpers/post";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decodedSlug = decodeURIComponent(category);

  return {
    alternates: {
      canonical: `/category/${decodedSlug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { category } = await params;

  return <CategoryPostsPage category={decodeURIComponent(category)} />;
}

export function generateStaticParams() {
  const categories: string[] = Object.keys(getAllCategories());
  const encodedCategories: { category: string }[] = categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
  const nonEncodedCategories: { category: string }[] = categories.map((category) => ({
    category,
  }));
  return [...encodedCategories, ...nonEncodedCategories];
}

export const dynamicParams = false;
