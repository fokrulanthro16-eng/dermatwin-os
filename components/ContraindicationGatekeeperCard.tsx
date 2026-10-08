'use client';

import React from 'react';
import { ContraindicationGatekeeper, DiagnosticTriage } from '@/types/dermatwin';
import { ShieldCheck, ShieldAlert, Ban, CheckCircle2, AlertOctagon, Lock } from 'lucide-react';

interface ContraindicationGatekeeperCardProps {
  gatekeeper: ContraindicationGatekeeper;
  triage?: DiagnosticTriage;
}

export function ContraindicationGatekeeperCard({
  gatekeeper,
  triage
}: ContraindicationGatekeeperCardProps) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Header with Safety Shield Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Autonomous Contraindication Gatekeeper
              </h3>
              <p className="text-xs text-slate-400">
                DeepSeek-V4.1-Flash Clinical Reasoning & Ingredient Incompatibility Filter
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3 h-3 text-emerald-400" />
            Zero-Irritation Protocol Active
          </span>
        </div>
      </div>

      {/* Rationale Banner */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
          <AlertOctagon className="w-4 h-4 text-cyan-400" />
          Clinical Gatekeeper Verdict:
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {gatekeeper.gatekeeperRationale}
        </p>
      </div>

      {/* Two-Column Comparison: Prohibited vs Approved Actives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prohibited Ingredients Column */}
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-900/40">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Ban className="w-4 h-4" />
              Prohibited Ingredients ({gatekeeper.blockedIngredients.length})
            </div>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono font-semibold">
              REJECTED
            </span>
          </div>

          <div className="space-y-3">
            {gatekeeper.blockedIngredients.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-rose-900/50 rounded-lg p-3 text-xs shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-rose-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {item.ingredient}
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono bg-rose-950/60 px-1.5 py-0.2 rounded uppercase">
                    {item.targetTrigger}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Approved Active Formulations Column */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-900/40">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Prescribed Safe Actives ({gatekeeper.allowedActives.length})
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-semibold">
              APPROVED
            </span>
          </div>

          <div className="space-y-3">
            {gatekeeper.allowedActives.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-emerald-900/50 rounded-lg p-3 text-xs shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {item.ingredient}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded font-bold">
                    {item.optimalConcentration}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.actionMechanism}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
