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
// backend/http-functions.jsw
// import { ok, badRequest } from "wix-http-functions";
// import wixData from "wix-data";
// import { getUserIdByUsername } from "backend/utils/getUserIdByUsername";

// import { getUserIdByUsername } from "backend/utils/getUserIdByUsername";
// export async function post_addPost(request) {
//   try {
//     const body = await request.body.json();
//     const { id, desc, img, userId, subscriptionOnly, polls } = body;

//     // Basic validation
//     if (!userId) return badRequest({ error: "Unauthorized: Missing user ID" });

//     if (!desc || !desc.trim()) {
//       return badRequest({ error: "Cannot create an empty post!" });
//     }
//     const userID = await getUserIdByUsername(userId);

//     const postData = {
//       id,
//       desc: desc.trim(),
//       img,
//       userId: userID,
//       subscriptionOnly: Boolean(subscriptionOnly),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       // polls,
//     };

//     const postResult = await wixData.insert("SocialMedia-Post", postData);

//     // Insert polls if provided
//     if (polls.length > 0) {
//       const pollItems = polls.map((text) => ({
//         text,
//         postId: id,
//       }));

//       await wixData.bulkInsert("SocialMedia-PollOption", pollItems);
//     }

//     return ok({ post: postResult });
//   } catch (err) {
//     console.error("❌ Unexpected error:", err);
//     return badRequest({
//       error: "Something went wrong while creating the post.",
//     });
//   }
// }

export async function post_addPost(request) {
  try {
    const body = await request.body.json();
    const { id, desc, img, userId, subscriptionOnly, polls } = body;

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
      id,
      desc: desc.trim(),
      img,
      userId: { _id: wixUserId }, // ← use Wix _id here
      subscriptionOnly: Boolean(subscriptionOnly) || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const postResult = await wixData.insert("SocialMedia-Post", postData);

    // Insert polls if provided
    if (Array.isArray(polls) && polls.length > 0) {
      const pollItems = polls.map((text) => ({
        text,
        postId: id,
      }));

      await wixData.bulkInsert("SocialMedia-PollOption", pollItems);
    }

    return ok({ post: postResult });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return badRequest({
      error: "Something went wrong while creating the post.",
    });
  }
}

// fetch("https://www.themillionproject.org/_functions/addPost", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     id: "test-post-001",
//     desc: "This is a fake post for testing",
//     img: "https://example.com/image.jpg",
//     userId: "d13996ae-c828-4891-bb6a-d4307004cbb6", // must match an existing user in your Wix collection
//     subscriptionOnly: false,
//     polls: ["Option A", "Option B"],
//   }),
// })
//   .then((res) => res.json())
//   .then((data) => console.log("✅ Response:", data))
//   .catch((err) => console.error("❌ Error:", err));

export async function get_getPosts(request) {
  try {
    const results = await wixData.query("SocialMedia-Post").find();

    return ok({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: {
        success: true,
        posts: results.items,
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
// export async function get_getUser(request) {
//   try {
//     const results = await wixData.query("SocialMedia-User").find();

//     return ok({
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: {
//         success: true,
//         posts: results.items,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Failed to fetch posts:", err);
//     return badRequest({
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: {
//         success: false,
//         error: err.message,
//       },
//     });
//   }
// }
