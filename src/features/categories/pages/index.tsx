import CategoryTag from "@/components/CategoryTag";
import { getBlogsGroupedByCategory } from "@/helpers/blog";
import styles from "./styles.module.css";

export interface CategoriesPageProps {}

const CategoriesPage = (_props: CategoriesPageProps) => {
  const blogsGroupedByCategory = getBlogsGroupedByCategory();

  return (
    <div className={styles.root}>
      {Object.keys(blogsGroupedByCategory).map((category) => {
        return <CategoryTag key={category} category={category} count={blogsGroupedByCategory[category].length} />;
      })}
    </div>
  );
};

export { CategoriesPage };
