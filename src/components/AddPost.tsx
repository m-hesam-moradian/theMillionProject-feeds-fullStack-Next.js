"use client";

import { useUser } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "@/lib/actions";
import Swal from "sweetalert2";

const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();
  const [pollCount, setPollCount] = useState<number>(0);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [activePoll, setActivePoll] = useState(false);
  const [subscriptionOnly, setSubscriptionOnly] = useState(false);

  if (!isLoaded) return "Loading...";

  const insertImageToTextarea = (url: string) => {
    setDesc((prev) => prev + ` ![](${url}) `); // Markdown style for embedding
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      <Image
        src={user?.imageUrl || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex-1">
        <form
          action={async (formData) => {
            const cleanedPolls = inputValues.filter((val) => val.trim() !== "");
            const result = await addPost(
              formData,
              img?.secure_url || "",
              activePoll ? cleanedPolls : undefined,
              subscriptionOnly
            );

            if (result.error) {
              Swal.fire({
                icon: "error",
                title: "Oops!",
                text: result.error,
              });
              return;
            }

            Swal.fire({
              icon: "success",
              title: "Post created!",
              text: "Your post has been successfully published.",
            });
            // Reset form
            setDesc("");
            setImg(undefined);
            setInputValues([]);
            setPollCount(0);
            setActivePoll(false);
            setSubscriptionOnly(false);
          }}
          className="flex flex-col gap-4"
        >
          {/* Image Preview */}
          {img?.secure_url && (
            <div className="relative w-24 h-24 mt-2">
              <Image
                src={img.secure_url}
                alt="Preview"
                width={96}
                height={96}
                className="object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => setImg(undefined)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
              {/* <button
                type="button"
                onClick={() => insertImageToTextarea(img.secure_url)}
                className="absolute bottom-0 left-0 bg-blue-500 text-white rounded-md px-1 text-xs"
              >
                Insert
              </button> */}
            </div>
          )}
          <textarea
            className="flex-1 bg-slate-100 rounded-lg p-2 resize-none overflow-hidden"
            placeholder="What's on your mind?"
            name="desc"
            rows={1}
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />

          {/* Poll Inputs */}
          {activePoll && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Array.from({ length: pollCount }, (_, index) => (
                <input
                  key={index}
                  id={`poll-input-${index}`}
                  type="text"
                  value={inputValues[index] || ""}
                  onChange={(e) => {
                    const newValues = [...inputValues];
                    newValues[index] = e.target.value;
                    setInputValues(newValues);
                  }}
                  className="bg-slate-100 rounded-lg p-2 w-[96%] m-1"
                  placeholder={`Poll ${index + 1}`}
                />
              ))}
              <button
                type="button"
                className="bg-slate-100 rounded-lg p-2 m-1 text-gray-400"
                onClick={() => setPollCount((prev) => prev + 1)}
              >
                Add Poll +
              </button>
            </div>
          )}

          {/* Post Options */}
          <div className="flex items-center gap-4 flex-wrap mt-2 text-gray-400">
            <CldUploadWidget
              uploadPreset="social"
              onSuccess={(result, { widget }) => {
                setImg(result.info);
                widget.close();
              }}
            >
              {({ open }) => (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/addimage.png" alt="" width={20} height={20} />
                  Photo
                </div>
              )}
            </CldUploadWidget>

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActivePoll((prev) => !prev)}
            >
              <Image src="/poll.png" alt="" width={20} height={20} />
              Poll
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setSubscriptionOnly((prev) => !prev)}
                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                  subscriptionOnly
                    ? "bg-green-500 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </button>
              <label className="text-gray-600">SubOnly</label>
            </div>

            <AddPostButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
