import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero3DScene } from './components/3d/Hero3DScene';
import { MaterialExplodedScene } from './components/3d/MaterialExplodedScene';
import { CustomizerStudio } from './components/CustomizerStudio';
import { ProductGallery } from './components/ProductGallery';
import { WorkingOnSection } from './components/WorkingOnSection';
import { SaleOnSection } from './components/SaleOnSection';
import { ManufacturingShowcase } from './components/ManufacturingShowcase';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { BulkEnquiryModal } from './components/BulkEnquiryModal';
import { Product } from './components/ProductCard';
import workshopData from './data/workshop.json';
import { MessageCircle, Phone, Sliders, ArrowRight, Sparkles, Layers, Cpu, ShieldCheck } from 'lucide-react';

export default function App() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onOpenBulkModal={() => setBulkModalOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section id="hero" className="relative pt-6 pb-20 overflow-hidden">
          {/* Subtle cyber background lights */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Top Headline & Lead */}
            <div className="text-center max-w-4xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D-FIRST INTERACTIVE FABRICATION REVOLUTION</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-['Space_Grotesk'] tracking-tight text-white leading-[1.08]">
                Precision Laser MDF, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent">
                  Architectural Acrylic
                </span>{' '}
                & Blanks
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
                Explore floating 3D acrylic sheets, rotating pine MDF panels, and sublimation blanks in interactive real-time. Calibrated for signmakers, craft artists, and architects with instant WhatsApp ordering.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleNavigate('customizer')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs font-mono tracking-wider shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:-translate-y-0.5"
                >
                  <Sliders className="w-4 h-4" />
                  <span>LAUNCH 3D CUSTOMIZER</span>
                </button>

                <a
                  href={`https://wa.me/${workshopData.contact.whatsappNumber}?text=${encodeURIComponent('Hello MMD Craft! I want to discuss custom laser cutting and sheet blanks.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>ORDER ON WHATSAPP</span>
                </a>

                <button
                  onClick={() => handleNavigate('products')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono tracking-wider transition-all"
                >
                  <span>BROWSE CATALOG</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3D Immersive Hero Scene */}
            <div className="w-full">
              <Hero3DScene />
            </div>

            {/* Live Factory Ticker Strip */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>FACTORY BED STATUS: 6 LASER + 4 CNC ACTIVE</span>
              </div>
              <div className="text-slate-400 hidden sm:block">
                TOLERANCE: <span className="text-slate-200 font-bold">±0.025 mm</span>
              </div>
              <div className="text-slate-400 hidden md:block">
                CAPACITY: <span className="text-amber-400 font-bold">12,500+ sq.ft/day</span>
              </div>
              <div className="text-slate-400">
                DISPATCH: <span className="text-emerald-400 font-bold">24-48 Hours</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3D STORYTELLING / EXPLODED MATERIAL BREAKDOWN */}
        <section id="exploded-view" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>SCROLL-DRIVEN 3D STORYTELLING</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight">
                Deconstruct the Substrate
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-2">
                Drag the exploded view slider to separate protective mask, cast optical acrylic, sublimation polymer glaze, engineered pine MDF core, and CNC mounting fixtures.
              </p>
            </div>

            <MaterialExplodedScene />
          </div>
        </section>

        {/* INTERACTIVE 3D CUSTOMIZER STUDIO */}
        <CustomizerStudio />

        {/* PRODUCT CATALOG & SPECIFICATION GALLERIES */}
        <ProductGallery onQuickView={(prod) => setQuickViewProduct(prod)} />

        {/* WORKING ON / LIVE FACTORY TELEMETRY */}
        <WorkingOnSection />

        {/* SALE ON / LIMITED DROPS */}
        <SaleOnSection />

        {/* MANUFACTURING HARDWARE SUITE */}
        <ManufacturingShowcase />

        {/* ABOUT US */}
        <AboutSection />

        {/* CONTACT & FAQ */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Bulk Enquiries Modal */}
      <BulkEnquiryModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
      />

      {/* Floating Persistent WhatsApp Hotlink Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${workshopData.contact.whatsappNumber}?text=${encodeURIComponent('Hello MMD Craft! I have a question about material specs and custom laser blanks.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-400/60 transition-all hover:scale-105 group"
          title="Direct WhatsApp Production Desk"
        >
          <MessageCircle className="w-5 h-5 fill-black" />
          <span className="hidden sm:inline">WhatsApp Order</span>
        </a>
      </div>
    </div>
  );
}
