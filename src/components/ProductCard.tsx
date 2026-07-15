import React, { useState } from 'react';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatPrice } from '../utils';
import { ARZENLogo } from './Header';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: ProductColor) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  currency: 'INR' | 'USD' | 'EUR';
  onBuyNow: (product: Product, selectedColor: ProductColor) => void;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  currency,
  onBuyNow,
  onClick,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);

  // When color is changed, we can display the specific image for that color if available, or fall back to main/alt.
  const displayImage = selectedColor.image || product.images[0];
  const hoverImage = product.images[1] || displayImage;

  const handleCardClick = (e: React.MouseEvent) => {
    // If the click is inside buttons, do nothing
    if (onClick) {
      onClick(product);
    } else {
      onQuickView(product);
    }
  };

  return (
    <div
      id={`product-${product.id}`}
      onClick={handleCardClick}
      className="group relative border border-[#C8A25D]/15 hover:border-[#C8A25D]/70 bg-gradient-to-b from-[#141414] to-[#080808] rounded-xs overflow-hidden flex flex-col h-full shadow-lg hover:shadow-[0_0_25px_rgba(200,162,93,0.25)] transition-all duration-500 ease-out hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111111] select-none">
        {/* Main Product Image */}
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 ${
            isHovered && product.images[1] ? 'opacity-0 scale-95' : 'opacity-100'
          }`}
        />

        {/* Hover Product Image (Alternative Angle) */}
        {product.images[1] && (
          <img
            src={hoverImage}
            alt={`${product.name} alternate`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        )}

        {/* Shadow overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />

        {/* Product Badges */}
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-[#C8A25D] text-[#0B0B0B] font-mono text-[8px] font-bold px-2 py-0.5 tracking-[0.15em] uppercase rounded-xs shadow-md">
            Best Seller
          </span>
        )}
        {product.isNewArrival && !product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-[#0B0B0B] text-white border border-[#C8A25D]/50 font-mono text-[8px] font-bold px-2 py-0.5 tracking-[0.15em] uppercase rounded-xs shadow-md">
            New Arrival
          </span>
        )}

        {/* ARZEN Signature metal brand plaque */}
        <div className="absolute bottom-3 left-3 z-10 bg-[#070707]/90 backdrop-blur-md border border-[#C8A25D]/40 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xs flex items-center justify-center shadow-lg pointer-events-none transition-all duration-300 group-hover:border-[#C8A25D]/70">
          <ARZENLogo className="h-4 sm:h-4.5" onlyIcon={true} color="gold" />
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[#0B0B0B]/60 hover:bg-[#0B0B0B] text-white hover:text-[#C8A25D] border border-white/5 hover:border-[#C8A25D]/40 transition-all duration-300 focus:outline-none cursor-pointer"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          id={`wishlist-toggle-${product.id}`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-300 ${
              isWishlisted ? 'fill-[#C8A25D] text-[#C8A25D] scale-110' : 'text-white'
            }`}
          />
        </button>

        {/* Quick View Quick-Action Overlay (Slide Up on desktop hover) */}
        <div className="absolute inset-x-0 bottom-0 bg-black/85 backdrop-blur-xs border-t border-[#C8A25D]/20 py-3 px-4 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-white hover:text-[#C8A25D] transition-colors duration-300 cursor-pointer focus:outline-none"
            id={`quick-view-btn-${product.id}`}
          >
            <Eye className="w-4 h-4 text-[#C8A25D]" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Mobile Quick View Action Dot (Visible always on mobile) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="md:hidden absolute bottom-3 right-3 p-2 rounded-full bg-[#0B0B0B]/80 text-[#C8A25D] border border-[#C8A25D]/30 shadow-lg"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Information Details */}
      <div className="p-4 flex flex-col flex-grow bg-transparent">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-[#C8A25D] tracking-widest uppercase font-mono font-medium">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-[#C8A25D] text-[#C8A25D]" />
            <span className="text-[10px] text-white/80 font-mono font-semibold">
              {product.rating}
            </span>
          </div>
        </div>

        <h3 className="text-sm font-sans font-medium text-white tracking-wide mt-1.5 group-hover:text-[#C8A25D] transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-[10.5px] text-white/50 italic mt-0.5 line-clamp-1 font-light">
          {product.tagline}
        </p>

        {/* Color Swatch Selector Dots */}
        <div className="flex items-center space-x-2.5 mt-3 mb-2">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(color);
              }}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 focus:outline-none cursor-pointer flex items-center justify-center ${
                selectedColor.name === color.name
                  ? 'border-[#C8A25D] scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase">
            {selectedColor.name}
          </span>
        </div>

        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[13.5px] font-semibold text-white tracking-wider font-mono">
            {formatPrice(product.price, currency)}
          </span>
          <span className="text-[9px] text-white/40 font-mono">
            ({product.reviewsCount} reviews)
          </span>
        </div>
      </div>

      {/* Actions Split Button Grid (Mobile & Desktop Touch Targets) */}
      <div className="flex w-full mt-auto text-center border-t border-[#C8A25D]/10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, selectedColor);
          }}
          className="w-1/2 py-3.5 sm:py-3 bg-[#141414] hover:bg-[#C8A25D] text-white hover:text-[#0B0B0B] text-[9.5px] font-bold tracking-widest uppercase transition-all duration-300 border-r border-[#C8A25D]/15 flex items-center justify-center space-x-1 focus:outline-none cursor-pointer min-h-[44px]"
          id={`add-to-cart-${product.id}`}
        >
          <ShoppingCart className="w-3 h-3" />
          <span>Add to Bag</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBuyNow(product, selectedColor);
          }}
          className="w-1/2 py-3.5 sm:py-3 bg-[#0B0B0B] hover:bg-white text-[#C8A25D] hover:text-[#0B0B0B] text-[9.5px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center focus:outline-none cursor-pointer min-h-[44px]"
          id={`buy-now-${product.id}`}
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
