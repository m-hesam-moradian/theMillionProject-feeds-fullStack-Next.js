// components/AddPostWrapper.tsx
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import AddPost from "./AddPost";

const AddPostWrapper = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.role !== "ADMIN") return null;

  return <AddPost />;
};

export default AddPostWrapper;
