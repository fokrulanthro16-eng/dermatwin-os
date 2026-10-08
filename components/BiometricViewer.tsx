'use client';

import React, { useState } from 'react';
import {
  BiometricAction,
  OverlayCoordinate,
  SkinAnalysisResult
} from '@/types/dermatwin';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
  Flame,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface BiometricViewerProps {
  biometrics: SkinAnalysisResult;
  selectedMetricId?: string;
  onSelectCoordinate?: (coord: OverlayCoordinate) => void;
}

export function BiometricViewer({
  biometrics,
  selectedMetricId,
  onSelectCoordinate
}: BiometricViewerProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    acne: true,
    redness: true,
    wrinkle: true,
    pore: true,
    dark_circle_v2: true,
    tear_trough: true
  });
  const [hoveredCoord, setHoveredCoord] = useState<OverlayCoordinate | null>(null);
  const [viewMode, setViewMode] = useState<'hud' | 'raw'>('hud');

  // Collect all coordinates from metrics whose layer is active
  const activeCoordinates: OverlayCoordinate[] = [];
  Object.values(biometrics.metrics).forEach((metric) => {
    if (activeLayers[metric.id] && metric.coordinates) {
      activeCoordinates.push(...metric.coordinates);
    }
  });

  const toggleLayer = (layerKey: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const setAllLayers = (val: boolean) => {
    setActiveLayers({
      acne: val,
      redness: val,
      wrinkle: val,
      pore: val,
      dark_circle_v2: val,
      tear_trough: val
    });
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.5, Math.max(1, +(prev + delta).toFixed(1))));
  };

  const resetView = () => {
    setZoomLevel(1);
    setViewMode('hud');
  };

  // Metric counts for badges
  const acneCount = biometrics.metrics.acne?.coordinates?.length || 0;
  const rednessCount = biometrics.metrics.redness?.coordinates?.length || 0;
  const wrinkleCount = biometrics.metrics.wrinkle?.coordinates?.length || 0;
  const poreCount = biometrics.metrics.pore?.coordinates?.length || 0;
  const darkCircleCount = biometrics.metrics.dark_circle_v2?.coordinates?.length || 0;

  // Color mapping by action type
  const getMarkerColor = (type: BiometricAction) => {
    switch (type) {
      case 'acne':
        return {
          bg: 'bg-rose-500',
          border: 'border-rose-400',
          ring: 'ring-rose-500/60',
          text: 'text-rose-300',
          badgeBg: 'bg-rose-950/90 border-rose-500/70 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]',
          zoneBg: 'bg-rose-500/20 border-rose-400/80 shadow-[0_0_20px_rgba(244,63,94,0.5)]',
          glow: 'shadow-[0_0_15px_rgba(244,63,94,0.8)]'
        };
      case 'redness':
        return {
          bg: 'bg-red-500',
          border: 'border-red-400',
          ring: 'ring-red-500/60',
          text: 'text-red-300',
          badgeBg: 'bg-red-950/90 border-red-500/70 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.4)]',
          zoneBg: 'bg-red-500/25 border-red-400/80 shadow-[0_0_25px_rgba(239,68,68,0.5)]',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.7)]'
        };
      case 'wrinkle':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-300',
          ring: 'ring-amber-500/60',
          text: 'text-amber-300',
          badgeBg: 'bg-amber-950/90 border-amber-500/70 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
          zoneBg: 'bg-amber-500/20 border-amber-400/80 shadow-[0_0_18px_rgba(245,158,11,0.5)]',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.8)]'
        };
      case 'dark_circle_v2':
      case 'tear_trough':
        return {
          bg: 'bg-purple-500',
          border: 'border-purple-300',
          ring: 'ring-purple-500/60',
          text: 'text-purple-300',
          badgeBg: 'bg-purple-950/90 border-purple-500/70 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]',
          zoneBg: 'bg-purple-500/20 border-purple-400/80 shadow-[0_0_18px_rgba(168,85,247,0.5)]',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.8)]'
        };
      case 'pore':
        return {
          bg: 'bg-cyan-500',
          border: 'border-cyan-300',
          ring: 'ring-cyan-500/60',
          text: 'text-cyan-300',
          badgeBg: 'bg-cyan-950/90 border-cyan-500/70 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
          zoneBg: 'bg-cyan-500/20 border-cyan-400/80 shadow-[0_0_18px_rgba(6,182,212,0.5)]',
          glow: 'shadow-[0_0_15px_rgba(6,182,212,0.8)]'
        };
      default:
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-300',
          ring: 'ring-emerald-500/60',
          text: 'text-emerald-300',
          badgeBg: 'bg-emerald-950/90 border-emerald-500/70 text-emerald-300',
          zoneBg: 'bg-emerald-500/20 border-emerald-400/80',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.8)]'
        };
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Visual Blemish & Anatomical Layer Map
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click interactive blemish toggle pills to isolate localized clinical zones on the facial scan
          </p>
        </div>

        {/* View mode toggle & Zoom controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* HUD vs Raw Toggle */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-0.5 flex text-xs">
            <button
              onClick={() => setViewMode('hud')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'hud'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Biometric HUD
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'raw'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw Selfie
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-xl px-1.5 py-0.5">
            <button
              onClick={() => handleZoom(-0.2)}
              disabled={zoomLevel <= 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-cyan-400 px-1.5 font-bold">
              {zoomLevel.toFixed(1)}x
            </span>
            <button
              onClick={() => handleZoom(0.2)}
              disabled={zoomLevel >= 2.5}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              className="p-1 text-slate-400 hover:text-white border-l border-slate-800 ml-1 pl-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Visual Blemish Overlay Toggle Pills (Centered & Accessible) */}
      <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-2.5 mb-3 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Blemish Layers:
          </span>

          {/* ACNE TOGGLE PILL */}
          <button
            onClick={() => toggleLayer('acne')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeLayers.acne
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeLayers.acne ? 'bg-rose-400 animate-ping' : 'bg-slate-600'}`} />
            <span>Acne</span>
            {acneCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950 border border-rose-800 text-rose-300 font-mono">
                {acneCount}
              </span>
            )}
          </button>

          {/* REDNESS TOGGLE PILL */}
          <button
            onClick={() => toggleLayer('redness')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeLayers.redness
                ? 'bg-red-500/20 text-red-300 border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeLayers.redness ? 'bg-red-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>Redness</span>
            {rednessCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-950 border border-red-800 text-red-300 font-mono">
                {rednessCount} zones
              </span>
            )}
          </button>

          {/* WRINKLES TOGGLE PILL */}
          <button
            onClick={() => toggleLayer('wrinkle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeLayers.wrinkle
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeLayers.wrinkle ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>Wrinkles</span>
            {wrinkleCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950 border border-amber-800 text-amber-300 font-mono">
                {wrinkleCount}
              </span>
            )}
          </button>

          {/* PORES TOGGLE PILL */}
          <button
            onClick={() => toggleLayer('pore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeLayers.pore
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeLayers.pore ? 'bg-cyan-400' : 'bg-slate-600'}`} />
            <span>Pores</span>
          </button>

          {/* DARK CIRCLES TOGGLE PILL */}
          <button
            onClick={() => toggleLayer('dark_circle_v2')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeLayers.dark_circle_v2
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)] ring-1 ring-purple-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeLayers.dark_circle_v2 ? 'bg-purple-400' : 'bg-slate-600'}`} />
            <span>Dark Circles</span>
          </button>
        </div>

        {/* Master Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const anyActive = Object.values(activeLayers).some(Boolean);
              setAllLayers(!anyActive);
            }}
            className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/80 transition-colors"
          >
            {Object.values(activeLayers).some(Boolean) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {Object.values(activeLayers).some(Boolean) ? 'Hide All' : 'Show All'}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group select-none shadow-2xl">
        {/* Clinical Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Scalable Container */}
        <div
          className="relative max-w-full max-h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Portrait Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={biometrics.imageUrl}
            alt="Biometric Scan Subject"
            className="w-auto h-[380px] sm:h-[460px] max-w-full object-contain rounded-xl shadow-2xl pointer-events-none"
          />

          {/* Biometric Laser Reticle in HUD Mode */}
          {viewMode === 'hud' && showOverlays && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-8 top-12 bottom-12 border border-cyan-500/20 rounded-full animate-pulse" />
            </div>
          )}

          {/* Interactive Blemish Overlays: Highlighted Zones & Badges */}
          {viewMode === 'hud' && showOverlays && (
            <div className="absolute inset-0">
              {activeCoordinates.map((coord) => {
                const colors = getMarkerColor(coord.type);
                const isSelected = selectedMetricId === coord.type;
                const isHovered = hoveredCoord?.id === coord.id;

                // Wrinkle Lines / Linear Zones
                if (coord.width && coord.height) {
                  return (
                    <div
                      key={coord.id}
                      style={{
                        left: `${coord.x - (coord.width || 10) / 2}%`,
                        top: `${coord.y - (coord.height || 4) / 2}%`,
                        width: `${coord.width}%`,
                        height: `${coord.height}%`
                      }}
                      onMouseEnter={() => setHoveredCoord(coord)}
                      onMouseLeave={() => setHoveredCoord(null)}
                      onClick={() => onSelectCoordinate?.(coord)}
                      className={`absolute rounded-full border-2 border-dashed cursor-pointer transition-all ${colors.border} ${colors.glow} ${
                        isSelected || isHovered
                          ? 'bg-amber-400/35 ring-2 ring-amber-300 scale-105'
                          : 'bg-amber-500/20'
                      }`}
                    >
                      {/* Floating Zone Badge */}
                      <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap shadow-md transition-all ${colors.badgeBg} ${
                        isSelected || isHovered ? 'scale-110 opacity-100 z-30' : 'opacity-85'
                      }`}>
                        ⚡ {coord.label || 'Rhytid Zone'}
                      </span>
                    </div>
                  );
                }

                // Circular Zones (Acne, Redness Malar Heatmap, Pores, Dark Circles)
                const diameter = (coord.radius || 6) * 2;
                return (
                  <div
                    key={coord.id}
                    style={{
                      left: `${coord.x}%`,
                      top: `${coord.y}%`,
                      width: `${diameter * 1.8}px`,
                      height: `${diameter * 1.8}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onMouseEnter={() => setHoveredCoord(coord)}
                    onMouseLeave={() => setHoveredCoord(null)}
                    onClick={() => onSelectCoordinate?.(coord)}
                    className={`absolute rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center ${
                      coord.type === 'redness'
                        ? 'bg-red-500/25 border-2 border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                        : coord.type === 'acne'
                        ? 'bg-rose-500/25 border-2 border-rose-500/90 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                        : coord.type === 'dark_circle_v2'
                        ? 'bg-purple-500/25 border border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'bg-cyan-500/20 border border-cyan-400/60'
                    } ${
                      isSelected || isHovered
                        ? 'ring-4 ' + colors.ring + ' scale-125 z-20'
                        : ''
                    }`}
                  >
                    {/* Inner core target pin */}
                    {coord.type === 'acne' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping absolute" />
                    )}
                    <span className={`w-2 h-2 rounded-full ${colors.bg}`} />

                    {/* Floating Clinical Badge attached to marker */}
                    <span
                      className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap shadow-lg transition-all ${colors.badgeBg} ${
                        isSelected || isHovered ? 'scale-110 opacity-100 z-30' : 'opacity-80'
                      }`}
                    >
                      {coord.type === 'acne' && '🔴 '}
                      {coord.type === 'redness' && '🔥 '}
                      {coord.type === 'dark_circle_v2' && '👁️ '}
                      {coord.label || coord.type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Hovered Marker Telemetry Tooltip */}
        {hoveredCoord && (
          <div className="absolute top-4 left-4 bg-slate-950/95 border border-cyan-500/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl text-xs z-40 max-w-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hoveredCoord.label || 'Biometric Detection'}</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Target Vector:</span>
                <span className="font-mono text-white capitalize font-bold">
                  {hoveredCoord.type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Clinical Severity:</span>
                <span
                  className={`font-semibold uppercase text-[10px] ${
                    hoveredCoord.severity === 'severe'
                      ? 'text-rose-400 font-bold'
                      : hoveredCoord.severity === 'moderate'
                      ? 'text-amber-400 font-bold'
                      : 'text-emerald-400 font-bold'
                  }`}
                >
                  {hoveredCoord.severity}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Coordinates:</span>
                <span className="font-mono text-cyan-400 text-[10px]">
                  X: {hoveredCoord.x}% | Y: {hoveredCoord.y}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Telemetry HUD Watermark */}
        <div className="absolute bottom-3 right-3 bg-slate-950/85 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] font-mono text-cyan-400/90 pointer-events-none flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>YOUCAM S2S v2.1 // ACTIVE BLEMISH OVERLAYS</span>
        </div>
      </div>
    </div>
  );
}
