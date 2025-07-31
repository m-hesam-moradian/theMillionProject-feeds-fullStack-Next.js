"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
// import { addPost } from "@/lib/actions";
// import prisma from "@/lib/client";

const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();

  // Remove this line, use user?.id instead
  // const { userId } = auth();

  if (!isLoaded) {
    return "Loading...";
  }

  if (!user) {
    return <div>Please sign in to add a post.</div>;
  }

  const testAction = async (formData: FormData) => {
    // Your server action or API call here
    // Use user.id on server to identify user
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user.imageUrl || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        <form action={testAction} className="flex gap-4">
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            name="desc"
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <div>
            <AddPostButton />
          </div>
        </form>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          {/* Your additional UI controls */}
        </div>
      </div>
    </div>
  );
};

export default AddPost;
