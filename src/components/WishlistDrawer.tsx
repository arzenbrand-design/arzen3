import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  currency: 'INR' | 'USD' | 'EUR';
  setView: (view: 'home' | 'shop' | 'about' | 'contact') => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  currency,
  setView,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  const handleStartShopping = () => {
    setView('shop');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-0 overflow-hidden">
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md bg-[#0B0B0B] border-l border-[#C8A25D]/25 shadow-2xl flex flex-col h-full text-white">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#C8A25D]/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-[#C8A25D]" />
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase font-bold text-white">
                  Your Wishlist ({wishlistItems.length})
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-[#C8A25D] hover:text-white transition-colors focus:outline-none cursor-pointer"
                title="Close Wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#111] border border-[#C8A25D]/15 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#C8A25D]/60" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono tracking-widest uppercase text-white font-semibold">
                      Your Wishlist is Empty
                    </h3>
                    <p className="text-xs text-white/45 mt-2 max-w-[240px] font-light leading-relaxed">
                      Collect and keep track of premium ARZEN designs that you admire.
                    </p>
                  </div>
                  <button
                    onClick={handleStartShopping}
                    className="mt-2 px-6 py-2.5 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none cursor-pointer rounded-xs"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                wishlistItems.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-start space-x-4 pb-4 border-b border-white/5 last:border-0"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-24 rounded-xs overflow-hidden bg-[#111] border border-white/5 flex-shrink-0">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Information */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-medium text-white tracking-wide line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product)}
                          className="text-white/40 hover:text-red-500 transition-colors p-1 -mt-1 cursor-pointer focus:outline-none"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[9px] text-[#C8A25D] font-mono tracking-wider uppercase mt-0.5">
                        {product.category}
                      </span>

                      <div className="text-xs font-bold font-mono text-white mt-1.5">
                        {formatPrice(product.price, currency)}
                      </div>

                      {/* Direct Add to Cart Action inside wishlist */}
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveFromWishlist(product);
                        }}
                        className="mt-3.5 py-1.5 px-3 bg-[#111] hover:bg-[#C8A25D] text-[#C8A25D] hover:text-[#0B0B0B] border border-[#C8A25D]/20 hover:border-transparent text-[9px] font-mono font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-1 focus:outline-none cursor-pointer rounded-xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Wishlist Footer */}
            {wishlistItems.length > 0 && (
              <div className="p-6 border-t border-[#C8A25D]/10 bg-[#0F0F0F] text-center">
                <button
                  onClick={() => {
                    setView('shop');
                    onClose();
                  }}
                  className="w-full py-3.5 bg-transparent text-[#C8A25D] hover:text-white border border-[#C8A25D]/25 hover:border-white/50 text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 rounded-xs focus:outline-none cursor-pointer"
                >
                  View Full Catalog
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
