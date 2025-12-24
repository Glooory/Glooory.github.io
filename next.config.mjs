import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

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
  defaultLanguage: "plaintext",
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    rehypePlugins: [
      ["rehype-pretty-code", rehypePrettyCodeOptions],
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "wrap" }],
    ],
  },
});

export default withBundleAnalyzer(
  withMDX({
    output: "export",
    reactStrictMode: false,
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    experimental: {
      optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    },
  })
);
