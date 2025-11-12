import Image from "next/image";
import React from "react";

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

  return (
    <div className="w-full">
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
        <div className="p-2">
          <h2 className="text-lg mb-3 font-bold">
            {movie.title || movie.name}
          </h2>
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
    </div>
  );
}
