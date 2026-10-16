"use client";

import { useState } from "react";
import ExploreBackground from "@/components/ExploreBackground";
import CosmicScannerModal from "@/components/scanner/CosmicScannerModal";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ScannerPage() {
  return (
    <main className="relative min-h-screen bg-black text-white pt-28 pb-32 overflow-hidden px-4 sm:px-8">
      <ExploreBackground />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb Header */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white backdrop-blur-xl transition-all shadow-md"
          >
            ← Back to Explore Hub
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>OBSERVATORY RADAR LINKED</span>
          </div>
        </div>

        {/* Embedded Scanner Command Deck */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CosmicScannerModal
            isOpen={true}
            onClose={() => {}}
            isEmbeddedPage={true}
          />
        </motion.div>

      </div>
    </main>
  );
}
