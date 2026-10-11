"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface LaunchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DESTINATIONS = [
  { id: "earth", name: "Earth", type: "Home World", icon: "🌍", color: "from-blue-500 to-cyan-400" },
  { id: "mars", name: "Mars", type: "Red Planet", icon: "🔴", color: "from-red-500 to-orange-400" },
  { id: "jupiter", name: "Jupiter", type: "Gas Giant", icon: "🌀", color: "from-amber-500 to-yellow-300" },
  { id: "saturn", name: "Saturn", type: "Ringed World", icon: "🪐", color: "from-yellow-500 to-amber-200" },
  { id: "europa", name: "Europa", type: "Ocean Moon", icon: "❄️", color: "from-cyan-400 to-blue-300" },
  { id: "moon", name: "The Moon", type: "Satellite", icon: "🌙", color: "from-gray-300 to-slate-100" },
  { id: "sun", name: "The Sun", type: "Star", icon: "☀️", color: "from-yellow-400 to-orange-500" },
  { id: "titan", name: "Titan", type: "Methane World", icon: "🌫️", color: "from-amber-600 to-orange-500" },
  { id: "pluto", name: "Pluto", type: "Dwarf Planet", icon: "🧊", color: "from-indigo-400 to-purple-300" },
];

export default function LaunchpadModal({ isOpen, onClose }: LaunchpadModalProps) {
  const router = useRouter();
  const [isWarping, setIsWarping] = useState(false);
  const [targetName, setTargetName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isWarping) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isWarping, onClose]);

  // Audio synthesis helpers
  const playSound = (type: "blip" | "warp") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "blip") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(540, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1080, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "warp") {
        // Bass engine ramp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 1.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }
    } catch {}
  };

  // Hyperspace canvas animation
  useEffect(() => {
    if (!isWarping || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Star {
      x: number;
      y: number;
      z: number;
      pz: number;
    }

    const stars: Star[] = Array.from({ length: 800 }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      z: Math.random() * canvas.width,
      pz: canvas.width,
    }));

    let animId: number;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 5, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        s.z -= 35;
        if (s.z <= 0) {
          s.z = canvas.width;
          s.pz = canvas.width;
          s.x = (Math.random() - 0.5) * canvas.width * 2;
          s.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        const k = 250 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        const pk = 250 / s.pz;
        const prevX = s.x * pk + cx;
        const prevY = s.y * pk + cy;
        s.pz = s.z;

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = `rgba(160, 210, 255, ${Math.min(1, (1 - s.z / canvas.width) * 1.5)})`;
        ctx.lineWidth = Math.max(1, (1 - s.z / canvas.width) * 3);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isWarping]);

  // Execute a warp jump
  const triggerWarp = (name: string, url: string) => {
    playSound("warp");
    setTargetName(name);
    setIsWarping(true);

    setTimeout(() => {
      router.push(url);
      setTimeout(() => {
        setIsWarping(false);
        onClose();
      }, 300);
    }, 1200);
  };

  const handleRandomJump = () => {
    playSound("blip");
    const pick = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
    triggerWarp(pick.name, `/explore/objects/${pick.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isWarping && onClose()}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Hyperspace Fullscreen Warp Canvas */}
          {isWarping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex flex-col items-center justify-center pointer-events-none bg-black"
            >
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
              <div className="relative z-10 text-center space-y-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="inline-block px-6 py-2 rounded-full border border-cyan-400/50 bg-cyan-950/60 backdrop-blur-xl text-cyan-300 text-xs sm:text-sm font-mono tracking-[0.3em] uppercase shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                >
                  ⚡ HYPERSPACE DRIVE ENGAGED
                </motion.div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                  JUMPING TO {targetName.toUpperCase()}
                </h2>
                <p className="text-sm text-cyan-200/70 font-mono tracking-widest">
                  COORDINATES LOCKED • TRANSLATING SPACE-TIME
                </p>
              </div>
            </motion.div>
          )}

          {/* Modal Container */}
          {!isWarping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-3xl rounded-3xl bg-slate-950/90 border border-white/15 p-6 sm:p-8 shadow-[0_0_60px_rgba(59,130,246,0.3)] backdrop-blur-2xl overflow-hidden"
            >
              {/* Subtle animated ambient glow */}
              <div className="absolute -top-32 -right-32 w-72 h-72 bg-blue-500/20 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-purple-500/20 rounded-full blur-[90px] pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(37,99,235,0.6)]">
                    🚀
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                        COSMOS LAUNCHPAD
                      </h3>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Select a mission parameter or initiate a hyperspace jump.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSound("blip");
                    onClose();
                  }}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                >
                  ✕
                </button>
              </div>

              {/* Primary Action Banners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Random Cosmic Warp */}
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRandomJump}
                  className="group relative p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 via-indigo-950/40 to-slate-900/60 border border-blue-500/30 hover:border-blue-400/60 text-left transition-all shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.35)] overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono tracking-widest text-blue-400 uppercase font-semibold">
                        Quantum Drive
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1 group-hover:text-blue-300 transition-colors">
                        🎲 Random Warp Jump
                      </h4>
                      <p className="text-xs text-gray-300/80 mt-1.5 leading-relaxed">
                        Spin the cosmic coordinates and jump instantly to a random world.
                      </p>
                    </div>
                    <span className="text-2xl p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 group-hover:scale-110 transition-transform">
                      ⚡
                    </span>
                  </div>
                </motion.button>

                {/* Gravity Simulator Sandbox */}
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playSound("blip");
                    triggerWarp("Gravity Sandbox", "/sandbox");
                  }}
                  className="group relative p-5 rounded-2xl bg-gradient-to-br from-purple-900/40 via-violet-950/40 to-slate-900/60 border border-purple-500/30 hover:border-purple-400/60 text-left transition-all shadow-[0_0_25px_rgba(168,85,247,0.15)] hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono tracking-widest text-purple-400 uppercase font-semibold">
                        Interactive Physics
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">
                        🕹️ Gravity Sandbox
                      </h4>
                      <p className="text-xs text-gray-300/80 mt-1.5 leading-relaxed">
                        Spawn black holes and manipulate orbital physics in real-time.
                      </p>
                    </div>
                    <span className="text-2xl p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 group-hover:scale-110 transition-transform">
                      🌌
                    </span>
                  </div>
                </motion.button>
              </div>

              {/* Fast Teleport Destinations */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
                    Quick-Lock Destinations
                  </span>
                  <button
                    onClick={() => {
                      playSound("blip");
                      triggerWarp("Solar System", "/explore/solar-system");
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    View All 26+ Objects →
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
                  {DESTINATIONS.slice(0, 6).map((dest) => (
                    <motion.button
                      key={dest.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        playSound("blip");
                        triggerWarp(dest.name, `/explore/objects/${dest.id}`);
                      }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group cursor-pointer"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {dest.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                          {dest.name}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">
                          {dest.type}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">ESC</kbd> to disengage</span>
                  <button
                    onClick={() => {
                      playSound("blip");
                      triggerWarp("NASA News Center", "/news");
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 decoration-blue-500/40 hover:decoration-blue-400"
                  >
                    📡 Live NASA News Center →
                  </button>
                </div>
                <span className="text-blue-400 font-mono">WARP SYSTEM v2.4 READY</span>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
