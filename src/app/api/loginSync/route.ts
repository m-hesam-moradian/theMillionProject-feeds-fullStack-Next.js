import { validateAndPostUser } from "@/lib/validateAndPostUser";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const user = req.body;

  const result = await validateAndPostUser(user);

  if (result.success) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
}
