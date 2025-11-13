"use client";

import styles from "./styles.module.css";

export interface HeaderProps {}

const Header = (_props: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <h5 className={styles.title}>
          <a href="/">Glooory</a>
        </h5>
        <a href="/about">About</a>
      </div>
    </header>
  );
};

export default Header;
