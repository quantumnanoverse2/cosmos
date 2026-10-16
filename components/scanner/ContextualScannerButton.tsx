"use client";

import { useState } from "react";
import { COSMIC_MYSTERIES } from "@/data/mysteries";
import CosmicScannerModal from "./CosmicScannerModal";
import { motion } from "framer-motion";

interface ContextualScannerButtonProps {
  objectId: string;
  objectName: string;
}

export default function ContextualScannerButton({
  objectId,
  objectName,
}: ContextualScannerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Find if this object has an associated mystery
  const matchedMystery = COSMIC_MYSTERIES.find(
    (m) => m.celestialObjectId === objectId || m.celestialObjectName.toLowerCase().includes(objectName.toLowerCase())
  );

  if (!matchedMystery) return null;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-400/50 text-cyan-200 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(34,211,238,0.35)] backdrop-blur-xl transition-all cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>📡 Anomaly Detected — Scan {objectName}</span>
      </motion.button>

      <CosmicScannerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialMysteryId={matchedMystery.id}
      />
    </>
  );
}
