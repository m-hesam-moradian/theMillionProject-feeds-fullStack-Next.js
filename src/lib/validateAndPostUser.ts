export async function validateAndPostUser(
  user: any
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("📥 Incoming user object:", user);

    if (!user?.id || !user?.loginEmail) {
      console.log("❌ Missing required fields");
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

    console.log("📦 Prepared payload for Wix:", payload);

    const res = await fetch(
      "https://www.themillionproject.org/_functions/addUser",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const text = await res.text();
    console.log(`🌐 Wix response status: ${res.status}`);
    console.log("📨 Wix response body:", text);

    if (!res.ok) {
      return { success: false, error: `Wix returned ${res.status}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error("🔥 validateAndPostUser failed:", err.message);
    return { success: false, error: err.message };
  }
}
