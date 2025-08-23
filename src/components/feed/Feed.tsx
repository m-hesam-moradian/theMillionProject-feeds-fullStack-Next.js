import Post from "./Post";
import { getPosts } from "@/lib/actions";

const Feed = async ({ username }: { username?: string }) => {
  const posts = await getPosts();

  return (
    <div className="flex flex-col gap-4">
      {posts.length
        ? posts.map((post) => <Post key={post.id} post={post} />)
        : "No posts found!"}
    </div>
  );
};

export default Feed;
