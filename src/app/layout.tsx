import "./normalize.css";
//
import "@mantine/core/styles.layer.css";
//
import "@mantine/notifications/styles.layer.css";
//
import "./global.css";

import { ReactNode } from "react";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import CustomMantineProvider from "@/lib/theme/CustomMantineProvider";
import { appConfig } from "../../app.config.mjs";
import styles from "./styles.module.css";

export const metadata = {
  metadataBase: new URL(appConfig.baseUrl),
  title: {
    default: appConfig.title,
    template: `%s | ${appConfig.title}`,
  },
  description: appConfig.description,
  openGraph: {
    title: appConfig.title,
    description: appConfig.description,
    url: appConfig.baseUrl,
    siteName: appConfig.title,
    locale: "zh_CN",
    type: "website",
  },
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
          <Notifications position="top-right" />
          <Header />
          <div className={styles.content}>{children}</div>
          <Footer />
          <ScrollToTop />
        </CustomMantineProvider>
      </body>
    </html>
  );
}
