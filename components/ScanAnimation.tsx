'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, ShieldCheck, Sparkles, Activity, ShoppingBag } from 'lucide-react';

interface ScanAnimationProps {
  imageUrl: string;
}

interface ScanPhase {
  phaseNumber: number;
  minPercent: number;
  maxPercent: number;
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SCAN_PHASES: ScanPhase[] = [
  {
    phaseNumber: 1,
    minPercent: 0,
    maxPercent: 30,
    title: 'Uploading & normalising facial resolution...',
    detail: 'Downscaling to 1080p, verifying lighting balance, and centering facial oval bounds.',
    icon: Activity
  },
  {
    phaseNumber: 2,
    minPercent: 30,
    maxPercent: 70,
    title: 'Extracting 16 YouCam biometric layers & tone analysis...',
    detail: 'Polling S2S v2.1 pipeline: Redness, Acne, Moisture, Rhytids, Pores, Tear Troughs & Elasticity.',
    icon: Sparkles
  },
  {
    phaseNumber: 3,
    minPercent: 70,
    maxPercent: 90,
    title: 'Running DeepSeek V4.1 clinical contraindication audit...',
    detail: 'Evaluating stratum corneum barrier integrity and rejecting incompatible acidic or retinoid actives.',
    icon: ShieldCheck
  },
  {
    phaseNumber: 4,
    minPercent: 90,
    maxPercent: 100,
    title: 'Generating personalized ecommerce regimen & checkout...',
    detail: 'Mapping clinical concentrations into bespoke AM/PM product bundles with 1-click cart payload.',
    icon: ShoppingBag
  }
];

export function ScanAnimation({ imageUrl }: ScanAnimationProps) {
  const [percent, setPercent] = useState<number>(5);

  useEffect(() => {
    // Smooth progress simulation during the polling & formulation cycle
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev < 28) return prev + 3; // Phase 1
        if (prev < 68) return prev + 2; // Phase 2 (YouCam polling)
        if (prev < 88) return prev + 1.5; // Phase 3 (DeepSeek)
        if (prev < 98) return prev + 0.8; // Phase 4 (Cart Assembly)
        return 99;
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  // Determine current active phase
  const currentPhase =
    SCAN_PHASES.find((p) => percent >= p.minPercent && percent < p.maxPercent) ||
    SCAN_PHASES[SCAN_PHASES.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/92 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Animated Laser Scanning Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl mb-6 bg-slate-950">
          {/* Facial Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Scanning Face"
            className="w-full h-full object-cover filter brightness-90 contrast-110"
          />

          {/* Sweeping Cyan/Green Laser Beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-scan" />

          {/* Biometric Grid Mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Target Reticles */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 border border-cyan-400/80 rounded-full animate-ping" />
          <div className="absolute bottom-1/3 right-1/3 w-6 h-6 border border-emerald-400/80 rounded-full animate-ping [animation-delay:0.5s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-dashed border-cyan-400/40 rounded-full animate-[spin_10s_linear_infinite]" />

          {/* Telemetry Badge */}
          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md rounded-lg py-1 px-2.5 border border-slate-800 text-[10px] font-mono text-cyan-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              S2S ENGINE 2.1
            </span>
            <span className="font-bold text-white">{Math.round(percent)}% COMPLETE</span>
          </div>
        </div>

        {/* Multi-Phase Interactive Progress Readout */}
        <div className="w-full space-y-4">
          {/* Current Phase Title */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Phase {currentPhase.phaseNumber} ({currentPhase.minPercent}-{currentPhase.maxPercent}%):{' '}
                <span className="text-cyan-300">{currentPhase.title}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto h-9 leading-relaxed">
              {currentPhase.detail}
            </p>
          </div>

          {/* Precision Step Tracker Line */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* 4-Phase Step Status Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            {SCAN_PHASES.map((phase) => {
              const isDone = percent >= phase.maxPercent;
              const isCurrent = percent >= phase.minPercent && percent < phase.maxPercent;

              return (
                <div
                  key={phase.phaseNumber}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span className="font-mono text-[10px] font-bold">P{phase.phaseNumber}</span>
                    )}
                    <span className="font-mono font-bold text-[10px]">
                      {phase.minPercent}-{phase.maxPercent}%
                    </span>
                  </div>
                  <span className="line-clamp-1 text-[10px] font-medium">
                    {phase.title.split(' ')[0]} {phase.title.split(' ')[1]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <span>YOUCAM S2S 16-VECTOR PIPELINE</span>
            <span className="text-cyan-400 font-semibold">NEBIUS DEEPSEEK-V4.1-FLASH ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
