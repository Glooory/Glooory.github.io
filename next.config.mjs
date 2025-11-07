import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
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
