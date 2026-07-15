import React, { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, ArrowUpDown, Search, X, Check, ArrowRight } from 'lucide-react';
import { Product, ProductColor } from '../types';
import ProductCard from './ProductCard';

interface ShopViewProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: ProductColor) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistItems: Product[];
  currency: 'INR' | 'USD' | 'EUR';
  onBuyNow: (product: Product, selectedColor: ProductColor) => void;
  initialCategoryFilter?: string;
  onNavigateToProduct?: (product: Product) => void;
}

type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

export default function ShopView({
  products,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistItems,
  currency,
  onBuyNow,
  initialCategoryFilter = 'All',
  onNavigateToProduct,
}: ShopViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(initialCategoryFilter);
  }, [initialCategoryFilter]);

  const categories = useMemo(() => {
    return [
      'All', 
      'Bags', 
      'Wallets', 
      'Sunglasses', 
      'Perfumes', 
      'Water Bottles', 
      'Accessories', 
      'Travel Essentials', 
      'Lifestyle', 
      'Gift Collection'
    ];
  }, []);
  
  const colors = [
    { name: 'All', hex: 'transparent' },
    { name: 'Matte Black', hex: '#0B0B0B' },
    { name: 'Luxury Gold', hex: '#C8A25D' },
    { name: 'Sovereign Tan', hex: '#8B5A2B' },
    { name: 'Pearl White', hex: '#F5F5F0' },
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedColor('All');
    setSortBy('recommended');
  };

  // Filter and Sort Products logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search query filter
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category filter matching with broad luxury groupings
        let matchesCategory = false;
        if (selectedCategory === 'All') {
          matchesCategory = true;
        } else if (selectedCategory === 'Bags') {
          matchesCategory = ['tote', 'shoulder bag', 'backpack', 'duffle', 'sling', 'laptop bag', 'bags', 'backpacks'].includes(product.category.toLowerCase());
        } else if (selectedCategory === 'Wallets') {
          matchesCategory = ['wallets', 'wallet', 'card holders', 'card holder'].includes(product.category.toLowerCase());
        } else if (selectedCategory === 'Sunglasses') {
          matchesCategory = ['sunglasses', 'eyewear', 'blue light glasses', 'glasses'].includes(product.category.toLowerCase());
        } else if (selectedCategory === 'Perfumes') {
          matchesCategory = ['perfumes', 'perfume', 'candles', 'scent'].includes(product.category.toLowerCase());
        } else if (selectedCategory === 'Water Bottles') {
          matchesCategory = ['premium water bottles', 'travel bottles', 'coffee mugs', 'travel mugs', 'tumblers', 'bottles', 'water bottles'].includes(product.category.toLowerCase());
        } else if (selectedCategory === 'Accessories') {
          matchesCategory = ['accessories', 'phone cases', 'keychains', 'tech accessories', 'watches', 'gems'].includes(product.category.toLowerCase());
        } else if (selectedCategory === 'Travel Essentials') {
          matchesCategory = ['travel organizers', 'toiletry bags', 'packing cubes', 'travel', 'travel essentials'].includes(product.category.toLowerCase());
        } else if (selectedCategory === 'Lifestyle') {
          matchesCategory = ['lifestyle', 'notebooks', 'journals', 'premium pens', 'desk accessories', 'apparel', 'footwear'].includes(product.category.toLowerCase());
        } else if (selectedCategory === 'Gift Collection') {
          matchesCategory = ['premium gift sets', 'gift collection', 'gifts', 'gift set'].includes(product.category.toLowerCase());
        } else {
          matchesCategory = product.category.toLowerCase() === selectedCategory.toLowerCase();
        }

        // Color filter
        const matchesColor = selectedColor === 'All' || product.colors.some(c => c.name.toLowerCase() === selectedColor.toLowerCase() || (selectedColor === 'Pearl White' && c.name === 'Pearl White') || (selectedColor === 'Luxury Gold' && (c.name === 'Luxury Gold' || c.name === 'Imperial Gold')));

        return matchesSearch && matchesCategory && matchesColor;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // recommended (default: best seller first, then alphabet)
        const scoreA = (a.isBestSeller ? 10 : 0) + (a.isNewArrival ? 5 : 0);
        const scoreB = (b.isBestSeller ? 10 : 0) + (b.isNewArrival ? 5 : 0);
        return scoreB - scoreA;
      });
  }, [products, searchQuery, selectedCategory, selectedColor, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedColor !== 'All') count++;
    if (searchQuery !== '') count++;
    return count;
  }, [selectedCategory, selectedColor, searchQuery]);

  return (
    <div className="w-full bg-[#0B0B0B] text-white min-h-screen py-10 px-4 sm:px-8">
      
      {/* Top Banner & Header */}
      <div className="w-full max-w-7xl mx-auto mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b border-[#C8A25D]/15 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C8A25D] uppercase block mb-1">ARZEN Catalog</span>
          <h1 className="text-3xl font-sans font-medium tracking-wide">The Full Collection</h1>
          <p className="text-xs text-white/50 font-light mt-1 max-w-md">
            Meticulously hand-formed leather bags, designed to look expensive, feel robust, and act as timeless statements.
          </p>
        </div>
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-4 md:mt-0">
          Showing <span className="text-white font-bold">{filteredProducts.length}</span> of {products.length} masterpieces
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">
        
        {/* Left Side: Desktop Filter Controls Drawer (1/4 Width) */}
        <aside className="hidden lg:block w-1/4 bg-[#0F0F0F] border border-[#C8A25D]/10 rounded-sm p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C8A25D]" />
              <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-white">Filters</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button 
                onClick={handleResetFilters}
                className="text-[10px] font-mono uppercase tracking-widest text-[#C8A25D] hover:text-white transition-colors cursor-pointer"
              >
                Reset ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Filter Sub-Section 1: Interactive Search inside catalog */}
          <div className="space-y-2">
            <span className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D]">Search Collection</span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 rounded-xs py-2 pl-3 pr-8 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#C8A25D]/40"
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-white/40 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Search className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-white/30" />
              )}
            </div>
          </div>

          {/* Filter Sub-Section 2: Categories */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <span className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D]">Categories</span>
            <div className="flex flex-col space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs py-1.5 transition-colors uppercase font-mono tracking-wider flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat 
                      ? 'text-[#C8A25D] font-bold' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <span className="w-1.5 h-1.5 bg-[#C8A25D] rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Sub-Section 3: Color Tones */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <span className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D]">Color Tone</span>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col.name)}
                  className={`flex items-center space-x-1.5 p-1.5 border rounded-xs transition-colors text-[10px] font-mono tracking-wider text-left cursor-pointer ${
                    selectedColor === col.name 
                      ? 'border-[#C8A25D] text-[#C8A25D] bg-[#C8A25D]/5 font-bold' 
                      : 'border-white/5 text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {col.name !== 'All' ? (
                    <span className="w-2.5 h-2.5 rounded-full border border-white/15 flex-shrink-0" style={{ backgroundColor: col.hex }} />
                  ) : (
                    <span className="w-2.5 h-2.5 border border-dashed border-white/30 rounded-full flex-shrink-0" />
                  )}
                  <span className="truncate">{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Sub-Section 4: Sorting options */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <span className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D]">Sort Masterpieces</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full bg-[#161616] border border-white/10 rounded-xs py-2 px-2.5 text-xs text-white focus:outline-none focus:border-[#C8A25D]/40 uppercase font-mono tracking-wider"
            >
              <option value="recommended">RECOMMENDED</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="rating">TOP CUSTOMER RATING</option>
            </select>
          </div>
        </aside>

        {/* Right Side: Products Grid Column (3/4 Width) */}
        <div className="w-full lg:w-3/4 flex flex-col">
          
          {/* Mobile Filters Toggles Button (Responsive Only) */}
          <div className="lg:hidden w-full flex items-center justify-between mb-6 bg-[#0F0F0F] border border-[#C8A25D]/10 rounded-xs px-4 py-3 text-sm">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#C8A25D] focus:outline-none cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({activeFiltersCount})</span>
            </button>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#C8A25D]">
              <ArrowUpDown className="w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent border-0 text-white font-mono uppercase font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="recommended" className="bg-[#0B0B0B]">Recommended</option>
                <option value="price-asc" className="bg-[#0B0B0B]">Price: Low-High</option>
                <option value="price-desc" className="bg-[#0B0B0B]">Price: High-Low</option>
                <option value="rating" className="bg-[#0B0B0B]">Rating</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges row */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-[10px] font-mono tracking-widest uppercase">
              <span className="text-white/40">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="bg-[#111] border border-[#C8A25D]/30 text-[#C8A25D] px-2.5 py-1 rounded-sm flex items-center space-x-1.5">
                  <span>{selectedCategory}</span>
                  <X className="w-3 h-3 hover:text-white cursor-pointer" onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedColor !== 'All' && (
                <span className="bg-[#111] border border-[#C8A25D]/30 text-[#C8A25D] px-2.5 py-1 rounded-sm flex items-center space-x-1.5">
                  <span>{selectedColor}</span>
                  <X className="w-3 h-3 hover:text-white cursor-pointer" onClick={() => setSelectedColor('All')} />
                </span>
              )}
              {searchQuery && (
                <span className="bg-[#111] border border-[#C8A25D]/30 text-[#C8A25D] px-2.5 py-1 rounded-sm flex items-center space-x-1.5">
                  <span className="max-w-[100px] truncate">"{searchQuery}"</span>
                  <X className="w-3 h-3 hover:text-white cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
              <button 
                onClick={handleResetFilters}
                className="text-[#C8A25D] hover:text-white font-bold transition-colors underline underline-offset-4 cursor-pointer pl-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Catalog Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-24 px-6 border border-[#C8A25D]/10 bg-[#0F0F0F] rounded-sm space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#111] border border-dashed border-[#C8A25D]/20 flex items-center justify-center">
                <SlidersHorizontal className="w-6 h-6 text-[#C8A25D]/40" />
              </div>
              <div>
                <h3 className="text-base font-sans font-medium text-white tracking-wide">No Masterpieces Found</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light mt-2 max-w-sm mx-auto">
                  Settle for nothing less. No bags matched your selected filter arrangement. Reset filters to explore the ARZEN catalog.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-8 py-3 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-xs cursor-pointer focus:outline-none shadow-lg shadow-[#C8A25D]/5"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onAddToCart={(p, col) => onAddToCart(p, col)}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistItems.some((item) => item.id === product.id)}
                  currency={currency}
                  onBuyNow={(p, col) => onBuyNow(p, col)}
                  onClick={onNavigateToProduct}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Sliding Panel/Overlay */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed top-0 right-0 w-[280px] h-full bg-[#0F0F0F] border-l border-[#C8A25D]/20 z-50 p-6 flex flex-col justify-between text-white transition-transform duration-300 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#C8A25D]/15 pb-4">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C8A25D] font-bold">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-[#C8A25D] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile: Search */}
              <div className="space-y-2">
                <span className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D]">Search</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xs py-2 pl-3 pr-8 text-xs text-white placeholder-white/35"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2.5 text-white/40">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile: Categories */}
              <div className="space-y-2">
                <span className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D]">Categories</span>
                <div className="flex flex-col space-y-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setMobileFiltersOpen(false);
                      }}
                      className={`text-left text-xs py-1 transition-colors uppercase font-mono tracking-wider flex items-center justify-between ${
                        selectedCategory === cat ? 'text-[#C8A25D] font-bold' : 'text-white/60'
                      }`}
                    >
                      {cat}
                      {selectedCategory === cat && <span className="w-1.5 h-1.5 bg-[#C8A25D] rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: Colors */}
              <div className="space-y-2">
                <span className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D]">Colors</span>
                <div className="grid grid-cols-2 gap-2">
                  {colors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        setSelectedColor(col.name);
                        setMobileFiltersOpen(false);
                      }}
                      className={`flex items-center space-x-1.5 p-1.5 border rounded-xs text-[9px] font-mono tracking-wider truncate text-left ${
                        selectedColor === col.name 
                          ? 'border-[#C8A25D] text-[#C8A25D] bg-[#C8A25D]/5' 
                          : 'border-white/5 text-white/50'
                      }`}
                    >
                      {col.name !== 'All' && (
                        <span className="w-2.5 h-2.5 rounded-full border border-white/10 flex-shrink-0" style={{ backgroundColor: col.hex }} />
                      )}
                      <span className="truncate">{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    handleResetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full py-2 bg-transparent hover:bg-white/5 border border-[#C8A25D]/30 text-[#C8A25D] hover:text-white text-[10px] font-mono font-bold tracking-widest uppercase transition-colors rounded-xs"
                >
                  Reset All ({activeFiltersCount})
                </button>
              )}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-[#C8A25D] text-[#0B0B0B] text-[10px] font-mono font-bold tracking-widest uppercase rounded-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
