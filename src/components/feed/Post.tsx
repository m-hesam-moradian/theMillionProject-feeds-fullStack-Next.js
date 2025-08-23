import Image from "next/image";
import Comments from "./Comments";
import { Post as PostType, User } from "@prisma/client";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";
import { auth } from "@clerk/nextjs/server";
import { voteOnPoll } from "@/lib/actions";
import PollBlock from "./PollBlock"; // adjust path if needed

type FeedPostType = PostType & {
  user: User;
  likes: [{ userId: string }];
  _count: { comments: number };
  poll?: {
    id: number;
    options?: {
      id: number;
      text: string;
      votes: { userId: string }[];
    }[];
  };
};

const Post = ({ post }: { post: FeedPostType }) => {
  const { userId } = auth();

  const pollOptions = Array.isArray(post.poll?.options)
    ? post.poll.options
    : [];

  return (
    <div className="flex bg-white p-4 rounded-lg shadow-md flex-col gap-4">
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avatar || "/noAvatar.png"}
            width={40}
            height={40}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">
            {post.user.name && post.user.surname
              ? `${post.user.name} ${post.user.surname}`
              : post.user.username}
          </span>
        </div>
        {userId === post.user.id && <PostInfo postId={post.id} />}
      </div>

      {/* DESC */}
      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="w-full min-h-96 relative">
            <Image
              src={post.img}
              fill
              className="object-contain rounded-md"
              alt=""
            />
          </div>
        )}
        <p>{post.desc}</p>
      </div>

      {/* POLL OPTIONS */}
      {pollOptions.length > 0 && (
        <PollBlock pollId={post.poll!.id} options={pollOptions} />
      )}

      {/* INTERACTION */}
      <Suspense fallback="Loading...">
        <PostInteraction
          postId={post.id}
          likes={post.likes.map((like) => like.userId)}
          commentNumber={post._count.comments}
        />
      </Suspense>

      {/* COMMENTS */}
      <Suspense fallback="Loading...">
        <Comments postId={post.id} />
      </Suspense>
    </div>
  );
};

export default Post;
