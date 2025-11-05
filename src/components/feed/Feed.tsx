import Post from "./Post";
import { getPosts } from "@/lib/actions";
import MemberStorage from "../MemberStorage";

const Feed = async () => {
  const posts = await getPosts();

  
  return (
    <div className="flex flex-col gap-4 pb-5">
      {posts.length
        ? posts.map((post) => <Post key={post._id} post={post} />)
        : "No posts found!"}
    </div>
  );
};

export default Feed;
