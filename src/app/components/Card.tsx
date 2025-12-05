"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CardProps {
  result: any;
}

export default function Card({ result }: CardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const imageUrl = "https://image.tmdb.org/t/p/original";
  const posterPath = result.backdrop_path ?? result.poster_path;

  const handleAddFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/favorite/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: result.id.toString(),
          title: result.title || result.name,
          posterUrl: result.poster_path,
          overview: result.overview,
          releaseDate: result.release_date,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log("add favorite response:", json);
        setIsFavorited(true);
        // Dispatch custom event so favorites page can refresh
        // cross-tab: write a timestamp to localStorage so other tabs receive a storage event
        try {
          localStorage.setItem("favorites:lastUpdated", Date.now().toString());
        } catch (e) {
          // ignore (e.g., SSR or browser privacy)
        }
        window.dispatchEvent(new Event("favoriteAdded"));
      } else {
        const text = await response.text();
        console.error("Failed to add favorite", response.status, text);
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="group relative cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-night-800 border border-gray-200 dark:border-night-600 shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-black/40 transform hover:scale-[1.03] transition-all duration-300">
      {/* ❤️ FAVORITE BUTTON */}
      <button
        className="absolute top-2 right-2 z-30 text-xl transition-transform duration-200 hover:scale-125 disabled:opacity-50"
        onClick={handleAddFavorite}
        disabled={isLoading}
        aria-label="Add to favorites"
        title={isFavorited ? "Added to favorites" : "Add to favorites"}
      >
        {isFavorited || isLoading ? "❤️" : "🤍"}
      </button>

      {/* MOVIE LINK*/}
      <Link href={`/movie/${result.id}`}>
        <div className="relative w-full aspect-[2/3] bg-black">
          {posterPath ? (
            <Image
              src={`${imageUrl}${posterPath}`}
              alt={result.title || result.name || "Movie poster"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}

          {typeof result.vote_average !== "undefined" && (
            <div className="absolute top-2 left-2 z-20">
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-md bg-imdb-500 text-black shadow-sm">
                {Math.round((result.vote_average || 0) * 10) / 10}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />
        </div>

        <div className="relative z-10 p-3">
          <h2 className="text-sm sm:text-base font-semibold text-black dark:text-white line-clamp-2">
            {result.title || result.name}
          </h2>

          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {result.release_date || result.first_air_date || "Unknown date"}
          </p>
        </div>
      </Link>
    </article>
  );
}
