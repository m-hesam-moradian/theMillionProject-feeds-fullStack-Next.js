import AddPostWrapper from "@/components/AddPostWrapper";
import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";

// import type { NextApiRequest, NextApiResponse } from "next";

// interface UserInfoCookie {
//   id: string;
//   firstName: string;
//   lastName: string;
//   nickname: string;
//   picture?: { url?: string };
// }

// interface WixUserPayload {
//   id: string;
//   username: string;
//   avatar: string;
//   name: string;
//   surname: string;
//   cover: string;
//   description: string;
//   city: string;
//   school: string;
//   work: string;
//   website: string;
//   createdAt: string;
// }

// function buildWixUserPayload(user: UserInfoCookie): WixUserPayload {
//   return {
//     id: user.id,
//     username: user.nickname,
//     avatar: user.picture?.url ?? "",
//     name: user.firstName,
//     surname: user.lastName,
//     cover: "",
//     description: "",
//     city: "",
//     school: "",
//     work: "",
//     website: "",
//     createdAt: new Date().toISOString(),
//   };
// }

// export async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   try {
//     const userInfo: UserInfoCookie = req.body;
//     const payload = buildWixUserPayload(userInfo);

//     const wixRes = await fetch(
//       "https://www.themillionproject.org/_functions/addUser",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );

//     const result = await wixRes.json();
//     res.status(wixRes.status).json(result);
//   } catch (error) {
//     console.error("Wix insert error:", error);
//     res.status(500).json({ error: "Failed to send user to Wix" });
//   }
// }

const Homepage = () => {
  return (
    <>
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
    </>
  );
};

export default Homepage;
