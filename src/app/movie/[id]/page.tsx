import Image from "next/image";
import React from "react";
import Card from "@/app/components/Card";

const BASE_URL = "https://api.themoviedb.org/3";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movieId = params.id;
  const url = `${BASE_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`;
  const res = await fetch(url, { next: { revalidate: 10000 } });

  if (!res.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const movie = await res.json();
  const imageUrl = "https://image.tmdb.org/t/p/original";

  // Fetch trailer video
  const videoRes = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  const videoData = await videoRes.json();

  const trailer = videoData.results?.find(
    (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  const similarRes = await fetch(
    `${BASE_URL}/movie/${movieId}/similar?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  const similarData = await similarRes.json();
  const similarMovies = similarData.results || [];
  return (
    <div className="w-full mt-6">
      <div className="p-4 md:pt-8 flex flex-col md:flex-row items-center content-center max-w-6xl mx-auto md:space-x-6">
        {/* Poster Image */}
        <Image
          src={`${imageUrl}${movie.backdrop_path || movie.poster_path}`}
          width={500}
          height={300}
          alt="Movie Poster"
          className="rounded-lg"
          style={{
            maxWidth: "100%",
            height: "100%",
          }}
          placeholder="blur"
          blurDataURL="/spinner.svg"
        />

        {/* Text Content */}
        <h1 className="text-4xl font-bold mb-6 text-center md:text-left">
          Movie Details
        </h1>
        <div className="p-2">
          <h2 className="text-3xl mb-3 font-bold">
            {movie.title || movie.name}
          </h2>
          <p className="text-gray-400 mb-2">
            Release date: {movie.release_date}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre: any) => (
              <span
                key={genre.id}
                className="bg-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <p className="text-lg mb-3 pt-2">{movie.overview}</p>
          <p className="mb-3">
            <span className="font-semibold mr-1">Rating</span>
            {movie.vote_count} Votes
            <span className="ml-2 text-amber-500">
              ({movie.vote_average.toFixed(1)}/10)
            </span>
          </p>
        </div>
      </div>
      {/* Trailer Section */}
      {trailer && (
        <div className="mt-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Trailer</h2>

          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="mt-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {similarMovies.slice(0, 8).map((movie: any) => (
              <Card key={movie.id} result={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
