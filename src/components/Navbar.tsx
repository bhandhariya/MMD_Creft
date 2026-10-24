import React, { useState } from 'react';
import { Phone, MessageCircle, Layers, Wrench, Sparkles, Menu, X, Compass, Flame } from 'lucide-react';
import workshopData from '../data/workshop.json';

interface NavbarProps {
  onOpenBulkModal: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBulkModal, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Products', id: 'products' },
    { label: '3D Customizer', id: 'customizer' },
    { label: 'Exploded Tech', id: 'exploded-view' },
    { label: 'Live Workshop', id: 'working-on' },
    { label: 'Sale Drops', id: 'sale-on' },
    { label: 'Capabilities', id: 'capabilities' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-[#030508]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-cyan-700 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-shadow">
            <div className="w-full h-full bg-[#070b13] rounded-[10px] flex items-center justify-center">
              <span className="font-['Orbitron'] font-black text-lg bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                M
              </span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-cyan-400 blur-[1px]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Orbitron'] font-black text-xl tracking-wider text-white">
                MMD<span className="text-cyan-400">.</span>CRAFT
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 font-semibold tracking-wider">
                3D STUDIO
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 tracking-wider">
              PRECISION MDF • ACRYLIC • SUBLIMATION
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-cyan-400 hover:bg-white/[0.04] rounded-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Call to Order */}
          <a
            href={`tel:${workshopData.contact.phone}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all"
            title="Direct phone desk"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Call to Order</span>
            <span className="lg:hidden">Call</span>
          </a>

          {/* Bulk Enquiries */}
          <button
            onClick={onOpenBulkModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-xs font-mono text-cyan-300 transition-all hover:border-cyan-400"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bulk Enquiries</span>
          </button>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${workshopData.contact.whatsappNumber}?text=${encodeURIComponent('Hello MMD Craft, I want to inquire about custom laser cutting and material blanks.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold text-xs font-mono tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-400/40"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="xl:hidden flex items-center gap-2">
          <a
            href={`https://wa.me/${workshopData.contact.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#05080f] border-b border-cyan-500/30 px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left px-3.5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-cyan-500/30"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => { onOpenBulkModal(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-xs font-mono text-cyan-300"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Bulk Order Inquiries</span>
            </button>
            <a
              href={`tel:${workshopData.contact.phone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-mono text-slate-200"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Factory Desk ({workshopData.contact.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
