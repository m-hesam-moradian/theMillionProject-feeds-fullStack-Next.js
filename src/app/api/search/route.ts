// /app/api/search/route.ts

// import prisma from "@/lib/client";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.trim() === "") {
    return NextResponse.json([]);
  }

  const lowerQuery = query.toLowerCase();

  // const users = await prisma.user.findMany({
  //   where: {
  //     OR: [
  //       {
  //         username: {
  //           contains: lowerQuery,
  //         },
  //       },
  //       {
  //         name: {
  //           contains: lowerQuery,
  //         },
  //       },
  //       {
  //         surname: {
  //           contains: lowerQuery,
  //         },
  //       },
  //     ],
  //   },
  //   select: {
  //     id: true,
  //     username: true,
  //     name: true,
  //     surname: true,
  //     avatar: true,
  //   },
  //   take: 10,
  // });

  // return NextResponse.json(users);
}
