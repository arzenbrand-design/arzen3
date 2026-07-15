import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Globe, Menu, X, ChevronDown, Check, Instagram, Facebook } from 'lucide-react';
import { ActiveView } from '../types';

interface HeaderProps {
  currentView: ActiveView;
  setView: (view: ActiveView) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  currency: 'INR' | 'USD' | 'EUR';
  setCurrency: (currency: 'INR' | 'USD' | 'EUR') => void;
}

export const ARZENLogo: React.FC<{ 
  className?: string; 
  scale?: number;
  color?: 'gold' | 'white' | 'black';
  onlyIcon?: boolean;
}> = ({ className = "h-12", scale = 1, color = 'gold', onlyIcon = false }) => {
  // We bypass the fallback check and use our premium, ultra-high-fidelity vector SVG logo.
  // This guarantees that the exact high-end beveled redesign is displayed perfectly on all screens and states.

  // Premium Luxury Gold Gradients for the beveled emblem (matching the uploaded image's warm gold metal)
  const goldLeftGrad = (
    <linearGradient id="luxuryGoldLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#F9F5E8" />
      <stop offset="35%" stopColor="#EAD09D" />
      <stop offset="70%" stopColor="#C5A059" />
      <stop offset="100%" stopColor="#9C7B3E" />
    </linearGradient>
  );

  const goldRightGrad = (
    <linearGradient id="luxuryGoldRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#C5A059" />
      <stop offset="40%" stopColor="#9C7B3E" />
      <stop offset="75%" stopColor="#7A5D26" />
      <stop offset="100%" stopColor="#483311" />
    </linearGradient>
  );

  // Silver Chrome Gradient for the ARZEN wordmark (matching the uploaded image's silver metallic lettering)
  const silverChromeGrad = (
    <linearGradient id="silverChrome" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="25%" stopColor="#E5E7EB" />
      <stop offset="50%" stopColor="#9CA3AF" />
      <stop offset="75%" stopColor="#D1D5DB" />
      <stop offset="100%" stopColor="#4B5563" />
    </linearGradient>
  );

  const lineBg = color === 'white' ? 'bg-white/50' : color === 'black' ? 'bg-black/50' : 'bg-[#C8A25D]/50';
  const textColor = color === 'white' ? '#FFFFFF' : color === 'black' ? '#000000' : '#C8A25D';
  
  // Resolve SVG gradient reference relative to the absolute page URL to prevent router issues,
  // with safe solid-color fallbacks in case of any layout/rendering constraints.
  const baseUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  const strokeColor = color === 'white' ? '#FFFFFF' : color === 'black' ? '#000000' : `url(${baseUrl}#silverChrome) #E5E7EB`;

  if (onlyIcon) {
    return (
      <div 
        className={`flex items-center justify-center select-none cursor-pointer transition-all duration-300 ${className}`}
        style={{ transform: `scale(${scale})`, filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.75))' }}
      >
        <svg viewBox="0 0 100 70" className="h-full w-auto fill-none animate-fade-in" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {goldLeftGrad}
            {goldRightGrad}
          </defs>
          {/* Outer Chevron - Left Facet (Lighted) */}
          <path 
            d="M 50 10 L 50 26 L 29 62 L 18 62 Z" 
            fill={color === 'white' ? '#FFFFFF' : color === 'black' ? '#000000' : `url(${baseUrl}#luxuryGoldLeft) #EAD09D`}
          />
          {/* Outer Chevron - Right Facet (Shadowed) */}
          <path 
            d="M 50 10 L 82 62 L 71 62 L 50 26 Z" 
            fill={color === 'white' ? '#E0E0E0' : color === 'black' ? '#1A1A1A' : `url(${baseUrl}#luxuryGoldRight) #9C7B3E`}
          />
          {/* Inner Solid Triangle - Left Facet (Lighted) */}
          <path 
            d="M 50 44 L 50 62 L 38 62 Z" 
            fill={color === 'white' ? '#FFFFFF' : color === 'black' ? '#000000' : `url(${baseUrl}#luxuryGoldLeft) #EAD09D`}
          />
          {/* Inner Solid Triangle - Right Facet (Shadowed) */}
          <path 
            d="M 50 44 L 62 62 L 50 62 Z" 
            fill={color === 'white' ? '#E0E0E0' : color === 'black' ? '#1A1A1A' : `url(${baseUrl}#luxuryGoldRight) #9C7B3E`}
          />
        </svg>
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center select-none cursor-pointer transition-all duration-300 ${className}`} 
      style={{ transform: `scale(${scale})`, filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.85))' }}
    >
      {/* Golden Triangular Emblem (Redesigned matching the uploaded image) */}
      <svg viewBox="0 0 100 70" className="h-10 w-auto fill-none animate-fade-in" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {goldLeftGrad}
          {goldRightGrad}
        </defs>
        {/* Outer Chevron - Left Facet (Lighted) */}
        <path 
          d="M 50 10 L 50 26 L 29 62 L 18 62 Z" 
          fill={color === 'white' ? '#FFFFFF' : color === 'black' ? '#000000' : `url(${baseUrl}#luxuryGoldLeft) #EAD09D`}
        />
        {/* Outer Chevron - Right Facet (Shadowed) */}
        <path 
          d="M 50 10 L 82 62 L 71 62 L 50 26 Z" 
          fill={color === 'white' ? '#E0E0E0' : color === 'black' ? '#1A1A1A' : `url(${baseUrl}#luxuryGoldRight) #9C7B3E`}
        />
        {/* Inner Solid Triangle - Left Facet (Lighted) */}
        <path 
          d="M 50 44 L 50 62 L 38 62 Z" 
          fill={color === 'white' ? '#FFFFFF' : color === 'black' ? '#000000' : `url(${baseUrl}#luxuryGoldLeft) #EAD09D`}
        />
        {/* Inner Solid Triangle - Right Facet (Shadowed) */}
        <path 
          d="M 50 44 L 62 62 L 50 62 Z" 
          fill={color === 'white' ? '#E0E0E0' : color === 'black' ? '#1A1A1A' : `url(${baseUrl}#luxuryGoldRight) #9C7B3E`}
        />
      </svg>

      {/* ARZEN Wordmark (Custom silver/chrome beveled font styling matching the image) */}
      <svg viewBox="0 0 210 40" className="h-[18px] w-auto mt-2" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {silverChromeGrad}
        </defs>
        <path
          d="
            M 10 35 L 25 5 L 40 35
            M 55 35 L 55 5
            M 55 5 L 72 5 C 81 5, 81 19, 72 19 L 55 19
            M 66 19 L 78 35
            M 92 5 L 117 5 L 92 35 L 117 35
            M 132 5 L 132 35
            M 132 5 L 157 5
            M 132 20 L 157 20
            M 132 35 L 157 35
            M 172 35 L 172 5 L 197 35 L 197 5
          "
          stroke={strokeColor}
          strokeWidth="4"
          fill="none"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        />
      </svg>

      {/* BUILT DIFFERENT Subtitle */}
      <div className="flex items-center justify-center w-full mt-1.5 px-1">
        <div className={`h-[0.5px] w-6 ${lineBg}`} />
        <span 
          className="text-[7.5px] font-semibold tracking-[0.25em] mx-2 whitespace-nowrap uppercase font-sans"
          style={{ color: textColor }}
        >
          BUILT DIFFERENT
        </span>
        <div className={`h-[0.5px] w-6 ${lineBg}`} />
      </div>
    </div>
  );
};

export default function Header({
  currentView,
  setView,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  currency,
  setCurrency,
}: HeaderProps) {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currencies: { code: 'INR' | 'USD' | 'EUR'; label: string; symbol: string }[] = [
    { code: 'INR', label: 'India (INR ₹)', symbol: '₹' },
    { code: 'USD', label: 'United States (USD $)', symbol: '$' },
    { code: 'EUR', label: 'Europe (EUR €)', symbol: '€' },
  ];

  const handleNavClick = (view: ActiveView) => {
    setView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full z-40 relative">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#0B0B0B] border-b border-[#C8A25D]/15 py-2.5 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between text-[10.5px] tracking-widest text-[#D3D3D3]">
        <div className="flex items-center space-x-2 text-center md:text-left mb-1.5 md:mb-0 uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C8A25D] animate-pulse"></span>
          <span>COMPLIMENTARY EXPRESS SHIPPING ON ORDERS ABOVE {currency === 'INR' ? '₹4,999' : currency === 'USD' ? '$60' : '€55'}</span>
        </div>
        <div className="flex items-center space-x-5 uppercase select-none">
          <span className="hover:text-[#C8A25D] transition-colors cursor-pointer" onClick={() => handleNavClick('shop')}>TRACK ORDER</span>
          <span className="h-3 w-[1px] bg-white/20" />
          <span className="hover:text-[#C8A25D] transition-colors cursor-pointer" onClick={() => handleNavClick('contact')}>SUPPORT</span>
          <span className="h-3 w-[1px] bg-white/20" />
          
          {/* Currency Dropdown Selector */}
          <div className="relative">
            <button 
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center space-x-1 hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer uppercase"
            >
              <Globe className="w-3 h-3 text-[#C8A25D]" />
              <span>{currency === 'INR' ? 'INDIA (₹)' : currency === 'USD' ? 'US ($)' : 'EU (€)'}</span>
              <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {currencyDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCurrencyDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-[#0B0B0B] border border-[#C8A25D]/30 rounded-sm shadow-xl z-50 py-1">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[10.5px] tracking-widest uppercase hover:bg-[#C8A25D]/10 flex items-center justify-between text-white hover:text-[#C8A25D] transition-colors"
                    >
                      <span>{curr.label}</span>
                      {currency === curr.code && <Check className="w-3 h-3 text-[#C8A25D]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav className="w-full bg-[#0B0B0B]/80 backdrop-blur-md sticky top-0 border-b border-[#C8A25D]/15 px-4 sm:px-8 py-3 flex items-center justify-between transition-all duration-300 z-50">
        
        {/* Left Side: Mobile Menu Trigger / ARZEN Logo on desktop (slightly larger) */}
        <div className="flex items-center space-x-4 md:w-1/4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-[#C8A25D] hover:text-white transition-colors focus:outline-none cursor-pointer p-1"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="hidden md:flex items-center" onClick={() => handleNavClick('home')} id="arzen-logo-home">
            <ARZENLogo scale={1.2} />
          </div>
          {/* Logo on mobile centered/left */}
          <div className="md:hidden flex items-center" onClick={() => handleNavClick('home')}>
            <ARZENLogo scale={1.05} />
          </div>
        </div>

        {/* Center: Center-aligned Navigation Links (Desktop Only) */}
        <div className="hidden md:flex flex-grow justify-center items-center space-x-10 text-[11px] tracking-[0.2em] uppercase font-medium md:w-2/4">
          <button 
            onClick={() => handleNavClick('home')} 
            className={`relative pb-1 cursor-pointer transition-all duration-300 hover:text-[#C8A25D] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[#C8A25D] after:transition-transform after:duration-300 ${currentView === 'home' ? 'text-[#C8A25D] after:scale-x-100' : 'text-white/70 after:scale-x-0 hover:after:scale-x-100'}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick('shop')} 
            className={`relative pb-1 cursor-pointer transition-all duration-300 hover:text-[#C8A25D] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[#C8A25D] after:transition-transform after:duration-300 ${currentView === 'shop' ? 'text-[#C8A25D] after:scale-x-100' : 'text-white/70 after:scale-x-0 hover:after:scale-x-100'}`}
          >
            Shop Collection
          </button>
          <button 
            onClick={() => handleNavClick('lifestyle')} 
            className={`relative pb-1 cursor-pointer transition-all duration-300 hover:text-[#C8A25D] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[#C8A25D] after:transition-transform after:duration-300 ${currentView === 'lifestyle' ? 'text-[#C8A25D] after:scale-x-100' : 'text-white/70 after:scale-x-0 hover:after:scale-x-100'}`}
          >
            Lifestyle
          </button>
          <button 
            onClick={() => { handleNavClick('shop'); }} 
            className="relative pb-1 text-white/70 hover:text-[#C8A25D] cursor-pointer transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[#C8A25D] after:transition-transform after:duration-300 after:scale-x-0 hover:after:scale-x-100"
          >
            Best Sellers
          </button>
          <button 
            onClick={() => handleNavClick('about')} 
            className={`relative pb-1 cursor-pointer transition-all duration-300 hover:text-[#C8A25D] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[#C8A25D] after:transition-transform after:duration-300 ${currentView === 'about' ? 'text-[#C8A25D] after:scale-x-100' : 'text-white/70 after:scale-x-0 hover:after:scale-x-100'}`}
          >
            Our Story
          </button>
          <button 
            onClick={() => handleNavClick('contact')} 
            className={`relative pb-1 cursor-pointer transition-all duration-300 hover:text-[#C8A25D] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-[#C8A25D] after:transition-transform after:duration-300 ${currentView === 'contact' ? 'text-[#C8A25D] after:scale-x-100' : 'text-white/70 after:scale-x-0 hover:after:scale-x-100'}`}
          >
            Contact
          </button>
          <button 
            onClick={() => handleNavClick('admin')} 
            className={`relative pb-1 cursor-pointer transition-all duration-300 hover:text-[#C8A25D] border border-[#C8A25D]/30 hover:border-[#C8A25D] px-2.5 py-0.5 rounded-xs text-[10px] font-mono tracking-widest flex items-center space-x-1.5 ${currentView === 'admin' ? 'text-[#C8A25D] bg-[#C8A25D]/10 border-[#C8A25D]' : 'text-white/50'}`}
          >
            <span className="w-1 h-1 rounded-full bg-[#C8A25D] animate-pulse"></span>
            <span>ADMIN</span>
          </button>
        </div>

        {/* Right Side: Action Icons */}
        <div className="flex items-center justify-end space-x-5 md:w-1/4 text-white">
          <button 
            onClick={onOpenSearch} 
            className="hover:text-[#C8A25D] transition-colors p-1 focus:outline-none cursor-pointer"
            id="search-btn"
            title="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onOpenAccount} 
            className="hover:text-[#C8A25D] transition-colors p-1 focus:outline-none cursor-pointer"
            id="account-btn"
            title="My Account"
          >
            <User className="w-5 h-5" />
          </button>

          <button 
            onClick={onOpenWishlist} 
            className="hover:text-[#C8A25D] transition-colors p-1 relative focus:outline-none cursor-pointer"
            id="wishlist-btn"
            title="My Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono">
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            onClick={onOpenCart} 
            className="hover:text-[#C8A25D] transition-colors p-1 relative focus:outline-none cursor-pointer"
            id="cart-btn"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C8A25D] text-[#0B0B0B] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-[280px] h-full bg-[#0B0B0B] border-r border-[#C8A25D]/20 z-40 p-6 flex flex-col md:hidden text-white transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-[#C8A25D]/10 pb-4 mb-6">
              <span className="text-[10px] tracking-[0.2em] font-semibold text-[#C8A25D] uppercase">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-[#C8A25D] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-5 text-sm tracking-[0.2em] uppercase font-medium">
              <button 
                onClick={() => handleNavClick('home')} 
                className={`text-left hover:text-[#C8A25D] transition-colors py-1 ${currentView === 'home' ? 'text-[#C8A25D]' : 'text-white'}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('shop')} 
                className={`text-left hover:text-[#C8A25D] transition-colors py-1 ${currentView === 'shop' ? 'text-[#C8A25D]' : 'text-white'}`}
              >
                Shop Collection
              </button>
              <button 
                onClick={() => handleNavClick('lifestyle')} 
                className={`text-left hover:text-[#C8A25D] transition-colors py-1 ${currentView === 'lifestyle' ? 'text-[#C8A25D]' : 'text-white'}`}
              >
                Lifestyle
              </button>
              <button 
                onClick={() => handleNavClick('about')} 
                className={`text-left hover:text-[#C8A25D] transition-colors py-1 ${currentView === 'about' ? 'text-[#C8A25D]' : 'text-white'}`}
              >
                Our Story
              </button>
              <button 
                onClick={() => handleNavClick('contact')} 
                className={`text-left hover:text-[#C8A25D] transition-colors py-1 ${currentView === 'contact' ? 'text-[#C8A25D]' : 'text-white'}`}
              >
                Contact Us
              </button>
              <button 
                onClick={() => handleNavClick('admin')} 
                className={`text-left hover:text-[#C8A25D] transition-colors py-1 flex items-center space-x-2 ${currentView === 'admin' ? 'text-[#C8A25D]' : 'text-white/50'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A25D] animate-pulse"></span>
                <span>ADMIN PORTAL</span>
              </button>
            </div>

            <div className="mt-auto border-t border-[#C8A25D]/10 pt-6">
              <div className="flex items-center space-x-3 text-xs tracking-wider text-white/60 mb-4">
                <Globe className="w-4 h-4 text-[#C8A25D]" />
                <span className="uppercase">Currency: {currency === 'INR' ? 'INR (₹)' : currency === 'USD' ? 'USD ($)' : 'EUR (€)'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-1.5 text-[9px] tracking-widest border uppercase rounded-sm text-center ${currency === curr.code ? 'border-[#C8A25D] text-[#C8A25D]' : 'border-white/10 text-white/50'}`}
                  >
                    {curr.code}
                  </button>
                ))}
              </div>

              {/* Mobile Menu Official Contacts & Social Icons */}
              <div className="flex flex-col space-y-2 border-t border-[#C8A25D]/10 pt-4 text-left select-none">
                <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase">DIRECT CONCIERGE</span>
                <a href="mailto:arzen.brand@gmail.com" className="text-[11px] font-mono tracking-widest text-[#C8A25D] hover:text-white transition-colors">
                  arzen.brand@gmail.com
                </a>
                <a href="tel:+917679847319" className="text-[11px] font-mono tracking-widest text-[#C8A25D] hover:text-white transition-colors">
                  +91 76798 47319
                </a>
                <div className="flex items-center space-x-3 pt-1">
                  <a href="https://www.instagram.com/arzen.brand?igsh=MWNxYjdzeHRpa3A4Ng==" target="_blank" rel="noopener noreferrer" className="text-[#C8A25D] hover:text-white transition-colors" title="Instagram">
                    <Instagram className="w-4.5 h-4.5" />
                  </a>
                  <a href="https://www.facebook.com/share/1CwR6azJ2Y/" target="_blank" rel="noopener noreferrer" className="text-[#C8A25D] hover:text-white transition-colors" title="Facebook">
                    <Facebook className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
