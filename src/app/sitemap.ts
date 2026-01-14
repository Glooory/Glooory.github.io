import { MetadataRoute } from "next";
import { getAllBlogs } from "@/helpers/blog";
import { appConfig } from "../../app.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogs();
  const baseUrl = appConfig.baseUrl;

  const blogUrls = blogs.map((post) => ({
    url: `${baseUrl}/blog/${post.fileName}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
  }));

  const routes = ["", "/about", "/categories", "/works"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...routes, ...blogUrls];
}
