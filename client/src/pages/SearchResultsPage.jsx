import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import VideoCard from "../components/VideoCard.jsx";

function useQuery() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

export default function SearchResultsPage() {
  const query = useQuery();
  const searchTerm = query.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function search() {
      if (!searchTerm) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch all videos once from backend
        const res = await fetch("http://localhost:4000/videos");
        if (!res.ok) {
          throw new Error("Failed to load videos");
        }

        // Backend returns a plain array
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.videos || [];

        const q = searchTerm.toLowerCase();
        const filtered = list.filter(
          (video) =>
            (video.title || "").toLowerCase().includes(q) ||
            (video.category || "").toLowerCase().includes(q)
        );

        setResults(filtered);
      } catch (err) {
        console.error("Failed to search videos", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    search();
  }, [searchTerm]);

  if (!searchTerm) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-white/95 mb-2">
          Search
        </h1>
        <p className="text-sm text-white/50">
          Type a title or category in the search bar to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white/95">
          Search results for <span className="text-sb-accent">"{searchTerm}"</span>
        </h1>
        <p className="text-sm text-white/50 mt-1">
          {loading
            ? "Searching videos…"
            : results.length === 0
            ? "No videos found matching your search."
            : `${results.length} result${results.length === 1 ? "" : "s"} found.`}
        </p>
      </div>

      {!loading && results.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-6 justify-center">
          {results.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
