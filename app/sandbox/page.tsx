"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface GravityWell {
  x: number;
  y: number;
  mass: number;
}

export default function GravitySandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wells, setWells] = useState<GravityWell[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Initialize particles if empty
    if (particlesRef.current.length === 0) {
      const p: Particle[] = [];
      const colors = ["#4fa8ff", "#ffffff", "#ffaa00", "#ff4444"];
      for (let i = 0; i < 3000; i++) {
        p.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      particlesRef.current = p;
    }

    // Animation Loop
    const animate = () => {
      // Trail effect (slight fade)
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply gravity from wells
        for (const well of wells) {
          const dx = well.x - p.x;
          const dy = well.y - p.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          
          if (dist > 5) {
            const force = well.mass / distSq;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Friction / Drag
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen instead of bouncing (feels more space-like)
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Draw Gravity Wells (Black Holes)
      for (const well of wells) {
        // Event horizon
        ctx.beginPath();
        ctx.arc(well.x, well.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.strokeStyle = "rgba(79, 168, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Accretion disk glow
        ctx.beginPath();
        ctx.arc(well.x, well.y, 30, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(well.x, well.y, 10, well.x, well.y, 30);
        gradient.addColorStop(0, "rgba(79, 168, 255, 0.5)");
        gradient.addColorStop(1, "rgba(79, 168, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [wells]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add a new gravity well (black hole)
    setWells((prev) => [...prev, { x, y, mass: 1000 }]);
  };

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-8 left-8 z-50 flex gap-4">
        <Link 
          href="/" 
          className="text-white/70 hover:text-white flex items-center gap-2 transition-colors text-sm uppercase tracking-widest font-semibold backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10"
        >
          ← Home
        </Link>
        <button 
          onClick={() => { 
            setWells([]); 
            particlesRef.current.forEach(p => { 
              p.vx = (Math.random() - 0.5)*2; 
              p.vy = (Math.random() - 0.5)*2; 
            }); 
          }}
          className="text-white/70 hover:text-white flex items-center gap-2 transition-colors text-sm uppercase tracking-widest font-semibold backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 cursor-pointer"
        >
          Reset Space
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-white/50 text-sm tracking-widest uppercase font-semibold"
        >
          Click anywhere to spawn a Black Hole
        </motion.p>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="block touch-none cursor-crosshair"
      />
    </main>
  );
}
