import Image from "next/image";
import Link from "next/link";
import FriendRequestList from "./FriendRequestList";

const FriendRequests = async () => {
  // Removed: Prisma queries - now using Wix
  // This component needs to be updated to fetch from Wix API
  
  const requests: any[] = [];
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link href="/" className="text-main_third text-xs">
          See all
        </Link>
      </div>
      {/* USER */}
      <FriendRequestList requests={requests} />
    </div>
  );
};

export default FriendRequests;
