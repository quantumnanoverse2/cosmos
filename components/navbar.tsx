"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Explore", href: "#" },
  { name: "Missions", href: "#" },
  { name: "Gallery", href: "#" },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-shadow duration-500">
              <span className="text-white text-xs font-black">C</span>
            </div>
            <h1 className="text-xl font-bold tracking-widest text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
              COSMOS
            </h1>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link, index) => (
              <a 
                key={link.name} 
                href={link.href}
                className="relative px-5 py-2 text-sm font-medium text-gray-300 transition-colors duration-300 hover:text-white rounded-full"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="relative z-10">{link.name}</span>
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Action Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-shadow duration-300 border border-white/10"
          >
            Launch
          </motion.button>

        </div>
      </div>
    </motion.nav>
  );
}