'use client';

import React from 'react';
import { SkinAnalysisResult, DiagnosticTriage } from '@/types/dermatwin';
import { ShieldCheck, ShieldAlert, Sparkles, UserCheck, Flame } from 'lucide-react';

interface SkinScoreGaugeProps {
  biometrics: SkinAnalysisResult;
  triage?: DiagnosticTriage;
}

export function SkinScoreGauge({ biometrics, triage }: SkinScoreGaugeProps) {
  const score = biometrics.overallScore;

  // Determine color and status
  let scoreColor = '#10b981'; // emerald
  let statusText = 'Optimal Health';
  let statusBadgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  if (score < 50) {
    scoreColor = '#f43f5e'; // rose
    statusText = 'Compromised Barrier';
    statusBadgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  } else if (score < 65) {
    scoreColor = '#f59e0b'; // amber
    statusText = 'Vulnerable Barrier';
    statusBadgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  } else if (score < 80) {
    scoreColor = '#06b6d4'; // cyan
    statusText = 'Mild Surface Stress';
    statusBadgeBg = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  }

  // SVG Gauge calculations
  const radius = 64;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Composite Skin Health Index
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time biometric integration across 16 clinical parameters
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadgeBg}`}>
          {statusText}
        </span>
      </div>

      {/* Main Visual: Circular Gauge + Skin Age */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              stroke="#1e293b"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Animated Progress Arc */}
            <circle
              stroke={scoreColor}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          {/* Central Score Digits */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white tracking-tight">{score}</span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              / 100 PTS
            </span>
          </div>
        </div>

        {/* Skin Age & Skin Type Info */}
        <div className="space-y-3 w-full sm:w-auto">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Biological Skin Age</div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>{biometrics.skinAge} years</span>
                {biometrics.actualAge && (
                  <span className="text-xs text-slate-400 font-normal">
                    (Chronological: {biometrics.actualAge})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Physiological Skin Type</div>
              <div className="text-base font-bold text-white">
                {biometrics.skinType} Phenotype
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triage Highlights Row */}
      {triage && (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950/50 rounded-lg p-2 text-xs">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-400" /> Primary Concern
            </div>
            <div className="font-semibold text-rose-300 truncate mt-0.5">
              {triage.primaryConditions[0] || 'Surface Erythema'}
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-lg p-2 text-xs">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" /> Barrier Integrity
            </div>
            <div className="font-semibold text-amber-300 truncate mt-0.5">
              {triage.barrierIntegrity} ({triage.barrierScore}/100)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
