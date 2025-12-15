import { Post } from "@/type";

export interface BlogPageProps {
  postPath: string;
  post: Post;
}

const BlogPage = async (props: BlogPageProps) => {
  const { postPath } = props;

  const { default: PostContent } = await import(`@/posts/${postPath}`);

  return (
    <article className="markdown-content">
      <PostContent />
    </article>
  );
};

export default BlogPage;
