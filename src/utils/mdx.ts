import fs from "fs";
import path from "path";
import { sync } from "glob";
import matter from "gray-matter";
import { postExtensionRegex } from "@/constants/file";
import { Post, PostMetadata } from "@/type";

const postsRelativePath = "src/posts";

const postPaths = path.join(process.cwd(), postsRelativePath);

export async function getPostSlug() {
  const paths = sync(`${postPaths}/*.mdx`); // fixme: maybe ends with .md

  return paths.map((path) => {
    const pathContent = path.split("/");
    const fileName = pathContent[pathContent.length - 1];
    const [slug, _extension] = fileName.split(".");

    return slug;
  });
}

export async function getPostFromPostSlug(slug: string) {
  const postPath = path.join(postPaths, `${slug}.mdx`); // fixme: maybe ends with .md
  const source = fs.readFileSync(postPath);
  const { content, data } = matter(source);

  return {
    content,
    frontmatter: {
      slug,
      title: data.title,
      publishedAt: data.publishedAt,
      ...data,
    },
  };
}

export function getAllPosts(): Post[] {
  const postPaths = fs.readdirSync(path.join(process.cwd(), postsRelativePath));

  return postPaths.map((postPath) => {
    const source = fs.readFileSync(path.join(process.cwd(), postsRelativePath, postPath), "utf-8");
    const { data, content, excerpt } = matter<string, {}>(source, {
      excerpt: (file: { content: string; excerpt?: string }) => {
        file.excerpt = `${file.content
          .split("\n")
          .filter((line) => line.trim() !== "")
          .filter((line) => !line.startsWith("import"))
          .filter((line) => !line.startsWith("#"))
          .slice(0, 10)
          .join(" ")
          .slice(0, 100)}...`;
        return file;
      },
    });

    return {
      ...(data as PostMetadata),
      content,
      excerpt,
      slug: postPath.replace(postExtensionRegex, ""),
      filePath: postPath,
    };
  });
}
