import { insert, query, update } from "wix-data";
import { ok, badRequest, notFound } from "wix-http-functions";
import wixUsersBackend from "wix-users-backend";
import wixData from "wix-data";

export function get_userById(request) {
  const response = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // or use your Next.js domain
    },
    body: {},
  };

  const userId = request.query.userId;
  if (!userId) {
    response.body = { success: false, error: "Missing 'userId' parameter" };
    return badRequest(response);
  }

  return wixUsersBackend
    .getUser(userId)
    .then((user) => {
      if (!user) {
        response.body = {
          success: false,
          error: `User with ID ${userId} not found`,
        };
        return notFound(response);
      }

      response.body = { success: true, user };
      return ok(response);
    })
    .catch((err) => {
      response.body = {
        success: false,
        error: `Failed to fetch user: ${err.message}`,
      };
      return badRequest(response);
    });
}
// https://www.themillionproject.org/_functions/userById?userId=d13996ae-c828-4891-bb6a-d4307004cbb6
export async function post_addUser(request) {
  try {
    const body = await request.body.json();
    console.log("📥 Incoming payload:", body);

    // Required fields
    const requiredFields = ["username"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      console.log(`❌ Missing required fields: ${missingFields.join(", ")}`);
      return new Response(
        JSON.stringify({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare payload with defaults
    const payload = {
      id: body.id,
      username: body.username,
      avatar: body.avatar ?? "",
      cover: body.cover ?? "",
      name: body.name ?? "",
      surname: body.surname ?? "",
      description: body.description ?? "",
      city: body.city ?? "",
      school: body.school ?? "",
      work: body.work ?? "",
      website: body.website ?? "",
      createdAt: body.createdAt ?? new Date().toISOString(),
      role: body.role ?? "USER",
      isSubscribed: body.isSubscribed ?? false,
    };

    console.log("🔍 Checking for existing user with id:", payload.id);

    const existing = await query("SocialMedia-User")
      .eq("id", payload.id)
      .find();

    if (existing.items.length > 0) {
      const existingItem = existing.items[0];
      console.log("✏️ Updating existing user:", existingItem._id);

      // merge the new payload into the existing item
      const updatedItem = { ...existingItem, ...payload };

      const updated = await update("SocialMedia-User", updatedItem);
      console.log("✅ Update result:", updated);

      return new Response(
        JSON.stringify({
          success: true,
          message: "User updated",
          data: updated,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("📦 Inserting new user:", payload);
    const result = await insert("SocialMedia-User", payload);
    console.log("✅ Insert result:", result);

    return new Response(
      JSON.stringify({ success: true, message: "User inserted", data: result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("🔥 Upsert error:", error.message);
    console.error("🧵 Stack trace:", error.stack);

    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
export async function post_addPost(request) {
  try {
    const body = await request.body.json();
    const {  desc, img, userId, subscriptionOnly, polls } = body;

    // Basic validation
    if (!userId) {
      return badRequest({ error: "Unauthorized: Missing user ID" });
    }

    if (!desc || !desc.trim()) {
      return badRequest({ error: "Cannot create an empty post!" });
    }

    // 🔍 Find the user by custom `id` field and get Wix `_id`
    const userQuery = await wixData
      .query("SocialMedia-User")
      .eq("id", userId) // ← this is your custom ID field
      .limit(1)
      .find();

    if (userQuery.items.length === 0) {
      return badRequest({ error: "User not found with provided ID" });
    }

    const wixUserId = userQuery.items[0]._id;

    const postData = {
      desc: desc.trim(),
      img,
      userId: { _id: wixUserId },
      subscriptionOnly: subscriptionOnly,
      createdAt: new Date(),
      updatedAt: new Date(),
      polls,
      Like: [],
      comment: [],
    };

    const postResult = await wixData.insert("SocialMedia-Post", postData);

    return ok({ post: postResult });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return badRequest({
      error: "Something went wrong while creating the post.",
    });
  }
}
export async function get_getPosts(request) {
  try {
    const postResults = await wixData.query("SocialMedia-Post").find();
    const posts = postResults.items;

    // Enrich each post with userInfo
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const userId = post.userId;
        let userInfo = null;

        if (userId) {
          const userResult = await wixData
            .query("SocialMedia-User")
            .eq("_id", userId)
            .limit(1)
            .find();

          if (userResult.items.length > 0) {
            userInfo = userResult.items[0];
          }
        }

        return {
          ...post,
          userInfo, // ← embedded user data
        };
      })
    );

    return ok({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: {
        success: true,
        posts: enrichedPosts, // ← single array of enriched post objects
      },
    });
  } catch (err) {
    console.error("❌ Failed to fetch posts:", err);
    return badRequest({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: {
        success: false,
        error: err.message,
      },
    });
  }
}
export async function post_voteOnPoll(request) {
  try {
    const body = await request.body.json();
    const { postId, userId, pollIndex } = body;

    // Validate input
    if (!postId || !userId || pollIndex === undefined) {
      return badRequest({
        headers: { "Content-Type": "application/json" },
        body: {
          success: false,
          error: "Missing required fields: postId, userId, or pollIndex",
        },
      });
    }

    // Fetch the post
    const postResult = await wixData
      .query("SocialMedia-Post")
      .eq("_id", postId)
      .limit(1)
      .find();

    if (postResult.items.length === 0) {
      return notFound({
        headers: { "Content-Type": "application/json" },
        body: {
          success: false,
          error: `Post with ID ${postId} not found`,
        },
      });
    }

    const post = postResult.items[0];

    // Validate pollIndex
    if (
      !Array.isArray(post.polls) ||
      pollIndex < 0 ||
      pollIndex >= post.polls.length
    ) {
      return badRequest({
        headers: { "Content-Type": "application/json" },
        body: {
          success: false,
          error: `Invalid pollIndex: ${pollIndex}`,
        },
      });
    }

    // Check if user already voted
    let alreadyVotedIndex = -1;
    post.polls.forEach((option, index) => {
      if (
        Array.isArray(option.voters) &&
        option.voters.includes(userId)
      ) {
        alreadyVotedIndex = index;
      }
    });

    // If user already voted on the same option, do nothing
    if (alreadyVotedIndex === pollIndex) {
      return ok({
        headers: { "Content-Type": "application/json" },
        body: {
          success: true,
          message: "Already voted on this option",
          post,
        },
      });
    }

    // Remove userId from previous vote if exists
    if (alreadyVotedIndex !== -1) {
      post.polls[alreadyVotedIndex].voters = post.polls[alreadyVotedIndex].voters.filter(
        (id) => id !== userId
      );
    }

    // Add userId to new poll option
    const targetOption = post.polls[pollIndex];
    targetOption.voters = Array.isArray(targetOption.voters)
      ? [...targetOption.voters, userId]
      : [userId];

    // Update the post
    const updatedPost = {
      ...post,
      polls: post.polls,
      updatedAt: new Date(),
    };

    const updateResult = await wixData.update("SocialMedia-Post", updatedPost);

    return ok({
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        message: "Vote recorded",
        post: updateResult,
      },
    });
  } catch (err) {
    console.error("❌ Vote error:", err);
    return badRequest({
      headers: { "Content-Type": "application/json" },
      body: {
        success: false,
        error: err.message,
      },
    });
  }
}


