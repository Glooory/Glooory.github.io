"use client";

import styles from "./styles.module.css";

export interface PostFooterSeparatorProps {}

const PostFooterSeparator = (_props: PostFooterSeparatorProps) => {
  return (
    <div className={styles["post-footer-separator"]} role="separator" aria-hidden="true">
      - • - • -
    </div>
  );
};

export { PostFooterSeparator };
