'use client';

import React, { useState, useEffect } from 'react';
import { CLINICAL_PRESETS } from '@/lib/presets';
import {
  BiometricAction,
  FormulationResponse,
  ProductItem,
  SkinAnalysisResult
} from '@/types/dermatwin';
import { Header } from '@/components/Header';
import { ScanAnimation } from '@/components/ScanAnimation';
import { SkinScoreGauge } from '@/components/SkinScoreGauge';
import { SkinRadarChart } from '@/components/SkinRadarChart';
import { BiometricViewer } from '@/components/BiometricViewer';
import { BiometricMetricsGrid } from '@/components/BiometricMetricsGrid';
import { ContraindicationGatekeeperCard } from '@/components/ContraindicationGatekeeperCard';
import { ProductBundle } from '@/components/ProductBundle';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AgentChatDrawer } from '@/components/AgentChatDrawer';
import { CaptureModal } from '@/components/CaptureModal';
import {
  Camera,
  Upload,
  Link as LinkIcon,
  User,
  Sparkles,
  Zap,
  ShieldAlert,
  AlertCircle,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function DermaTwinDashboard() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-elena');
  const [imageUrl, setImageUrl] = useState<string>(CLINICAL_PRESETS[0].fullImageUrl);
  const [activeFileId, setActiveFileId] = useState<string | undefined>(undefined);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [showUrlForm, setShowUrlForm] = useState<boolean>(false);

  // Diagnostic State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [biometrics, setBiometrics] = useState<SkinAnalysisResult | null>(null);
  const [formulation, setFormulation] = useState<FormulationResponse | null>(null);
  const [selectedMetricId, setSelectedMetricId] = useState<BiometricAction | undefined>(undefined);
  const [scanError, setScanError] = useState<string | null>(null);

  // Modals & Drawers
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState<boolean>(false);
  const [checkoutProducts, setCheckoutProducts] = useState<ProductItem[]>([]);

  // Auto-scan the first preset on first load for instant judge wow-factor (served from cache to conserve API units)
  useEffect(() => {
    executeDiagnosis(CLINICAL_PRESETS[0].fullImageUrl, 'preset-elena');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setActiveFileId(undefined);
    const preset = CLINICAL_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setImageUrl(preset.fullImageUrl);
      executeDiagnosis(preset.fullImageUrl, preset.id);
    }
  };

  const executeDiagnosis = async (imgUrl: string, presetId?: string, fileId?: string) => {
    setIsScanning(true);
    setScanError(null);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imgUrl,
          presetId,
          fileId
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Diagnostic pipeline error');
      }

      setBiometrics(data.biometrics);
      setFormulation(data.formulation);
      if (data.formulation?.bundle?.products) {
        setCheckoutProducts(data.formulation.bundle.products);
      }
    } catch (err) {
      console.error('[DermaTwin] Diagnostic error:', err);
      setScanError((err as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCaptureComplete = (data: { imageUrl: string; fileId?: string; presetId?: string }) => {
    setImageUrl(data.imageUrl);
    setActiveFileId(data.fileId);
    if (data.presetId) {
      setSelectedPresetId(data.presetId);
    }
    executeDiagnosis(data.imageUrl, data.presetId, data.fileId);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setImageUrl(customUrlInput.trim());
      setActiveFileId(undefined);
      setShowUrlForm(false);
      executeDiagnosis(customUrlInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Enterprise Header */}
      <Header
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onResetScan={() => {
          setSelectedPresetId('preset-elena');
          setImageUrl(CLINICAL_PRESETS[0].fullImageUrl);
          setActiveFileId(undefined);
          executeDiagnosis(CLINICAL_PRESETS[0].fullImageUrl, 'preset-elena');
        }}
        cartItemCount={checkoutProducts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> YOUCAM API SKIN AI & COMMERCE VTO HACKATHON
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              DermaTwin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-200">OS</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Autonomous Biometric Longitudinal Dermatologist & Real-Time Headless Commerce Formulator.
              Synthesizing 16 YouCam S2S metrics with DeepSeek-V4.1-Flash clinical reasoning.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Universal Capture Button */}
            <button
              onClick={() => setIsCaptureModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
            >
              <Camera className="w-4 h-4 fill-slate-950" />
              <span>Universal Camera & Upload</span>
            </button>

            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 transition-all shadow-sm"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Ask AI Clinical Advisor</span>
            </button>
          </div>
        </div>

        {/* Clinical Patient Input & Preset Selector */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-5 shadow-xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-4 h-4 text-cyan-400" /> Clinical Diagnostic Target
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Select a verified clinical phenotype (conserves YouCam units) or capture a custom face
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCaptureModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Webcam Live Oval Guide</span>
              </button>

              <button
                onClick={() => setShowUrlForm(!showUrlForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-all"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Custom URL</span>
              </button>
            </div>
          </div>

          {/* Optional URL Input Dropdown */}
          {showUrlForm && (
            <form onSubmit={handleUrlSubmit} className="flex gap-2 mb-4 p-3 bg-slate-950 rounded-2xl border border-slate-800 animate-in fade-in">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="Enter direct high-resolution portrait URL (HTTPS)..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0"
              >
                <Zap className="w-3.5 h-3.5" /> Scan URL
              </button>
            </form>
          )}

          {/* 4 Clinical Presets Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CLINICAL_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id && !activeFileId;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`relative rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/90'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.avatarUrl}
                      alt={preset.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {preset.name}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        )}
                      </h4>
                      <div className="text-[11px] text-slate-400">
                        {preset.age} yrs • {preset.gender} • <span className="text-cyan-400 font-medium">{preset.expectedSkinType}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {preset.tagline}
                  </p>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                    <span className="text-rose-400 font-mono text-[10px] truncate max-w-[170px]">
                      {preset.concern}
                    </span>
                    <span className={`font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {isSelected ? 'Active' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Phase Scanning Progress Overlay */}
        {isScanning && <ScanAnimation imageUrl={imageUrl} />}

        {/* Non-Technical Face Alignment Alert / Notice */}
        {biometrics?.errorMessage && (
          <div className="bg-amber-950/30 border border-amber-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 text-xs shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <span className="font-bold text-white block sm:inline">Face Alignment Advisory: </span>
                {biometrics.errorMessage}
              </div>
            </div>
            <button
              onClick={() => setIsCaptureModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-all flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" /> Re-Align with Live Oval Guide
            </button>
          </div>
        )}

        {/* Error Notification */}
        {scanError && (
          <div className="bg-rose-950/30 border border-rose-800 rounded-2xl p-4 flex items-center gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <span className="font-bold">Clinical Analysis Notice:</span> {scanError}
            </div>
          </div>
        )}

        {/* Main Biometric Diagnostic Dashboard */}
        {biometrics && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Row: Skin Score Gauge + 16-Axis Spider Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkinScoreGauge biometrics={biometrics} triage={formulation?.triage} />
              <SkinRadarChart
                biometrics={biometrics}
                onSelectMetric={(id) => setSelectedMetricId(id as BiometricAction)}
              />
            </div>

            {/* Middle Row: Biometric Anatomical Canvas Viewer */}
            <BiometricViewer
              biometrics={biometrics}
              selectedMetricId={selectedMetricId}
              onSelectCoordinate={(coord) => setSelectedMetricId(coord.type)}
            />

            {/* 16-Vector Biometric Triage Grid */}
            <BiometricMetricsGrid
              biometrics={biometrics}
              onHighlightMetric={(action) => setSelectedMetricId(action)}
            />

            {/* Contraindication Gatekeeper Report */}
            {formulation && (
              <ContraindicationGatekeeperCard
                gatekeeper={formulation.gatekeeper}
                triage={formulation.triage}
              />
            )}

            {/* Autonomous Regimen Assembly & Headless eCommerce Product Bundle */}
            {formulation && (
              <ProductBundle
                bundle={formulation.bundle}
                onOpenCheckout={(products) => {
                  setCheckoutProducts(products);
                  setIsCheckoutOpen(true);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Universal Webcam & Upload Capture Modal */}
      <CaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        onCaptureComplete={handleCaptureComplete}
      />

      {/* One-Click eCommerce Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        products={checkoutProducts}
        bundleDiscountPercent={20}
      />

      {/* Real-Time "Ask DermaTwin AI" Chat Drawer */}
      <AgentChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        biometrics={biometrics || undefined}
        formulation={formulation || undefined}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">DermaTwin OS</span>
            <span>• Built for YouCam API Skin AI & eCommerce VTO Hackathon</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>YouCam S2S API v2.1</span>
            <span>•</span>
            <span>Nebius DeepSeek-V4.1-Flash</span>
            <span>•</span>
            <span>Unit Conservation Cache Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
