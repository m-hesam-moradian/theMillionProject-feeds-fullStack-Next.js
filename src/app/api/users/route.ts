// app/api/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/client"; // your prisma client

export async function GET(req: Request) {
  // const { searchParams } = new URL(req.url);
  // const q = searchParams.get("q") || "";

  // if (!q.trim()) {
  //   return NextResponse.json([]);
  // }

  // const users = await prisma.user.findMany({
  //   where: {
  //     OR: [
  //       { username: { contains: q, mode: "insensitive" } },
  //       { name: { contains: q, mode: "insensitive" } },
  //     ],
  //   },
  //   select: {
  //     username: true,
  //     avatar: true,
  //     name: true,
  //   },
  //   take: 10,
  // });

  return "works";
}
