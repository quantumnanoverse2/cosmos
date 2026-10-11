"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExploreBackground from "@/components/ExploreBackground";
import Link from "next/link";

interface Article {
  id: number | string;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
}

const CATEGORIES = [
  { id: "all", label: "🛰️ All NASA Updates" },
  { id: "Artemis", label: "🌙 Artemis & Moon" },
  { id: "Webb", label: "🔭 James Webb & Telescopes" },
  { id: "Mars", label: "🔴 Mars & Rovers" },
  { id: "Space Station", label: "🛸 ISS & Astronauts" },
];

export default function NewsCenter() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceStatus, setSourceStatus] = useState<"live" | "fallback">("live");

  const fetchNews = async (cat: string, query: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat !== "all") params.set("category", cat);
      if (query.trim()) params.set("search", query.trim());

      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      setArticles(data.articles || []);
      setSourceStatus(data.source || "live");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNews(activeCategory, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <main className="relative min-h-screen bg-black text-white pt-28 pb-32 overflow-hidden">
      <ExploreBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl text-blue-300 text-xs font-mono tracking-widest uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {sourceStatus === "live" ? "Live NASA Dispatch Feed" : "Archived NASA Transmissions"}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]"
          >
            NASA NEWS CENTER
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal"
          >
            Live real-time breaking news, scientific discoveries, rocket launches, and deep-space press releases streamed directly from NASA.
          </motion.p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search NASA dispatches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div 
                key={n} 
                className="h-80 rounded-3xl bg-white/5 border border-white/10 animate-pulse" 
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="text-5xl">🛰️</div>
            <h3 className="text-xl font-bold text-white">No NASA transmissions found</h3>
            <p className="text-gray-400 text-sm">
              Try adjusting your search terms or selecting another category.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Content Section */}
        {!loading && articles.length > 0 && (
          <div className="space-y-10">
            
            {/* Featured Article Banner */}
            {featuredArticle && !searchQuery && (
              <motion.a
                href={featuredArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative block rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl shadow-[0_0_50px_rgba(59,130,246,0.25)] hover:shadow-[0_0_70px_rgba(59,130,246,0.4)] transition-all duration-500"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                  <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[420px] overflow-hidden">
                    <img
                      src={featuredArticle.image_url}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent lg:hidden" />
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold tracking-wider">
                        ★ TOP DISPATCH
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        {formatDate(featuredArticle.published_at)}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-blue-300 transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {featuredArticle.summary}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:text-blue-300">
                      <span>Read Official NASA Release</span>
                      <span className="group-hover:translate-x-1 transition-transform">↗</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery ? articles : gridArticles).map((article, idx) => (
                <motion.a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex flex-col justify-between rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] hover:-translate-y-1.5"
                >
                  <div>
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-black/40">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/explore/space-missions.jpg";
                        }}
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-black/70 backdrop-blur-md text-blue-300 border border-white/10 font-bold">
                          {article.news_site}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <span className="text-[11px] font-mono text-gray-400 block">
                        {formatDate(article.published_at)}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300 border-t border-white/5">
                    <span>Read Full Story</span>
                    <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                  </div>
                </motion.a>
              ))}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
