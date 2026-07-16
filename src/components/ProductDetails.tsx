import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw, 
  Star, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Copy, 
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react';
import { Product, ProductColor, Review } from '../types';
import { formatPrice } from '../utils';
import ProductCard from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, selectedColor: ProductColor, quantity: number, selectedSize?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  currency: 'INR' | 'USD' | 'EUR';
  onBuyNow: (product: Product, selectedColor: ProductColor, quantity: number, selectedSize?: string) => void;
  onNavigateToProduct: (product: Product) => void;
}

export default function ProductDetails({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  currency,
  onBuyNow,
  onNavigateToProduct,
}: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  
  // Custom enhanced states for dynamic online shopping features
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'Regular');
  const [includeCompanion, setIncludeCompanion] = useState(false);

  // Initialize review list with premium feedback
  const [reviewsList, setReviewsList] = useState<Review[]>([
    {
      id: 'rev-1',
      name: 'Elena Rostova',
      role: 'Private Curator, Milan',
      rating: 5,
      comment: 'The stitching on this piece is unlike anything I have inspected from traditional luxury houses. The structural integrity is rigid, yet the leather smells rich and natural.',
      date: 'June 28, 2026',
      verified: true
    },
    {
      id: 'rev-2',
      name: 'Aditya Birla',
      role: 'Sovereign Client, Mumbai',
      rating: 5,
      comment: 'An exquisite masterpiece. Handcrafted perfection. Received mine in Bokaro in a beautiful custom sealed metal trunk. Worth every single rupee.',
      date: 'May 14, 2026',
      verified: true
    }
  ]);
  const [newReview, setNewReview] = useState({ name: '', role: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Determine a matching companion accessory for the Frequently Bought Together bundle
  const companionProduct = allProducts.find(p => p.id !== product.id && p.category === 'Bottles') ||
                           allProducts.find(p => p.id !== product.id && p.price < 12000) ||
                           allProducts.find(p => p.id !== product.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setSubmittingReview(true);
    setTimeout(() => {
      const added: Review = {
        id: `rev-user-${Date.now()}`,
        name: newReview.name,
        role: newReview.role || 'Verified Sovereign Client',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        verified: true
      };
      setReviewsList(prev => [added, ...prev]);
      setNewReview({ name: '', role: '', rating: 5, comment: '' });
      setSubmittingReview(false);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    }, 600);
  };

  // Sync color selection and active image if color changes
  useEffect(() => {
    setSelectedColor(product.colors[0]);
    setActiveImageIndex(0);
    setQuantity(1);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Regular');
    setIncludeCompanion(false);
  }, [product]);

  useEffect(() => {
    if (selectedColor.image) {
      const idx = product.images.findIndex(img => img === selectedColor.image);
      if (idx !== -1) {
        setActiveImageIndex(idx);
        // Scroll mobile container to the selected index
        if (scrollContainerRef.current) {
          const width = scrollContainerRef.current.clientWidth;
          scrollContainerRef.current.scrollTo({
            left: idx * width,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [selectedColor, product.images]);

  // Image Zoom logic for desktop hover
  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
    setZoomScale(2.0); // Deeper zoom for luxury inspection
  };

  const handleZoomLeave = () => {
    setZoomScale(1);
  };

  // Touch/swipe tracking for mobile carousel indicators
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const idx = Math.round(scrollLeft / clientWidth);
      if (idx !== activeImageIndex && idx >= 0 && idx < product.images.length) {
        setActiveImageIndex(idx);
      }
    }
  };

  // Next/prev for mobile/desktop carousel
  const handlePrevImage = () => {
    const nextIdx = activeImageIndex === 0 ? product.images.length - 1 : activeImageIndex - 1;
    setActiveImageIndex(nextIdx);
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: nextIdx * width,
        behavior: 'smooth'
      });
    }
  };

  const handleNextImage = () => {
    const nextIdx = activeImageIndex === product.images.length - 1 ? 0 : activeImageIndex + 1;
    setActiveImageIndex(nextIdx);
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: nextIdx * width,
        behavior: 'smooth'
      });
    }
  };

  // Copy product URL to share
  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setShareOpen(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }).catch(() => {
      setShareOpen(true);
    });
  };

  // Get related products (same category, excluding current product)
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // If none in the same category, get some top bestsellers
  const backupRelated = relatedProducts.length > 0 
    ? relatedProducts 
    : allProducts.filter(p => p.id !== product.id).slice(0, 4);

  // Format pricing with a dynamic luxury retail comparison
  const originalPrice = Math.round(product.price * 1.15); // Dynamic original price showing a premium 15% discount
  const savings = originalPrice - product.price;

  return (
    <div id="product-details-container" className="w-full bg-[#0B0B0B] text-white min-h-screen py-10 px-4 sm:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Back and Navigation Actions Bar */}
        <div className="flex items-center justify-between border-b border-[#C8A25D]/15 pb-5">
          <button 
            onClick={onBack}
            className="group flex items-center space-x-2 text-xs font-mono tracking-widest text-[#C8A25D] hover:text-white transition-colors duration-300 focus:outline-none cursor-pointer"
            id="back-to-listing-btn"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="uppercase font-bold">Back to Masterpieces</span>
          </button>

          <div className="flex items-center space-x-2.5 font-mono text-[10px] text-white/50">
            <span>ARZEN MAISON</span>
            <span className="text-[#C8A25D]/40">/</span>
            <span className="text-[#C8A25D] uppercase tracking-wider">{product.category}</span>
          </div>
        </div>

        {/* Primary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
          
          {/* Left Column: Touch-Swipeable Gallery, Zoom, and Visuals (5 Columns) */}
          <div className="lg:col-span-6 flex flex-col space-y-5">
            
            {/* Main Interactive Screen */}
            <div className="relative aspect-square w-full overflow-hidden bg-[#121212] rounded-xs border border-[#C8A25D]/20 group">
              
              {/* Desktop Zoom Wrapper */}
              <div 
                className="hidden md:block w-full h-full cursor-zoom-in"
                onMouseMove={handleZoomMove}
                onMouseLeave={handleZoomLeave}
              >
                <img 
                  src={product.images[activeImageIndex] || selectedColor.image} 
                  alt={`${product.name} active preview`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-150 ease-out"
                  style={{
                    transform: `scale(${zoomScale})`,
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                  }}
                />
              </div>

              {/* Mobile Touch-Swipeable Scroll Container */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="md:hidden w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
                style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
              >
                {product.images.map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-center">
                    <img 
                      src={img} 
                      alt={`${product.name} swipe view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>

              {/* Navigation arrows (shown on hover on desktop, always on mobile) */}
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#0B0B0B]/85 hover:bg-[#C8A25D] hover:text-black text-[#C8A25D] p-2 rounded-full border border-[#C8A25D]/30 transition-all duration-300 z-10 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#0B0B0B]/85 hover:bg-[#C8A25D] hover:text-black text-[#C8A25D] p-2 rounded-full border border-[#C8A25D]/30 transition-all duration-300 z-10 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Product Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                {product.isBestSeller && (
                  <span className="bg-[#C8A25D] text-[#0B0B0B] font-mono text-[8px] sm:text-[9px] font-bold px-3 py-1 tracking-[0.2em] uppercase rounded-xs shadow-md">
                    Sovereign Bestseller
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-[#0B0B0B] text-white border border-[#C8A25D]/50 font-mono text-[8px] sm:text-[9px] font-bold px-3 py-1 tracking-[0.2em] uppercase rounded-xs shadow-md">
                    New Collection
                  </span>
                )}
              </div>

              {/* Swipe/Zoom visual tips overlay */}
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1 text-[8.5px] font-mono tracking-widest text-[#C8A25D] uppercase border border-[#C8A25D]/20 rounded-xs select-none">
                <span className="md:hidden">Swipe to explore alternate views</span>
                <span className="hidden md:inline">Hover to inspect calf-skin grain</span>
              </div>
            </div>

            {/* Gallery Thumbnails List */}
            <div className="flex items-center space-x-3.5 overflow-x-auto py-1 scrollbar-thin">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    if (scrollContainerRef.current) {
                      const width = scrollContainerRef.current.clientWidth;
                      scrollContainerRef.current.scrollTo({
                        left: idx * width,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xs overflow-hidden border transition-all duration-300 flex-shrink-0 focus:outline-none cursor-pointer ${
                    activeImageIndex === idx 
                      ? 'border-[#C8A25D] scale-105 shadow-[0_0_12px_rgba(200,162,93,0.3)]' 
                      : 'border-white/10 hover:border-[#C8A25D]/50'
                  }`}
                  id={`thumbnail-${idx}`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} thumb ${idx}`} 
                    className="w-full h-full object-cover bg-black" 
                    referrerPolicy="no-referrer" 
                  />
                </button>
              ))}
            </div>

            {/* Core Trust Attributes Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="flex flex-col items-center justify-center p-3.5 rounded-xs bg-[#111] border border-[#C8A25D]/10 text-center hover:border-[#C8A25D]/30 transition-colors">
                <Shield className="w-5 h-5 text-[#C8A25D] mb-1.5" />
                <span className="text-[8px] font-mono tracking-widest uppercase text-white/40">ASSURANCE</span>
                <span className="text-[10px] font-medium text-white mt-1">Lifetime Warranty</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3.5 rounded-xs bg-[#111] border border-[#C8A25D]/10 text-center hover:border-[#C8A25D]/30 transition-colors">
                <Truck className="w-5 h-5 text-[#C8A25D] mb-1.5" />
                <span className="text-[8px] font-mono tracking-widest uppercase text-white/40">DELIVERY</span>
                <span className="text-[10px] font-medium text-white mt-1">Free Priority Cargo</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3.5 rounded-xs bg-[#111] border border-[#C8A25D]/10 text-center hover:border-[#C8A25D]/30 transition-colors">
                <RotateCcw className="w-5 h-5 text-[#C8A25D] mb-1.5" />
                <span className="text-[8px] font-mono tracking-widest uppercase text-white/40">RETURNS</span>
                <span className="text-[10px] font-medium text-white mt-1">7-Day Doorstep Pickup</span>
              </div>
            </div>

          </div>

          {/* Right Column: Descriptions, Purchasing Options, Technical Specifications (7 Columns) */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Header Product Titles */}
            <div className="space-y-3.5 border-b border-[#C8A25D]/15 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#C8A25D] uppercase font-bold">
                  CATEGORY: {product.category}
                </span>
                <div className="flex items-center space-x-1.5">
                  <div className="flex items-center space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating) 
                            ? 'fill-[#C8A25D] text-[#C8A25D]' 
                            : 'text-white/20'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-white/80">{product.rating}</span>
                  <span className="text-[10px] font-mono text-white/40">({product.reviewsCount} Sovereign Appraisals)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-white uppercase leading-tight">
                {product.name}
              </h1>

              <p className="text-[#C8A25D] font-mono text-xs tracking-widest uppercase font-bold italic">
                “ {product.tagline} ”
              </p>
            </div>

            {/* Pricing Section with Premium Struck-out Allocation Values */}
            <div className="bg-[#111] border border-[#C8A25D]/15 p-5 rounded-xs space-y-3">
              <div className="flex items-baseline space-x-4">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                  {formatPrice(product.price, currency)}
                </span>
                <span className="text-sm font-mono text-white/40 line-through">
                  {formatPrice(originalPrice, currency)}
                </span>
                <span className="text-[10px] font-mono bg-[#C8A25D]/15 text-[#C8A25D] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                  15% SPECIAL ATELIER ALLOCATION BENEFIT
                </span>
              </div>
              <p className="text-[10.5px] font-mono text-white/50 leading-relaxed">
                Save <strong className="text-white">{formatPrice(savings, currency)}</strong> immediately via this exclusive direct digital commission channel. Inclusive of all GST, customs duties, and bespoke protective dust-casing.
              </p>
            </div>

            {/* Live Inventory Status / SKU / Code Details */}
            <div className="grid grid-cols-2 gap-4 border-b border-[#C8A25D]/15 pb-6">
              <div>
                <span className="block text-[8.5px] font-mono tracking-widest uppercase text-white/40">Stock Status</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${
                    product.stock && product.stock <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                  }`} />
                  <span className="text-xs font-mono font-semibold">
                    {product.stock && product.stock <= 5 
                      ? `CRITICAL STOCK: Only ${product.stock} pieces remain in Bokaro` 
                      : 'Active Allocation — Handmade To Order'}
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-[8.5px] font-mono tracking-widest uppercase text-white/40">Masterpiece SKU Identifier</span>
                <span className="block text-xs font-mono text-[#C8A25D] font-bold mt-1 uppercase">
                  {product.sku || `ARZ-LXP-${product.id}`}
                </span>
              </div>
            </div>

            {/* Full Product Narrative Description */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono tracking-[0.25em] text-[#C8A25D] uppercase font-bold">
                Maison Narrative
              </h3>
              <p className="text-sm text-white/80 leading-relaxed font-sans font-light">
                {product.description}
              </p>
            </div>

            {/* Color Swatches Selection */}
            <div className="space-y-4 border-t border-[#C8A25D]/15 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A25D] font-bold">
                  Select Leather Hide Variant
                </span>
                <span className="text-[11px] font-mono text-white/50 bg-[#161616] px-2.5 py-1 border border-white/5 rounded-xs uppercase">
                  Selected: <strong className="text-white">{selectedColor.name}</strong>
                </span>
              </div>
              
              <div className="flex items-center space-x-3.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-8 h-8 rounded-full border transition-all duration-300 focus:outline-none cursor-pointer flex items-center justify-center ${
                      selectedColor.name === color.name
                        ? 'border-[#C8A25D] scale-110 shadow-[0_0_12px_rgba(200,162,93,0.4)]'
                        : 'border-white/15 hover:border-[#C8A25D]/50 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <span className="absolute inset-0.5 rounded-full border border-black flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Architectural Size Selection */}
            <div className="space-y-4 border-t border-[#C8A25D]/15 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A25D] font-bold">
                  Select Architectural Size
                </span>
                <span className="text-[11px] font-mono text-white/50 bg-[#161616] px-2.5 py-1 border border-white/5 rounded-xs uppercase">
                  Selected: <strong className="text-white">{selectedSize}</strong>
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                {(product.sizes || ['Regular', 'Grande', 'Mini']).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 border font-mono text-[10.5px] font-bold tracking-wider rounded-xs uppercase transition-all duration-300 cursor-pointer min-h-[38px] ${
                      selectedSize === sz
                        ? 'bg-[#C8A25D] text-[#0B0B0B] border-[#C8A25D] shadow-[0_0_12px_rgba(200,162,93,0.35)]'
                        : 'bg-transparent border-white/10 text-white/70 hover:border-[#C8A25D]/50 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequently Bought Together (FBT) Bundle Deal widget */}
            {companionProduct && (
              <div className="border border-[#C8A25D]/20 bg-[#0F0F0F] p-4.5 rounded-xs space-y-3.5 border-t">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#C8A25D] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A25D] font-bold">
                    FREQUENTLY BOUGHT TOGETHER (10% BUNDLE BENEFIT)
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-black/40 p-1 rounded-xs">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 object-cover bg-black rounded-xs border border-white/5" 
                    />
                    <span className="text-lg font-light text-white/40 font-sans">+</span>
                    <img 
                      src={companionProduct.images[0]} 
                      alt={companionProduct.name} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 object-cover bg-black rounded-xs border border-[#C8A25D]/30" 
                    />
                  </div>
                  <div className="flex-1 text-xs space-y-0.5">
                    <span className="text-white/40 block font-mono text-[9px] tracking-wider">COMPANION CO-ORDINATE</span>
                    <strong className="text-white font-medium block leading-snug">{companionProduct.name}</strong>
                    <span className="text-white/50 font-sans font-light text-[11px] block">
                      Enhance your carry collection by matching with this premium accessory.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 select-none">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
                    <input 
                      type="checkbox" 
                      checked={includeCompanion}
                      onChange={(e) => setIncludeCompanion(e.target.checked)}
                      className="accent-[#C8A25D] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-white/80 font-light font-sans text-xs">
                      Acquire matching {companionProduct.name} together (Save 10% on Bundle)
                    </span>
                  </label>
                </div>

                {includeCompanion && (
                  <div className="p-3 bg-[#C8A25D]/10 border border-[#C8A25D]/35 rounded-xs flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60 font-sans">Set Bundle Price:</span>
                    <div className="text-right space-x-1.5">
                      <span className="text-white/30 line-through text-[11px]">
                        {formatPrice(product.price + companionProduct.price, currency)}
                      </span>
                      <strong className="text-[#C8A25D] font-bold text-sm">
                        {formatPrice(Math.round((product.price + companionProduct.price) * 0.9), currency)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantitative Selection & Purchasing Control Deck */}
            <div className="bg-[#0F0F0F] border border-white/5 p-5 rounded-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                
                {/* Quantity Incrementor */}
                <div className="flex items-center border border-[#C8A25D]/30 bg-[#111] rounded-xs select-none w-full sm:w-auto justify-between min-h-[44px]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-4 py-2.5 text-white/60 hover:text-white disabled:opacity-30 cursor-pointer focus:outline-none"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-6 font-mono font-bold text-xs">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2.5 text-white/60 hover:text-white cursor-pointer focus:outline-none"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Wishlist Toggle Action */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xs border transition-all duration-300 flex items-center justify-center space-x-2 text-xs font-mono tracking-wider font-bold uppercase cursor-pointer min-h-[44px] ${
                    isWishlisted 
                      ? 'bg-[#C8A25D]/15 border-[#C8A25D] text-[#C8A25D]' 
                      : 'bg-transparent border-[#C8A25D]/30 text-white/70 hover:text-white hover:border-[#C8A25D]'
                  }`}
                  id={`wishlist-toggle-details`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C8A25D]' : ''}`} />
                  <span>{isWishlisted ? 'SAVED IN VAULT' : 'ADD TO VAULT'}</span>
                </button>

                {/* Share Product Action */}
                <button
                  onClick={handleShareClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xs border border-white/10 hover:border-[#C8A25D] text-white/70 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 text-xs font-mono tracking-wider font-bold uppercase cursor-pointer min-h-[44px] relative"
                  title="Share masterpiece"
                  id="share-masterpiece-btn"
                >
                  <Share2 className="w-4 h-4 text-[#C8A25D]" />
                  <span>{isCopied ? 'LINK COPIED' : 'SHARE'}</span>

                  {/* Share Confirmation Tooltip */}
                  {shareOpen && (
                    <div className="absolute bottom-full mb-2 bg-[#121212] border border-[#C8A25D]/40 p-3 rounded-xs shadow-2xl z-20 text-[10px] w-56 text-left animate-fade-in space-y-2">
                      <div className="flex items-center justify-between text-white border-b border-white/5 pb-1.5 font-sans">
                        <span className="font-semibold uppercase tracking-wide">Share Masterpiece</span>
                        <button onClick={(e) => { e.stopPropagation(); setShareOpen(false); }} className="text-white/40 hover:text-white">✕</button>
                      </div>
                      <p className="text-white/60 font-sans leading-normal">
                        Copied direct secure URL! You can paste the link to send this premium piece to your associates.
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const text = `Take a look at the ARZEN ${product.name}: ${window.location.href}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
                        }}
                        className="w-full py-1 bg-[#25D366] text-black font-sans font-bold rounded-xs text-[9px] uppercase tracking-wide text-center block"
                      >
                        Send via WhatsApp
                      </button>
                    </div>
                  )}
                </button>

              </div>

              {/* Huge Golden Button Call to Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedColor, quantity, selectedSize);
                    if (includeCompanion && companionProduct) {
                      onAddToCart(companionProduct, companionProduct.colors[0], 1, companionProduct.sizes?.[0] || 'Regular');
                    }
                  }}
                  className="w-full py-4 bg-[#141414] hover:bg-[#C8A25D] text-white hover:text-[#0B0B0B] border border-[#C8A25D]/40 hover:border-transparent text-[11px] font-bold tracking-widest uppercase transition-all duration-300 rounded-xs flex items-center justify-center space-x-2 focus:outline-none cursor-pointer min-h-[50px] shadow-lg shadow-black/50"
                  id="add-to-bag-details-btn"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO SHOPPING BAG</span>
                </button>
                
                <button
                  onClick={() => {
                    onBuyNow(product, selectedColor, quantity, selectedSize);
                    if (includeCompanion && companionProduct) {
                      onAddToCart(companionProduct, companionProduct.colors[0], 1, companionProduct.sizes?.[0] || 'Regular');
                    }
                  }}
                  className="w-full py-4 bg-[#C8A25D] hover:bg-white text-[#0B0B0B] text-[11px] font-bold tracking-widest uppercase transition-all duration-300 rounded-xs flex items-center justify-center focus:outline-none cursor-pointer min-h-[50px] shadow-lg shadow-[#C8A25D]/10"
                  id="buy-now-details-btn"
                >
                  <span>COMMISSION IMMEDIATELY (BUY NOW)</span>
                </button>
              </div>
            </div>

            {/* Delivery estimate */}
            <div className="p-4 bg-[#0F0F0F] border border-[#C8A25D]/10 rounded-xs flex items-center space-x-3.5">
              <Truck className="w-5 h-5 text-[#C8A25D] flex-shrink-0" />
              <div className="text-xs">
                <strong className="text-white block font-mono uppercase text-[9px] tracking-wider text-[#C8A25D] mb-0.5">DHL Air-Priority Express Delivery Estimate:</strong>
                <span className="text-white/60 font-light font-sans text-[11px]">
                  Bespoke shipment packing complete. Delivered to your doorstep by{' '}
                  <strong className="text-white font-mono font-bold">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </strong>{' '}
                  (Complimentary Secure Express).
                </span>
              </div>
            </div>

            {/* Specifications, Structural Dimensions, and Material Breakdown Accordion */}
            <div className="border border-white/10 rounded-xs overflow-hidden divide-y divide-white/5">
              
              {/* Materials Spec */}
              <div className="p-4 bg-[#0E0E0E]/50 space-y-2">
                <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold">
                  Bespoke Materials Breakdown
                </h4>
                <ul className="space-y-1.5 text-xs text-white/70 pl-3.5 list-disc font-sans font-light">
                  {product.materials ? product.materials.map((m, i) => (
                    <li key={i}>{m}</li>
                  )) : (
                    <>
                      <li>Double-faced full-grain French calfskin hides</li>
                      <li>Threaded with heavy-duty German nylon saddle stitch</li>
                      <li>Sash-locked golden brass heavy duty solid alloy zippers</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Dimensions & Capacity Spec */}
              <div className="p-4 bg-[#0E0E0E]/50 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold mb-1.5">
                    Structural Dimensions
                  </h4>
                  <span className="block text-xs text-white/80 font-mono">
                    {product.dimensions || '14.5" W x 11.2" H x 6.3" D'}
                  </span>
                </div>
                <div>
                  <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold mb-1.5">
                    Internal Volume Capacity
                  </h4>
                  <span className="block text-xs text-white/80 font-mono">
                    {product.capacity || '16 Liters'}
                  </span>
                </div>
              </div>

              {/* Features Specs list */}
              <div className="p-4 bg-[#0E0E0E]/50 space-y-2">
                <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold">
                  Distinguished Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/70">
                  {product.features ? product.features.map((f, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C8A25D] flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  )) : (
                    <>
                      <div className="flex items-start space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#C8A25D] flex-shrink-0 mt-0.5" />
                        <span>Dedicated padded digital laptop sleeve</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#C8A25D] flex-shrink-0 mt-0.5" />
                        <span>Saddle-stitched handles for heavy support</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Warranty, Logistics, and Policy Info */}
              <div className="p-4 bg-[#0E0E0E]/50 grid grid-cols-1 sm:grid-cols-3 gap-4.5 text-[10.5px]">
                <div className="space-y-1">
                  <span className="block font-mono tracking-widest uppercase text-[#C8A25D] font-bold">WARRANTY</span>
                  <p className="text-white/60 leading-normal font-sans font-light">
                    {product.warranty || 'Lifetime repair or replace assurance covering snaps, stitches, and lock hardware.'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block font-mono tracking-widest uppercase text-[#C8A25D] font-bold">LOGISTICS</span>
                  <p className="text-white/60 leading-normal font-sans font-light">
                    {product.shipping || 'Priority air delivery via secure partner network inside sealed custom rigid cases.'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block font-mono tracking-widest uppercase text-[#C8A25D] font-bold">RETURNS</span>
                  <p className="text-white/60 leading-normal font-sans font-light">
                    {product.returnEnabled !== false ? (
                      <>Complimentary {product.returnDays || 7}-day return or {product.replacementEnabled !== false ? 'replacement' : 'repair'} pick-up if the allocation does not fit perfectly.</>
                    ) : (
                      <span className="text-[#FF5A5F] font-medium">Bespoke allocation sale. No returns or cancellations permitted.</span>
                    )}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Customer Ratings & Live Reviews Portal */}
        <div className="border-t border-[#C8A25D]/15 pt-12 space-y-8 select-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Reviews list - 7 Columns */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-semibold">
                  Sovereign Client Feedbacks
                </span>
                <h3 className="text-xl font-serif font-light text-white uppercase tracking-wider">
                  Client Appraisals ({reviewsList.length})
                </h3>
              </div>

              <div className="space-y-4 divide-y divide-white/5">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-white text-xs block font-mono uppercase tracking-wide">{rev.name}</strong>
                        <span className="text-[10px] text-white/45 font-light">{rev.role}</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-0.5 justify-end mb-1">
                          {[...Array(5)].map((_, rIdx) => (
                            <Star 
                              key={rIdx} 
                              className={`w-3 h-3 ${rIdx < rev.rating ? 'fill-[#C8A25D] text-[#C8A25D]' : 'text-white/10'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[9px] text-[#C8A25D]/80 font-mono">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 font-light leading-relaxed font-sans italic">
                      “ {rev.comment} ”
                    </p>
                    <div className="flex items-center space-x-1.5 text-[9px] text-green-500 font-mono tracking-wider uppercase font-bold">
                      <Check className="w-3 h-3" />
                      <span>Verified Acquisition Registry</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appraisal Registration - 5 Columns */}
            <div className="lg:col-span-5 bg-[#0E0E0E] border border-[#C8A25D]/15 p-5 rounded-xs space-y-4">
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold block">CLIENT REGISTRY</span>
                <h4 className="text-sm font-mono text-white uppercase font-bold">Record Your Appraisement</h4>
                <p className="text-[11px] text-white/40 font-sans leading-normal">
                  Your feedback helps maintain the high material and stitching standards of our Bokaro steel city atelier.
                </p>
              </div>

              {reviewSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-[10.5px] text-center font-mono uppercase">
                  Appraisement submitted successfully to our Bokaro headquarters ledger!
                </div>
              )}

              <form onSubmit={handleAddReview} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Star Assessment</label>
                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        type="button"
                        key={stars}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: stars }))}
                        className="focus:outline-none cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${stars <= newReview.rating ? 'fill-[#C8A25D] text-[#C8A25D]' : 'text-white/20 hover:text-[#C8A25D]/60'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Sovereign Client Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="E.g., Devashish Sen"
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#141414] border border-white/10 focus:border-[#C8A25D] rounded-xs px-3 py-2 text-white font-mono placeholder-white/10 uppercase focus:outline-none text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Corporate Title / Private Role</label>
                  <input 
                    type="text" 
                    placeholder="E.g., Managing Partner, BCG"
                    value={newReview.role}
                    onChange={(e) => setNewReview(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-[#141414] border border-white/10 focus:border-[#C8A25D] rounded-xs px-3 py-2 text-white font-mono placeholder-white/10 uppercase focus:outline-none text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Bespoke Feedback Comment</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Describe your tactile, structural, and stitching observations..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full bg-[#141414] border border-white/10 focus:border-[#C8A25D] rounded-xs px-3 py-2 text-white font-sans placeholder-white/10 focus:outline-none text-[11px] leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3 bg-[#C8A25D] hover:bg-white text-black font-mono font-bold uppercase tracking-wider text-[10px] transition-colors rounded-xs flex items-center justify-center space-x-1.5 focus:outline-none cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? 'RECORDING LEDGER...' : 'SUBMIT BESPOKE APPRAISEMENT'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="border-t border-[#C8A25D]/15 pt-12 space-y-8 select-none">
          <div className="text-center md:text-left max-w-xl space-y-2">
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-semibold">
              ACCOMPANYING SILHOUETTES
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-white tracking-wide uppercase">
              Related <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCEECB] via-[#C8A25D] to-[#A37E3E] font-medium italic">Masterpieces</span>
            </h2>
            <p className="text-xs text-white/50 font-sans font-light">
              Complete your bespoke carry collection with our perfectly aligned, matching premium accessories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {backupRelated.map((relProduct) => (
              <div 
                key={relProduct.id} 
                onClick={() => {
                  onNavigateToProduct(relProduct);
                }}
                className="cursor-pointer"
              >
                <ProductCard
                  product={relProduct}
                  onQuickView={() => onNavigateToProduct(relProduct)}
                  onAddToCart={(p, col, qty, size) => onAddToCart(p, col, qty, size)}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={isWishlisted}
                  currency={currency}
                  onBuyNow={(p, col, qty, size) => onBuyNow(p, col, qty, size)}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
