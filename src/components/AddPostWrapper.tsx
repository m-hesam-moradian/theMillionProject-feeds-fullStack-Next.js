// components/AddPostWrapper.tsx
"use client";
import { useSelector } from "react-redux";
import AddPost from "./AddPost";

const AddPostWrapper = () => {
  const user = useSelector((state: any) => state.user);
  if (user.role !== "ADMIN") return null;
  return <AddPost />;
};

export default AddPostWrapper;
