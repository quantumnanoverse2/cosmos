"use client";

import { motion } from "framer-motion";
import ExploreBackground from "@/components/ExploreBackground";
import ExploreCard from "@/components/ExploreCard";

const solarSystemCategories = [
  {
    title: "☀️ The Sun",
    description: "Explore our local star, the heart of the solar system.",
    bgImage: "/solar-system/sun.jpg",
    href: "/explore/objects/sun",
  },
  {
    title: "🪨 Inner Planets",
    description: "Discover the rocky worlds: Mercury, Venus, Earth, and Mars.",
    bgImage: "/solar-system/inner-planets.jpg",
    href: "/explore/solar-system/inner-planets",
  },
  {
    title: "🪐 Gas Giants",
    description: "Journey to the massive atmospheric worlds of Jupiter and Saturn.",
    bgImage: "/solar-system/gas-giants.jpg",
    href: "/explore/solar-system/gas-giants",
  },
  {
    title: "🧊 Ice Giants",
    description: "Explore the frigid outer planets: Uranus and Neptune.",
    bgImage: "/solar-system/ice-giants.jpg",
    href: "/explore/solar-system/ice-giants",
  },
  {
    title: "🌑 Dwarf Planets",
    description: "Visit Pluto, Ceres, Eris, Haumea, and Makemake.",
    bgImage: "/solar-system/dwarf-planets.jpg",
    href: "/explore/solar-system/dwarf-planets",
  },
  {
    title: "🌙 Famous Moons",
    description: "Explore unique satellites like Europa, Titan, and Enceladus.",
    bgImage: "/solar-system/famous-moons.jpg",
    href: "/explore/solar-system/famous-moons",
  },
  {
    title: "☄️ Small Bodies",
    description: "Asteroids, Comets, the Kuiper Belt, and the Oort Cloud.",
    bgImage: "/solar-system/small-bodies.jpg",
    href: "/explore/solar-system/small-bodies",
  },
];

export default function SolarSystemPage() {
  return (
    <main className="relative min-h-screen pb-24">
      {/* Background */}
      <ExploreBackground />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/solar-system/sun.jpg" 
            alt="The Sun" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        </motion.div>

        <motion.div 
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-white mb-6 drop-shadow-[0_0_40px_rgba(255,165,0,0.4)]">
            Solar System
          </h1>
          <p className="text-xl sm:text-3xl text-gray-200 font-medium tracking-wide drop-shadow-md">
            Explore our cosmic neighborhood.
          </p>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-xs uppercase tracking-widest mb-2 font-semibold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* Grid Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        {solarSystemCategories.map((category, idx) => (
          <ExploreCard
            key={category.title}
            index={idx}
            title={category.title}
            description={category.description}
            bgImage={category.bgImage}
            href={category.href}
          />
        ))}
      </section>
    </main>
  );
}
