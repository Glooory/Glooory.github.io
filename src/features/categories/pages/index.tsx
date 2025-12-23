import CategoryTag from "@/components/CategoryTag";
import { getAllCategories } from "@/helpers/post";
import styles from "./styles.module.css";

export interface CategoriesPageProps {}

const CategoriesPage = (_props: CategoriesPageProps) => {
  const categoriesMap = getAllCategories();

  return (
    <div className={styles.root}>
      {Object.keys(categoriesMap).map((category) => {
        return <CategoryTag key={category} category={category} count={categoriesMap[category].length} />;
      })}
    </div>
  );
};

export { CategoriesPage };
