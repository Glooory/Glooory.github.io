import "./normalize.css";
//
import "@mantine/core/styles.layer.css";
//
import "./global.css";

import { ReactNode } from "react";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import CustomMantineProvider from "@/lib/theme/CustomMantineProvider";
import styles from "./styles.module.css";

export const metadata = {
  title: "Glooory's blog",
  description: "Where I writes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body className={styles["root-container"]}>
        <CustomMantineProvider>
          <Header />
          <div className={styles.content}>{children}</div>
          <Footer />
          <ScrollToTop />
        </CustomMantineProvider>
      </body>
    </html>
  );
}
