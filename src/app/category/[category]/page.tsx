import { CategoryPostsPage } from "@/features/category/pages";
import { getAllCategories } from "@/helpers/post";

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
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
