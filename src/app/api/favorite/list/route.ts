import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log("SESSION:", session);

  if (!session || !session.user?.email) {
    console.log("NOT AUTHENTICATED - returning empty array");
    // Return empty list instead of error so the page can render
    return NextResponse.json([], { status: 200 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        favorites: {
          include: { movie: true },
        },
      },
    });

    console.log("USER FOUND:", user?.email);
    console.log("USER FAVORITES COUNT:", user?.favorites?.length ?? 0);
    console.log("FIRST FAVORITE:", JSON.stringify(user?.favorites?.[0], null, 2));

    // Ensure we return the full favorite objects with movies
    const favorites = user?.favorites ?? [];
    console.log("RETURNING FAVORITES:", JSON.stringify(favorites, null, 2));

    // Return with explicit Content-Type and ensure it's JSON serializable
    return new NextResponse(JSON.stringify(favorites), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json([], { status: 200 });
  }
}
