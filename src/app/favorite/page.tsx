// src/app/favorite/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface FavoriteMovie {
  id: string;
  movieId: string;
  movie: {
    id: string;
    title: string;
    posterUrl: string;
    overview: string;
    releaseDate: string;
  };
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      // Force a fresh fetch to avoid any caching issues
      const res = await fetch(`/api/favorite/list?ts=${Date.now()}`, { cache: "no-store" });
      console.log("Favorites fetch status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched favorites:", data);
        setFavorites(data);
      } else {
        const error = await res.text();
        console.error("Favorites fetch error:", res.status, error);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      console.log("Session loaded, fetching favorites");
      fetchFavorites();
    }
  }, [session]);

  // Listen for storage events to refresh when favorites are added from other tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      fetchFavorites();
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom event from Card component
    window.addEventListener("favoriteAdded", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoriteAdded", handleStorageChange);
    };
  }, []);

  if (!session) {
    return (
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
        <p className="text-gray-300">
          Please log in to view your favorite movies.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
        <p className="text-gray-300">Loading...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
        <p className="text-gray-300">
          You don&apos;t have any favorite movies yet. Go hit that ❤️.
        </p>
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {favorites.map((fav) => (
          <div key={fav.id} className="bg-gray-800 p-4 rounded-xl">
            {fav.movie?.posterUrl && (
              <img
                src={`https://image.tmdb.org/t/p/w500${fav.movie.posterUrl}`}
                alt={fav.movie.title}
                className="rounded-lg"
              />
            )}
            <h2 className="text-lg font-semibold mt-3">
              {fav.movie?.title ?? "Untitled"}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
