import React from 'react';
import { Compass, ShieldCheck, Award, Sparkles, Cpu, Layers } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 relative bg-[#04060b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
              <Compass className="w-3.5 h-3.5" />
              <span>THE MMD CRAFT MANIFESTO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight leading-tight">
              Where High-Tech Optics Meets Mastercraft Substrates
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-sans">
              Founded to empower signage creators, woodcraft artisans, neon sign designers, and retail architects, MMD Craft bridges the gap between mass industrial laser cutting and bespoke artisanal fabrication.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Every MDF sheet is selected for uniform E1-grade core density to eliminate inner air voids. Every acrylic blank is cast from 100% pure virgin methyl methacrylate to ensure laser flame-polished edge clarity that never yellows under UV light.
            </p>

            {/* Quality Badges */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <div className="text-sm font-bold text-white font-['Space_Grotesk']">Zero-Blowout Guarantee</div>
                <div className="text-xs text-slate-400 font-mono">Calibrated micro-kerf laser feed profiles</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <Award className="w-5 h-5 text-amber-400" />
                <div className="text-sm font-bold text-white font-['Space_Grotesk']">E1 Eco Certified Pine</div>
                <div className="text-xs text-slate-400 font-mono">Low-formaldehyde safe indoor emission</div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Craft Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-black">
                <span className="text-3xl font-black font-['Orbitron'] text-cyan-400">100%</span>
                <div className="text-sm font-bold text-white mt-1">Virgin Cast PMMA</div>
                <p className="text-xs text-slate-400 mt-1">Zero recycled resin regrind, offering 92.5% crystalline light pass-through.</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#070b13]">
                <span className="text-3xl font-black font-['Orbitron'] text-amber-400">12,500</span>
                <div className="text-sm font-bold text-white mt-1">Sq.Ft Daily Output</div>
                <p className="text-xs text-slate-400 mt-1">Dual-shift high-speed laser and 5-axis routing beds ready for large contract runs.</p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#070b13]">
                <span className="text-3xl font-black font-['Orbitron'] text-pink-400">200°C</span>
                <div className="text-sm font-bold text-white mt-1">Sublimation Glaze</div>
                <p className="text-xs text-slate-400 mt-1">Molecular polymer bond that never cracks, peels, or fades under heat press.</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-black">
                <span className="text-3xl font-black font-['Orbitron'] text-emerald-400">24-48h</span>
                <div className="text-sm font-bold text-white mt-1">Rapid Dispatch</div>
                <p className="text-xs text-slate-400 mt-1">Standard blank formats ship same-day or within 24 hours of CAD verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
