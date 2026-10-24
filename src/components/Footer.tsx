import React from 'react';
import workshopData from '../data/workshop.json';
import { MessageCircle, Phone, ArrowUp, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-900 bg-[#020407] relative overflow-hidden">
      <div className="laser-line-cyan absolute top-0 left-0 right-0 opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1.5px]">
                <div className="w-full h-full bg-[#070b13] rounded-[10px] flex items-center justify-center font-['Orbitron'] font-black text-cyan-300">
                  M
                </div>
              </div>
              <span className="font-['Orbitron'] font-black text-xl tracking-wider text-white">
                MMD<span className="text-cyan-400">.</span>CRAFT
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              Next-generation 3D-first manufacturing portal for precision laser-cut MDF, architectural cast acrylic panels, and custom sublimation blanks. Engineered for zero-blowout and microscopic kerf tolerances.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://wa.me/${workshopData.contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Hotline</span>
              </a>

              <a
                href={`tel:${workshopData.contact.phone}`}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>

          {/* Substrates Catalog */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Substrate Solutions
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li><a href="#products" className="hover:text-white transition-colors">Pine MDF Blanks (2-18mm)</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Frosted & Gloss Acrylic</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Mirror Gold & Silver PMMA</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Dye-Sublimation Hardboard</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Layered 3D Mandala Art</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Architectural Neon Backing</a></li>
            </ul>
          </div>

          {/* Custom Studio */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Studio & Tools
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li><a href="#customizer" className="hover:text-white transition-colors">3D Material Configurator</a></li>
              <li><a href="#exploded-view" className="hover:text-white transition-colors">Exploded Layer Inspector</a></li>
              <li><a href="#working-on" className="hover:text-white transition-colors">Live Factory Bed Queue</a></li>
              <li><a href="#sale-on" className="hover:text-white transition-colors">Sale On Batch Overruns</a></li>
              <li><a href="#capabilities" className="hover:text-white transition-colors">Machinery & Kerf Specs</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">CAD DXF Verification</a></li>
            </ul>
          </div>

          {/* Compliance & Factory */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Fabrication Standards
            </h4>
            <div className="space-y-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>ISO 9001:2015 Quality</span>
              </div>
              <div className="text-[11px] text-slate-500">E1 Emission Low-Formaldehyde</div>
              <div className="text-[11px] text-slate-500">100% Virgin Cast Monomer</div>
              <div className="text-[11px] text-slate-500">Coaxial Nitrogen Laser Assist</div>
              <div className="text-[11px] text-slate-500">Recyclable Acrylic Scrap Loop</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} MMD Craft Precision Works. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-600">3D-First Interactive WebGL Studio</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
