"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COSMIC_MYSTERIES, CosmicMystery } from "@/data/mysteries";
import ScannerRadar from "./ScannerRadar";
import EvidenceWorkbench from "./EvidenceWorkbench";
import { scannerAudio } from "./ScannerAudio";

interface CosmicScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMysteryId?: string;
  isEmbeddedPage?: boolean;
}

const STORAGE_KEY = "cosmos_mystery_scanner_v1";

interface ProgressState {
  unlockedClues: Record<string, string[]>; // mysteryId -> clueIds
  testedHypotheses: Record<string, string[]>; // mysteryId -> hypothesisIds
  solvedMysteryIds: string[];
}

export default function CosmicScannerModal({
  isOpen,
  onClose,
  initialMysteryId,
  isEmbeddedPage = false,
}: CosmicScannerModalProps) {
  const [selectedMystery, setSelectedMystery] = useState<CosmicMystery | null>(null);
  const [activeSector, setActiveSector] = useState<string>("All Sectors");
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Local storage state
  const [progress, setProgress] = useState<ProgressState>({
    unlockedClues: {},
    testedHypotheses: {},
    solvedMysteryIds: [],
  });

  // Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save to localStorage
  const saveProgress = (newProgress: ProgressState) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch {}
  };

  // Select initial mystery if provided, otherwise default to first
  useEffect(() => {
    if (initialMysteryId) {
      const target = COSMIC_MYSTERIES.find((m) => m.id === initialMysteryId);
      if (target) {
        setSelectedMystery(target);
        setActiveSector(target.sector);
        return;
      }
    }
    if (!selectedMystery && COSMIC_MYSTERIES.length > 0) {
      setSelectedMystery(COSMIC_MYSTERIES[0]);
    }
  }, [initialMysteryId]);

  // Handle clue unlock
  const handleUnlockClue = (mysteryId: string, clueId: string) => {
    const currentClues = progress.unlockedClues[mysteryId] || [];
    if (!currentClues.includes(clueId)) {
      const updated = {
        ...progress,
        unlockedClues: {
          ...progress.unlockedClues,
          [mysteryId]: [...currentClues, clueId],
        },
      };
      saveProgress(updated);
    }
  };

  // Handle test hypothesis
  const handleTestHypothesis = (mysteryId: string, hypothesisId: string) => {
    const currentTested = progress.testedHypotheses[mysteryId] || [];
    if (!currentTested.includes(hypothesisId)) {
      const updated = {
        ...progress,
        testedHypotheses: {
          ...progress.testedHypotheses,
          [mysteryId]: [...currentTested, hypothesisId],
        },
      };
      saveProgress(updated);
    }
  };

  // Handle solve mystery
  const handleSolveMystery = (mysteryId: string) => {
    if (!progress.solvedMysteryIds.includes(mysteryId)) {
      const updated = {
        ...progress,
        solvedMysteryIds: [...progress.solvedMysteryIds, mysteryId],
      };
      saveProgress(updated);
    }
  };

  // Reset progress
  const handleResetProgress = () => {
    if (confirm("Reset all mystery investigations and discovery log?")) {
      const fresh: ProgressState = {
        unlockedClues: {},
        testedHypotheses: {},
        solvedMysteryIds: [],
      };
      saveProgress(fresh);
      scannerAudio.playBlip(300);
    }
  };

  // Select a lead from conclusion
  const handleSelectLead = (leadId: string) => {
    const nextMystery = COSMIC_MYSTERIES.find((m) => m.id === leadId);
    if (nextMystery) {
      setSelectedMystery(nextMystery);
      setActiveSector(nextMystery.sector);
      scannerAudio.playBlip(620);
    }
  };

  // Escape key listener for modal
  useEffect(() => {
    if (isEmbeddedPage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isEmbeddedPage, onClose]);

  // Detective title
  const solvedCount = progress.solvedMysteryIds.length;
  const detectiveRank =
    solvedCount === 0
      ? "Cadet Stargazer"
      : solvedCount === 1
      ? "Astrophysical Analyst"
      : solvedCount < COSMIC_MYSTERIES.length
      ? "Senior Deep-Space Investigator"
      : "Chief Cosmologist (All Resolved)";

  const content = (
    <div className={`relative w-full ${isEmbeddedPage ? "max-w-7xl mx-auto" : "max-w-7xl max-h-[92vh]"} rounded-3xl bg-slate-950/95 border border-white/20 shadow-[0_0_90px_rgba(34,211,238,0.25)] backdrop-blur-2xl flex flex-col overflow-hidden`}>
      
      {/* Scanner Header HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-8 border-b border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.6)]">
            📡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider font-mono">
                COSMIC MYSTERY SCANNER
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              INVESTIGATOR RANK: <span className="text-cyan-300 font-bold">{detectiveRank}</span> • {solvedCount}/{COSMIC_MYSTERIES.length} Mysteries Solved
            </p>
          </div>
        </div>

        {/* Header HUD Controls */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => {
              const next = !audioEnabled;
              setAudioEnabled(next);
              scannerAudio.enabled = next;
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
            title="Toggle Synthesizer Sound"
          >
            {audioEnabled ? "🔊" : "🔇"}
          </button>

          {/* Reset progress */}
          <button
            onClick={handleResetProgress}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
            title="Reset investigations"
          >
            Reset Log
          </button>

          {/* Close button if modal */}
          {!isEmbeddedPage && (
            <button
              onClick={() => {
                scannerAudio.playBlip(380);
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Command Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-8 flex-1 overflow-y-auto">
        
        {/* Left Column: Sector Radar (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <ScannerRadar
            selectedMystery={selectedMystery}
            onSelectMystery={(m) => setSelectedMystery(m)}
            activeSector={activeSector}
            onSectorChange={(sec) => setActiveSector(sec)}
            solvedMysteryIds={progress.solvedMysteryIds}
          />

          {/* Quick Target List */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
              DETECTED SIGNATURES ({COSMIC_MYSTERIES.length})
            </span>
            <div className="space-y-1.5">
              {COSMIC_MYSTERIES.map((m) => {
                const isSelected = selectedMystery?.id === m.id;
                const isSolved = progress.solvedMysteryIds.includes(m.id);

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      scannerAudio.playBlip(580);
                      setSelectedMystery(m);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold"
                        : "bg-black/30 hover:bg-white/5 border border-white/5 text-gray-300"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{m.title}</div>
                      <div className="text-[10px] text-gray-500 font-mono truncate">{m.celestialObjectName}</div>
                    </div>
                    {isSolved ? (
                      <span className="text-emerald-400 font-mono text-[11px] font-bold">✓ SOLVED</span>
                    ) : (
                      <span className="text-cyan-400/80 font-mono text-[10px]">ACTIVE</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Evidence Workbench (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {selectedMystery ? (
            <EvidenceWorkbench
              mystery={selectedMystery}
              unlockedClues={progress.unlockedClues[selectedMystery.id] || []}
              onUnlockClue={handleUnlockClue}
              testedHypothesisIds={progress.testedHypotheses[selectedMystery.id] || []}
              onTestHypothesis={handleTestHypothesis}
              isSolved={progress.solvedMysteryIds.includes(selectedMystery.id)}
              onSolveMystery={handleSolveMystery}
              onSelectLead={handleSelectLead}
              onClose={onClose}
            />
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-white/5 border border-white/10 text-gray-400 space-y-3">
              <span className="text-4xl">📡</span>
              <h4 className="text-base font-bold text-white">Select a Celestial Signature</h4>
              <p className="text-xs max-w-sm">
                Use the Sector Radar on the left to lock onto an anomalous signal and begin scientific investigation.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );

  if (isEmbeddedPage) {
    return content;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative z-10 w-full flex items-center justify-center"
          >
            {content}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
