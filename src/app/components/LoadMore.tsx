"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function LoadMore() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);

  function handleLoadMore() {
    const newPage = currentPage + 1;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    router.push("?" + params.toString());
  }

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={handleLoadMore}
        className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
      >
        Load More
      </button>
    </div>
  );
}
