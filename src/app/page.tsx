// src/app/page.tsx
import MovieList from "./components/MovieList";

export default async function Home({
  searchParams,
}: {
  searchParams: { genre?: string };
}) {
  const genre = searchParams.genre || "trending";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {genre === "topRated" ? "Top Rated Movies" : "Trending This Week"}
      </h1>

      <MovieList genre={genre} />
    </div>
  );
}
