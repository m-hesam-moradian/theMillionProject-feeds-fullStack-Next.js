"use client";

import { switchLike } from "@/lib/actions";
import Image from "next/image";
import { useOptimistic, useState } from "react";

const PostInteraction = ({
  postId,
  like,
  comment,
  userInfo,
}: {
  postId: string;
  like: string[];
  comment: string[];
  userInfo: {
    id: string;
    name: string;
  };
}) => {
  const userId = userInfo.id;

  const [likeState, setLikeState] = useState({
    likeCount: like.length,
    isLiked: userId ? like.includes(userId) : false,
  });

  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    likeState,
    (state) => ({
      likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
      isLiked: !state.isLiked,
    })
  );

  console.log(comment);
  
const parsedComments = Array.isArray(comment) 
  ? comment 
  : typeof comment === 'string' 
    ? JSON.parse(comment || "[]") 
    : [];
console.log("parsedComments:", parsedComments);



  const likeAction = async () => {
    // userId ? like.includes(userId) : false
 
    
    switchOptimisticLike("");
    try {
      await switchLike(postId); // ensure it's awaited
      setLikeState((state) => ({
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      }));
    } catch (err) {
      console.error("❌ Like toggle failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-8">
        {/* LIKE */}
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <form action={likeAction}>
            <button>
              <Image
                src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
                width={16}
                height={16}
                alt=""
                className="cursor-pointer"
              />
            </button>
          </form>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {optimisticLike.likeCount}
            <span className="hidden md:inline"> Likes</span>
          </span>
        </div>

        {/* COMMENT */}
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <Image
            src="/comment.png"
            width={16}
            height={16}
            alt=""
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {parsedComments.length}
            <span className="hidden md:inline"> Comments</span>
          </span>
        </div>
      </div>

      {/* SHARE */}
      <div>
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <Image
            src="/share.png"
            width={16}
            height={16}
            alt=""
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            <span className="hidden md:inline"> Share</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostInteraction;