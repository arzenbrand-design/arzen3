import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Heart, Shield, Truck, RotateCcw, ChevronDown, ChevronUp, Star, ShoppingBag } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatPrice } from '../utils';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: ProductColor, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  currency: 'INR' | 'USD' | 'EUR';
  onBuyNow: (product: Product, selectedColor: ProductColor, quantity: number) => void;
}

type AccordionSection = 'details' | 'materials' | 'dimensions' | 'shipping';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  currency,
  onBuyNow,
}: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<AccordionSection | null>('details');
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Sync active image if color is changed
  useEffect(() => {
    if (selectedColor.image) {
      const idx = product.images.findIndex(img => img === selectedColor.image);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  }, [selectedColor, product.images]);

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
    setZoomScale(1.8);
  };

  const handleZoomLeave = () => {
    setZoomScale(1);
  };

  const toggleAccordion = (section: AccordionSection) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Dark Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-[#0B0B0B] border border-[#C8A25D]/25 rounded-xs w-full max-w-5xl shadow-2xl overflow-hidden z-10 text-white flex flex-col md:flex-row my-8 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-[#C8A25D] hover:text-black text-[#C8A25D] border border-[#C8A25D]/20 p-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer"
          title="Close Modal"
          id="close-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Section: Gallery (Images) */}
        <div className="w-full md:w-1/2 p-6 flex flex-col border-b md:border-b-0 md:border-r border-[#C8A25D]/10">
          
          {/* Main Visual Viewer with Zoom Effect */}
          <div 
            className="relative aspect-square w-full overflow-hidden bg-[#121212] rounded-xs border border-[#C8A25D]/10 cursor-zoom-in"
            onMouseMove={handleZoomMove}
            onMouseLeave={handleZoomLeave}
          >
            <img 
              src={product.images[activeImageIndex] || selectedColor.image} 
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
              }}
            />

            {/* Badge overlay inside details */}
            {product.isBestSeller && (
              <span className="absolute top-3 left-3 bg-[#C8A25D] text-[#0B0B0B] font-mono text-[9px] font-bold px-3 py-1 tracking-[0.15em] uppercase rounded-xs">
                Best Seller
              </span>
            )}
          </div>

          {/* Gallery Thumbnails List */}
          <div className="flex items-center space-x-3 mt-4 overflow-x-auto pb-1 scrollbar-thin">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-16 rounded-xs overflow-hidden border transition-all duration-300 flex-shrink-0 focus:outline-none cursor-pointer ${
                  activeImageIndex === idx 
                    ? 'border-[#C8A25D] scale-105' 
                    : 'border-white/10 hover:border-[#C8A25D]/50'
                }`}
              >
                <img src={img} alt={`${product.name} preview`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          {/* Key Value Badges */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/5">
            <div className="flex flex-col items-center justify-center p-3 rounded-xs bg-[#111] border border-white/5 text-center">
              <Shield className="w-5 h-5 text-[#C8A25D] mb-1.5" />
              <span className="text-[9px] font-mono tracking-widest uppercase text-white/50">Lifetime</span>
              <span className="text-[10px] font-medium text-white mt-0.5">Warranty</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xs bg-[#111] border border-white/5 text-center">
              <Truck className="w-5 h-5 text-[#C8A25D] mb-1.5" />
              <span className="text-[9px] font-mono tracking-widest uppercase text-white/50">Complementary</span>
              <span className="text-[10px] font-medium text-white mt-0.5">Express Shipping</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xs bg-[#111] border border-white/5 text-center">
              <RotateCcw className="w-5 h-5 text-[#C8A25D] mb-1.5" />
              <span className="text-[9px] font-mono tracking-widest uppercase text-white/50">7-Day</span>
              <span className="text-[10px] font-medium text-white mt-0.5">Hassle-Free Returns</span>
            </div>
          </div>
        </div>

        {/* Right Section: Purchase Config & Accordion Specs */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between max-h-none md:max-h-[90vh] overflow-y-auto">
          <div>
            {/* Category Path & Rating */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A25D] font-semibold">
                Collection &gt; {product.category}
              </span>
              <div className="flex items-center space-x-1.5 bg-[#111] border border-white/5 px-2.5 py-1 rounded-sm">
                <Star className="w-3.5 h-3.5 fill-[#C8A25D] text-[#C8A25D]" />
                <span className="text-xs text-white font-mono font-semibold">{product.rating}</span>
                <span className="text-[10px] text-white/40">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl font-sans font-medium tracking-wide text-white">
              {product.name}
            </h1>
            <p className="text-xs text-white/50 italic tracking-wider mt-0.5">
              {product.tagline}
            </p>

            {/* Price block */}
            <div className="my-4 flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-[#C8A25D] tracking-wider">
                {formatPrice(product.price, currency)}
              </span>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Inclusive of all taxes
              </span>
            </div>

            {/* Brief brand description */}
            <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
              {product.description}
            </p>

            {/* Swatch Selector Area */}
            <div className="mb-6">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C8A25D] block mb-2">
                Color Options: <span className="text-white ml-1">{selectedColor.name}</span>
              </span>
              <div className="flex items-center space-x-3.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border transition-all duration-300 focus:outline-none cursor-pointer flex items-center justify-center ${
                      selectedColor.name === color.name 
                        ? 'border-[#C8A25D] scale-110 shadow-lg shadow-[#C8A25D]/20' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Custom Accordion Sections (Collapse Panel) */}
            <div className="space-y-3.5 mb-6 border-t border-white/5 pt-4">
              
              {/* Accordion Item 1: Description & Structural Features */}
              <div className="border-b border-white/5 pb-3">
                <button 
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-widest text-[#C8A25D] py-1 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  <span>Key Features & Design</span>
                  {activeAccordion === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'details' && (
                  <div className="mt-2 text-xs text-white/70 leading-relaxed font-light pl-1 space-y-1">
                    {product.features.map((feature, i) => (
                      <p key={i} className="flex items-start">
                        <span className="text-[#C8A25D] mr-2">•</span>
                        <span>{feature}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion Item 2: Premium materials */}
              <div className="border-b border-white/5 pb-3">
                <button 
                  onClick={() => toggleAccordion('materials')}
                  className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-widest text-[#C8A25D] py-1 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  <span>Sovereign Materials</span>
                  {activeAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'materials' && (
                  <div className="mt-2 text-xs text-white/70 leading-relaxed font-light pl-1 space-y-1">
                    {product.materials.map((mat, i) => (
                      <p key={i} className="flex items-start">
                        <span className="text-[#C8A25D] mr-2">✦</span>
                        <span>{mat}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion Item 3: Dimensions */}
              <div className="border-b border-white/5 pb-3">
                <button 
                  onClick={() => toggleAccordion('dimensions')}
                  className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-widest text-[#C8A25D] py-1 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  <span>Dimensions & Fit Capacity</span>
                  {activeAccordion === 'dimensions' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'dimensions' && (
                  <div className="mt-2 text-xs text-white/70 leading-relaxed font-light pl-1 space-y-1.5">
                    <p><strong className="text-[#C8A25D]">Dimensions:</strong> {product.dimensions}</p>
                    <p><strong className="text-[#C8A25D]">Capacity Volume:</strong> {product.capacity}</p>
                  </div>
                )}
              </div>

              {/* Accordion Item 4: Delivery, Warranty & Returns */}
              <div className="border-b border-[#C8A25D]/10 pb-3">
                <button 
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-widest text-[#C8A25D] py-1 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  <span>Complementary Delivery & Warranty</span>
                  {activeAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="mt-2 text-xs text-white/70 leading-relaxed font-light pl-1 space-y-2">
                    <p><strong className="text-[#C8A25D]">Lifetime Warranty:</strong> {product.warranty}</p>
                    <p><strong className="text-[#C8A25D]">Shipping:</strong> {product.shipping}</p>
                    <p><strong className="text-[#C8A25D]">Returns:</strong> {product.returns}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Purchase Configuration (Counter, Buy & Cart buttons) */}
          <div className="border-t border-[#C8A25D]/25 pt-6 mt-6 bg-[#0B0B0B]/90">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
              
              {/* Quantity Changer */}
              <div className="flex items-center justify-between sm:justify-start border border-[#C8A25D]/20 rounded-xs bg-[#111] p-1.5 sm:w-auto w-full">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="p-1 text-[#C8A25D] hover:text-white transition-colors disabled:opacity-30 cursor-pointer focus:outline-none"
                  disabled={quantity <= 1}
                  title="Decrease Quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-bold font-mono min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-[#C8A25D] hover:text-white transition-colors cursor-pointer focus:outline-none"
                  title="Increase Quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Wishlist Button in Details */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-xs border transition-all duration-300 flex items-center justify-center cursor-pointer focus:outline-none flex-grow sm:flex-grow-0 ${
                  isWishlisted 
                    ? 'border-red-600/50 bg-red-600/10 text-red-500 hover:bg-red-600/20' 
                    : 'border-white/10 hover:border-[#C8A25D]/50 hover:bg-white/5 text-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                <span className="sm:hidden ml-2 font-mono text-[10px] uppercase tracking-wider">Wishlist</span>
              </button>
            </div>

            {/* Split Direct Checkout & Cart Buttons */}
            <div className="grid grid-cols-2 gap-3.5 mt-4">
              <button
                onClick={() => onAddToCart(product, selectedColor, quantity)}
                className="w-full py-3.5 bg-[#141414] hover:bg-[#C8A25D] text-white hover:text-[#0B0B0B] border border-[#C8A25D]/20 hover:border-transparent text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none cursor-pointer rounded-xs"
                id={`modal-add-to-cart-${product.id}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              
              <button
                onClick={() => onBuyNow(product, selectedColor, quantity)}
                className="w-full py-3.5 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white hover:text-black font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center focus:outline-none cursor-pointer rounded-xs"
                id={`modal-buy-now-${product.id}`}
              >
                <span>Checkout Now</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
