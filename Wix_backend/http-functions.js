import { insert, query, update } from "wix-data";
import { ok, badRequest, notFound } from "wix-http-functions";
import wixUsersBackend from "wix-users-backend";
import wixData from "wix-data";
import wixMedia from "wix-media-backend";

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
    const requiredFields = ["id", "username"];
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

// export async function post_addPost(request) {

//   try {
//     const body = await request.body.json();
//     const { desc, img, userId, subscriptionOnly, polls } = body;

//     // Basic validation
//     if (!userId) return badRequest({ error: "Unauthorized: Missing user ID" });

//     const cleanedPolls = (polls || []).filter(text => text.trim() !== "");
//     if (!desc.trim() && !img && cleanedPolls.length === 0) {
//       return badRequest({ error: "Cannot create an empty post!" });
//     }

//     let wixImageUrl = "";
//     if (img && img.startsWith("data:image")) {
//       try {
//         const base64Data = img.split(",")[1];
//         const buffer = Buffer.from(base64Data, "base64");

//         const uploadResult = await wixMedia.upload({
//           fileName: "post-image.jpg",
//           fileContent: buffer,
//           mimeType: "image/jpeg", // You can dynamically detect this if needed
//         });

//         wixImageUrl = uploadResult.fileUrl;
//       } catch (uploadErr) {
//         console.error("❌ Image upload failed:", uploadErr);
//         return badRequest({ error: "Failed to upload image to Wix Media" });
//       }
//     }

//     // Insert post
//     const postData = {
//       desc,
//       img: wixImageUrl || undefined,
//       userId,
//       subscriptionOnly: subscriptionOnly || false,
//     };

//     const postResult = await wixData.insert("SocialMedia-Post", postData);

//     // Insert polls if provided
//     if (cleanedPolls.length > 0) {
//       const pollItems = cleanedPolls.map(text => ({
//         text,
//         postId: postResult._id,
//       }));

//       await wixData.bulkInsert("SocialMedia-PollOption", pollItems);
//     }

//     return ok({ post: postResult });
//   } catch (err) {
//     console.error("❌ Unexpected error:", err);
//     return badRequest({ error: "Something went wrong while creating the post." });
//   }
// }

export async function post_addPost(request) {
  try {
    const body = await request.body.json();
    const { desc = "", img, userId, subscriptionOnly = false, polls } = body;

    // Basic validation
    if (!userId) return badRequest({ error: "Unauthorized: Missing user ID" });

    const cleanedPolls = (polls || []).filter((text) => text.trim() !== "");
    if (!desc.trim() && !img && cleanedPolls.length === 0) {
      return badRequest({ error: "Cannot create an empty post!" });
    }

    let wixImageUrl;
    if (img && img.startsWith("data:image")) {
      try {
        const [meta, base64Data] = img.split(",");
        const mimeType =
          meta.match(/data:(image\/[^;]+);/)?.[1] || "image/jpeg";
        const buffer = Buffer.from(base64Data, "base64");

        const uploadResult = await wixMedia.upload({
          fileName: `post-image.${mimeType.split("/")[1]}`,
          fileContent: buffer,
          mimeType,
        });

        wixImageUrl = uploadResult.fileUrl;
      } catch (uploadErr) {
        console.error("❌ Image upload failed:", uploadErr);
        return badRequest({ error: "Failed to upload image to Wix Media" });
      }
    }

    // Generate unique ID and timestamps

    const now = new Date();

    const postData = {
      _id: postId,
      desc: desc.trim(),
      img: wixImageUrl || undefined,
      user: userId,
      userId,
      subscriptionOnly: Boolean(subscriptionOnly),
      createdAt: now,
      updatedAt: now,
      comments: postId, // Ready for multi-reference
      multireference: polls,
      likes: postId, // Ready for multi-reference
    };

    const postResult = await wixData.insert("SocialMedia-Post", postData);

    // Insert polls if provided
    if (cleanedPolls.length > 0) {
      const pollItems = cleanedPolls.map((text) => ({
        text,
        postId,
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
