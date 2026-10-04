import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LayoutGrid, ChevronDown } from "lucide-react";

const POPULAR_TAGS = ["React", "Copywriting", "Webflow", "SEO"];

const Hero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/find-work?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Translucent overlay so text stays readable over any footage */}
     {/* Translucent overlay so text stays readable over any footage */}
<div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/15 to-white" />
      {/* Foreground content, sits above the video */}
      <div className="relative z-10">
       <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
  <span className="text-brand-600">Unlock</span>{" "}
  <span className="text-gray-900">Your Next Opportunity</span>
</h1>
<p className="mt-5 max-w-2xl mx-auto text-gray-700 text-lg font-medium drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
  Search through thousands of curated projects matched to your unique skill set, or
  browse trending services to spark your next big idea.
</p>
        <form
          onSubmit={handleSearch}
          className="mt-9 max-w-2xl mx-auto flex items-center bg-white rounded-2xl shadow-lg shadow-brand-100 p-2"
        >
          <Search className="ml-3 text-gray-400" size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for 'Framer Developer'"
            className="flex-1 px-3 py-2 outline-none text-gray-700 bg-transparent"
          />
          <div className="hidden sm:flex items-center gap-1 px-4 border-l border-gray-200 text-gray-600 text-sm">
            <LayoutGrid size={16} />
            All Categories
            <ChevronDown size={14} />
          </div>
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl px-6 py-3 ml-2"
          >
            Find Work
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <span className="text-gray-500 tracking-wide font-medium">POPULAR:</span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/find-work?search=${tag}`)}
              className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full font-medium hover:bg-brand-500 hover:text-white transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;