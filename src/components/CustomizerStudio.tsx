import React, { useState } from 'react';
import { Customizer3DViewer, CustomizerState } from './3d/Customizer3DViewer';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';
import { Sparkles, MessageCircle, Copy, Check, Sliders, Shield, Zap, Calculator } from 'lucide-react';

const MATERIALS = [
  {
    id: 'mdf-pine',
    name: 'Engineered Pine MDF',
    category: 'MDF Crafts',
    basePricePerSqFt: 3.20,
    thicknesses: [2.0, 3.2, 5.5, 8.0, 12.0, 18.0],
    color: '#b88a56',
    desc: 'Calibrated uniform density, laser charred-free edge, ideal for mandala and wood art.',
  },
  {
    id: 'mdf-primed',
    name: 'White Pre-Primed MDF',
    category: 'MDF Crafts',
    basePricePerSqFt: 4.10,
    thicknesses: [3.2, 5.5, 8.0, 12.0],
    color: '#e2e8f0',
    desc: 'UV-sealed white primer coat, ready for direct painting, vinyl wrap, or decoupage.',
  },
  {
    id: 'acrylic-frosted',
    name: 'Frosted Cast Acrylic',
    category: 'Acrylic Signs',
    basePricePerSqFt: 9.80,
    thicknesses: [2.0, 3.0, 4.5, 6.0, 8.0, 10.0],
    color: '#00f2fe',
    desc: 'Matte translucent ice diffusion, diamond bevelled edges, popular for neon backplates.',
  },
  {
    id: 'acrylic-clear',
    name: 'Ultra-Clear Cast Acrylic',
    category: 'Acrylic Signs',
    basePricePerSqFt: 8.50,
    thicknesses: [2.0, 3.0, 4.5, 6.0, 8.0, 12.0],
    color: '#38bdf8',
    desc: '92.5% optical transmission, scratch-resistant surface, laser flame-polished edge.',
  },
  {
    id: 'acrylic-gold',
    name: 'Mirrored Gold PMMA',
    category: 'Acrylic Signs',
    basePricePerSqFt: 14.50,
    thicknesses: [2.0, 3.0, 5.0],
    color: '#f59e0b',
    desc: 'Electroplated mirror backing, shatterproof luxury trophy and monogram grade.',
  },
  {
    id: 'sublimation-gloss',
    name: 'Dye Sublimation Hardboard',
    category: 'Sublimation Blanks',
    basePricePerSqFt: 6.20,
    thicknesses: [3.2, 5.0],
    color: '#ec4899',
    desc: 'Diamond-gloss polymer coating cured for vibrant 200°C dye transfer.',
  },
];

const SHAPES = [
  { id: 'rect', label: 'Rectangle', icon: '▬' },
  { id: 'rounded', label: 'Rounded Edge', icon: '▢' },
  { id: 'circle', label: 'Disc / Circle', icon: '●' },
  { id: 'arch', label: 'Architectural Arch', icon: '⌒' },
  { id: 'hexagon', label: 'Hexagon', icon: '⬡' },
];

export const CustomizerStudio: React.FC = () => {
  const [config, setConfig] = useState<CustomizerState>({
    material: 'mdf-pine',
    thicknessMm: 5.5,
    widthMm: 300,
    heightMm: 300,
    shape: 'rect',
    hasStandoffs: false,
    engravedText: 'MMD CRAFT',
    finish: 'Standard Laser Cut & Cleaned',
  });

  const [unitMode, setUnitMode] = useState<'mm' | 'in'>('mm');
  const [quantity, setQuantity] = useState(10);
  const [copiedSpecs, setCopiedSpecs] = useState(false);

  const activeMaterial = MATERIALS.find((m) => m.id === config.material) || MATERIALS[0];

  // Pricing calculations
  // Area in sq ft (1 sq mm = 0.0000107639 sq ft)
  const areaSqFt = (config.widthMm * config.heightMm * 0.0000107639);
  const thicknessMultiplier = 1 + (config.thicknessMm / 10);
  const standoffsAddon = config.hasStandoffs ? 4.50 : 0;
  const customEngravingAddon = config.engravedText.trim() ? 2.00 : 0;

  const unitBasePrice = (activeMaterial.basePricePerSqFt * Math.max(0.25, areaSqFt) * thicknessMultiplier) + standoffsAddon + customEngravingAddon;

  // Bulk discount tiers
  let discountPercent = 0;
  if (quantity >= 200) discountPercent = 30;
  else if (quantity >= 51) discountPercent = 20;
  else if (quantity >= 11) discountPercent = 10;

  const discountedUnitPrice = unitBasePrice * (1 - discountPercent / 100);
  const totalQuote = discountedUnitPrice * quantity;

  // Generate WhatsApp link
  const whatsAppUrl = generateWhatsAppOrderUrl({
    productName: `Custom ${activeMaterial.name}`,
    category: activeMaterial.category,
    material: activeMaterial.name,
    thickness: `${config.thicknessMm} mm`,
    dimensions: `${config.widthMm} × ${config.heightMm} mm (${(config.widthMm / 25.4).toFixed(1)}" × ${(config.heightMm / 25.4).toFixed(1)}")`,
    shape: SHAPES.find(s => s.id === config.shape)?.label || 'Rectangle',
    finish: config.hasStandoffs ? 'With 4x Wall Standoff Mounts' : 'Laser Cut Blank',
    customText: config.engravedText || undefined,
    quantity: quantity,
    estimatedPrice: totalQuote,
    notes: `${discountPercent}% bulk discount applied for ${quantity} pcs batch.`,
  });

  const handleCopySpecs = () => {
    const text = [
      `MMD CRAFT CUSTOM SPECIFICATION`,
      `Material: ${activeMaterial.name}`,
      `Thickness: ${config.thicknessMm} mm`,
      `Dimensions: ${config.widthMm} × ${config.heightMm} mm`,
      `Shape: ${SHAPES.find(s => s.id === config.shape)?.label}`,
      `Standoffs: ${config.hasStandoffs ? 'Included (4x)' : 'None'}`,
      `Engraving: ${config.engravedText || 'None'}`,
      `Batch Qty: ${quantity} units`,
      `Est. Total Quote: $${totalQuote.toFixed(2)} USD`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedSpecs(true);
    setTimeout(() => setCopiedSpecs(false), 2500);
  };

  return (
    <div id="customizer" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE FABRICATION CONFIGURATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight">
            Design, Calibrate & Quote in Real-Time 3D
          </h2>
          <p className="text-base text-slate-400 mt-4">
            Select substrate, thickness, dimensions, and shape. See an accurate 3D preview with laser edge profiles, then send complete fabrication parameters directly to our WhatsApp production desk.
          </p>
        </div>

        {/* Customizer Layout: 3D Viewport on Left/Top, Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3D Live Viewer & Real-Time Technical Specs Badge */}
          <div className="lg:col-span-5 flex flex-col gap-5 sticky top-24">
            <Customizer3DViewer config={config} />

            {/* Live Spec Calculator Card */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
                  <Calculator className="w-4 h-4" />
                  <span>CALCULATED SPECIFICATIONS</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {discountPercent > 0 ? `${discountPercent}% B2B Discount` : 'Factory Direct'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[11px]">CALCULATED AREA</span>
                  <div className="text-slate-200 font-semibold">{areaSqFt.toFixed(2)} sq.ft ({((config.widthMm * config.heightMm) / 1000000).toFixed(3)} m²)</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">PERIMETER CUT</span>
                  <div className="text-slate-200 font-semibold">{((config.widthMm + config.heightMm) * 2 / 1000).toFixed(2)} meters</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">UNIT ESTIMATE</span>
                  <div className="text-cyan-400 font-semibold">${discountedUnitPrice.toFixed(2)} / pc</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">BATCH TOTAL ({quantity} PCS)</span>
                  <div className="text-emerald-400 font-bold text-base">${totalQuote.toFixed(2)} USD</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs font-mono tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-400/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>ORDER VIA WHATSAPP</span>
                </a>

                <button
                  onClick={handleCopySpecs}
                  className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  title="Copy full spec sheet to clipboard"
                >
                  {copiedSpecs ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSpecs ? 'Copied!' : 'Copy Specs'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Configuration Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Material Selection */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">1</span>
                  Select Substrate Material
                </label>
                <span className="text-xs text-slate-400 font-mono">{activeMaterial.category}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MATERIALS.map((mat) => {
                  const isSelected = config.material === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => {
                        const fallbackThick = mat.thicknesses.includes(config.thicknessMm)
                          ? config.thicknessMm
                          : mat.thicknesses[0];
                        setConfig({
                          ...config,
                          material: mat.id as any,
                          thicknessMm: fallbackThick,
                        });
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/50'
                          : 'border-slate-800/80 bg-black/40 hover:border-slate-700 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: mat.color }}
                          />
                          <span className="text-xs font-bold text-slate-200">{mat.name}</span>
                        </div>
                        {isSelected && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {mat.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Calibrated Thickness */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">2</span>
                  Select Material Thickness
                </label>
                <span className="text-xs font-mono text-cyan-300 font-bold">{config.thicknessMm} mm Calibrated</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {activeMaterial.thicknesses.map((th) => {
                  const isSelected = config.thicknessMm === th;
                  return (
                    <button
                      key={th}
                      onClick={() => setConfig({ ...config, thicknessMm: th })}
                      className={`py-3 px-2 rounded-xl text-center border font-mono transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold shadow-md shadow-cyan-950'
                          : 'border-slate-800 bg-black/40 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="text-sm font-semibold">{th} mm</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">±0.05mm</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Geometry & Dimensions */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">3</span>
                  Shape Geometry & Dimensions
                </label>

                {/* Unit Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                  <button
                    onClick={() => setUnitMode('mm')}
                    className={`px-2 py-0.5 rounded ${unitMode === 'mm' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'}`}
                  >
                    mm
                  </button>
                  <button
                    onClick={() => setUnitMode('in')}
                    className={`px-2 py-0.5 rounded ${unitMode === 'in' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'}`}
                  >
                    inches
                  </button>
                </div>
              </div>

              {/* Shape Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SHAPES.map((shape) => {
                  const isSelected = config.shape === shape.id;
                  return (
                    <button
                      key={shape.id}
                      onClick={() => setConfig({ ...config, shape: shape.id as any })}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                          : 'border-slate-800 bg-black/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-lg">{shape.icon}</div>
                      <div className="text-[11px] font-mono mt-1">{shape.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Dimension Sliders & Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                    <span>Width ({unitMode})</span>
                    <span className="text-cyan-400 font-semibold">
                      {unitMode === 'mm' ? `${config.widthMm} mm` : `${(config.widthMm / 25.4).toFixed(1)}"`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1200"
                    step="10"
                    value={config.widthMm}
                    onChange={(e) => setConfig({ ...config, widthMm: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1">
                    <span>100 mm</span>
                    <span>1200 mm</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                    <span>Height ({unitMode})</span>
                    <span className="text-cyan-400 font-semibold">
                      {unitMode === 'mm' ? `${config.heightMm} mm` : `${(config.heightMm / 25.4).toFixed(1)}"`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1200"
                    step="10"
                    value={config.heightMm}
                    onChange={(e) => setConfig({ ...config, heightMm: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1">
                    <span>100 mm</span>
                    <span>1200 mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Engraving & Standoff Hardware */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">4</span>
                Laser Engraving & Hardware Fixtures
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Custom Laser Engraved Text (3D Previewed)
                  </label>
                  <input
                    type="text"
                    maxLength={32}
                    value={config.engravedText}
                    onChange={(e) => setConfig({ ...config, engravedText: e.target.value })}
                    placeholder="e.g. STUDIO LAB 404"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    Vaporized laser depth: 0.3mm into surface
                  </span>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-black/40 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={config.hasStandoffs}
                      onChange={(e) => setConfig({ ...config, hasStandoffs: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-mono text-slate-200 font-semibold">
                        Add 4x Anodized Aluminum Standoffs
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Includes CNC pre-drilled holes & mounting screws
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Batch Quantity Stepper */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-slate-300 font-semibold block">Required Production Quantity</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Tier: 11-50 pcs (10% off) | 51-200 pcs (20% off) | 200+ pcs (30% off)
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 5))}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold font-mono text-sm"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-transparent text-sm font-mono font-bold text-cyan-300 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 5)}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold font-mono text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
