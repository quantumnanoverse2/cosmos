"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  left: string;
  top: string;
  width: string;
  height: string;
  opacity: number;
  animation: string;
  animationDelay: string;
}

export default function ExploreBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random values only on the client to avoid Next.js SSR hydration mismatches
    const generatedStars = Array.from({ length: 250 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.7 + 0.1,
      animation: `pulse ${Math.random() * 4 + 2}s infinite alternate`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black pointer-events-none">
      {/* Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.width,
            height: star.height,
            opacity: star.opacity,
            animation: star.animation,
            animationDelay: star.animationDelay,
          }}
        />
      ))}

      {/* Subtle moving nebulas */}
      <motion.div
        className="absolute left-[10%] top-[10%] h-[800px] w-[800px] rounded-full bg-blue-900/20 blur-[150px] mix-blend-screen"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute right-[5%] bottom-[10%] h-[900px] w-[900px] rounded-full bg-purple-900/15 blur-[180px] mix-blend-screen"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      <motion.div
        className="absolute left-[50%] top-[40%] h-[600px] w-[600px] rounded-full bg-pink-900/10 blur-[150px] mix-blend-screen"
        animate={{
          x: [0, 40, -50, 0],
          y: [0, 40, -40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}
