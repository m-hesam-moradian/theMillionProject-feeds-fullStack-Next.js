"use client";

import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "@/lib/actions";

const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();
  const [pollCount, setPollCount] = useState<number>(0);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [activePoll, setActivePoll] = useState(false);
  const [subscriptionOnly, setSubscriptionOnly] = useState(false);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // console.log(inputValues);
  // };
  if (!isLoaded) {
    return "Loading...";
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user?.imageUrl || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form
          // onSubmit={handleSubmit}
          action={async (formData) => {
            const cleanedPolls = inputValues.filter((val) => val.trim() !== "");
            console.log(subscriptionOnly);

            await addPost(
              formData,
              img?.secure_url || "",
              activePoll ? cleanedPolls : undefined,
              subscriptionOnly // pass the toggle state
            );

            setDesc(""); // clear text
            setImg(undefined); // clear image
            setInputValues([]); // clear poll inputs
            setPollCount(0); // reset poll count
            setActivePoll(false); // close poll section
            setSubscriptionOnly(false); // reset subscription toggle
          }}
          className="flex gap-4"
        >
          <div className="grid w-[100%]">
            <textarea
              className="flex-1 bg-slate-100 rounded-lg p-2 resize-none overflow-hidden "
              placeholder="What's on your mind?"
              name="desc"
              rows={1}
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                e.target.style.height = "auto"; // reset height
                e.target.style.height = `${e.target.scrollHeight}px`; // set to scroll height
              }}
            ></textarea>

            <div className="grid grid-cols-2  mt-4">
              {activePoll &&
                Array.from({ length: pollCount }, (_, index) => (
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
                    className=" bg-slate-100 rounded-lg p-2 w-[96%] m-1 poll-inputs"
                    placeholder={`Poll ${index + 1}`}
                  />
                ))}
              {activePoll && (
                <button
                  type="button"
                  className="flex-1 bg-slate-100 rounded-lg p-2  m-1 text-gray-400"
                  onClick={() => setPollCount((prev) => prev + 1)}
                >
                  Add Poll +
                </button>
              )}
            </div>
          </div>
          <div className="">
            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            <AddPostButton />
            {/* <button
              onClick={() => {
                // Collect all input values into an array
                const values = Array.from({ length: pollCount }, (_, index) => {
                  const inputElement = document.getElementById(
                    `poll-input-${index}`
                  ) as HTMLInputElement;
                  return inputElement ? inputElement.value : "";
                });

                // Log the array of input values
                console.log(values);
              }}
            >
              test
            </button> */}
          </div>
        </form>

        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              setImg(result.info);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/addimage.png" alt="" width={20} height={20} />
                  Photo
                </div>
              );
            }}
          </CldUploadWidget>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addVideo.png" alt="" width={20} height={20} />
            Video
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActivePoll((previous) => !previous)}
          >
            <Image src="/poll.png" alt="" width={20} height={20} />
            Poll
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                id="subscription-toggle"
                onClick={() => {
                  setSubscriptionOnly((prev) => !prev);
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                  subscriptionOnly
                    ? "bg-green-500 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </button>
              <label htmlFor="subscription-toggle" className="text-gray-600">
                Subscription Only
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
