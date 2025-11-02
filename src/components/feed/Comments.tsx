"use client";

import { addCommentToPost } from "@/lib/actions";
import Image from "next/image";
import { useOptimistic, useState ,startTransition} from "react";

// Mocked user and comments
const mockUser = {
  id: "1",
  username: "AdminUser",
  imageUrl: "/noAvatar.png",
  name: "Admin",
  surname: "User",
};

const mockComments = [
  {
    desc: "This is a great post!",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "2",
    user: {
      id: "2",
      username: "JaneDoe",
      avatar: "/noAvatar.png",
      name: "Jane",
      surname: "Doe",
    },
  },
  {
    desc: "Thanks for sharing this.",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "3",
    user: {
      id: "3",
      username: "JohnSmith",
      avatar: "/noAvatar.png",
      name: "John",
      surname: "Smith",
    },
  },
];

const Comments = ({ postInfo, userInfo }: { postInfo: any; userInfo: any }) => {
  const [commentState, setCommentState] = useState(mockComments);
  const [desc, setDesc] = useState("");
  const [isAdmin, setIsAdmin] = useState(true); // Always true for mock
  const user = mockUser;


const add = async () => {
  if (!user || !desc.trim()) return;

  const newComment = {
    desc,
    createdAt: new Date(),
    userId: user.id,
    user: {
      ...user,
      avatar: user.imageUrl || "/noAvatar.png",
    },
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

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value) => [value, ...state]
  );

  return (
    <>
      {user && isAdmin && (
        <div className="flex items-center gap-4">
          <Image
            src={user.imageUrl || "/noAvatar.png"}
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
        <div className="m-2 p-2 shadow-inner rounded-lg bg-slate-100">
          {optimisticComments.map((comment, index) => (
            <div
              className="flex gap-4 justify-between mt-4 p-2"
              key={index}
            >
              <Image
                src={comment.user.avatar || "/noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col gap-2 flex-1">
                <span className="font-medium">
                  {comment.user.name && comment.user.surname
                    ? `${comment.user.name} ${comment.user.surname}`
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

export default Comments;