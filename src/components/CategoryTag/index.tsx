import Link from "next/link";
import { getCategoryPagePath } from "@/features/category/route";
import styles from "./styles.module.css";

export interface CategoryTagProps {
  category: string;
  count?: number;
}

const CategoryTag = (props: CategoryTagProps) => {
  const { category, count } = props;

  return (
    <Link className={styles.category} href={getCategoryPagePath(category)}>
      <span>{category}</span>
      {count && <span>{count}</span>}
    </Link>
  );
};

export default CategoryTag;
