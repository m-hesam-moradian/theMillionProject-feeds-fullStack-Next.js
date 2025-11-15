import Image from "next/image";
import Link from "next/link";

// Removed: Prisma types, now using Wix
type User = {
  id: string;
  username: string;
  avatar?: string;
  cover?: string;
  name?: string;
  surname?: string;
};

const UserMediaCard = async ({ user }: { user: User }) => {
  

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
   
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Media</span>
        <Link href="/" className="text-main_third text-xs">
          See all
        </Link>
      </div>
{/*    
      <div className="flex gap-4 justify-between flex-wrap">
        {postsWithMedia.length
          ? postsWithMedia.map((post) => (
              <div className="relative w-1/5 h-24" key={post.id}>
                <Image
                  src={post.img!}
                  alt=""
                  fill
                  className="object-contain rounded-md bg-slate-400"
                />
                {post.desc && (
                  <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 line-clamp-1">
                    {post.desc}
                  </p>
                )}
              </div>
            ))
          : "No media found!"}
      </div> */}
    </div>
  );
};

export default UserMediaCard;
