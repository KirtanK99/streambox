import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VideoCard from "./VideoCard.jsx";

export default function CategoryRow({ title, videos }) {
  const rowRef = useRef(null);

  if (!videos?.length) return null;

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const amount = direction === "left" ? -600 : 600;
    rowRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mb-10 max-w-full">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white/90">{title}</h2>
        <span className="text-[10px] text-white/40">{videos.length} titles</span>
      </div>

      {/* NOTE: added overflow-hidden + max-w-full guard */}
      <div className="relative group/row overflow-hidden max-w-full">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 
                    w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 
                    text-white items-center justify-center z-20
                    opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto max-w-full pb-2 scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 
                    w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 
                    text-white items-center justify-center z-20
                    opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight size={20} />
        </button>

        {/* Fades (your original design) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-sb-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-sb-bg to-transparent" />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
