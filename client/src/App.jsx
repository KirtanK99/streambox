import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import VideoDetailPage from "./pages/VideoDetailPage.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import { useState } from "react";
function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery =
    location.pathname === "/search" ? params.get("q") || "" : "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sb-bg via-sb-bg to-black text-white overflow-x-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-[#050509ee] to-[#050509cc] backdrop-blur border-b border-white/5">
        {/* ⬇️ FULL-WIDTH CONTAINER INSTEAD OF max-w-6xl mx-auto */}
        <div className="w-full px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="h-8 w-8 rounded-2xl bg-sb-accent-soft flex items-center justify-center">
              <span className="text-sm font-semibold text-sb-accent">SB</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-wide text-sm">
                StreamBox
              </div>
              <div className="text-[11px] text-white/50">
                Browse. Discover. Binge.
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full bg-sb-surface-alt/80 border border-white/10 px-4 py-2 text-sm
                           text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sb-accent/60"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/70"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      {/* ⬇️ FULL-WIDTH, JUST SOME HORIZONTAL PADDING */}
      <main className="w-full px-6 pb-10 pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/videos/:id" element={<VideoDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </main>
    </div>
  );
}



export default function App() {
  return <AppShell />;
}
