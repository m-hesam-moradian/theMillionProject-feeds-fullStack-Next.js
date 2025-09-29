export async function testWixInsert(): Promise<void> {
  const payload = {
    id: `test-${Math.random().toString(36).substring(2, 10)}`,
    username: `test_user_${Math.floor(Math.random() * 1000)}`,
    avatar: "",
    name: "Test",
    surname: "User",
    cover: "",
    description: "",
    city: "",
    school: "",
    work: "",
    website: "",
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(
      "https://www.themillionproject.org/_functions/addUser",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();
    console.log("✅ Wix response:", result);
  } catch (error) {
    console.error("❌ Wix insert failed:", error);
  }
}
