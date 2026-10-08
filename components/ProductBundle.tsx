'use client';

import React, { useState } from 'react';
import { CommerceBundle, ProductItem } from '@/types/dermatwin';
import {
  ShoppingBag,
  Sun,
  Moon,
  Sparkles,
  Check,
  ShieldCheck,
  Percent,
  Plus,
  Trash2,
  ArrowRight,
  Zap
} from 'lucide-react';

interface ProductBundleProps {
  bundle: CommerceBundle;
  onOpenCheckout: (selectedProducts: ProductItem[]) => void;
}

export function ProductBundle({ bundle, onOpenCheckout }: ProductBundleProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(bundle.products.map((p) => p.id))
  );
  const [routineTab, setRoutineTab] = useState<'both' | 'am' | 'pm'>('both');

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        if (next.size > 1) {
          next.delete(productId);
        }
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const selectedProducts = bundle.products.filter((p) => selectedProductIds.has(p.id));

  // Dynamic price calculations
  const rawSubtotal = selectedProducts.reduce((sum, p) => sum + (p.originalPrice || p.price * 1.2), 0);
  const currentSubtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const isFullBundle = selectedProductIds.size === bundle.products.length;
  const bundleDiscount = isFullBundle ? Math.round(currentSubtotal * 0.2) : 0;
  const finalPrice = currentSubtotal - bundleDiscount;
  const totalSaved = Math.round(rawSubtotal - finalPrice);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Autonomous Clinical eCommerce Formulator
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {bundle.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {bundle.description}
          </p>
        </div>

        {/* Routine Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-start lg:self-auto">
          <button
            onClick={() => setRoutineTab('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              routineTab === 'both'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Complete Regimen ({bundle.products.length})
          </button>
          <button
            onClick={() => setRoutineTab('am')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              routineTab === 'am'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3 text-amber-400" /> AM Routine
          </button>
          <button
            onClick={() => setRoutineTab('pm')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              routineTab === 'pm'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3 h-3 text-purple-400" /> PM Routine
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {bundle.products
          .filter((p) => {
            if (routineTab === 'am') return p.timeOfDay === 'AM' || p.timeOfDay === 'BOTH';
            if (routineTab === 'pm') return p.timeOfDay === 'PM' || p.timeOfDay === 'BOTH';
            return true;
          })
          .map((product) => {
            const isSelected = selectedProductIds.has(product.id);

            return (
              <div
                key={product.id}
                className={`relative bg-slate-950/70 border rounded-xl p-4 transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-700/80 shadow-md'
                    : 'border-slate-800/40 opacity-60'
                }`}
              >
                <div>
                  {/* Top Bar: Time of day tag + Match percentage */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      {product.timeOfDay === 'AM' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                          <Sun className="w-3 h-3 text-amber-400" /> AM Step {product.stepNumber}
                        </span>
                      ) : product.timeOfDay === 'PM' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded">
                          <Moon className="w-3 h-3 text-purple-400" /> PM Step {product.stepNumber}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                          <Sparkles className="w-3 h-3 text-cyan-400" /> AM + PM Step {product.stepNumber}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                      {product.clinicalMatch}% Match
                    </span>
                  </div>

                  {/* Product Details Header */}
                  <div className="mb-3">
                    <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                      {product.sku} // {product.brand}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                      {product.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">{product.volume}</span>
                  </div>

                  {/* Active Ingredients Badges */}
                  <div className="bg-slate-900/80 rounded-lg p-2.5 mb-3 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                      Key Active Formulations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.activeIngredients.map((act, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-950 text-slate-200 border border-slate-700/80 px-2 py-0.5 rounded font-medium"
                        >
                          <span className="text-cyan-300">{act.name}</span> ({act.concentration})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Rationale */}
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
                    {product.clinicalRationale}
                  </p>
                </div>

                {/* Footer: Price + Selection Toggle */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleProduct(product.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Included
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Sticky eCommerce Checkout Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left: Bundle Breakdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mx-auto sm:mx-0 shadow-lg shadow-cyan-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-sm font-bold text-white">
                Personalized Regimen Bundle
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {selectedProducts.length} Items Selected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Formulated specifically for identified YouCam biometric markers & barrier threshold
            </p>
          </div>
        </div>

        {/* Right: Pricing & CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Price Summary */}
          <div className="text-center sm:text-right">
            <div className="flex items-baseline justify-center sm:justify-end gap-2">
              {bundleDiscount > 0 && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                  20% BUNDLE DISCOUNT
                </span>
              )}
              <span className="text-2xl font-black text-white">
                ${finalPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Total Saved: <span className="text-emerald-400 font-bold">${totalSaved}</span> • Free Express Clinical Shipping
            </div>
          </div>

          {/* Add Full Personalized Routine to Cart Button */}
          <button
            onClick={() => onOpenCheckout(selectedProducts)}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black px-7 py-4 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all transform active:scale-95 text-sm cursor-pointer group"
          >
            <ShoppingBag className="w-4 h-4 fill-slate-950 transition-transform group-hover:scale-110" />
            <span className="tracking-wide">Add Full Personalized Routine to Cart</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
