import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import Slugger from "github-slugger";
import matter from "gray-matter";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import { postExtensionRegex } from "@/constants/file";
import { Post, PostMetadata } from "@/type";

export function getAllPosts(postsRelativePath: string, isNewestFirst = true): Post[] {
  const postPaths = fs.readdirSync(path.join(process.cwd(), postsRelativePath));

  const posts: Post[] = postPaths
    .filter((postPath) => postPath.endsWith(".md") || postPath.endsWith(".mdx"))
    .map((postPath) => {
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
        fileName: postPath.replace(postExtensionRegex, ""),
        encodedFileName: encodeURIComponent(postPath.replace(postExtensionRegex, "")),
        filePath: postPath,
        extension: (postPath.match(postExtensionRegex)?.[0] || "").replace(".", "").toLowerCase(),
      };
    })
    .sort((a, b) => {
      return dayjs(a.publishedAt).unix() - dayjs(b.publishedAt).unix();
    });
  return isNewestFirst ? posts.reverse() : posts;
}

export const groupPostsByYear = (posts: Post[], isNewestFirst = true): Record<string, Post[]> => {
  const groupedPosts: Record<string, Post[]> = {};

  posts.forEach((post) => {
    const year = dayjs(post.publishedAt).year();
    if (!groupedPosts[year]) {
      groupedPosts[year] = [];
    }
    groupedPosts[year].push(post);
  });

  Object.values(groupedPosts).forEach((posts) => {
    posts.sort((a, b) => {
      return (dayjs(a.publishedAt).unix() - dayjs(b.publishedAt).unix()) * (isNewestFirst ? -1 : 1);
    });
  });

  return groupedPosts;
};

export const getPostsGroupedByYear = (relativePath: string, isNewestFirst = true): Record<string, Post[]> => {
  const posts = getAllPosts(relativePath, isNewestFirst);
  return groupPostsByYear(posts, isNewestFirst);
};

export const getPostsGroupedByCategory = (relativePath: string): Record<string, Post[]> => {
  const posts = getAllPosts(relativePath);
  const categoriesMap = posts.reduce(
    (acc, post) => {
      (post?.categories || []).forEach((category) => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(post);
      });
      return acc;
    },
    {} as Record<string, Post[]>
  );

  return categoriesMap;
};

export const getHeadings = async (content: string) => {
  const headings: { text: string; id: string; depth: number }[] = [];
  const slugger = new Slugger();

  await remark()
    .use(() => (tree) => {
      visit(tree, "heading", (node: any) => {
        if (node.depth >= 2 && node.depth <= 4) {
          const text = node.children
            .filter((child: any) => child.type === "text")
            .map((child: any) => child.value)
            .join("");
          const id = slugger.slug(text);
          headings.push({ text, id, depth: node.depth });
        }
      });
    })
    .process(content);

  return headings;
};
