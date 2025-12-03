import { CategoryPostsPage } from "@/features/category/pages";
import { getAllCategories } from "@/helpers/post";

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  return <CategoryPostsPage category={decodeURIComponent(category)} />;
}

export function generateStaticParams() {
  const categories: { category: string }[] = Object.keys(getAllCategories()).map((category) => ({
    category: encodeURIComponent(category),
  }));
  return categories;
}

export const dynamicParams = false;
