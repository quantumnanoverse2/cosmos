"use client";

import { useEffect, useState } from "react";

interface Star {
  id: number;
  left: string;
  top: string;
  opacity: number;
}

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random(),
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute h-[2px] w-[2px] rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}