import AddPostWrapper from "@/components/AddPostWrapper";
import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import { cookies } from "next/headers";

export function getMemberDetails() {
  const cookieStore = cookies();
  const raw = cookieStore.get("memberDetails")?.value;

  if (!raw) return null;

  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}
const member = getMemberDetails();
console.log(member);

const obj = {
  id: member.id,
  username: member.firstName,
  avatar: member.imageUrl,
  name: member.memberName,
  surname: member.lastName,
};

const Homepage = () => {
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <AddPostWrapper />
          <Feed />
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
};

export default Homepage;
