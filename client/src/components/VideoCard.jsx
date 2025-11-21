import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  return (
    <Link
      to={`/videos/${video.id}`}
      className="group relative w-[230px] shrink-0 cursor-pointer"
    >
      <div className="aspect-video overflow-hidden rounded-2xl bg-sb-surface shadow-sb-card
                      ring-1 ring-white/5 group-hover:ring-sb-accent/70 transition-all
                      group-hover:-translate-y-1 group-hover:scale-[1.04]">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover group-hover:brightness-110 group-hover:contrast-110
                     transition-[filter,transform] duration-300"
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-xs font-medium text-white/90 truncate group-hover:text-sb-accent">
          {video.title}
        </div>
        <span className="text-[10px] text-white/40">
          {video.duration} min
        </span>
      </div>

      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-white/35">
        {video.category}
      </div>
    </Link>
  );
}
