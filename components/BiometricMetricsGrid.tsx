'use client';

import React, { useState } from 'react';
import { BiometricAction, MetricCategory, SkinAnalysisResult } from '@/types/dermatwin';
import {
  ShieldCheck,
  Sparkles,
  Clock,
  Eye,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface BiometricMetricsGridProps {
  biometrics: SkinAnalysisResult;
  onHighlightMetric?: (action: BiometricAction) => void;
}

export function BiometricMetricsGrid({
  biometrics,
  onHighlightMetric
}: BiometricMetricsGridProps) {
  const [activeTab, setActiveTab] = useState<MetricCategory | 'all'>('all');

  const categories: Array<{ id: MetricCategory | 'all'; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All 16 Metrics', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'barrier', label: 'Barrier & Lipids', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'tone', label: 'Cellular & Tone', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'aging', label: 'Structural Aging', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'periorbital', label: 'Periorbital Eyes', icon: <Eye className="w-3.5 h-3.5" /> }
  ];

  const metricsList = Object.values(biometrics.metrics).filter(
    (m) => activeTab === 'all' || m.category === activeTab
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Header and Category Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Comprehensive 16-Vector Biometric Triage
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Standardized clinical index mapped across physiological facial strata
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsList.map((metric) => {
          const isHighConcern = metric.severity === 'severe' || metric.severity === 'moderate';

          return (
            <div
              key={metric.id}
              onClick={() => onHighlightMetric?.(metric.id)}
              className="group bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800/90 hover:border-cyan-500/50 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-cyan-500/10"
            >
              <div>
                {/* Metric Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {metric.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                      metric.severity === 'severe'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : metric.severity === 'moderate'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : metric.severity === 'mild'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {metric.severity}
                  </span>
                </div>

                {/* Score Big Digits */}
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-2xl font-black text-white">{metric.score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                  <span className="text-[11px] text-slate-400 ml-auto font-mono">
                    Ref: {metric.benchmark}
                  </span>
                </div>

                {/* Progress Bar with Benchmark Marker */}
                <div className="relative w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      metric.score >= 80
                        ? 'bg-emerald-400'
                        : metric.score >= 65
                        ? 'bg-cyan-400'
                        : metric.score >= 45
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  />
                  {/* Benchmark Needle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white/70 shadow-sm"
                    style={{ left: `${metric.benchmark}%` }}
                    title={`Healthy benchmark: ${metric.benchmark}`}
                  />
                </div>

                {/* Clinical Description */}
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {metric.description}
                </p>
              </div>

              {/* Card Footer: Detection count & Inspect CTA */}
              <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px]">
                {metric.coordinates && metric.coordinates.length > 0 ? (
                  <span className="text-cyan-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    {metric.coordinates.length} zones localized
                  </span>
                ) : (
                  <span className="text-slate-400">Normal profile</span>
                )}

                <span className="text-slate-400 group-hover:text-cyan-300 font-medium flex items-center gap-0.5 transition-colors">
                  Inspect <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
