import React, { useState, useMemo } from 'react';
import productsData from '../data/products.json';
import { ProductCard, Product } from './ProductCard';
import { Search, Filter, Sparkles, Layers, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ProductGalleryProps {
  onQuickView: (product: Product) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Substrates' },
  { id: 'mdf', label: 'MDF Crafts & Blanks' },
  { id: 'acrylic', label: 'Laser Cut Acrylic' },
  { id: 'sublimation', label: 'Sublimation Blanks' },
  { id: 'architectural', label: '3D Architectural & Signage' },
];

export const ProductGallery: React.FC<ProductGalleryProps> = ({ onQuickView }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let list = (productsData as Product[]).filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.materialType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.applications.some((app) => app.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.priceEstimate - b.priceEstimate);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.priceEstimate - a.priceEstimate);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section id="products" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>FACTORY MASTER CATALOG</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Space_Grotesk'] text-white tracking-tight">
              Calibrated Blanks & 3D Architectural Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Precision-cut on 150W optical laser systems and 5-axis CNC machining centers. Available in calibrated thicknesses from 2mm to 18mm with zero blowout.
            </p>
          </div>

          {/* Quick stats counter */}
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-[#080d18] p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-cyan-400 font-bold block">{productsData.length} SKUs</span>
              <span className="text-[10px] text-slate-500">In Production</span>
            </div>
            <div className="w-[1px] h-7 bg-slate-800" />
            <div>
              <span className="text-amber-400 font-bold block">±0.03 mm</span>
              <span className="text-[10px] text-slate-500">CNC Kerf Tolerance</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-mono tracking-wider transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by substrate or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-[#080d18] text-white">Featured</option>
                  <option value="price-asc" className="bg-[#080d18] text-white">Price: Low to High</option>
                  <option value="price-desc" className="bg-[#080d18] text-white">Price: High to Low</option>
                  <option value="rating" className="bg-[#080d18] text-white">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center max-w-md mx-auto space-y-3">
            <Search className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">No matching substrates found</h3>
            <p className="text-xs text-slate-400 font-mono">
              Try searching for "MDF", "Acrylic", "Sublimation", or clear filters to view all factory products.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
