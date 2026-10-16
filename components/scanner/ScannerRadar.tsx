"use client";

import { useEffect, useRef, useState } from "react";
import { COSMIC_MYSTERIES, CosmicMystery } from "@/data/mysteries";
import { scannerAudio } from "./ScannerAudio";

interface ScannerRadarProps {
  selectedMystery: CosmicMystery | null;
  onSelectMystery: (mystery: CosmicMystery) => void;
  activeSector: string;
  onSectorChange: (sector: string) => void;
  solvedMysteryIds: string[];
}

export default function ScannerRadar({
  selectedMystery,
  onSelectMystery,
  activeSector,
  onSectorChange,
  solvedMysteryIds,
}: ScannerRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedBand, setSelectedBand] = useState<string>("All Bands");
  const animRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  // Filter mysteries according to sector
  const visibleMysteries = COSMIC_MYSTERIES.filter((m) => {
    if (activeSector !== "All Sectors" && m.sector !== activeSector) return false;
    if (selectedBand !== "All Bands" && !m.frequencyBand.toLowerCase().includes(selectedBand.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Calculate static polar coordinates for blips on radar
  const blipPositions = useRef<Record<string, { rRatio: number; theta: number }>>({
    "europa-plumes": { rRatio: 0.32, theta: 0.8 },
    "wasp76-iron-rain": { rRatio: 0.58, theta: 2.4 },
    "psr-methuselah-pulse": { rRatio: 0.82, theta: 4.1 },
    "mars-methane-surge": { rRatio: 0.22, theta: 5.3 },
  });

  const triggerScan = () => {
    setIsScanning(true);
    scannerAudio.playScanSweep();
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 380);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(cx, cy) - 20;

      // 1. Concentric Range Rings
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((ratio, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * ratio, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 3 ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Distance markings
        ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
        ctx.font = "9px monospace";
        const labels = ["1 AU", "50 LY", "500 LY", "10,000 LY"];
        ctx.fillText(labels[idx], cx + maxR * ratio - 30, cy - 6);
      });

      // 2. Coordinate Crosshairs & Radial Spokes
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Rotating Scan Sweep Beam
      angleRef.current += isScanning ? 0.07 : 0.025;
      if (angleRef.current > Math.PI * 2) angleRef.current -= Math.PI * 2;
      const currentAngle = angleRef.current;

      // Scan beam wedge gradient
      const sweepAngle = Math.PI / 3;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, "rgba(56, 189, 248, 0.0)");
      grad.addColorStop(1, isScanning ? "rgba(56, 189, 248, 0.28)" : "rgba(56, 189, 248, 0.12)");

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, currentAngle - sweepAngle, currentAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Leading beam line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(currentAngle) * maxR, cy + Math.sin(currentAngle) * maxR);
      ctx.strokeStyle = isScanning ? "rgba(147, 197, 253, 0.95)" : "rgba(56, 189, 248, 0.6)";
      ctx.lineWidth = isScanning ? 2 : 1.5;
      ctx.stroke();
      ctx.restore();

      // 4. Render Anomaly Blips
      visibleMysteries.forEach((mystery) => {
        const pos = blipPositions.current[mystery.id] || { rRatio: 0.5, theta: 0 };
        const bx = cx + Math.cos(pos.theta) * (maxR * pos.rRatio);
        const by = cy + Math.sin(pos.theta) * (maxR * pos.rRatio);

        const isSelected = selectedMystery?.id === mystery.id;
        const isSolved = solvedMysteryIds.includes(mystery.id);

        // Blip brightness boosted when radar beam crosses it
        const angleDiff = Math.abs(currentAngle - pos.theta);
        const isIlluminated = angleDiff < 0.25 || angleDiff > Math.PI * 2 - 0.25;

        // Outer glow
        ctx.beginPath();
        ctx.arc(bx, by, isSelected ? 12 : isIlluminated ? 9 : 6, 0, Math.PI * 2);
        ctx.fillStyle = isSolved
          ? "rgba(16, 185, 129, 0.25)"
          : isSelected
          ? "rgba(244, 63, 94, 0.35)"
          : "rgba(56, 189, 248, 0.25)";
        ctx.fill();

        // Target core
        ctx.beginPath();
        ctx.arc(bx, by, isSelected ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isSolved
          ? "#10b981"
          : isSelected
          ? "#f43f5e"
          : isIlluminated
          ? "#ffffff"
          : "#38bdf8";
        ctx.fill();

        // Target reticle if selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(bx, by, 16, 0, Math.PI * 2);
          ctx.strokeStyle = "#f43f5e";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = isSelected ? "#ffffff" : "rgba(203, 213, 225, 0.7)";
        ctx.font = isSelected ? "bold 10px monospace" : "9px monospace";
        ctx.fillText(mystery.celestialObjectName, bx + 12, by + 3);
      });

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [visibleMysteries, selectedMystery, isScanning, solvedMysteryIds]);

  // Click on canvas to select blip
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxR = Math.min(cx, cy) - 20;

    let clickedMystery: CosmicMystery | null = null;
    visibleMysteries.forEach((m) => {
      const pos = blipPositions.current[m.id] || { rRatio: 0.5, theta: 0 };
      const bx = cx + Math.cos(pos.theta) * (maxR * pos.rRatio);
      const by = cy + Math.sin(pos.theta) * (maxR * pos.rRatio);

      const dist = Math.hypot(x - bx, y - by);
      if (dist < 22) {
        clickedMystery = m;
      }
    });

    if (clickedMystery) {
      scannerAudio.playBlip(680);
      onSelectMystery(clickedMystery);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Sector & Frequency Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-300 uppercase">
            SECTOR SCAN RADAR
          </h3>
        </div>

        {/* Scan Trigger Button */}
        <button
          onClick={triggerScan}
          disabled={isScanning}
          className="px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)] cursor-pointer disabled:opacity-50"
        >
          {isScanning ? "SWEEPING..." : "SCAN REGION"}
        </button>
      </div>

      {/* Sector Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px] font-mono">
        {["All Sectors", "Solar System", "Exoplanets", "Galactic Core & Deep Space"].map((sec) => (
          <button
            key={sec}
            onClick={() => onSectorChange(sec)}
            className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeSector === sec
                ? "bg-blue-600 text-white font-bold shadow-md"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Radar Canvas Visualizer */}
      <div className="relative flex-1 min-h-[300px] sm:min-h-[340px] flex items-center justify-center my-2">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair block"
        />

        {/* Center reticle label */}
        <div className="absolute pointer-events-none text-center">
          <span className="text-[10px] font-mono text-cyan-400/80 bg-black/60 px-2 py-0.5 rounded-full border border-cyan-500/20">
            OBSERVATORY ARRAY
          </span>
        </div>
      </div>

      {/* Frequency Bands Selector */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
          <span>RECEPTOR BAND:</span>
          <span className="text-cyan-300 font-bold">{selectedBand}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
          {["All Bands", "Radio", "Infrared", "Ultraviolet"].map((band) => (
            <button
              key={band}
              onClick={() => setSelectedBand(band)}
              className={`py-1 rounded-md text-center transition-all cursor-pointer ${
                selectedBand === band
                  ? "bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 font-bold"
                  : "bg-white/5 border border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {band}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
