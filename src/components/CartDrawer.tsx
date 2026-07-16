import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Gift, Lock } from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice } from '../utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  currency: 'INR' | 'USD' | 'EUR';
  setView: (view: 'home' | 'shop' | 'about' | 'contact') => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currency,
  setView,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalINR = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Luxury Embellishment: custom gold embossing unlock threshold (INR 25,000)
  const unlockThreshold = 25000;
  const progressPercent = Math.min((totalINR / unlockThreshold) * 100, 100);
  const remainingINR = Math.max(unlockThreshold - totalINR, 0);

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
                <ShoppingBag className="w-5 h-5 text-[#C8A25D]" />
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase font-bold text-white">
                  Your Bag ({cartItems.length})
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-[#C8A25D] hover:text-white transition-colors focus:outline-none cursor-pointer"
                title="Close Bag"
                id="close-bag-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Premium Gold Embossing Progress Bar */}
            {cartItems.length > 0 && (
              <div className="bg-[#111111] px-6 py-4 border-b border-[#C8A25D]/10 text-xs">
                <div className="flex items-center space-x-2 text-[#C8A25D] font-mono uppercase tracking-widest mb-1.5 font-semibold">
                  <Gift className="w-4 h-4 animate-bounce" />
                  <span>
                    {totalINR >= unlockThreshold 
                      ? "✨ COMPLIMENTARY GOLD EMBOSSING UNLOCKED!" 
                      : "COMPLIMENTARY MONOGRAMMING"}
                  </span>
                </div>
                {totalINR < unlockThreshold ? (
                  <p className="text-[10px] text-white/50 leading-relaxed font-light mb-2.5">
                    Add <span className="text-white font-mono font-medium">{formatPrice(remainingINR, currency)}</span> more to unlock complementary custom 24k gold leaf initials stamping on your leather tag.
                  </p>
                ) : (
                  <p className="text-[10px] text-white/50 leading-relaxed font-light mb-2.5">
                    Your luxury order qualifies for elite hand-stamped gold monogramming at checkout.
                  </p>
                )}
                {/* Progress bar line */}
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-[#DFBA73] to-[#C8A25D] h-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Scrollable Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#111] border border-[#C8A25D]/15 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-[#C8A25D]/60" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono tracking-widest uppercase text-white font-semibold">
                      Your Bag is Empty
                    </h3>
                    <p className="text-xs text-white/45 mt-2 max-w-[240px] font-light leading-relaxed">
                      Settle for nothing less. Discover the handcrafted excellence of ARZEN bags.
                    </p>
                  </div>
                  <button
                    onClick={handleStartShopping}
                    className="mt-2 px-6 py-2.5 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none cursor-pointer rounded-xs"
                  >
                    Shop Collection
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div 
                    key={`${item.product.id}-${item.selectedColor.name}-${idx}`}
                    className="flex items-start space-x-4 pb-4 border-b border-white/5 last:border-0"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-24 rounded-xs overflow-hidden bg-[#111] border border-white/5 flex-shrink-0">
                      <img 
                        src={item.selectedColor.image || item.product.images[0]} 
                        alt={item.product.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Information */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-medium text-white tracking-wide line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-white/40 hover:text-red-500 transition-colors p-1 -mt-1 cursor-pointer focus:outline-none"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Swatch name detail & size */}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: item.selectedColor.hex }} />
                          <span className="text-[10px] text-white/50 font-mono tracking-wider uppercase">
                            {item.selectedColor.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#C8A25D]/80 font-mono bg-[#C8A25D]/10 px-1.5 py-0.5 rounded-xs uppercase tracking-wider font-semibold">
                          Size: {item.selectedSize || 'Regular'}
                        </span>
                      </div>

                      {/* Quantity Modifier and Price line */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-white/10 rounded-xs bg-[#111] p-1 scale-90 -ml-1">
                          <button
                            onClick={() => onUpdateQuantity(idx, -1)}
                            className="p-0.5 text-white/60 hover:text-[#C8A25D] transition-colors cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold font-mono min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(idx, 1)}
                            className="p-0.5 text-white/60 hover:text-[#C8A25D] transition-colors cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Calculated aggregate price */}
                        <span className="text-xs font-bold font-mono text-white tracking-wider">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Checkout Actions */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#C8A25D]/20 bg-[#0F0F0F] space-y-4">
                
                {/* Price Subtotals breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60">
                    <span className="uppercase tracking-widest font-mono">Bag Subtotal</span>
                    <span className="font-mono text-white">{formatPrice(totalINR, currency)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#C8A25D]">
                    <span className="uppercase tracking-widest font-mono">Express Delivery</span>
                    <span className="font-mono uppercase font-semibold">Complimentary</span>
                  </div>
                  {totalINR >= unlockThreshold && (
                    <div className="flex justify-between text-xs text-green-500">
                      <span className="uppercase tracking-widest font-mono">Premium Embossing</span>
                      <span className="font-mono uppercase font-semibold">Included</span>
                    </div>
                  )}
                  <div className="h-[1px] bg-white/10 my-1" />
                  <div className="flex justify-between text-sm">
                    <span className="uppercase tracking-widest font-mono font-bold text-white">Estimated Total</span>
                    <span className="font-mono font-bold text-[#C8A25D] text-base">{formatPrice(totalINR, currency)}</span>
                  </div>
                </div>

                <p className="text-[9px] text-white/40 italic text-center">
                  Packaged securely in custom protective rigid wooden crates & felt dustcover sheets.
                </p>

                {/* Checkout Trigger button */}
                <button
                  onClick={onCheckout}
                  className="w-full py-4 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white hover:text-[#0B0B0B] font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 rounded-xs focus:outline-none cursor-pointer shadow-lg hover:shadow-[#C8A25D]/10"
                  id="checkout-bag-btn"
                >
                  <Lock className="w-3.5 h-3.5 text-[#0B0B0B]" />
                  <span>Secure Checkout</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full text-center py-1 text-[10px] font-mono uppercase tracking-widest text-[#C8A25D] hover:text-white transition-colors cursor-pointer focus:outline-none"
                >
                  Continue Browsing
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
