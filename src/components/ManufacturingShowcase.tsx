import React, { useState } from 'react';
import workshopData from '../data/workshop.json';
import { Cpu, Wrench, Shield, CheckCircle, Crosshair, Sparkles } from 'lucide-react';

export const ManufacturingShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeMachine = workshopData.machinery[activeTab] || workshopData.machinery[0];

  return (
    <section id="capabilities" className="py-20 relative bg-cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>INDUSTRIAL PRECISION INFRASTRUCTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight">
            Advanced CNC & Laser Hardware Suite
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            Our multi-axis production cells blend high-power sealed CO2 optical lasers, diamond edge flywheels, and vacuum-bed CNC routers to achieve zero-defect blanks and architectural grade finishes.
          </p>
        </div>

        {/* Machine Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {workshopData.machinery.map((mach, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={mach.name}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all border ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'bg-black/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {mach.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        {/* Active Machine Detailed Inspection Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="laser-line-cyan absolute top-0 left-0 right-0" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Machine Specs Left */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                {activeMachine.highlight}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
                {activeMachine.name}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {activeMachine.detail}
              </p>

              {/* Machine Parameters Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeMachine.specs.map((spec) => (
                  <div
                    key={spec}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-slate-800/80 text-xs font-mono text-slate-300"
                  >
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Engineering Diagram / Tolerances Right */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#090e1a] to-[#04060a] p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Crosshair className="w-4 h-4" /> MICROSCOPIC TOLERANCE AUDIT
                </span>
                <span>ISO 9001:2015</span>
              </div>

              {/* Laser Kerf vs Traditional Comparison */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>MMD Optical Laser Beam Kerf</span>
                    <span className="text-cyan-400 font-bold">0.08 mm (Ultra-Fine)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-2/12 h-full bg-cyan-400 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>CNC Solid Carbide Bit Kerf</span>
                    <span className="text-amber-400 font-bold">1.50 mm (Pocketing)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-5/12 h-full bg-amber-400 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Conventional Saw Kerf</span>
                    <span className="text-slate-500 line-through">3.20 mm (High Waste)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-10/12 h-full bg-slate-700 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="text-slate-200 font-semibold">Engineered Material Advantage:</div>
                <div>• Zero-Blowout: Calibrated feed-to-power computerized curve</div>
                <div>• Pure Nitrogen Purge: Clean edge without soot or residue</div>
                <div>• Auto-Nesting Software: Maximum sheet yield & lower customer cost</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
