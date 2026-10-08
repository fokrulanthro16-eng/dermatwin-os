'use client';

import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { BiometricMetricDetail, MetricCategory, SkinAnalysisResult } from '@/types/dermatwin';
import { Activity, ShieldCheck, Sparkles, Eye, Clock } from 'lucide-react';

interface SkinRadarChartProps {
  biometrics: SkinAnalysisResult;
  onSelectMetric?: (metricKey: string) => void;
}

export function SkinRadarChart({ biometrics, onSelectMetric }: SkinRadarChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory | 'all'>('all');

  const allMetrics = Object.values(biometrics.metrics);

  const filteredMetrics = selectedCategory === 'all'
    ? allMetrics
    : allMetrics.filter((m) => m.category === selectedCategory);

  const chartData = filteredMetrics.map((m) => ({
    metric: m.name.split(' ')[0], // Short name for radial axis
    fullName: m.name,
    id: m.id,
    userScore: m.score,
    benchmark: m.benchmark,
    category: m.category,
    severity: m.severity
  }));

  const categoryButtons: Array<{ id: MetricCategory | 'all'; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All 16 Markers', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'barrier', label: 'Barrier & Lipids', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'tone', label: 'Cellular & Tone', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'aging', label: 'Dermal Elasticity', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'periorbital', label: 'Periorbital Eyes', icon: <Eye className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
      {/* Header & Category Filter */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-base font-semibold text-white tracking-wide">
                16-Vector Biometric Spider Map
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative analysis vs clinical healthy reference population
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-cyan-500 shadow-sm shadow-cyan-500/50" />
              <span className="text-cyan-200">Patient Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm border border-dashed border-emerald-400/80 bg-emerald-500/20" />
              <span className="text-emerald-300">Healthy Benchmark</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {categoryButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedCategory(btn.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === btn.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-[340px] w-full my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 9 }}
              stroke="#1e293b"
            />

            {/* Target Reference Benchmark */}
            <Radar
              name="Healthy Benchmark"
              dataKey="benchmark"
              stroke="#34d399"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fill="#10b981"
              fillOpacity={0.12}
            />

            {/* User Biometric Score */}
            <Radar
              name="Patient Score"
              dataKey="userScore"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="#06b6d4"
              fillOpacity={0.4}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as {
                    fullName: string;
                    id: string;
                    userScore: number;
                    benchmark: number;
                    severity: string;
                  };
                  return (
                    <div className="bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs">
                      <p className="font-semibold text-white mb-1.5">{data.fullName}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-cyan-400 font-medium">Patient Index:</span>
                          <span className="font-bold text-white">{data.userScore} / 100</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-emerald-400 font-medium">Clinical Benchmark:</span>
                          <span className="font-semibold text-slate-300">{data.benchmark} / 100</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
                          <span className="text-slate-400">Severity:</span>
                          <span
                            className={`font-semibold uppercase tracking-wider text-[10px] ${
                              data.severity === 'severe'
                                ? 'text-rose-400'
                                : data.severity === 'moderate'
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {data.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Diagnostic Note */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 mt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Showing <span className="text-white font-semibold">{chartData.length}</span> biometric markers
        </span>
        <span className="text-cyan-400 text-[11px] font-mono">
          YouCam S2S v2.1 16-Axis Normalization
        </span>
      </div>
    </div>
  );
}
