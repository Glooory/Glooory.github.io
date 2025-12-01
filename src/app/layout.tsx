import "./normalize.css";
//
import "@mantine/core/styles.css";
//
import "./global.css";
//
import "./markdown.css";

import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from "@mantine/core";
import Header from "@/components/Header";
import { theme } from "../../theme";
import styles from "./styles.module.css";

export const metadata = {
  title: "Glooory's blog",
  description: "Where I writes",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="zh" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body className={styles.content}>
        <MantineProvider theme={theme}>
          <Header />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
