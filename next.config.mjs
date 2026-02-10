import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import { appConfig } from "./app.config.mjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
  },
  keepBackground: false,
  defaultLang: {
    block: "plaintext",
    inline: "plaintext",
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    rehypePlugins: [
      ["rehype-pretty-code", rehypePrettyCodeOptions],
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "wrap" }],
      [
        "rehype-raw",
        {
          passThrough: ["mdxjsEsm", "mdxFlowExpression", "mdxJsxFlowElement", "mdxJsxTextElement", "mdxTextExpression"],
        },
      ],
    ],
  },
});

const isProd = process.env.NODE_ENV === "production";
let basePath = isProd ? new URL(appConfig.baseUrl).pathname : "";
basePath = basePath === "/" ? "" : basePath;

export default withBundleAnalyzer(
  withMDX({
    output: "export",
    reactStrictMode: false,
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    images: {
      unoptimized: true,
    },
    basePath,
    experimental: {
      optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    },
    trailingSlash: true,
  })
);
