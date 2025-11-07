import { GrayMatterFile } from "gray-matter";

export interface PostMetadata {
  title: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  categories: string[];
}

export type Post = Pick<GrayMatterFile<string>, "content" | "excerpt"> &
  PostMetadata & {
    slug: string;
    filePath: string;
  };
