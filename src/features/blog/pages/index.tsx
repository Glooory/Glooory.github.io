import PostContent from "@/components/PostContent";
import { Post } from "@/type";

export interface BlogPageProps {
  postPath: string;
  post: Post;
}

const BlogPage = async (props: BlogPageProps) => {
  const { postPath, post } = props;

  return <PostContent type="blog" postPath={postPath} post={post} />;
};

export default BlogPage;
