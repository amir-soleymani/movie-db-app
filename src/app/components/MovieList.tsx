"use client";

import { useEffect, useState } from "react";
import Card from "./Card";

export default function MovieList({ genre }: { genre: string }) {
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadMovies(pageNumber: number) {
    setLoading(true);

    console.log("Loading page:", pageNumber);

    const BASE_URL = "https://api.themoviedb.org/3";
    const genrePath =
      genre === "topRated" ? "/movie/top_rated" : "/trending/all/week";

    const res = await fetch(
      `${BASE_URL}${genrePath}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${pageNumber}`
    );

    const data = await res.json();

    console.log("Received results:", data.results);

    // to Append and not to Replace
    setResults((prev) => [...prev, ...data.results]);
    setLoading(false);
  }

  useEffect(() => {
    loadMovies(1);
  }, [genre]);
  function handleLoadMore() {
    const newPage = page + 1;
    setPage(newPage);
    loadMovies(newPage);
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Movie Grid*/}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {results.map((movie) => (
          <Card key={movie.id} result={movie} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center my-8">
        <button
          onClick={handleLoadMore}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
