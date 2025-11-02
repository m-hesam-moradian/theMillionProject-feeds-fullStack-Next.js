"use server";

// import { auth } from "@clerk/nextjs/server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { kMaxLength } from "buffer";

const userId = "34567890"; // Mocked userId, replace with actual auth logic
const currentUserId = "34567890"; // Mocked currentUserId, replace with actual auth logic

export const switchFollow = async (userId: string) => {
  // const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not authenticated!");
  }

  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });

      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const switchBlock = async (userId: string) => {
  // const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const acceptFollowRequest = async (userId: string) => {
  // const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });

      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const declineFollowRequest = async (userId: string) => {
  // const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  payload: { formData: FormData; cover: string }
) => {
  const { formData, cover } = payload;
  const fields = Object.fromEntries(formData);

  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value !== "")
  );

  const Profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });

  const validatedFields = Profile.safeParse({ cover, ...filteredFields });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  // const { userId } = auth();

  if (!userId) {
    return { success: false, error: true };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: validatedFields.data,
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};




export const switchLike = async (postId: string) => {
  const user = await getUserFromJWT();

  if (!user?.id) {
    return { error: "Unauthorized: Missing user ID" };
  }

  const payload = {
    postId,
    userId: user.id,
  };

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/switchLike",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { error: result.error || "Failed to toggle like" };
    }

    return { success: true };
  } catch (err: any) {
    return { error: "Network error while toggling like" };
  }
};


export const addComment = async (postId: number, desc: string) => {
  if (!userId) throw new Error("User is not authenticated!");

  try {
    const createdComment = await prisma.comment.create({
      data: {
        desc,
        userId,
        postId,
      },
      include: {
        user: true,
      },
    });
    return createdComment;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const getCurrentUserRole = async () => {
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role || null;
};

export const getUserRole = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role || null;
};
export const toggleUserAdmin = async (targetUserId: string) => {
  // const { userId: currentUserId } = auth();

  if (!currentUserId) throw new Error("Not authenticated!");

  // Check if current user is admin
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { role: true },
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Only admins can update roles!");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { role: true },
  });

  if (!targetUser) throw new Error("Target user not found!");

  const newRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  return updatedUser;
};

// // lib/actions.ts
// export const addPost = async (
//   formData: FormData,
//   imageFile: File | null,
//   polls?: string[],
//   subscriptionOnly?: boolean,
//   userId?: string
// ) => {
//   const desc = formData.get("desc")?.toString() || "";
//   const cleanedPolls = polls?.filter((text) => text.trim() !== "") || [];

//   if (!userId) return { error: "Unauthorized: Missing user ID" };

//   let base64Image = "";
//   if (imageFile) {
//     const buffer = await imageFile.arrayBuffer();
//     base64Image = `data:${imageFile.type};base64,${Buffer.from(buffer).toString(
//       "base64"
//     )}`;
//   }

//   const payload = {
//     desc,
//     img: base64Image,
//     userId,
//     subscriptionOnly,
//     polls: cleanedPolls,
//   };

//   try {
//     const response = await fetch(
//       "https://www.themillionproject.org/_functions/addPost",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error("❌ Error sending post to Wix:", error);
//     return { error: "Failed to reach Wix backend." };
//   }
// };
// lib/actions.ts

export const addPost = async (
  desc: string,
  img: string | null,
  polls?: string[],
  subscriptionOnly?: boolean,
  user?: string
) => {
  console.log(polls);

  // Validate required fields
  if (!user || !user.trim()) {
    console.warn("🚫 Missing user");
    return { error: "Unauthorized: Missing user" };
  }

  if (!desc || !desc.trim()) {
    console.warn("🚫 Missing description");
    return { error: "Cannot create an empty post" };
  }

  console.log("👤 Using user:", user);

  // Transform polls array into desired object format
  let formattedPolls: { description: string; voters: string[] }[] | undefined =
    undefined;
  if (polls && polls.length > 0) {
    formattedPolls = polls.map((poll) => ({
      description: poll,
      voters: [],
    }));
  }

  const payload = {
    desc: desc.trim(),
    img,
    userId: user,
    subscriptionOnly: subscriptionOnly ?? false,
    polls: formattedPolls,
  };

  console.log("📤 Final payload:", JSON.stringify(payload));

  try {
    console.log("🌐 Sending POST request to Wix...");
    const response = await fetch(
      "https://www.themillionproject.org/_functions/addPost",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    // if (response.ok) {
    //   // console.log("✅ Post created:", response.post);
    // } else {
    //   console.error("❌ Post creation failed:", response.status);
    // }
  } catch (error) {
    console.error("❌ Network or fetch error:", error);
    return { error: "Failed to reach Wix backend." };
  }

  return { success: true };
};

import { getUserFromJWT } from "@/lib/getUserFromJWT";
export const getPosts = async () => {
  try {
    const user = await getUserFromJWT();

    const response = await fetch(
      "https://www.themillionproject.org/_functions/getPosts"
    );
    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("❌ Failed to fetch posts:", result.error);
      return [];
    }

    const posts = result.posts || [];

    // Filter subscription-only posts
    const filteredPosts = posts.filter((post: any) => {
      if (!post.subscriptionOnly) return true; // Public post
      if (!user.isSubscribed) return false; // Non-subscribers can't see
      return true; // Subscriber sees all
    });

    return filteredPosts;
  } catch (err) {
    console.error("❌ Network error while fetching posts:", err);
    return [];
  }
};


export const voteOnPoll = async (
  postId: string,
  pollIndex: number
): Promise<{ success?: boolean; error?: string }> => {
  try {
    const user = await getUserFromJWT();

    if (!user?.id) {
      console.warn("🚫 Missing user ID from JWT");
      return { error: "Unauthorized: Missing user ID" };
    }

    const payload = {
      postId,
      userId: user.id,
      pollIndex,
    };

    console.log("📤 Sending vote payload:", payload);

    const response = await fetch(
      "https://www.themillionproject.org/_functions/voteOnPoll",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("❌ Vote failed:", result.error);
      return { error: result.error || "Vote failed" };
    }

    console.log("✅ Vote recorded:", result);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Network or fetch error:", error.message);
    return { error: "Failed to reach Wix backend." };
  }
};

export const addStory = async (img: string) => {
  // const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }
    const createdStory = await prisma.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    return createdStory;
  } catch (err) {
    console.log(err);
  }
};



export const deletePost = async (postId: string) => {
  const user = await getUserFromJWT();

  if (!user?.id || user.role !== "ADMIN") {
    console.warn("🚫 Unauthorized delete attempt");
    return { error: "Only admins can delete posts." };
  }

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/deletePostByAdmin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: user.id }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("❌ Delete failed:", result.error);
      return { error: result.error || "Delete failed" };
    }

    console.log("✅ Post deleted:", result.message);
    return { success: true };
  } catch (err: any) {
    console.error("❌ Network error:", err.message);
    return { error: "Failed to reach Wix backend." };
  }
};



// export const addCommentToPost = async (postId: string, desc: string) => {
//   const user = await getUserFromJWT();


//   if (!user?._id || !desc.trim()) {
//     return { error: "Missing user or comment content" };
//   }

//   const payload = {
//     postId,
//     userId: user.id,
//     desc: desc.trim(),
//   };
// console.log(payload);

//   try {
//     const response = await fetch(
//       "https://www.themillionproject.org/_functions/addCommentToPost",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       return { error: result.error || "Failed to add comment" };
//     }

//     return result;
//   } catch (err: any) {
//     return { error: "Network error while adding comment" };
//   }
// };

export const addCommentToPost = async (postId: string, desc: string) => {
  console.log("🔄 Starting addCommentToPost...");

  const user = await getUserFromJWT();
  console.log("👤 Retrieved user:", user);

  if (!user?.id || !desc.trim()) {
    console.warn("⚠️ Missing user or comment content");
    return { error: "Missing user or comment content" };
  }

  const payload = {
    postId,
    userId: user.id,
    desc: desc.trim(),
  };

  console.log("📦 Prepared payload:", payload);

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/addCommentToPost",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    console.log("📡 Sent request to HTTP function");

    const result = await response.json();
    console.log("📥 Received response:", result);

    if (!response.ok || !result.success) {
      console.error("❌ Backend error:", result.error || "Failed to add comment");
      return { error: result.error || "Failed to add comment" };
    }

    console.log("✅ Comment successfully added:", result.comment);
    return result;
  } catch (err: any) {
    console.error("❌ Network error while adding comment:", err);
    return { error: "Network error while adding comment" };
  }
};