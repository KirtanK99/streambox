import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function VideoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [related, setRelated] = useState([]);

  // Load main video
  useEffect(() => {
    async function loadVideo() {
      try {
        setError("");
        setLoading(true);

        const res = await fetch(`http://localhost:4000/videos/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Video not found");
          }
          throw new Error("Failed to load video");
        }

        const data = await res.json();
        setVideo(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadVideo();
  }, [id]);

  // Load "More like this" / related videos
  useEffect(() => {
    async function loadRelated() {
      if (!video?.category) {
        setRelated([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:4000/videos?category=${encodeURIComponent(
            video.category
          )}`
        );
        if (!res.ok) throw new Error("Failed to load related videos");

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.videos || [];

        const allSameCategory = list.filter(
          (v) => v.category === video.category
        );

        // Exclude the current video
        const others = allSameCategory.filter(
          (v) => String(v.id) !== String(video.id)
        );

        setRelated(others);
      } catch (err) {
        console.error("Failed to load related videos", err);
        setRelated([]);
      }
    }

    loadRelated();
  }, [video]);


const handleBackToBrowse = () => {
  if (window.history.length > 1) navigate(-1);
  else navigate("/");
};


  // Loading / error states
  if (loading) {
    return <div className="text-white/60">Loading video…</div>;
  }

  if (error) {
    return (
      <div className="space-y-3 max-w-5xl mx-auto">
        <button
          type="button"
          onClick={handleBackToBrowse}
          className="inline-flex items-center gap-2 text-sb-accent hover:text-sb-accent/80 text-sm font-medium transition"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sb-accent-soft/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </span>
          <span>Back to browse</span>
        </button>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 py-6 space-y-10">
      {/* Back to browse */}
      <button
          type="button"
          onClick={handleBackToBrowse}
          className="inline-flex items-center gap-2 text-sb-accent hover:text-sb-accent/80 text-sm font-medium transition"
        >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sb-accent-soft/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </span>
        <span>Back to browse</span>
      </button>

      {/* Hero section */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,3fr)] items-start">
        {/* Thumbnail / hero */}
        <div className="relative">
          <div className="aspect-video rounded-3xl bg-sb-surface shadow-sb-card ring-1 ring-white/10 overflow-hidden">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Metadata row */}
          <div className="inline-flex flex-wrap items-center gap-3 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-sb-accent-soft text-sb-accent font-medium">
              {video.category}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/60">{video.duration} min</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-semibold text-white/95 leading-tight">
            {video.title}
          </h1>

          {/* Description */}
          <p className="mt-2 text-sm md:text-base text-white/70 max-w-xl">
            {video.description}
          </p>

          {/* Actions */}
          <div className="pt-2">
            <button
              type="button"
              className="
                inline-flex items-center gap-2 rounded-full bg-sb-accent px-7 py-3
                text-sm font-semibold text-black shadow-lg
                hover:brightness-110 active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sb-accent
                transition-all
              "
              onClick={() => {
                alert(`Playing "${video.title}" (simulated)`);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-4 w-4"
              >
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
              <span>Play</span>
            </button>
          </div>
        </div>
      </section>

      {/* More like this */}
      {related.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xl font-semibold text-white/95 mb-4">
            More like this
          </h2>

          <div
            className="
              grid gap-6
              grid-cols-[repeat(auto-fill,minmax(220px,1fr))]
            "
          >
            {related.slice(0, 18).map((v) => (
              <Link
                key={v.id}
                to={`/videos/${v.id}`}
                className="group cursor-pointer"
              >
                <div
                  className="
                    aspect-video rounded-2xl bg-sb-surface overflow-hidden
                    ring-1 ring-white/5 shadow-sb-card
                    group-hover:ring-sb-accent/60
                    transition-all group-hover:brightness-110 group-hover:contrast-110
                  "
                >
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-2 text-sm font-medium text-white/90 truncate group-hover:text-sb-accent">
                  {v.title}
                </div>

                <div className="text-[11px] text-white/50">
                  {v.duration} min • {v.category}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
