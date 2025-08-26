"use client";

import { switchBlock, switchFollow } from "@/lib/actions";
import { getCurrentUserRole } from "@/lib/actions"; // 👈 import action
import { useOptimistic, useState, useEffect } from "react";
import { toggleUserAdmin } from "@/lib/actions";
import { getUserRole } from "@/lib/actions";

const UserInfoCardInteraction = ({
  userId,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
}: {
  userId: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
}) => {
  const [userState, setUserState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingRequestSent: isFollowingSent,
  });

  const [isAdmin, setIsAdmin] = useState(false); // 👈 track admin
  const [isAccountAdmin, setIsAccountAdmin] = useState(false); // 👈 switch state

  useEffect(() => {
    const fetchRoles = async () => {
      // Check if current viewer is admin
      const role = await getCurrentUserRole();
      setIsAdmin(role === "ADMIN");

      // Get the target user's role to set switch
      const targetRole = await getUserRole(userId);
      setIsAccountAdmin(targetRole === "ADMIN");
    };
    fetchRoles();
  }, [userId]);

  const follow = async () => {
    switchOptimisticState("follow");
    try {
      await switchFollow(userId);
      setUserState((prev) => ({
        ...prev,
        following: prev.following && false,
        followingRequestSent:
          !prev.following && !prev.followingRequestSent ? true : false,
      }));
    } catch (err) {}
  };

  const block = async () => {
    switchOptimisticState("block");
    try {
      await switchBlock(userId);
      setUserState((prev) => ({
        ...prev,
        blocked: !prev.blocked,
      }));
    } catch (err) {}
  };

  const [optimisticState, switchOptimisticState] = useOptimistic(
    userState,
    (state, value: "follow" | "block") =>
      value === "follow"
        ? {
            ...state,
            following: state.following && false,
            followingRequestSent:
              !state.following && !state.followingRequestSent ? true : false,
          }
        : { ...state, blocked: !state.blocked }
  );

  return (
    <>
      <form className="flex gap-5">
        <button
          type="button"
          onClick={follow}
          className="w-full bg-main_third text-white text-sm rounded-md p-2"
        >
          {optimisticState.following
            ? "Following"
            : optimisticState.followingRequestSent
            ? "Friend Request Sent"
            : "Follow"}
        </button>

        {/* 👇 only show switch if viewer is admin */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  await toggleUserAdmin(userId);
                  setIsAccountAdmin((prev) => !prev); // update UI
                } catch (err) {
                  console.error(err);
                  alert("Failed to update role!");
                }
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                isAccountAdmin
                  ? "bg-green-500 justify-end"
                  : "bg-gray-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
            <label className="text-gray-600">Admin</label>
          </div>
        )}
      </form>

      <form className="self-end">
        <button type="button">
          <span className="text-red-400 text-xs cursor-pointer">
            {optimisticState.blocked ? "Unblock User" : "Block User"}
          </span>
        </button>
      </form>
    </>
  );
};

export default UserInfoCardInteraction;
