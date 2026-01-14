import { appConfig } from "../../../app.config";
import styles from "./styles.module.css";

export interface FooterProps {}

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span>
        © {appConfig.since} - {new Date().getFullYear()} {appConfig.author} 本站内容采用{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-NC-SA 4.0
        </a>{" "}
        许可协议，代码采用{" "}
        <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">
          MIT
        </a>{" "}
        许可协议。
      </span>
    </footer>
  );
};

export default Footer;
