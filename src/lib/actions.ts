"use server";

// import { auth } from "@clerk/nextjs/server";
import prisma from "./client";
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

export const switchLike = async (postId: number) => {
  // const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const addComment = async (postId: number, desc: string) => {
  // const { userId } = auth();

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

// Get current logged-in user role (already have)
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

export const addPost = async (
  formData: FormData,
  img: string,
  polls?: string[],
  subscriptionOnly?: boolean
) => {
  // const { userId } = auth();
  if (!userId) return { error: "Unauthorized" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") {
    return { error: "Forbidden: Only admins can post" };
  }

  const desc = formData.get("desc")?.toString() || "";
  const cleanedPolls = polls?.filter((text) => text.trim() !== "") || [];

  if (!desc.trim() && !img && cleanedPolls.length === 0) {
    return { error: "Cannot create an empty post!" };
  }

  try {
    const post = await prisma.post.create({
      data: {
        desc,
        img,
        userId: user.id,
        subscriptionOnly: subscriptionOnly || false,
        poll: cleanedPolls.length
          ? {
              create: {
                options: {
                  create: cleanedPolls.map((text) => ({ text })),
                },
              },
            }
          : undefined,
      },
    });

    console.log("Created post:", post);
    revalidatePath("/");
    return { post };
  } catch (err) {
    console.error("❌ Error creating post:", err);
    return { error: "Something went wrong while creating the post." };
  }
};

export const getPosts = async () => {
  // const { userId } = auth(); // may be null if guest

  // fetch all posts with related data
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      likes: { select: { userId: true } },
      _count: { select: { comments: true } },
      poll: {
        include: {
          options: {
            include: {
              votes: { select: { userId: true } }, // for poll votes
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // get viewer info if logged in
  const viewer = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;

  // filter subscription-only posts
  const filteredPosts = posts.filter((post) => {
    if (!post.subscriptionOnly) return true; // public post
    if (!viewer?.isSubscribed) return false; // non-subscribers cannot see
    return true; // subscriber sees post
  });

  return filteredPosts;
};

export const voteOnPoll = async (pollId: number, pollOptionId: number) => {
  // const { userId } = auth();

  if (!userId) return { error: "User is not authenticated!" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.isSubscribed) {
    return { error: "Only subscribed users can vote on polls!" };
  }

  const option = await prisma.pollOption.findUnique({
    where: { id: pollOptionId },
  });

  if (!option || option.pollId !== pollId) {
    return { error: "Invalid poll option for this poll." };
  }

  try {
    const existingVote = await prisma.pollVote.findUnique({
      where: {
        userId_pollId: {
          userId,
          pollId,
        },
      },
    });

    let vote;

    if (!existingVote) {
      vote = await prisma.pollVote.create({
        data: {
          userId,
          pollId,
          pollOptionId,
        },
      });
    } else if (existingVote.pollOptionId !== pollOptionId) {
      vote = await prisma.pollVote.update({
        where: {
          userId_pollId: {
            userId,
            pollId,
          },
        },
        data: {
          pollOptionId,
        },
      });
    } else {
      vote = existingVote;
    }

    revalidatePath("/");
    return { vote };
  } catch (err) {
    console.error("❌ Error while voting:", err);
    return { error: "Something went wrong while voting." };
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

export const deletePost = async (postId: number) => {
  // const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.post.delete({
      where: {
        id: postId,
        userId,
      },
    });
    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};
