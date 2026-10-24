import React, { useState } from 'react';
import { X, MessageCircle, Layers, Building2, Check, Sparkles } from 'lucide-react';
import { generateBulkWhatsAppUrl } from '../utils/whatsapp';

interface BulkEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkEnquiryModal: React.FC<BulkEnquiryModalProps> = ({ isOpen, onClose }) => {
  const [company, setCompany] = useState('');
  const [substrate, setSubstrate] = useState('Pine MDF & Cast Acrylic Mix');
  const [estimatedQty, setEstimatedQty] = useState('500 - 1,000 Units');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const whatsAppUrl = generateBulkWhatsAppUrl(company, substrate, estimatedQty, notes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsAppUrl, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#070b13] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 z-10 overflow-hidden">
        <div className="laser-line-cyan absolute top-0 left-0 right-0" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>ENTERPRISE & B2B DIRECT FABRICATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Space_Grotesk'] text-white">
            Bulk Production & Custom CNC Runs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sign-makers, craft studios, retail chains, and architects: connect with our production engineering desk for dedicated laser bed allocation, custom sheet optimization, and wholesale tiered pricing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Company / Brand / Studio Name
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Lumina Neon Design Studio"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Primary Substrate Material
              </label>
              <select
                value={substrate}
                onChange={(e) => setSubstrate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Pine MDF (2mm to 18mm)">Pine MDF (2mm to 18mm)</option>
                <option value="Cast PMMA Acrylic (Clear/Frosted/Mirror)">Cast PMMA Acrylic (Clear/Frosted/Mirror)</option>
                <option value="Sublimation Coated Hardboard Blanks">Sublimation Coated Hardboard Blanks</option>
                <option value="Multi-Layer 3D Signage Facades">Multi-Layer 3D Signage Facades</option>
                <option value="Mixed Substrates / Custom CAD Prototype">Mixed Substrates / Custom CAD Prototype</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Estimated Batch Volume
              </label>
              <select
                value={estimatedQty}
                onChange={(e) => setEstimatedQty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="200 - 500 Units (Tier 1 B2B)">200 - 500 Units (Tier 1 B2B)</option>
                <option value="500 - 1,500 Units (Tier 2 Wholesale)">500 - 1,500 Units (Tier 2 Wholesale)</option>
                <option value="1,500+ Units (Enterprise Production Run)">1,500+ Units (Enterprise Production Run)</option>
                <option value="Continuous Monthly Scheduled Supply">Continuous Monthly Scheduled Supply</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Target Timeline / Delivery
              </label>
              <input
                type="text"
                placeholder="e.g. Within 7-10 Business Days"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Project Scope, File Links (DXF/AI/SVG), or Specific Tolerances
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide dimensions, required thickness, laser vs CNC routing, edge polish requirements, or packaging needs..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs font-mono tracking-wider shadow-lg shadow-cyan-500/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>DISPATCH B2B INQUIRY TO PRODUCTION DESK</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-mono text-slate-300 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
