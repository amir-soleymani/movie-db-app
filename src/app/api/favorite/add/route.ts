import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log("=== ADD FAVORITE ===");
  console.log("Session:", session?.user?.email);

  if (!session || !session.user?.email) {
    console.log("Not authenticated");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  console.log("Movie data:", { id: body.id, title: body.title });

  // Normalize poster path: prefer poster_path, fallback to backdrop_path
  const rawPoster = body.posterUrl ?? body.poster_path ?? body.backdrop_path ?? null;
  let posterNormalized: string | null = null;
  if (rawPoster) {
    posterNormalized = String(rawPoster);
    if (!posterNormalized.startsWith("/")) posterNormalized = "/" + posterNormalized;
  }
  console.log("Normalized poster path:", posterNormalized);

  try {
    const favorite = await db.favorite.create({
      data: {
        user: { connect: { email: session.user.email } },
        movie: {
          connectOrCreate: {
            where: { id: body.id },
            create: {
              id: body.id,
              title: body.title,
              posterUrl: posterNormalized ?? "",
              overview: body.overview ?? "",
              releaseDate: body.releaseDate
                ? new Date(body.releaseDate)
                : new Date(),
            },
          },
        },
      },
    });

    // Return the created favorite including the movie so client can update immediately
    const created = await db.favorite.findUnique({
      where: { id: favorite.id },
      include: { movie: true },
    });

    console.log("Favorite created:", favorite.id);
    // Revalidate the favorites page so it shows the new favorite
    revalidatePath("/favorite");
    return NextResponse.json({ success: true, favorite: created });
  } catch (error: any) {
    // Handle unique constraint error (movie already favorited)
    if (error.code === "P2002") {
      console.log("Movie already favorited");
      // return the existing favorite so the client can update UI
      try {
        const user = await db.user.findUnique({ where: { email: session.user.email } });
        const existing = await db.favorite.findFirst({
          where: { userId: user?.id, movieId: body.id },
          include: { movie: true },
        });
        return NextResponse.json({ success: true, favorite: existing, message: "Already favorited" });
      } catch (e) {
        return NextResponse.json({ success: true, message: "Already favorited" });
      }
    }

    console.error("Error adding favorite:", error.message || error);
    console.error("Full error:", error);
    return NextResponse.json(
      { error: "Failed to add favorite", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
