"use client";

import { useEffect, useState, useOptimistic, startTransition } from "react";
import Image from "next/image";
import { addCommentToPost, getCommentsByPostId } from "@/lib/actions";

const Comments = ({ postInfo, userInfo }: { postInfo: any; userInfo: any }) => {
  const [desc, setDesc] = useState("");
  const [commentState, setCommentState] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(true); // Always true for now

  const user = userInfo;

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value) => [value, ...state]
  );

  // ✅ Fetch real comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      const result = await getCommentsByPostId(postInfo._id);
      if (!("error" in result)) {
        setCommentState(result);
      }
    };
    fetchComments();
  }, [postInfo._id]);

  // ✅ Add new comment
  const add = async () => {
    if (!user || !desc.trim()) return;

    const newComment = {
      desc,
      createdAt: new Date(),
      userId: user.id,
      userInfo: user,
    };

    startTransition(() => {
      addOptimisticComment(newComment);
    });

    setDesc("");

    try {
      await addCommentToPost(postInfo._id, desc);
    } catch (err) {
      console.error("❌ Failed to send comment to backend:", err);
    }
  };

  return (
    <>
      {user && isAdmin && (
        <div className="flex items-center gap-4">
          <Image
            src={user.avatar || "/noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 p-2 rounded-md text-white hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      )}



      {optimisticComments.length > 0 && (
        <div className="m-2 p-2 shadow-inner rounded-lg bg-slate-100  ">
          {optimisticComments.map((comment, index) => (
            <div
              className="flex gap-4 justify-between mt-4 p-2 "
              key={index}
            >
              <Image
                src={comment.userInfo?.avatar || "/noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col gap-2 flex-1">
                <span className="font-medium">
                  {comment.userInfo?.name && comment.userInfo?.surname
                    ? `${comment.userInfo.name} ${comment.userInfo.surname}`
                    : comment.userInfo?.username || "Unknown"}
                </span>
                <p>{comment.desc}</p>
                {/* <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/like.png"
                      alt=""
                      width={12}
                      height={12}
                      className="cursor-pointer w-4 h-4"
                    />
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">0 Likes</span>
                  </div>
                  <div className="">Reply</div>
                </div> */}
                
              </div>
              <Image
                src="/more.png"
                alt=""
                width={16}
                height={16}
                className="cursor-pointer w-4 h-4"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Comments;