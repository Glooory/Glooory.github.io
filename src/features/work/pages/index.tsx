import PostContent from "@/components/PostContent";
import { Post } from "@/type";

export interface WorkPageProps {
  postPath: string;
  post: Post;
}

const WorkPage = async (props: WorkPageProps) => {
  const { postPath, post } = props;

  return <PostContent type="work" postPath={postPath} post={post} />;
};

export default WorkPage;
