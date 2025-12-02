import Link from "next/link";
import { getAllCategories } from "@/helpers/post";
import styles from "./styles.module.css";

export interface CategoriesPageProps {}

const CategoriesPage = (_props: CategoriesPageProps) => {
  const categoriesMap = getAllCategories();

  return (
    <div className={styles.root}>
      {Object.keys(categoriesMap).map((category) => {
        return (
          <Link key={category} className={styles.category} href={`/categories/${category}`}>
            <span>{category}</span>
            <span>{categoriesMap[category].length}</span>
          </Link>
        );
      })}
    </div>
  );
};

export { CategoriesPage };
