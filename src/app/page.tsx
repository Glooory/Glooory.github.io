import dayjs from "dayjs";
import Link from "next/link";
import Header from "@/components/Header";
import { getAllPosts } from "@/utils/mdx";

export function getPosts() {
  const posts = getAllPosts();

  return [...posts]
    .sort((a, b) => {
      return dayjs(a.publishedAt).unix() - dayjs(b.publishedAt).unix();
    })
    .reverse();
}

export default function HomePage() {
  const posts = getPosts();

  return (
    <>
      <Header />
      <div>
        {posts.map((frontMatter) => {
          return (
            <Link key={frontMatter.slug} href={`/blog/${frontMatter.slug}`} passHref>
              <div>
                <h4 className="title">{frontMatter.title}</h4>
                <p className="summary">{frontMatter.excerpt}</p>
                <p className="date">{dayjs(frontMatter.publishedAt).format("MMMM D, YYYY")}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
