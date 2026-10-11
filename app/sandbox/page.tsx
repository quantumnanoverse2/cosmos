"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type SimulatorMode = "supernova" | "blackhole" | "orbital" | "galaxy";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay?: number;
}

interface Body {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

export default function CosmicSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<SimulatorMode>("supernova");
  const [particleCount, setParticleCount] = useState(3000);
  const [gravityStrength, setGravityStrength] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Drag-to-launch state for orbital mode
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);

  // Physics refs
  const particlesRef = useRef<Particle[]>([]);
  const bodiesRef = useRef<Body[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const supernovaStateRef = useRef<{ coreX: number; coreY: number; exploded: boolean; pulse: number }>({
    coreX: 0,
    coreY: 0,
    exploded: false,
    pulse: 0,
  });

  // Audio synthesizer
  const playSound = (type: "boom" | "gravity" | "launch" | "chime") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "boom") {
        // Deep sub-bass explosive rumble with white noise
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.4));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.2);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();

        // Sub bass drop
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.8);
        oscGain.gain.setValueAtTime(0.5, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
      } else if (type === "launch") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "gravity") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {}
  };

  // Initialize modes
  const initMode = (selectedMode: SimulatorMode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    particlesRef.current = [];
    bodiesRef.current = [];
    shockwavesRef.current = [];

    if (selectedMode === "supernova") {
      supernovaStateRef.current = {
        coreX: cx,
        coreY: cy,
        exploded: false,
        pulse: 0,
      };
      // Ambient stellar dust before explosion
      const p: Particle[] = [];
      const colors = ["#ffeedd", "#ffaa55", "#ff5533", "#4fa8ff"];
      for (let i = 0; i < 1500; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.min(cx, cy) * 0.9;
        p.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.7 + 0.3,
        });
      }
      particlesRef.current = p;
    } else if (selectedMode === "blackhole") {
      // Supermassive black hole at center
      bodiesRef.current = [
        {
          id: "smbh",
          x: cx,
          y: cy,
          vx: 0,
          vy: 0,
          mass: 8000,
          radius: 26,
          color: "#000000",
          trail: [],
        },
      ];

      // Accretion disk matter in Keplerian orbit
      const p: Particle[] = [];
      const colors = ["#ffffff", "#ffe288", "#ff8844", "#33bbff", "#aa44ff"];
      for (let i = 0; i < particleCount; i++) {
        const dist = Math.random() * (Math.min(cx, cy) * 0.85) + 35;
        const angle = Math.random() * Math.PI * 2;
        // Tangential velocity for stable orbit
        const speed = Math.sqrt((8000 * 0.15) / dist) * (0.9 + Math.random() * 0.2);
        p.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: -Math.sin(angle) * speed,
          vy: Math.cos(angle) * speed,
          radius: Math.random() * 1.6 + 0.6,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.8 + 0.2,
        });
      }
      particlesRef.current = p;
    } else if (selectedMode === "orbital") {
      // Central Sun
      bodiesRef.current = [
        {
          id: "sun",
          x: cx,
          y: cy,
          vx: 0,
          vy: 0,
          mass: 12000,
          radius: 24,
          color: "#ffaa00",
          trail: [],
        },
        // Pre-spawned inner planet
        {
          id: "planet-1",
          x: cx + 130,
          y: cy,
          vx: 0,
          vy: Math.sqrt((12000 * 0.08) / 130),
          mass: 40,
          radius: 6,
          color: "#4fa8ff",
          trail: [],
        },
        // Pre-spawned outer gas giant with moon
        {
          id: "planet-2",
          x: cx,
          y: cy - 240,
          vx: -Math.sqrt((12000 * 0.08) / 240),
          vy: 0,
          mass: 120,
          radius: 10,
          color: "#f59e0b",
          trail: [],
        },
      ];
      particlesRef.current = [];
    } else if (selectedMode === "galaxy") {
      // Two colliding spiral galaxies (Milky Way & Andromeda merger)
      const p: Particle[] = [];
      const g1X = cx - 180;
      const g1Y = cy + 60;
      const g2X = cx + 180;
      const g2Y = cy - 60;

      // Galaxy 1 (Blue/White, orbiting clockwise)
      for (let i = 0; i < particleCount / 2; i++) {
        const arms = 2;
        const armOffset = (i % arms) * ((Math.PI * 2) / arms);
        const dist = Math.pow(Math.random(), 1.5) * 160 + 10;
        const angle = dist * 0.03 + armOffset + (Math.random() - 0.5) * 0.4;
        const speed = Math.sqrt((4000 * 0.1) / dist);

        p.push({
          x: g1X + Math.cos(angle) * dist,
          y: g1Y + Math.sin(angle) * dist,
          vx: -Math.sin(angle) * speed + 0.4,
          vy: Math.cos(angle) * speed - 0.3,
          radius: Math.random() * 1.5 + 0.5,
          color: i % 4 === 0 ? "#ffffff" : "#4fa8ff",
          alpha: Math.random() * 0.8 + 0.2,
        });
      }

      // Galaxy 2 (Gold/Violet, orbiting counter-clockwise)
      for (let i = 0; i < particleCount / 2; i++) {
        const arms = 2;
        const armOffset = (i % arms) * ((Math.PI * 2) / arms);
        const dist = Math.pow(Math.random(), 1.5) * 160 + 10;
        const angle = -dist * 0.03 + armOffset + (Math.random() - 0.5) * 0.4;
        const speed = Math.sqrt((4000 * 0.1) / dist);

        p.push({
          x: g2X + Math.cos(angle) * dist,
          y: g2Y + Math.sin(angle) * dist,
          vx: Math.sin(angle) * speed - 0.4,
          vy: -Math.cos(angle) * speed + 0.3,
          radius: Math.random() * 1.5 + 0.5,
          color: i % 4 === 0 ? "#f43f5e" : "#fbbf24",
          alpha: Math.random() * 0.8 + 0.2,
        });
      }

      // Supermassive cores
      bodiesRef.current = [
        { id: "core1", x: g1X, y: g1Y, vx: 0.4, vy: -0.3, mass: 4500, radius: 14, color: "#38bdf8", trail: [] },
        { id: "core2", x: g2X, y: g2Y, vx: -0.4, vy: 0.3, mass: 4500, radius: 14, color: "#f59e0b", trail: [] },
      ];
      particlesRef.current = p;
    }
  };

  // Detonate Supernova trigger
  const triggerSupernova = (x?: number, y?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const originX = x ?? supernovaStateRef.current.coreX;
    const originY = y ?? supernovaStateRef.current.coreY;

    playSound("boom");
    supernovaStateRef.current.exploded = true;

    // Expand shockwaves
    shockwavesRef.current.push(
      { x: originX, y: originY, radius: 10, maxRadius: Math.max(canvas.width, canvas.height) * 0.7, color: "#ffffff", alpha: 1 },
      { x: originX, y: originY, radius: 5, maxRadius: Math.max(canvas.width, canvas.height) * 0.5, color: "#38bdf8", alpha: 0.8 },
      { x: originX, y: originY, radius: 2, maxRadius: Math.max(canvas.width, canvas.height) * 0.35, color: "#f43f5e", alpha: 0.9 }
    );

    // Eject blast debris
    const colors = ["#ffffff", "#ffe066", "#f97316", "#ef4444", "#a855f7", "#38bdf8"];
    const count = 3500;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.pow(Math.random(), 0.6) * 14 + 1.5;
      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.5 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.0015 + 0.0005,
      });
    }

    particlesRef.current = [...particlesRef.current.slice(0, 1000), ...newParticles];
  };

  // Resize listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initMode(mode);
    };

    window.addEventListener("resize", handleResize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initMode(mode);

    return () => window.removeEventListener("resize", handleResize);
  }, [mode]);

  // Main 60FPS Physics Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      // Cinematic motion blur trails
      ctx.fillStyle = mode === "supernova" ? "rgba(2, 4, 12, 0.18)" : "rgba(1, 2, 8, 0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ================= 1. SHOCKWAVES =================
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 12;
        sw.alpha *= 0.96;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = Math.max(1, 6 * (1 - sw.radius / sw.maxRadius));
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0.01) {
          shockwavesRef.current.splice(i, 1);
        }
      }

      // ================= 2. BODIES (BLACK HOLES / STARS / PLANETS) =================
      const bodies = bodiesRef.current;

      // N-Body Gravity interactions between bodies
      for (let i = 0; i < bodies.length; i++) {
        const b1 = bodies[i];

        for (let j = i + 1; j < bodies.length; j++) {
          const b2 = bodies[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist > 15) {
            const force = (gravityStrength * 0.08 * (b1.mass * b2.mass)) / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            b1.vx += fx / b1.mass;
            b1.vy += fy / b1.mass;
            b2.vx -= fx / b2.mass;
            b2.vy -= fy / b2.mass;
          }
        }

        // Update body position
        b1.x += b1.vx;
        b1.y += b1.vy;

        // Record trail for planets
        if (mode === "orbital") {
          b1.trail.push({ x: b1.x, y: b1.y });
          if (b1.trail.length > 90) b1.trail.shift();

          // Render glowing orbital trajectory path
          if (b1.trail.length > 2) {
            ctx.beginPath();
            ctx.moveTo(b1.trail[0].x, b1.trail[0].y);
            for (let t = 1; t < b1.trail.length; t++) {
              ctx.lineTo(b1.trail[t].x, b1.trail[t].y);
            }
            ctx.strokeStyle = b1.color;
            ctx.globalAlpha = 0.35;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        // Render body
        if (b1.id === "smbh" || mode === "blackhole") {
          // Relativistic Black Hole with accretion disk & jets
          const grad = ctx.createRadialGradient(b1.x, b1.y, b1.radius * 0.8, b1.x, b1.y, b1.radius * 2.8);
          grad.addColorStop(0, "rgba(255, 170, 50, 0.9)");
          grad.addColorStop(0.5, "rgba(79, 168, 255, 0.4)");
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.beginPath();
          ctx.arc(b1.x, b1.y, b1.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Event Horizon (Pitch Black)
          ctx.beginPath();
          ctx.arc(b1.x, b1.y, b1.radius, 0, Math.PI * 2);
          ctx.fillStyle = "#000000";
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Polar Relativistic Plasma Jets
          ctx.beginPath();
          ctx.moveTo(b1.x, b1.y - b1.radius);
          ctx.lineTo(b1.x, b1.y - 120);
          ctx.moveTo(b1.x, b1.y + b1.radius);
          ctx.lineTo(b1.x, b1.y + 120);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
          ctx.lineWidth = 3;
          ctx.stroke();
        } else {
          // Sun or Planet
          ctx.beginPath();
          ctx.arc(b1.x, b1.y, b1.radius, 0, Math.PI * 2);
          ctx.fillStyle = b1.color;
          ctx.shadowColor = b1.color;
          ctx.shadowBlur = b1.radius * 1.5;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ================= 3. SUPERNOVA CORE RENDERING =================
      if (mode === "supernova") {
        const core = supernovaStateRef.current;
        core.pulse += 0.05;

        if (!core.exploded) {
          // Pulsing massive blue-white supergiant star
          const pulseR = 35 + Math.sin(core.pulse) * 4;
          const starGrad = ctx.createRadialGradient(core.coreX, core.coreY, 5, core.coreX, core.coreY, pulseR * 2.2);
          starGrad.addColorStop(0, "#ffffff");
          starGrad.addColorStop(0.2, "#38bdf8");
          starGrad.addColorStop(0.6, "rgba(244, 63, 94, 0.6)");
          starGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.beginPath();
          ctx.arc(core.coreX, core.coreY, pulseR * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = starGrad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(core.coreX, core.coreY, pulseR, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        } else {
          // Remaining Pulsar / Neutron Star with sweeping beam
          ctx.save();
          ctx.translate(core.coreX, core.coreY);
          ctx.rotate(core.pulse * 2);
          ctx.beginPath();
          ctx.moveTo(0, -90);
          ctx.lineTo(0, 90);
          ctx.strokeStyle = "rgba(168, 85, 247, 0.7)";
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.restore();

          // Tiny hyper-dense core
          ctx.beginPath();
          ctx.arc(core.coreX, core.coreY, 8, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ================= 4. PARTICLES PHYSICS =================
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply gravity from all bodies
        for (const b of bodies) {
          const dx = b.x - p.x;
          const dy = b.y - p.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist > b.radius) {
            const force = (gravityStrength * 0.12 * b.mass) / distSq;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;

            // Frame dragging tangential boost for black holes
            if (b.id === "smbh" && dist < 120) {
              p.vx += (-dy / dist) * 0.15;
              p.vy += (dx / dist) * 0.15;
            }
          } else if (dist <= b.radius && mode === "blackhole") {
            // Consumed by event horizon -> respawn far away
            const angle = Math.random() * Math.PI * 2;
            const spawnDist = Math.min(canvas.width, canvas.height) * 0.45;
            p.x = b.x + Math.cos(angle) * spawnDist;
            p.y = b.y + Math.sin(angle) * spawnDist;
            const orbitV = Math.sqrt((b.mass * 0.15) / spawnDist);
            p.vx = -Math.sin(angle) * orbitV;
            p.vy = Math.cos(angle) * orbitV;
          }
        }

        // Apply friction / drag
        if (mode === "supernova") {
          p.vx *= 0.993;
          p.vy *= 0.993;
          if (p.decay) {
            p.alpha -= p.decay;
            if (p.alpha <= 0.05) p.alpha = 0.05; // Nebular lingering dust
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // ================= 5. DRAG LAUNCH VECTOR PREVIEW =================
      if (dragStart && dragCurrent && mode === "orbital") {
        ctx.beginPath();
        ctx.moveTo(dragStart.x, dragStart.y);
        ctx.lineTo(dragCurrent.x, dragCurrent.y);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Preview planet size
        ctx.beginPath();
        ctx.arc(dragStart.x, dragStart.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode, gravityStrength]);

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === "orbital") {
      setDragStart({ x, y });
      setDragCurrent({ x, y });
    } else if (mode === "supernova") {
      triggerSupernova(x, y);
    } else if (mode === "blackhole") {
      // Spawn extra singularity
      playSound("gravity");
      bodiesRef.current.push({
        id: `bh-${Date.now()}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        mass: 5000,
        radius: 18,
        color: "#000000",
        trail: [],
      });
    } else if (mode === "galaxy") {
      // Shockwave dispersion on galaxy click
      playSound("gravity");
      shockwavesRef.current.push({
        x,
        y,
        radius: 5,
        maxRadius: 250,
        color: "#fbbf24",
        alpha: 0.9,
      });
      for (const p of particlesRef.current) {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220 && dist > 1) {
          p.vx += (dx / dist) * 4;
          p.vy += (dy / dist) * 4;
        }
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragStart || mode !== "orbital") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePointerUp = () => {
    if (dragStart && dragCurrent && mode === "orbital") {
      const dx = dragStart.x - dragCurrent.x;
      const dy = dragStart.y - dragCurrent.y;
      const vx = dx * 0.04;
      const vy = dy * 0.04;

      playSound("launch");
      const planetColors = ["#38bdf8", "#34d399", "#f43f5e", "#fbbf24", "#a855f7", "#ec4899"];
      bodiesRef.current.push({
        id: `planet-${Date.now()}`,
        x: dragStart.x,
        y: dragStart.y,
        vx,
        vy,
        mass: Math.random() * 60 + 20,
        radius: Math.random() * 4 + 4,
        color: planetColors[Math.floor(Math.random() * planetColors.length)],
        trail: [],
      });
    }
    setDragStart(null);
    setDragCurrent(null);
  };

  return (
    <main className="relative min-h-screen bg-black overflow-hidden select-none">
      
      {/* Top HUD Controls */}
      <div className="absolute top-6 left-0 w-full z-50 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none">
        
        {/* Navigation & Mode Pills */}
        <div className="flex items-center gap-3 pointer-events-auto flex-wrap">
          <Link
            href="/"
            className="text-white/70 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest font-semibold backdrop-blur-xl bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full border border-white/15 transition-all shadow-lg"
          >
            ← Home
          </Link>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-950/80 border border-white/15 backdrop-blur-2xl shadow-2xl">
            <button
              onClick={() => { setMode("supernova"); initMode("supernova"); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === "supernova"
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              💥 Supernova
            </button>
            <button
              onClick={() => { setMode("blackhole"); initMode("blackhole"); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === "blackhole"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🕳️ Black Hole
            </button>
            <button
              onClick={() => { setMode("orbital"); initMode("orbital"); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === "orbital"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🪐 Orbit Maker
            </button>
            <button
              onClick={() => { setMode("galaxy"); initMode("galaxy"); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === "galaxy"
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🌌 Galaxy Collision
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {mode === "supernova" && (
            <button
              onClick={() => triggerSupernova()}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.6)] transition-all cursor-pointer animate-pulse"
            >
              💥 Detonate Supernova
            </button>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs backdrop-blur-xl transition-all cursor-pointer"
            title="Toggle Sound FX"
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>

          <button
            onClick={() => initMode(mode)}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold backdrop-blur-xl transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Floating Instructions HUD */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-5 py-2 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl shadow-xl"
        >
          <p className="text-xs sm:text-sm font-mono text-gray-300">
            {mode === "supernova" && "⚡ Click anywhere or press Detonate to trigger core-collapse blasts!"}
            {mode === "blackhole" && "🌀 Matter is swirling into the singularity. Click anywhere to spawn extra black holes!"}
            {mode === "orbital" && "🎯 Click & Drag to aim launch vector, release to fling planets into orbit!"}
            {mode === "galaxy" && "🌌 Watch Milky Way & Andromeda spiral into collision. Click to pulse shockwaves!"}
          </p>
        </motion.div>
      </div>

      {/* Interactive Simulation Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="block touch-none cursor-crosshair w-full h-full"
      />
    </main>
  );
}
