'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/types/dermatwin';
import {
  X,
  CheckCircle,
  CreditCard,
  Lock,
  Truck,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Tag,
  Trash2,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  bundleDiscountPercent?: number;
}

export function CheckoutModal({
  isOpen,
  onClose,
  products,
  bundleDiscountPercent = 15
}: CheckoutModalProps) {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode] = useState('DERMATWIN15');
  const [orderId, setOrderId] = useState('');
  const [cartItems, setCartItems] = useState<ProductItem[]>(products);

  // Sync cart items when products prop updates
  React.useEffect(() => {
    setCartItems(products);
  }, [products]);

  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: 'Dr. Sarah Lin',
    email: 'sarah.lin@clinicalbiometrics.ai',
    address: '742 Evergreen Terrace, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '12/28',
    cvv: '•••'
  });

  const currentProducts = (cartItems && cartItems.length > 0) ? cartItems : (products || []);
  const subtotal = currentProducts.reduce((acc, p) => acc + (p?.price || 0), 0);
  const discountAmount = Math.round(subtotal * (bundleDiscountPercent / 100));
  const shipping = 0; // Free Clinical Shipping
  const total = subtotal - discountAmount + shipping;

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedId = `DT-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsProcessing(false);
      setStep('success');

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }, 1100);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setStep('checkout');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {step === 'checkout' ? 'Personalized Biometric Cart' : 'Order Confirmed'}
                </h3>
                {step === 'checkout' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {currentProducts.length} Items
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {step === 'checkout'
                  ? 'Autonomous Regimen Formulation Dispatch'
                  : `Order Reference: ${orderId}`}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Scroll Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {step === 'checkout' ? (
            <>
              {/* Applied Biometric Discount Tag Banner */}
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between text-xs shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Tag className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      Biometric Promo Applied: <span className="font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">{promoCode}</span>
                    </span>
                    <span className="text-[11px] text-emerald-400/80 block mt-0.5">
                      15% Complete Regimen Bundle Savings Active
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-lg">
                  -${discountAmount.toFixed(2)}
                </span>
              </div>

              {/* Express Checkout Options */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Express Headless Checkout
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handlePlaceOrder}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all text-xs shadow-md"
                  >
                    <span>Apple Pay</span>
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold hover:bg-slate-700 transition-all text-xs shadow-md"
                  >
                    <span>Google Pay</span>
                  </button>
                </div>
              </div>

              {/* Itemized SKUs List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wide">
                    Itemized Clinical Formulations ({currentProducts.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ZERO CONTRAINDICATIONS
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {currentProducts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs shadow-sm hover:border-slate-700 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-1.5 py-0.2 rounded">
                            {item.sku}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {item.timeOfDay} Step {item.stepNumber}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-200 text-xs truncate">
                          {item.name}
                        </h5>
                        <p className="text-[10px] text-cyan-300/80 truncate">
                          {item.activeIngredients?.[0]?.name} ({item.activeIngredients?.[0]?.concentration})
                        </p>
                      </div>

                      {/* Price & Remove */}
                      <div className="text-right shrink-0">
                        <span className="font-black text-white block">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[10px] text-slate-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {currentProducts.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-600 hover:text-rose-400 transition-colors mt-1 p-0.5"
                            title="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Destination */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 text-xs">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" /> Destination Delivery Address
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Address"
                    className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({currentProducts.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Biometric Discount ({promoCode})
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Climate-Controlled Clinical Shipping</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-black text-white">
                  <span>Total Amount</span>
                  <span className="text-cyan-300 font-mono text-base">${total.toFixed(2)} USD</span>
                </div>
              </div>
            </>
          ) : (
            /* Order Success Receipt Screen */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">
                  Formulation Order Confirmed
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your tailored 16-metric skin regimen has been transmitted to compounding dispatch.
                </p>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-left text-xs max-w-sm mx-auto space-y-2.5 shadow-lg">
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Order Reference:</span>
                  <span className="font-mono font-bold text-cyan-400">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="text-white font-medium">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Billed:</span>
                  <span className="text-emerald-400 font-bold">${total.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Applied Discount:</span>
                  <span className="text-emerald-300 font-mono">{promoCode} (-15%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Delivery:</span>
                  <span className="text-white font-medium">2 Business Days (Express)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Clinical Verification:</span>
                  <span className="text-cyan-300 font-mono text-[10px]">YOUCAM-S2S-v2.1-CERTIFIED</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Return to Biometric Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Drawer Sticky Footer Checkout CTA */}
        {step === 'checkout' && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || currentProducts.length === 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Formulation Dispatch...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Place Order (${total.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
