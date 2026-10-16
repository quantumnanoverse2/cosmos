"use client";

import { useState, useEffect } from "react";
import { CosmicMystery, InstrumentObservation, Hypothesis } from "@/data/mysteries";
import { scannerAudio } from "./ScannerAudio";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface EvidenceWorkbenchProps {
  mystery: CosmicMystery;
  unlockedClues: string[];
  onUnlockClue: (mysteryId: string, clueId: string) => void;
  testedHypothesisIds: string[];
  onTestHypothesis: (mysteryId: string, hypothesisId: string) => void;
  isSolved: boolean;
  onSolveMystery: (mysteryId: string) => void;
  onSelectLead: (leadId: string) => void;
  onClose?: () => void;
}

export default function EvidenceWorkbench({
  mystery,
  unlockedClues,
  onUnlockClue,
  testedHypothesisIds,
  onTestHypothesis,
  isSolved,
  onSolveMystery,
  onSelectLead,
  onClose,
}: EvidenceWorkbenchProps) {
  // Instrument values state
  const [instrumentValues, setInstrumentValues] = useState<Record<string, number>>({});
  const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis | null>(null);
  const [activeTab, setActiveTab] = useState<"telemetry" | "instruments" | "hypotheses" | "conclusion">(
    isSolved ? "conclusion" : "instruments"
  );

  // Initialize instrument sliders
  useEffect(() => {
    const initial: Record<string, number> = {};
    mystery.instruments.forEach((inst) => {
      // If already unlocked, position in target range, otherwise initial
      const isAlreadyUnlocked = unlockedClues.includes(inst.id);
      initial[inst.id] = isAlreadyUnlocked
        ? (inst.expectedRange[0] + inst.expectedRange[1]) / 2
        : inst.initialValue;
    });
    setInstrumentValues(initial);
  }, [mystery, unlockedClues]);

  // Handle slider scrub
  const handleSliderChange = (inst: InstrumentObservation, val: number) => {
    setInstrumentValues((prev) => ({ ...prev, [inst.id]: val }));

    const inRange = val >= inst.expectedRange[0] && val <= inst.expectedRange[1];
    if (inRange && !unlockedClues.includes(inst.id)) {
      scannerAudio.playClueUnlocked();
      onUnlockClue(mystery.id, inst.id);
    }
  };

  // Hypotheses evaluation
  const handleSelectHypothesis = (hyp: Hypothesis) => {
    setSelectedHypothesis(hyp);
    scannerAudio.playBlip(540);
    if (!testedHypothesisIds.includes(hyp.id)) {
      onTestHypothesis(mystery.id, hyp.id);
    }

    if (hyp.isBestSupported) {
      scannerAudio.playHypothesisSuccess();
      onSolveMystery(mystery.id);
      setActiveTab("conclusion");
    }
  };

  const unlockedCount = mystery.instruments.filter((inst) => unlockedClues.includes(inst.id)).length;
  const totalClues = mystery.instruments.length;
  const progressPercent = Math.round((unlockedCount / totalClues) * 100);

  return (
    <div className="flex flex-col h-full rounded-3xl bg-slate-950/85 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
      
      {/* Top Banner & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                mystery.statusBadge.includes("ESTABLISHED")
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              }`}
            >
              {mystery.statusBadge}
            </span>

            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/10 text-gray-300">
              {mystery.frequencyBand}
            </span>

            {isSolved && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ✓ PHENOMENON RESOLVED
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            {mystery.title}
          </h2>
          <p className="text-xs sm:text-sm text-cyan-300 font-semibold mt-0.5">
            Target: {mystery.celestialObjectName} • {mystery.coordinates}
          </p>
        </div>

        {/* Action button to warp directly to 3D object */}
        {mystery.celestialObjectRoute && (
          <Link
            href={mystery.celestialObjectRoute}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold backdrop-blur-md transition-all self-start sm:self-auto shadow-md"
          >
            <span>View 3D Celestial Object</span>
            <span>↗</span>
          </Link>
        )}
      </div>

      {/* 3-Step Quick Mission Guide Banner */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/30 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎯</span>
          <div>
            <div className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Investigation Objective:
            </div>
            <div className="text-[11px] text-gray-300 flex flex-wrap items-center gap-2 mt-0.5 font-mono">
              <span className={`${unlockedCount < totalClues ? "text-cyan-300 font-bold underline" : "text-gray-400"}`}>1. Align Instrument Sliders</span>
              <span className="text-gray-500">→</span>
              <span className={`${unlockedCount === totalClues && !isSolved ? "text-purple-300 font-bold underline" : "text-gray-400"}`}>2. Decode Clues</span>
              <span className="text-gray-500">→</span>
              <span className={`${isSolved ? "text-emerald-300 font-bold" : "text-gray-400"}`}>3. Test & Confirm Hypothesis</span>
            </div>
          </div>
        </div>

        {unlockedCount < totalClues ? (
          <button
            onClick={() => setActiveTab("instruments")}
            className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/40 text-cyan-200 text-xs font-bold font-mono tracking-wide transition-all self-end sm:self-auto cursor-pointer"
          >
            Go to Sliders ({unlockedCount}/{totalClues}) ↓
          </button>
        ) : !isSolved ? (
          <button
            onClick={() => setActiveTab("hypotheses")}
            className="px-3 py-1.5 rounded-lg bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/50 text-purple-200 text-xs font-bold font-mono tracking-wide transition-all self-end sm:self-auto cursor-pointer animate-pulse"
          >
            Solve Case Now 💡
          </button>
        ) : (
          <span className="text-emerald-400 text-xs font-mono font-bold">
            ✓ Case Solved!
          </span>
        )}
      </div>

      {/* Navigation Tabs for Investigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pt-4 pb-3 overflow-x-auto scrollbar-none text-xs font-mono">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "telemetry"
              ? "bg-white/15 text-white font-bold border border-white/20 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          📡 Anomaly Telemetry
        </button>

        <button
          onClick={() => setActiveTab("instruments")}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "instruments"
              ? "bg-cyan-500/25 text-cyan-200 font-bold border border-cyan-400/40 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <span>🔬 Instruments & Clues</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/30 text-[10px]">
            {unlockedCount}/{totalClues}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("hypotheses")}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "hypotheses"
              ? "bg-purple-500/25 text-purple-200 font-bold border border-purple-400/40 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <span>💡 Test Hypotheses</span>
          {isSolved && <span className="text-emerald-400">✓</span>}
        </button>

        <button
          onClick={() => setActiveTab("conclusion")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "conclusion"
              ? "bg-emerald-500/25 text-emerald-200 font-bold border border-emerald-400/40 shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          📜 Conclusion & Next Leads
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-6">
        
        {/* ================= TAB 1: TELEMETRY ================= */}
        {activeTab === "telemetry" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overview Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                Observational Summary
              </span>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                {mystery.discoveryBrief}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed italic border-t border-white/5 pt-3">
                Historical Context: {mystery.historicalContext}
              </p>
            </div>

            {/* Signal Telemetry Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Primary Signal</span>
                <span className="text-xs sm:text-sm font-bold text-cyan-300 block mt-1">
                  {mystery.anomalyData.primarySignal}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Deviation Metric</span>
                <span className="text-xs sm:text-sm font-bold text-amber-300 block mt-1">
                  {mystery.anomalyData.anomalyMetric}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Baseline Comparison</span>
                <span className="text-xs sm:text-sm font-bold text-gray-300 block mt-1">
                  {mystery.anomalyData.baselineComparison}
                </span>
              </div>
            </div>

            {/* Next Step Callout */}
            <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-500/30 flex items-center justify-between gap-4">
              <div className="text-xs text-gray-300">
                <strong className="text-blue-300 block font-mono uppercase">Next Investigation Step:</strong>
                Calibrate the scientific instrumentation array to verify whether physical signatures match the anomaly.
              </div>
              <button
                onClick={() => setActiveTab("instruments")}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold whitespace-nowrap shadow-md cursor-pointer"
              >
                Open Instruments →
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 2: INSTRUMENTS & CLUES ================= */}
        {activeTab === "instruments" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <span>CALIBRATION PROGRESS:</span>
              <span className="text-cyan-300 font-bold">{progressPercent}% Calibrated</span>
            </div>

            <div className="space-y-5">
              {mystery.instruments.map((inst) => {
                const isUnlocked = unlockedClues.includes(inst.id);
                const currentVal = instrumentValues[inst.id] ?? inst.initialValue;
                const minRange = Math.min(inst.initialValue, inst.expectedRange[0]) * 0.8;
                const maxRange = Math.max(inst.initialValue, inst.expectedRange[1]) * 1.25;

                return (
                  <div
                    key={inst.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? "bg-cyan-950/30 border-cyan-500/40 shadow-[0_0_25px_rgba(34,211,238,0.15)]"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isUnlocked ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                        <h4 className="text-sm font-bold text-white font-mono">
                          {inst.name}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-cyan-300">
                        {currentVal} {inst.unit} (Target: {inst.expectedRange[0]}-{inst.expectedRange[1]} {inst.unit})
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mb-4">
                      {inst.description}
                    </p>

                    {/* Interactive Calibrator Slider */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-[10px] font-mono text-gray-500">
                        <span>{Math.round(minRange)} {inst.unit}</span>
                        <span className="text-cyan-400">Slide to align with peak anomaly</span>
                        <span>{Math.round(maxRange)} {inst.unit}</span>
                      </div>
                      <input
                        type="range"
                        min={minRange}
                        max={maxRange}
                        step={(maxRange - minRange) / 100}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(inst, parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Clue Reveal State */}
                    {isUnlocked ? (
                      <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-400/40 space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                          ✓ CLUE UNLOCKED:
                        </span>
                        <p className="text-xs font-semibold text-cyan-100">
                          {inst.revealedClue}
                        </p>
                        <p className="text-[11px] text-gray-400 italic pt-1 border-t border-white/5">
                          {inst.scientificContext}
                        </p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-gray-500 flex items-center gap-2">
                        <span>⚠️ Signal uncalibrated. Drag slider into the target alignment window to decipher.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {unlockedCount === totalClues && (
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-4">
                <div className="text-xs text-purple-200">
                  <strong className="block font-mono uppercase text-purple-300">All Clues Decoded:</strong>
                  Sufficient empirical evidence collected to test and evaluate competing scientific hypotheses.
                </div>
                <button
                  onClick={() => setActiveTab("hypotheses")}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold whitespace-nowrap shadow-md cursor-pointer"
                >
                  Evaluate Hypotheses →
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ================= TAB 3: TEST HYPOTHESES ================= */}
        {activeTab === "hypotheses" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-xs text-gray-300">
              Select an astrophysical hypothesis to cross-reference against your decoded instrument telemetry. Determine which theory best withstands the empirical data:
            </div>

            <div className="space-y-4">
              {mystery.hypotheses.map((hyp) => {
                const isSelected = selectedHypothesis?.id === hyp.id;
                const hasTested = testedHypothesisIds.includes(hyp.id);

                return (
                  <div
                    key={hyp.id}
                    onClick={() => handleSelectHypothesis(hyp)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? hyp.isBestSupported
                          ? "bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                          : "bg-red-950/30 border-red-500/50"
                        : "bg-white/5 border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="text-base font-bold text-white">
                        {hyp.title}
                      </h4>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                          hyp.scientificStatus === "Supported by Observation"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : hyp.scientificStatus === "Contradicted by Data"
                            ? "bg-red-500/20 text-red-300 border-red-500/40"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {hyp.scientificStatus}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 mb-3">
                      {hyp.summary}
                    </p>

                    {isSelected && (
                      <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
                        <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-gray-200">
                          <strong className="text-cyan-300 block font-mono text-[11px] mb-1">
                            SCIENTIFIC EVALUATION:
                          </strong>
                          {hyp.explanation}
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 text-gray-400 text-[11px]">
                          <strong className="text-amber-400 block font-mono mb-0.5">
                            REMAINING UNCERTAINTIES:
                          </strong>
                          {hyp.unresolvedQuestions}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isSolved && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-4">
                <div className="text-xs text-emerald-200">
                  <strong className="block font-mono uppercase text-emerald-300">Hypothesis Confirmed:</strong>
                  You have successfully reached a scientific conclusion supported by observational evidence!
                </div>
                <button
                  onClick={() => setActiveTab("conclusion")}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap shadow-md cursor-pointer"
                >
                  View Final Debriefing →
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ================= TAB 4: CONCLUSION & LEADS ================= */}
        {activeTab === "conclusion" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Conclusion Dossier Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-950/70 to-blue-950/40 border border-emerald-500/40 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-lg">✓</span>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 font-bold">
                  ASTROPHYSICAL INVESTIGATION CONCLUSION
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Confirmed Scientific Understanding</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {mystery.conclusionSummary.confirmedFindings}
                </p>
              </div>

              <div className="space-y-1.5 border-t border-white/10 pt-3 text-xs">
                <strong className="text-amber-300 font-mono block">What Remains Uncertain:</strong>
                <p className="text-gray-300 leading-relaxed">
                  {mystery.conclusionSummary.remainingMysteries}
                </p>
              </div>

              <div className="space-y-1.5 border-t border-white/10 pt-3 text-xs">
                <strong className="text-cyan-300 font-mono block">Active & Future Space Missions:</strong>
                <p className="text-gray-300 leading-relaxed">
                  {mystery.conclusionSummary.futureMissions}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-blue-200 font-medium">
                ⭐ <strong className="text-white">Why This Finding Matters:</strong> {mystery.conclusionSummary.significance}
              </div>
            </div>

            {/* Connected Discoveries / Next Leads */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                🔗 CROSS-CONNECTED LEADS & NEXT DISCOVERIES
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mystery.connectedLeads.map((lead) => (
                  <div
                    key={lead.leadId}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {lead.leadTitle}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {lead.leadDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => onSelectLead(lead.leadId)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/30 text-cyan-200 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Scan Lead 📡
                      </button>

                      <Link
                        href={lead.targetRoute}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 text-xs font-semibold transition-all"
                      >
                        Visit {lead.targetObjectName} ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
