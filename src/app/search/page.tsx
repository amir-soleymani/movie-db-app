import Card from "@/app/components/Card";
import SkeletonCard from "@/app/components/SkeletonCard";

const API_URL = "https://api.themoviedb.org/3/search/movie";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams.query;

  if (!query) {
    return <h1 className="p-4 text-xl">Type something to search...</h1>;
  }

  const skeletons = Array.from({ length: 10 }).map((_, i) => (
    <SkeletonCard key={i} />
  ));

  const res = await fetch(
    `${API_URL}?api_key=${process.env.TMDB_API_KEY}&query=${query}`
  );
  const data = await res.json();
  const results = data.results || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Results for: "{query}"</h1>

      {results.length === 0 ? (
        <div className="text-center mt-10 text-gray-400">
          <h2 className="text-2xl font-semibold mb-2">No results found</h2>
          <p>Try searching for another movie.</p>
        </div>
      ) : (
        <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-w-6xl mx-auto py-4">
          {results
            ? results.map((result: any) => (
                <Card key={result.id} result={result} />
              ))
            : skeletons}
        </div>
      )}
    </div>
  );
}
