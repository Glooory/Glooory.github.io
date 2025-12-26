import { CategoryPostsPage } from "@/features/category/pages";
import { getAllCategories } from "@/helpers/post";

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  return <CategoryPostsPage category={decodeURIComponent(category)} />;
}

export function generateStaticParams() {
  const categories: string[] = Object.keys(getAllCategories());
  return categories.map((category) => ({
    category,
  }));
}

export const dynamicParams = false;
