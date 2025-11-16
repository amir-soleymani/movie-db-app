import Image from "next/image";
import Link from "next/link";

interface CardProps {
  result: any; //improve later
}

export default function Card({ result }: CardProps) {
  // Base URL for TMDB images
  const imageUrl = "https://image.tmdb.org/t/p/original";

  return (
    <Link href={`/movie/${result.id}`}>
      <div className="cursor-pointer bg-white dark:bg-gray-700 sm:p-3 sm:hover:shadow-slate-400 sm:shadow-md sm:border sm:border-slate-400 dark:border-gray-600 rounded-lg sm:m-2 transition-shadow duration-200">
        {/* 1. Movie Poster Image */}
        <Image
          src={`${imageUrl}${result.backdrop_path || result.poster_path}`}
          width={500}
          height={300}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
          alt="movie poster"
          className="sm:rounded-t-lg group-hover:opacity-80 transition-opacity duration-300"
        />

        {/* 2. Text Content */}
        <div className="p-2">
          <h2 className="truncate text-lg font-bold">
            {result.title || result.name}
          </h2>
          <p className="flex items-center">
            {result.release_date || result.first_air_date}
          </p>
        </div>
      </div>
    </Link>
  );
}
