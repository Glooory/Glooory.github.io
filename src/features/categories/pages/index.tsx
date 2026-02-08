import CategoryTag from "@/components/CategoryTag";
import EmptyData from "@/components/EmptyData";
import { getBlogsGroupedByCategory } from "@/helpers/blog";
import styles from "./styles.module.css";

export interface CategoriesPageProps {}

const CategoriesPage = (_props: CategoriesPageProps) => {
  const blogsGroupedByCategory = getBlogsGroupedByCategory();

  if (Object.keys(blogsGroupedByCategory).length === 0) {
    return <EmptyData />;
  }

  return (
    <div className={styles.root}>
      {Object.keys(blogsGroupedByCategory).map((category) => {
        return <CategoryTag key={category} category={category} count={blogsGroupedByCategory[category].length} />;
      })}
    </div>
  );
};

export { CategoriesPage };
