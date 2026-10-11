"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExploreBackground from "@/components/ExploreBackground";
import Link from "next/link";

interface GalleryItem {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  center: string;
  keywords: string[];
  thumbnail: string;
  high_res: string;
}

const QUICK_SEARCHES = [
  "James Webb Space Telescope",
  "Pillars of Creation",
  "Mars Curiosity Rover",
  "Carina Nebula",
  "Jupiter Great Red Spot",
  "Saturn Cassini Rings",
  "Andromeda Galaxy",
  "Apollo Moon Landing",
  "Earth from Moon",
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("James Webb Space Telescope Deep Space");
  const [inputValue, setInputValue] = useState("James Webb Space Telescope Deep Space");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const fetchGallery = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?q=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setItems(data.items || []);
      setTotalResults(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchTerm(inputValue.trim());
    }
  };

  const handleQuickSearch = (term: string) => {
    setInputValue(term);
    setSearchTerm(term);
  };

  // Keyboard shortcut: Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedItem) {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Archival Date";
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white pt-28 pb-32 overflow-hidden">
      <ExploreBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl text-blue-300 text-xs font-mono tracking-widest uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Live NASA Archives Gateway
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]"
          >
            COSMIC MEDIA GALLERY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal"
          >
            Direct access to millions of official NASA photographs, telescope observations, planetary probes, and deep-space missions.
          </motion.p>
        </div>

        {/* Search Bar Form */}
        <motion.form 
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="relative flex items-center p-2 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-2xl shadow-[0_0_35px_rgba(59,130,246,0.25)] focus-within:border-blue-500/60 focus-within:shadow-[0_0_45px_rgba(59,130,246,0.4)] transition-all">
            <span className="pl-4 pr-3 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search NASA archives (e.g. James Webb, Supernova, Mars, Saturn)..."
              className="w-full bg-transparent border-none text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue("")}
                className="px-2 text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="ml-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-all whitespace-nowrap cursor-pointer"
            >
              Search NASA
            </button>
          </div>
        </motion.form>

        {/* Quick Search Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14 max-w-4xl mx-auto">
          <span className="text-xs text-gray-400 font-mono uppercase mr-2">Quick Search:</span>
          {QUICK_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => handleQuickSearch(term)}
              className={`px-3 py-1 rounded-full text-xs transition-all border cursor-pointer ${
                searchTerm === term
                  ? "bg-blue-600/30 border-blue-400 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 text-xs sm:text-sm text-gray-400">
          <div>
            Showing archives for: <span className="text-white font-semibold font-mono">"{searchTerm}"</span>
          </div>
          <div>
            {loading ? "Searching NASA Archives..." : `${items.length} captures retrieved`}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-72 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="text-5xl">🔭</div>
            <h3 className="text-xl font-bold text-white">No NASA captures matched your search</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              NASA's library could not find records matching "{searchTerm}". Try a different astronomical keyword like "Hubble", "Galaxy", or "Mars".
            </p>
            <button
              onClick={() => handleQuickSearch("James Webb Space Telescope")}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Explore James Webb Gallery
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <motion.div
                key={item.nasa_id + idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative aspect-video sm:aspect-square w-full overflow-hidden bg-black/40">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                  
                  {/* Center Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-black/70 backdrop-blur-md text-blue-300 border border-white/15">
                      {item.center}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>{formatDate(item.date_created)}</span>
                    <span className="truncate max-w-[100px] text-[10px] text-gray-500">{item.nasa_id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl bg-slate-950/95 border border-white/20 shadow-[0_0_80px_rgba(59,130,246,0.35)] backdrop-blur-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                ✕
              </button>

              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                
                {/* Full-res Image Container */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 max-h-[55vh]">
                  <img
                    src={selectedItem.high_res}
                    alt={selectedItem.title}
                    className="max-h-[55vh] w-auto max-w-full object-contain mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = selectedItem.thumbnail;
                    }}
                  />
                </div>

                {/* Metadata & Actions */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          {selectedItem.center} Archives
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                          Captured: {formatDate(selectedItem.date_created)}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                        {selectedItem.title}
                      </h2>
                    </div>

                    <a
                      href={selectedItem.high_res}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                    >
                      <span>Open Full RAW Image</span>
                      <span>↗</span>
                    </a>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono tracking-widest text-blue-400">
                      Scientific Archive Record
                    </span>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* NASA ID */}
                  <div className="pt-2 text-xs font-mono text-gray-500 flex items-center gap-4">
                    <span>NASA Record ID: <span className="text-gray-300">{selectedItem.nasa_id}</span></span>
                    <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300">ESC</kbd> to close</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
