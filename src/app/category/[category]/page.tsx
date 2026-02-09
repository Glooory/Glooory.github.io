import { Metadata } from "next";
import EmptyData from "@/components/EmptyData";
import { NO_CONTENTS_YET_DUMMY_SLUG } from "@/constants/file";
import { CategoryPostsPage } from "@/features/category/pages";
import { getBlogsGroupedByCategory } from "@/helpers/blog";

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

  const decodedCategory = decodeURIComponent(category);

  if (category === NO_CONTENTS_YET_DUMMY_SLUG) {
    return <EmptyData />;
  }

  return <CategoryPostsPage category={decodedCategory} />;
}

export function generateStaticParams() {
  const categories: string[] = Object.keys(getBlogsGroupedByCategory());

  if (categories.length === 0) {
    return [{ category: NO_CONTENTS_YET_DUMMY_SLUG }];
  }

  const encodedCategories: { category: string }[] = categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
  const nonEncodedCategories: { category: string }[] = categories.map((category) => ({
    category,
  }));
  return [...encodedCategories, ...nonEncodedCategories];
}

export const dynamicParams = false;
