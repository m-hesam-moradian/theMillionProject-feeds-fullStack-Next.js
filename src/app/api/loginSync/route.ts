import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateAndPostUser } from "@/lib/validateAndPostUser";

export async function POST(req: NextRequest) {
  try {
    const user = await req.json();
    const result = await validateAndPostUser(user);

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      console.error("❌ loginSync failed:", result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("🔥 loginSync crashed:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
