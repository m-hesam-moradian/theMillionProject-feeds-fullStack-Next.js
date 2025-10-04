import { cookies } from "next/headers";
import AddPost from "./AddPost";

const AddPostWrapper = async () => {
  const cookieStore = cookies();
  const userInfo = cookieStore.get("userInfo");

  if (!userInfo) return null;

  try {
    const user = JSON.parse(userInfo.value);
    if (user.role !== "ADMIN") return null;
    return <AddPost />;
  } catch {
    return null;
  }
};

export default AddPostWrapper;
