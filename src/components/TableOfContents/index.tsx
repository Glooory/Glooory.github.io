import Link from "next/link";
import styles from "./styles.module.css";

interface Heading {
  text: string;
  id: string;
  depth: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className={styles.toc}>
      <nav aria-label="目录">
        <div className={styles.title}>目录</div>
        <ul className={styles.list}>
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`${styles.item} ${heading.depth === 3 ? styles.depth_3 : ""} ${
                heading.depth === 4 ? styles.depth_4 : ""
              }`}
            >
              <Link href={`#${heading.id}`} className={styles.link}>
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default TableOfContents;
