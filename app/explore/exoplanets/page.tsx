"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExploreBackground from "@/components/ExploreBackground";
import Link from "next/link";
import { FEATURED_EXOPLANETS, FeaturedExoplanet } from "@/data/exoplanets";
import ContextualScannerButton from "@/components/scanner/ContextualScannerButton";

interface CatalogPlanet {
  name: string;
  hostname: string;
  discoveryMethod: string;
  discoveryYear: number;
  orbitalPeriod: number | null;
  radiusEarth: number | null;
  massEarth: number | null;
  distanceLy: number | null;
  temperatureK: number | null;
  type: string;
}

export default function ExoplanetsPage() {
  // Hall of Fame state
  const [hallFilter, setHallFilter] = useState<"all" | "habitable" | "exotic" | "historic">("all");
  const [selectedExoplanet, setSelectedExoplanet] = useState<FeaturedExoplanet | null>(null);

  // Live Catalog state
  const [catalogPlanets, setCatalogPlanets] = useState<CatalogPlanet[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogType, setCatalogType] = useState("all");
  const [sortBy, setSortBy] = useState<"year" | "dist" | "orbit">("year");

  // Fetch live NASA catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoadingCatalog(true);
      try {
        const params = new URLSearchParams();
        if (catalogSearch.trim()) params.set("search", catalogSearch.trim());
        if (catalogType !== "all") params.set("type", catalogType);

        const res = await fetch(`/api/exoplanets?${params.toString()}`);
        if (!res.ok) throw new Error("Catalog fetch failed");
        const data = await res.json();
        setCatalogPlanets(data.planets || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCatalog(false);
      }
    };

    const timer = setTimeout(fetchCatalog, 300);
    return () => clearTimeout(timer);
  }, [catalogSearch, catalogType]);

  // Sort catalog
  const sortedCatalog = [...catalogPlanets].sort((a, b) => {
    if (sortBy === "year") return b.discoveryYear - a.discoveryYear;
    if (sortBy === "dist") {
      if (!a.distanceLy) return 1;
      if (!b.distanceLy) return -1;
      return a.distanceLy - b.distanceLy;
    }
    if (sortBy === "orbit") {
      if (!a.orbitalPeriod) return 1;
      if (!b.orbitalPeriod) return -1;
      return a.orbitalPeriod - b.orbitalPeriod;
    }
    return 0;
  });

  // Filter Hall of Fame
  const filteredHall = FEATURED_EXOPLANETS.filter((p) => {
    if (hallFilter === "all") return true;
    return p.category === hallFilter;
  });

  return (
    <main className="relative min-h-screen bg-black text-white pt-28 pb-32 overflow-hidden">
      <ExploreBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white backdrop-blur-xl transition-all shadow-md"
          >
            ← Back to Explore
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl text-purple-300 text-xs font-mono tracking-widest uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            NASA Exoplanet Archive Gateway
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-[0_0_40px_rgba(168,85,247,0.35)]"
          >
            EXOPLANET ARCHIVE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal"
          >
            Explore over 5,500 confirmed alien worlds beyond our solar system—from diamond planets and molten iron rain to habitable Earth cousins.
          </motion.p>
        </div>

        {/* ================= TIER 1: HALL OF FAME ================= */}
        <section className="mb-24 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
                Tier 1 • Curated Superstars
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                🏆 Hall of Fame: Alien Worlds
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All 12 Superstars" },
                { id: "habitable", label: "🌱 Habitable Candidates" },
                { id: "exotic", label: "⚡ Extreme & Exotic" },
                { id: "historic", label: "📜 Historic Discoveries" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setHallFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    hallFilter === tab.id
                      ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/50"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hall of Fame Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHall.map((planet, idx) => (
              <motion.div
                key={planet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedExoplanet(planet)}
                className="group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950/60 backdrop-blur-2xl p-6 hover:border-purple-400/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Glowing ambient background corner */}
                <div
                  className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-[70px] opacity-25 group-hover:opacity-45 transition-opacity pointer-events-none"
                  style={{ backgroundColor: planet.color }}
                />

                <div className="space-y-4 relative z-10">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10 font-semibold">
                      {planet.distanceLy} Light-Years
                    </span>
                    <span className="text-gray-400">
                      Discovered {planet.discoveryYear}
                    </span>
                  </div>

                  {/* Title & Nickname */}
                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                      {planet.name}
                    </h3>
                    <p className="text-xs font-semibold text-purple-400 mt-0.5 tracking-wide">
                      {planet.nickname}
                    </p>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2">
                    {planet.tagline}
                  </p>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Type</span>
                      <span className="font-semibold text-white truncate block">{planet.type}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Temp</span>
                      <span className="font-semibold text-white truncate block">{planet.quickFacts.temperature.split(" ")[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                  <span>Open Full Dossier</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= TIER 2: LIVE NASA EXOPLANET ARCHIVE ================= */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
                Tier 2 • Official NASA Caltech Feed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                🛰️ Live NASA Catalog (300+ Confirmed Planets)
              </h2>
            </div>
            <div className="text-xs font-mono text-gray-400">
              {loadingCatalog ? "Querying NASA..." : `${sortedCatalog.length} planets cataloged`}
            </div>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by planet name (e.g. Kepler, TOI, WASP)..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {[
                { id: "all", label: "All Types" },
                { id: "Super-Earth", label: "Super-Earth" },
                { id: "Gas Giant", label: "Gas Giant" },
                { id: "Neptune-like", label: "Neptune-like" },
                { id: "Terrestrial", label: "Terrestrial" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCatalogType(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    catalogType === t.id
                      ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <span className="text-xs text-gray-400 font-mono">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="year">Discovery Year (Newest)</option>
                <option value="dist">Distance (Closest)</option>
                <option value="orbit">Orbital Period (Fastest)</option>
              </select>
            </div>
          </div>

          {/* Catalog Data Table */}
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-2xl overflow-hidden shadow-2xl">
            {loadingCatalog ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-gray-400">Streamed from NASA Exoplanet Archive TAP API...</p>
              </div>
            ) : sortedCatalog.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-sm text-gray-400">No exoplanets matched "{catalogSearch}".</p>
                <button
                  onClick={() => { setCatalogSearch(""); setCatalogType("all"); }}
                  className="px-4 py-1.5 rounded-full bg-blue-600 text-xs font-semibold text-white"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-mono uppercase text-[11px] tracking-wider">
                      <th className="py-3.5 px-6">Planet Name</th>
                      <th className="py-3.5 px-4">Classification</th>
                      <th className="py-3.5 px-4">Distance</th>
                      <th className="py-3.5 px-4">Radius (Earth)</th>
                      <th className="py-3.5 px-4">Orbital Period</th>
                      <th className="py-3.5 px-4">Method & Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sortedCatalog.slice(0, 100).map((p, idx) => (
                      <tr
                        key={p.name + idx}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-3.5 px-6 font-semibold text-white group-hover:text-blue-300">
                          {p.name}
                          <span className="text-[11px] text-gray-500 block font-normal">Host: {p.hostname}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold border ${
                              p.type === "Super-Earth"
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                : p.type === "Gas Giant"
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                : p.type === "Neptune-like"
                                ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                                : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                            }`}
                          >
                            {p.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-300 font-mono">
                          {p.distanceLy ? `${p.distanceLy} ly` : "Unknown"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-300 font-mono">
                          {p.radiusEarth ? `${p.radiusEarth} R⊕` : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-300 font-mono">
                          {p.orbitalPeriod ? `${p.orbitalPeriod} days` : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 text-xs">
                          {p.discoveryMethod} ({p.discoveryYear})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* ================= PLANETARY DOSSIER LIGHTBOX ================= */}
      <AnimatePresence>
        {selectedExoplanet && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExoplanet(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-950/95 border border-white/20 shadow-[0_0_80px_rgba(168,85,247,0.35)] backdrop-blur-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedExoplanet(null)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                ✕
              </button>

              <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
                
                {/* Header */}
                <div className="space-y-2 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                      {selectedExoplanet.type}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      Distance: {selectedExoplanet.distanceLy} Light-Years
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-white">
                    {selectedExoplanet.name}
                  </h2>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-purple-400">
                      "{selectedExoplanet.nickname}" — {selectedExoplanet.tagline}
                    </p>
                    <ContextualScannerButton objectId={selectedExoplanet.id} objectName={selectedExoplanet.name} />
                  </div>
                </div>

                {/* Quick Facts Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Radius</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{selectedExoplanet.quickFacts.radius}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Mass</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{selectedExoplanet.quickFacts.mass}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Year / Orbit</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{selectedExoplanet.quickFacts.orbitalPeriod}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">Est. Temp</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{selectedExoplanet.quickFacts.temperature}</span>
                  </div>
                </div>

                {/* Overview */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-purple-400 font-semibold">
                    Astronomical Profile & Environment
                  </h4>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    {selectedExoplanet.overview}
                  </p>
                </div>

                {/* Phenomenon Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/20 border border-purple-500/30 space-y-1.5">
                  <h5 className="text-xs font-mono uppercase text-purple-300 tracking-wider font-bold">
                    ⚡ Unique Atmospheric Phenomenon
                  </h5>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {selectedExoplanet.phenomenon}
                  </p>
                </div>

                {/* Discovery Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-gray-400 border-t border-white/10">
                  <div>
                    <span className="font-mono text-gray-500">Host Star: </span>
                    <span className="text-gray-300 font-semibold">{selectedExoplanet.hostStar}</span>
                  </div>
                  <div>
                    <span className="font-mono text-gray-500">Discovery Method: </span>
                    <span className="text-gray-300 font-semibold">{selectedExoplanet.discoveryMethod} ({selectedExoplanet.discoveryYear})</span>
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
