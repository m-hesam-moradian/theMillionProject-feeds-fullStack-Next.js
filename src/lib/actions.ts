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
      if (!user?.isSubscribed) return false; // Non-subscribers can't see
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

export const switchFollow = async (userId: string) => {
  const user = await getUserFromJWT();

  if (!user?.id) {
    return { error: "Unauthorized: Missing user ID" };
  }

  const payload = {
    userId: user.id,
    targetUserId: userId,
  };

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/switchFollow",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { error: result.error || "Failed to toggle follow" };
    }

    return { success: true };
  } catch (err: any) {
    return { error: "Network error while toggling follow" };
  }
};

export const switchBlock = async (userId: string) => {
  const user = await getUserFromJWT();

  if (!user?.id) {
    return { error: "Unauthorized: Missing user ID" };
  }

  const payload = {
    userId: user.id,
    targetUserId: userId,
  };

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/switchBlock",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { error: result.error || "Failed to toggle block" };
    }

    return { success: true };
  } catch (err: any) {
    return { error: "Network error while toggling block" };
  }
};

export const getCurrentUserRole = async () => {
  const user = await getUserFromJWT();

  if (!user) {
    return null;
  }

  return user.role || null;
};

export const getUserRole = async (userId: string) => {
  if (!userId) {
    return null;
  }

  try {
    const response = await fetch(
      `https://www.themillionproject.org/_functions/getUserRole?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return null;
    }

    return result.role || null;
  } catch (err) {
    console.error("❌ Failed to fetch user role:", err);
    return null;
  }
};

export const toggleUserAdmin = async (userId: string) => {
  const user = await getUserFromJWT();

  if (!user?.id || user.role !== "ADMIN") {
    return { error: "Unauthorized: Admin access required" };
  }

  const payload = {
    userId,
  };

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/toggleUserAdmin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { error: result.error || "Failed to toggle admin role" };
    }

    return { success: true };
  } catch (err: any) {
    return { error: "Network error while toggling admin role" };
  }
};

export const acceptFollowRequest = async (userId: string) => {
  const user = await getUserFromJWT();

  if (!user?.id) {
    return { error: "Unauthorized: Missing user ID" };
  }

  const payload = {
    userId: user.id,
    targetUserId: userId,
  };

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/acceptFollowRequest",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { error: result.error || "Failed to accept follow request" };
    }

    return { success: true };
  } catch (err: any) {
    return { error: "Network error while accepting follow request" };
  }
};

export const declineFollowRequest = async (userId: string) => {
  const user = await getUserFromJWT();

  if (!user?.id) {
    return { error: "Unauthorized: Missing user ID" };
  }

  const payload = {
    userId: user.id,
    targetUserId: userId,
  };

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/declineFollowRequest",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { error: result.error || "Failed to decline follow request" };
    }

    return { success: true };
  } catch (err: any) {
    return { error: "Network error while declining follow request" };
  }
};

export const updateProfile = async (
  prevState: any,
  formData: FormData | { formData: FormData; cover: string; id: string }
) => {
  const user = await getUserFromJWT();

  if (!user?.id) {
    return { success: false, error: "Unauthorized: Missing user ID" };
  }

  // Handle both FormData and the wrapped object format
  let actualFormData: FormData;
  let cover = "";
  let userId = user.id;

  if (formData instanceof FormData) {
    actualFormData = formData;
  } else {
    actualFormData = formData.formData;
    cover = formData.cover || "";
    userId = formData.id || user.id;
  }

  // Only allow users to update their own profile
  if (userId !== user.id) {
    return { success: false, error: "Unauthorized: Cannot update other user's profile" };
  }

  const payload: any = {
    id: userId,
    cover: cover || actualFormData.get("cover")?.toString() || "",
    name: actualFormData.get("name")?.toString() || "",
    surname: actualFormData.get("surname")?.toString() || "",
    description: actualFormData.get("description")?.toString() || "",
    city: actualFormData.get("city")?.toString() || "",
    school: actualFormData.get("school")?.toString() || "",
    work: actualFormData.get("work")?.toString() || "",
    website: actualFormData.get("website")?.toString() || "",
  };

  try {
    const response = await fetch(
      "https://www.themillionproject.org/_functions/addUser",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { success: false, error: result.error || "Failed to update profile" };
    }

    return { success: true, error: false };
  } catch (err: any) {
    return { success: false, error: "Network error while updating profile" };
  }
};