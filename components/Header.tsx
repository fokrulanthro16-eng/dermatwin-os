'use client';

import React from 'react';
import { Sparkles, Activity, Bot, ShoppingBag, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenChat: () => void;
  onOpenCheckout: () => void;
  onResetScan: () => void;
  cartItemCount: number;
}

export function Header({
  onOpenChat,
  onOpenCheckout,
  onResetScan,
  cartItemCount
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                DermaTwin<span className="text-cyan-400 font-mono">OS</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PROD v2.1
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Autonomous Biometric Skin Engine & Instant eCommerce Formulator
            </p>
          </div>
        </div>

        {/* Center: Live Engine Telemetry Pills */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium">YouCam S2S API v2.1</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-medium">DeepSeek-V4.1-Flash (Nebius)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-[11px] font-mono text-slate-400">16 Actions Synced</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onResetScan}
            title="Start New Biometric Analysis"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-all hover:border-cyan-500/40"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Ask AI Agent</span>
          </button>

          <button
            onClick={onOpenCheckout}
            className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-extrabold shadow-md shadow-cyan-500/20 transition-all transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Checkout</span>
            {cartItemCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-cyan-300 font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
