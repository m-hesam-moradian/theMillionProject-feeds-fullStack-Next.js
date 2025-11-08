import Image from "next/image";
import Comments from "./Comments";
// import { Post as PostType, User } from "@prisma/client";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";
// import { auth } from "@clerk/nextjs/server";
import { voteOnPoll } from "@/lib/actions";
import PollBlock from "./PollBlock"; // adjust path if needed
import { getUserFromJWT } from "@/lib/getUserFromJWT";



 




const  Post = async ({ post }: { post: any }) => {
const user = await getUserFromJWT();
const userId = user ? user.id : null;
 const pollOptions = Array.isArray(post.polls)
  ? post.polls
  : [];



       
  return (
    <div className="flex bg-white p-4 rounded-lg shadow-md flex-col gap-4">
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.userInfo.avatar || "/noAvatar.png"}
            width={40}
            height={40}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">
            {post.userInfo.name && post.userInfo.surname
              ? `${post.userInfo.name} ${post.userInfo.surname}`
              : post.userInfo.username}
          </span>
        </div>
        {userId === post.userInfo.id && <PostInfo postId={post._id} />}
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
      <PollBlock postId={post._id} options={pollOptions} />
      )}

      {/* INTERACTION */}
 
      <Suspense fallback="Loading...">
        <PostInteraction
          postId={post._id}
          like={post.Like}
          comment={post.comment}
          userInfo={post.userInfo}
        />
      </Suspense>

      {/* COMMENTS */}
      <Suspense fallback="Loading...">

        <Comments postInfo={post} userInfo={user}  />
      </Suspense>
    </div>
  );
};

export default Post;
