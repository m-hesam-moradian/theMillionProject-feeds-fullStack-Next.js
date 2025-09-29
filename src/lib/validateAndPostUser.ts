// lib/validateAndPostUser.ts
export async function validateAndPostUser(
  user: any
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!user?.id || !user?.loginEmail) {
      return {
        success: false,
        error: "Missing required fields: id or loginEmail",
      };
    }

    const payload = {
      id: user.id,
      username: user.nickname || user.memberName || user.loginEmail,
      avatar: user.picture?.url || "",
      name: user.firstName || "",
      surname: user.lastName || "",
      cover: "",
      description: "",
      city: "",
      school: "",
      work: "",
      website: "",
      createdAt: new Date().toISOString(),
    };

    const res = await fetch(
      "https://www.themillionproject.org/_functions/addUser",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();
    console.log("✅ User posted to Wix:", result);

    return { success: true };
  } catch (err: any) {
    console.error("❌ Failed to post user:", err.message);
    return { success: false, error: err.message };
  }
}
