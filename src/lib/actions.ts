"use server";

import { getUserFromJWT } from "@/lib/getUserFromJWT";

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

export const addPost = async (
  desc: string,
  img: string | null,
  polls?: string[],
  subscriptionOnly?: boolean,
  user?: string
) => {
  // Validate required fields
  if (!user || !user.trim()) {
    console.warn("🚫 Missing user");
    return { error: "Unauthorized: Missing user" };
  }

  if (!desc || !desc.trim()) {
    console.warn("🚫 Missing description");
    return { error: "Cannot create an empty post" };
  }

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
  } catch (error) {
    console.error("❌ Network or fetch error:", error);
    return { error: "Failed to reach Wix backend." };
  }

  return { success: true };
};

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

    return { success: true };
  } catch (error: any) {
    console.error("❌ Network or fetch error:", error.message);
    return { error: "Failed to reach Wix backend." };
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

export const addCommentToPost = async (postId: string, desc: string) => {
  const user = await getUserFromJWT();

  if (!user?.id || !desc.trim()) {
    return { error: "Missing user or comment content" };
  }

  const payload = {
    postId,
    userId: user.id,
    desc: desc.trim(),
  };

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/addCommentToPost",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    
    const result = await response.json();

    if (!response.ok || !result.success) {
      return { error: result.error || "Failed to add comment" };
    }

    return result;
  } catch (err: any) {
    return { error: "Network error while adding comment" };
  }
};

export const getCommentsByPostId = async (postId: string) => {
  if (!postId) {
    return { error: "Missing postId" };
  }

  try {
    const response = await fetch(
      `https://www.themillionproject.org/_functions/getCommentsByPostId?postId=${postId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { error: result.error || "Failed to fetch comments" };
    }

    return result.comments;
  } catch (err: any) {
    console.error("❌ Error fetching comments:", err);
    return { error: "Network error while fetching comments" };
  }
};

export const getUsersByName = async (query: string) => {
  if (!query) return [];

  try {
    const response = await fetch(
      `https://www.themillionproject.org/_functions/getUsersByName?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.users) {
      return [];
    }
    
    return result.users;
  } catch (err) {
    console.error("❌ Failed to fetch users by name:", err);
    return [];
  }
};
