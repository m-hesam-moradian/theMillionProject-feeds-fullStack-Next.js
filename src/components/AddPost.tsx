"use client";

import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "@/lib/actions";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { CldUploadWidget } from "next-cloudinary";

const AddPost = () => {
  const user = useSelector((state: any) => state.user);
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();
  const [pollCount, setPollCount] = useState<number>(0);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [activePoll, setActivePoll] = useState(false);
  const [subscriptionOnly, setSubscriptionOnly] = useState(false);
  console.log(user);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      <Image
        src={user?.avatar || "/noAvatar.png"}
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
              desc,
              img?.secure_url || "",
              activePoll ? cleanedPolls : undefined,
              subscriptionOnly,
              user.id
            );

            if (result.error) {
              Swal.fire({ icon: "error", title: "Oops!", text: result.error });
              return;
            }

            Swal.fire({
              icon: "success",
              title: "Post created!",
              text: "Your post has been successfully published.",
            });

            setDesc("");
            setImg(null);
            setInputValues([]);
            setPollCount(0);
            setActivePoll(false);
            setSubscriptionOnly(false);
          }}
          className="flex flex-col gap-4"
        >
          {img?.secure_url && (
            <div className="relative mt-2 w-40 h-full">
              <Image
                src={img.secure_url}
                alt="Preview"
                width={96}
                height={96}
                className="object-cover rounded-md h-full w-40"
              />
              <button
                type="button"
                onClick={() => setImg(undefined)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
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
