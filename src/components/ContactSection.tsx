import React, { useState } from 'react';
import workshopData from '../data/workshop.json';
import { Phone, MessageCircle, Mail, MapPin, Clock, ChevronDown, HelpCircle, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');

  const handleQuickWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*GENERAL INQUIRY - MMD CRAFT*\nName: ${inquiryName || 'Website Visitor'}\nMessage: ${inquiryMsg || 'I would like to inquire about your craft blanks and manufacturing capabilities.'}`;
    window.open(`https://wa.me/${workshopData.contact.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Factory Contacts & Quick WhatsApp Chat */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>DIRECT PRODUCTION LIAISON</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight">
                Connect with the Engineering Desk
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Have a complex CAD file, custom architectural installation, or need large-scale blank supplies? Reach out directly via WhatsApp, phone, or visit our factory floor.
              </p>
            </div>

            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`https://wa.me/${workshopData.contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel p-4 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 transition-colors flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">WHATSAPP DIRECT</span>
                  <span className="text-sm font-bold text-white group-hover:text-emerald-300 font-mono">
                    {workshopData.contact.whatsappDisplay}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">Instant Engineer Reply</span>
                </div>
              </a>

              <a
                href={`tel:${workshopData.contact.phone}`}
                className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-amber-400 transition-colors flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">CALL TO ORDER</span>
                  <span className="text-sm font-bold text-white group-hover:text-amber-300 font-mono">
                    {workshopData.contact.phone}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Mon-Sat 8:30-20:00</span>
                </div>
              </a>

              <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">EMAIL DISPATCH</span>
                  <span className="text-sm font-bold text-white font-mono">{workshopData.contact.email}</span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">DXF / AI CAD attachments</span>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">PRODUCTION SHIFTS</span>
                  <span className="text-xs font-bold text-white font-mono">3 Daily Laser Shifts</span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">24/7 Machine Telemetry</span>
                </div>
              </div>
            </div>

            {/* Factory Address */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">FACILITY LOCATION</span>
                <span className="text-slate-200 font-medium leading-relaxed block mt-0.5">
                  {workshopData.contact.factoryAddress}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 mt-1 block">
                  Visits by prior engineering appointment for sample catalog inspection.
                </span>
              </div>
            </div>

            {/* Direct Quick WhatsApp Inquiry Form */}
            <form onSubmit={handleQuickWhatsApp} className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-300 block uppercase">
                ⚡ Instant WhatsApp Message Generator
              </span>
              <input
                type="text"
                placeholder="Your Name / Studio"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <textarea
                rows={2}
                placeholder="Ask about custom cutting, material thickness, or sample dispatch..."
                value={inquiryMsg}
                onChange={(e) => setInquiryMsg(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono tracking-wider transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND TO FACTORY WHATSAPP</span>
              </button>
            </form>
          </div>

          {/* Right Column: Interactive Technical FAQ Accordion */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                FABRICATION & ORDERING FAQ
              </span>
            </div>

            <div className="space-y-3">
              {workshopData.faq.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={item.q}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? 'bg-slate-950/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                        : 'bg-black/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                    >
                      <span className="text-sm font-bold text-white font-['Space_Grotesk']">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 font-sans">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
