"use client";

import { addComment, getCurrentUserRole } from "@/lib/actions"; // 👈 import role action
// import { useUser } from "@clerk/nextjs";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState, useEffect } from "react";

type CommentWithUser = Comment & { user: User };

const CommentList = ({
  comments,
  postId,
}: {
  comments: CommentWithUser[];
  postId: number;
}) => {
  // const { user } = useUser();
  let user = { id: "1", username: "AdminUser", imageUrl: "/noAvatar.png" }; // Mocked user object
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // 👈 track admin

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getCurrentUserRole(); // call server action
      setIsAdmin(role === "ADMIN");
    };
    fetchRole();
  }, []);

  const add = async () => {
    if (!user || !desc) return;

    addOptimisticComment({
      id: Math.random(),
      desc,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,
      postId: postId,
      user: {
        id: user.id,
        username: "Sending Please Wait...",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(),
      } as unknown as User,
    });
    try {
      const createdComment = await addComment(postId, desc);
      setCommentState((prev) => [createdComment, ...prev]);
    } catch (err) {}
  };

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentWithUser) => [value, ...state]
  );

  return (
    <>
      {user &&
        isAdmin && ( // 👈 only show if ADMIN
          <div className="flex items-center gap-4">
            <Image
              src={user.imageUrl || "noAvatar.png"}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <form
              action={add}
              className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
            >
              <input
                type="text"
                placeholder="Write a comment..."
                className="bg-transparent outline-none flex-1"
                onChange={(e) => setDesc(e.target.value)}
              />

              {/* <Image
                src="/emoji.png"
                alt=""
                width={16}
                height={16}
                className="cursor-pointer"
              /> */}
            </form>
          </div>
        )}

      {optimisticComments.length > 0 && (
        <div className="m-2 p-2 shadow-inner rounded-lg bg-slate-100">
          {optimisticComments.map((comment) => (
            <div
              className="flex gap-4 justify-between mt-4 p-2"
              key={comment.id}
            >
              <Image
                src={comment.user.avatar || "noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col gap-2 flex-1">
                <span className="font-medium">
                  {comment.user.name && comment.user.surname
                    ? comment.user.name + " " + comment.user.surname
                    : comment.user.username}
                </span>
                <p>{comment.desc}</p>
                <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
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
                </div>
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

export default CommentList;
