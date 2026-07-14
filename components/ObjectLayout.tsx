"use client";

import { motion, Variants } from "framer-motion";
import { SolarSystemObject } from "@/data/solarSystem";
import ExploreBackground from "./ExploreBackground";
import Link from "next/link";

interface Props {
  data: SolarSystemObject;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

import PlanetViewer from "./PlanetViewer";

export default function ObjectLayout({ data }: Props) {
  return (
    <main className="relative min-h-screen pb-32">
      <ExploreBackground />

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <Link 
          href="/explore/solar-system" 
          className="text-white/70 hover:text-white flex items-center gap-2 transition-colors text-sm uppercase tracking-widest font-semibold backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10"
        >
          ← Back to Solar System
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-24 pt-24 overflow-hidden z-10">
        
        {/* Text Content */}
        <motion.div 
          className="relative z-10 w-full lg:w-1/2 text-left pt-12 lg:pt-0"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            {data.name}
          </h1>
          <p className="text-xl sm:text-3xl text-gray-200 font-medium tracking-wide drop-shadow-md border-l-4 border-blue-500 pl-6 py-2 bg-gradient-to-r from-blue-500/10 to-transparent">
            {data.tagline}
          </p>
        </motion.div>

        {/* Visuals (3D Globe or 2D Photo) */}
        <motion.div 
          className="relative w-full lg:w-1/2 h-[50vh] lg:h-[80vh] mt-12 lg:mt-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.5, ease: "easeOut" }}
        >
          {/* Subtle glow behind planet */}
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/5 bg-black/20 shadow-2xl backdrop-blur-sm group flex items-center justify-center">
            {data.textureUrl ? (
              <PlanetViewer textureUrl={data.textureUrl} />
            ) : (
              <img 
                src={data.heroImage} 
                alt={data.name} 
                className="w-full h-full object-contain p-8 animate-[pulse_6s_ease-in-out_infinite]"
              />
            )}
          </div>
        </motion.div>

      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-16 space-y-12 relative z-10">
        
        {/* Quick Facts Grid */}
        <motion.section 
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {Object.entries(data.quickFacts).map(([key, value]) => (
            <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-center items-center text-center shadow-xl">
              <span className="text-xs uppercase tracking-widest text-blue-400 mb-2 font-semibold">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-sm sm:text-base font-bold text-white">
                {value}
              </span>
            </div>
          ))}
        </motion.section>

        {/* Overview & Formation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section title="Overview" content={data.overview} />
          <Section title="Formation & History" content={data.formation} />
        </div>

        {/* Structure & Surface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section title="Structure & Composition" content={data.structure} />
          <Section title="Surface Features" content={data.surface} />
        </div>

        {/* Conditional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.atmosphere && <Section title="Atmosphere" content={data.atmosphere} />}
          {data.moons && <Section title="Moons" content={data.moons} />}
        </div>

        {/* Missions & Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">Space Missions</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-300 text-lg leading-relaxed">
              {data.missions.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </motion.div>

          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">Interesting Facts</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-300 text-lg leading-relaxed">
              {data.interestingFacts.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </motion.div>
        </div>

      </div>
    </main>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <motion.div 
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">
        {title}
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        {content}
      </p>
    </motion.div>
  );
}
