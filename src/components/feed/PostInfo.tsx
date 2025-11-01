"use client";

import { deletePost } from "@/lib/actions";
import Image from "next/image";
import { useState, useTransition } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


// After successful delete

const PostInfo = ({ postId }: { postId: string }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
const router = useRouter();

  const handleDelete = async () => {
    const result = await deletePost(postId);

    if (result?.error) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: result.error,
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Post deleted",
      text: "The post has been successfully removed.",
    });

    // Trigger rerender (e.g., refresh feed)
    startTransition(() => {
      router.refresh(); // or use router.refresh() if using Next.js app router
    });
  };

  return (
    <div className="relative">
      <Image
        src="/more.png"
        width={16}
        height={16}
        alt=""
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer"
      />
      {open && (
        <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
          <button
            className="text-red-500"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostInfo;