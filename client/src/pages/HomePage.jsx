import { useEffect, useState } from "react";
import CategoryRow from "../components/CategoryRow.jsx";

let cachedVideosByCategory = null;

export default function HomePage() {
  const [videosByCategory, setVideosByCategory] = useState(
    () => cachedVideosByCategory || {}
  );
  const [loading, setLoading] = useState(!cachedVideosByCategory);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cachedVideosByCategory) return;

    async function loadData() {
      try {
        setError("");

        // Fetch categories
        const categoriesRes = await fetch("http://localhost:4000/categories");
        if (!categoriesRes.ok) throw new Error("Failed to load categories");
        const categoriesRaw = await categoriesRes.json();

        const categories = Array.isArray(categoriesRaw)
          ? categoriesRaw
          : categoriesRaw.categories || [];

        // Fetch videos
        const videosRes = await fetch("http://localhost:4000/videos");
        if (!videosRes.ok) throw new Error("Failed to load videos");
        const videosRaw = await videosRes.json();

        const videos = Array.isArray(videosRaw)
          ? videosRaw
          : videosRaw.videos || [];

        const grouped = {};
        categories.forEach((cat) => {
          grouped[cat] = videos.filter((v) => v.category === cat);
        });

        // Save to cache + state
        cachedVideosByCategory = grouped;
        setVideosByCategory(grouped);
      } catch (err) {
        console.error("Error loading data", err);
        setError("Something went wrong loading StreamBox data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="text-white/60">Loading StreamBox…</div>;
  }

  if (error) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-white/95 mb-2">
          Welcome back, Kirtan
        </h1>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  const hasAnyVideos = Object.values(videosByCategory).flat().length > 0;

  return (
  <div className="w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white/95">
            Welcome to StreamBox 
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Dive into hand-picked categories and discover your next favorite title.
        </p>
      </div>

      {!hasAnyVideos && (
        <p className="text-sm text-white/40">
          No videos available yet. Double-check your backend data.
        </p>
      )}

      {Object.entries(videosByCategory).map(([category, videos]) =>
        videos.length > 0 ? (
          <CategoryRow key={category} title={category} videos={videos} />
        ) : null
      )}
    </div>
  );
}
