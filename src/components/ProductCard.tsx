import React from 'react';
import { Eye, MessageCircle, Star, ShieldCheck, Zap } from 'lucide-react';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  tagline: string;
  priceEstimate: number;
  unit: string;
  thicknessOptions: string[];
  rating: number;
  reviewsCount: number;
  leadTime: string;
  badge: string;
  laserSafe: boolean;
  cncTolerances: string;
  density: string;
  finishOptions: string[];
  description: string;
  applications: string[];
  popularDimensions: string[];
  accentColor: string;
  materialType: string;
}

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const whatsAppUrl = generateWhatsAppOrderUrl({
    productName: product.name,
    category: product.categoryLabel,
    material: product.materialType,
    thickness: product.thicknessOptions[0],
    dimensions: product.popularDimensions[0],
    quantity: 10,
    estimatedPrice: product.priceEstimate * 10,
    notes: 'Inquiring about ready-to-ship inventory and custom laser cutting.',
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-[#080d18] border border-slate-800/80 p-5 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30 hover:-translate-y-1">
      {/* Hologram Accent Rim on Top Edge */}
      <div 
        className="absolute top-0 left-6 right-6 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent, ${product.accentColor}, transparent)`
        }}
      />

      {/* Top Meta & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            {product.categoryLabel}
          </span>
          {product.badge && (
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              {product.badge}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
          {product.tagline}
        </p>

        {/* Material Specs Visual Strip */}
        <div className="mt-4 p-2.5 rounded-xl bg-black/40 border border-slate-800/60 grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block">DENSITY / CORE</span>
            <span className="text-slate-300 font-medium truncate block">{product.materialType}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">TOLERANCE</span>
            <span className="text-cyan-400 font-semibold block">{product.cncTolerances}</span>
          </div>
        </div>

        {/* Thickness Badges */}
        <div className="mt-3">
          <span className="text-[10px] font-mono text-slate-500 block mb-1">AVAILABLE THICKNESSES</span>
          <div className="flex flex-wrap gap-1">
            {product.thicknessOptions.slice(0, 4).map((th) => (
              <span
                key={th}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
              >
                {th}
              </span>
            ))}
            {product.thicknessOptions.length > 4 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                +{product.thicknessOptions.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Pricing & CTAs */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[10px] font-mono text-slate-500 block">EST. BASE QUOTE</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-['Space_Grotesk'] text-white">
                ${product.priceEstimate.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{product.unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-slate-500 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick View</span>
          </button>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-semibold text-xs font-mono transition-all shadow-md shadow-emerald-950"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
