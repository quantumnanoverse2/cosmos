"use client";

import { motion } from "framer-motion";
import ExploreBackground from "@/components/ExploreBackground";
import ExploreCard from "@/components/ExploreCard";

const exploreCategories = [
  {
    title: "🪐 Solar System",
    description: "Explore every planet, moon and dwarf planet in our cosmic neighborhood.",
    bgImage: "/explore/solar-system.jpg",
    href: "/explore/solar-system",
  },
  {
    title: "🌌 Nebulae",
    description: "Discover gigantic stellar nurseries where new stars are born.",
    bgImage: "/explore/nebulae.jpg",
    href: "/explore/nebulae",
  },
  {
    title: "🌠 Galaxies",
    description: "Travel across billions of stars and explore galaxies throughout the universe.",
    bgImage: "/explore/galaxies.jpg",
    href: "/explore/galaxies",
  },
  {
    title: "🌍 Exoplanets",
    description: "Visit thousands of planets orbiting distant stars.",
    bgImage: "/explore/exoplanets.jpg",
    href: "/explore/exoplanets",
  },
  {
    title: "⚫ Black Holes",
    description: "Learn about the most mysterious objects in space.",
    bgImage: "/explore/black-holes.jpg",
    href: "/explore/black-holes",
  },
  {
    title: "🚀 Space Missions",
    description: "Follow humanity's greatest journeys beyond Earth.",
    bgImage: "/explore/space-missions.jpg",
    href: "/explore/space-missions",
  },
  {
    title: "🔭 Observatories",
    description: "See how we observe the universe across different wavelengths.",
    bgImage: "/explore/observatories.jpg",
    href: "/explore/observatories",
  },
  {
    title: "📷 NASA Gallery",
    description: "Browse breathtaking images captured by NASA and ESA.",
    bgImage: "/explore/nasa-gallery.jpg",
    href: "/explore/nasa-gallery",
  },
];

export default function ExplorePage() {
  return (
    <main className="relative min-h-screen pt-32 pb-24 px-6 sm:px-12 lg:px-24">
      <ExploreBackground />

      {/* Header */}
      <motion.div 
        className="max-w-7xl mx-auto mb-20 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          EXPLORE THE UNIVERSE
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto font-medium tracking-wide">
          Choose where your journey begins.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        {exploreCategories.map((category, idx) => (
          <ExploreCard
            key={category.title}
            index={idx}
            title={category.title}
            description={category.description}
            bgImage={category.bgImage}
            href={category.href}
          />
        ))}
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest mb-2 font-semibold">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </main>
  );
}
