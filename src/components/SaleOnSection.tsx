import React from 'react';
import workshopData from '../data/workshop.json';
import { Flame, Clock, Tag, MessageCircle, AlertCircle } from 'lucide-react';

export const SaleOnSection: React.FC = () => {
  return (
    <section id="sale-on" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 mb-3">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>FACTORY OVERRUN & MAKER DROPS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight">
              Sale On: Limited Batch Clearance
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Factory overrun lots, offcut designer bundles, and calibrated craft packs sold directly from the production floor at up to 40% discount. First-come, first-served basis.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3.5 py-2 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>DAILY 24-HOUR BATCH ALLOCATION</span>
          </div>
        </div>

        {/* Drops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workshopData.saleDrops.map((drop) => {
            const whatsAppUrl = `https://wa.me/${workshopData.contact.whatsappNumber}?text=${encodeURIComponent(
              `⚡ *SALE BATCH CLAIM - MMD CRAFT*\nItem: ${drop.title}\nSpecial Price: $${drop.salePrice.toFixed(2)} (${drop.discount})\n${drop.whatsappNote}`
            )}`;

            return (
              <div
                key={drop.id}
                className="glass-panel p-6 rounded-2xl border border-amber-500/30 flex flex-col justify-between hover:border-amber-400/60 transition-all hover:-translate-y-1 relative overflow-hidden group shadow-xl shadow-amber-950/10"
              >
                {/* Accent Top Line */}
                <div className="laser-line-amber absolute top-0 left-0 right-0" />

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500 text-black shadow-md shadow-amber-500/30">
                      {drop.discount}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded border border-amber-500/20">
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      Only {drop.unitsLeft} units left
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white group-hover:text-amber-300 transition-colors">
                    {drop.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {drop.specs}
                  </p>

                  <div className="mt-4 inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                    ✓ {drop.readyToShip}
                  </div>
                </div>

                {/* Price & Claim CTA */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block">FACTORY SPECIAL PRICE</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                          ${drop.salePrice.toFixed(2)}
                        </span>
                        <span className="text-xs font-mono text-slate-500 line-through">
                          ${drop.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs font-mono tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-400/40"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>CLAIM BATCH ON WHATSAPP</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
