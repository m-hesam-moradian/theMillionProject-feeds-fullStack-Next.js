export async function validateAndPostUser(
  user: any
): Promise<{ success: boolean; error?: string }> {
  try {
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

    const raw = await res.text();
    console.log(`🌐 Wix status: ${res.status}`);
    console.log("📨 Wix raw response:", raw);

    // Try to parse only if there's content
    let parsed;
    if (raw.trim()) {
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        console.warn("⚠️ Failed to parse JSON:", err.message);
      }
    }

    if (res.ok) {
      return { success: true };
    } else {
      return { success: false, error: `Wix returned ${res.status}: ${raw}` };
    }
  } catch (err: any) {
    console.error("🔥 validateAndPostUser failed:", err.message);
    return { success: false, error: err.message };
  }
}
