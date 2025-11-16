import Card from "@/app/components/Card";

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

  const res = await fetch(
    `${API_URL}?api_key=${process.env.TMDB_API_KEY}&query=${query}`
  );
  const data = await res.json();
  const results = data.results || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Results for: "{query}"</h1>

      <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-w-6xl mx-auto py-4">
        {results.map((result: any) => (
          <Card key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}
