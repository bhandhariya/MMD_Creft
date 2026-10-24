import React, { useState, useEffect } from 'react';
import { Product } from './ProductCard';
import { X, MessageCircle, Phone, Star, ShieldCheck, Check, Sparkles, Layers, Sliders } from 'lucide-react';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';
import workshopData from '../data/workshop.json';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [selectedThickness, setSelectedThickness] = useState('');
  const [selectedDimension, setSelectedDimension] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [quantity, setQuantity] = useState(10);

  useEffect(() => {
    if (product) {
      setSelectedThickness(product.thicknessOptions[0] || '3mm');
      setSelectedDimension(product.popularDimensions[0] || '300 x 300 mm');
      setSelectedFinish(product.finishOptions[0] || 'Standard');
      setQuantity(10);
    }
  }, [product]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Calculate pricing with volume discount
  let discountPct = 0;
  if (quantity >= 200) discountPct = 30;
  else if (quantity >= 51) discountPct = 20;
  else if (quantity >= 11) discountPct = 10;

  const unitPrice = product.priceEstimate * (1 - discountPct / 100);
  const totalQuote = unitPrice * quantity;

  const whatsAppUrl = generateWhatsAppOrderUrl({
    productName: product.name,
    category: product.categoryLabel,
    material: product.materialType,
    thickness: selectedThickness,
    dimensions: selectedDimension,
    finish: selectedFinish,
    quantity: quantity,
    estimatedPrice: totalQuote,
    notes: `${discountPct}% volume discount applied. Inquiring about shipping lead time.`,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#070b13] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 z-10 my-8 overflow-hidden">
        {/* Holographic top accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${product.accentColor}, transparent)` }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header Title & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {product.categoryLabel}
              </span>
              {product.badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-semibold">
                  {product.badge}
                </span>
              )}
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 ml-auto">
                <ShieldCheck className="w-3.5 h-3.5" /> Laser Safe Guaranteed
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-['Space_Grotesk'] text-white">
              {product.name}
            </h2>
            <p className="text-sm text-slate-400 mt-1">{product.tagline}</p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">CORE DENSITY</span>
              <span className="text-slate-200 font-semibold block">{product.density}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">KERF TOLERANCE</span>
              <span className="text-cyan-400 font-semibold block">{product.cncTolerances}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">DISPATCH LEAD TIME</span>
              <span className="text-amber-400 font-semibold block">{product.leadTime}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">QUALITY RATING</span>
              <span className="text-slate-200 font-semibold block flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Interactive Selectors: Thickness, Dimensions, Finishes */}
          <div className="space-y-4">
            {/* Thickness selector */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-2">
                Calibrated Thickness Option
              </label>
              <div className="flex flex-wrap gap-2">
                {product.thicknessOptions.map((th) => (
                  <button
                    key={th}
                    onClick={() => setSelectedThickness(th)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      selectedThickness === th
                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {th}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular dimensions selector */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-2">
                Standard Sheet Format / Dimension Preset
              </label>
              <div className="flex flex-wrap gap-2">
                {product.popularDimensions.map((dim) => (
                  <button
                    key={dim}
                    onClick={() => setSelectedDimension(dim)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      selectedDimension === dim
                        ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-950'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {dim}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Options */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-2">
                Surface & Edge Finish
              </label>
              <div className="flex flex-wrap gap-2">
                {product.finishOptions.map((fin) => (
                  <button
                    key={fin}
                    onClick={() => setSelectedFinish(fin)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      selectedFinish === fin
                        ? 'bg-pink-500 text-white font-bold shadow-md shadow-pink-950'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {fin}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity Stepper & Price Calculation */}
          <div className="p-4 rounded-2xl bg-[#04070e] border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">PRODUCTION BATCH QUANTITY</span>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 5))}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-mono font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-transparent text-sm font-mono font-bold text-cyan-300"
                />
                <button
                  onClick={() => setQuantity(quantity + 5)}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-mono font-bold"
                >
                  +
                </button>
                {discountPct > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    {discountPct}% Tier Discount
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block">EST. BATCH QUOTE ({quantity} UNITS)</span>
              <div className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                ${totalQuote.toFixed(2)} USD
              </div>
              <span className="text-[10px] font-mono text-slate-400">${unitPrice.toFixed(2)} each</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs font-mono tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-400/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>SEND SPEC TO WHATSAPP</span>
            </a>

            <a
              href={`tel:${workshopData.contact.phone}`}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>CALL PRODUCTION DESK</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
