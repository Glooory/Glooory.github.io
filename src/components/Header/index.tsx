"use client";

import { useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export interface HeaderProps {}

const Header = (_props: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <h5 className={styles.header__title}>
          <a href="/">Glooory</a>
        </h5>

        <input
          type="checkbox"
          id="hamburger-menu"
          className={clsx(styles["hamburger-checkbox"], "visually-hidden")}
          onChange={toggleMenu}
        />
        <label htmlFor="hamburger-menu">
          <div className={styles.hamburger}>
            <span className={clsx(styles.bar, styles.bar1)} />
            <span className={clsx(styles.bar, styles.bar2)} />
            <span className={clsx(styles.bar, styles.bar3)} />
            <span className={clsx(styles.bar, styles.bar4)} />
          </div>
        </label>

        <nav
          className={clsx(styles.header__nav, {
            [styles["header__nav--open"]]: isMenuOpen,
          })}
        >
          <a href="/categories">Categories</a>
          <a href="/project">Projects</a>
          <a href="/about">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
