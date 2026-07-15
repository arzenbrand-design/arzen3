import React from 'react';
import { Instagram, Facebook, Youtube, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { ARZENLogo } from './Header';
import { ActiveView } from '../types';

interface FooterProps {
  setView: (view: ActiveView) => void;
  setCategoryFilter?: (cat: string) => void;
}

export default function Footer({ setView, setCategoryFilter }: FooterProps) {
  
  const handleCategoryLink = (cat: string) => {
    if (setCategoryFilter) {
      setCategoryFilter(cat);
    }
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (view: ActiveView) => {
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#070707]/60 backdrop-blur-md border-t border-[#C8A25D]/15 text-white pt-16 pb-8 px-4 sm:px-8 relative select-none">
      
      {/* Upper Footer: Branding & Grid Columns */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        
        {/* Column 1: Brand block (Spans 2 columns on lg) */}
        <div className="lg:col-span-2 space-y-5 flex flex-col items-center md:items-start text-center md:text-left">
          <ARZENLogo scale={1.1} />
          
          <p className="text-xs text-white/50 max-w-sm leading-relaxed font-light mt-4">
            ARZEN is an international luxury house founded on the simple premise of architectural distinction. We handcraft leather goods that make statement, command attention, and age beautifully. 
          </p>

          <div className="flex items-center space-x-4 pt-2">
            <a href="https://www.instagram.com/arzen.brand?igsh=MWNxYjdzeHRpa3A4Ng==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-black border border-[#C8A25D] hover:bg-[#C8A25D] text-[#C8A25D] hover:text-black flex items-center justify-center transition-all duration-300 shadow-[0_0_10px_rgba(200,162,93,0.15)]" title="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/share/1CwR6azJ2Y/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-black border border-[#C8A25D] hover:bg-[#C8A25D] text-[#C8A25D] hover:text-black flex items-center justify-center transition-all duration-300 shadow-[0_0_10px_rgba(200,162,93,0.15)]" title="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-black border border-white/5 hover:border-[#C8A25D]/40 text-[#C8A25D]/60 hover:text-[#C8A25D] flex items-center justify-center transition-all duration-300" title="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Shop Catalog */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono tracking-widest uppercase text-[#C8A25D] font-bold">
            Shop Catalog
          </h4>
          <ul className="space-y-2.5 text-[11px] font-mono tracking-wider text-white/60 uppercase">
            <li><button onClick={() => handleCategoryLink('All')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">All Masterpieces</button></li>
            <li><button onClick={() => handleCategoryLink('Tote')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Tote Bags</button></li>
            <li><button onClick={() => handleCategoryLink('Shoulder Bag')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Shoulder Bags</button></li>
            <li><button onClick={() => handleCategoryLink('Backpack')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Backpacks</button></li>
            <li><button onClick={() => handleCategoryLink('Duffle')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Duffels & Travel</button></li>
            <li><button onClick={() => handleCategoryLink('Sling')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Urban Slings</button></li>
          </ul>
        </div>

        {/* Column 3: The House */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono tracking-widest uppercase text-[#C8A25D] font-bold">
            The House
          </h4>
          <ul className="space-y-2.5 text-[11px] font-mono tracking-wider text-white/60 uppercase">
            <li><button onClick={() => handleNavClick('about')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Our Story</button></li>
            <li><a href="#" className="hover:text-[#C8A25D] transition-colors">Sustainability Code</a></li>
            <li><a href="#" className="hover:text-[#C8A25D] transition-colors">Careers at House</a></li>
            <li><a href="#" className="hover:text-[#C8A25D] transition-colors">Craftsmanship Ledger</a></li>
            <li><a href="#" className="hover:text-[#C8A25D] transition-colors">Press & Media</a></li>
            <li><button onClick={() => handleNavClick('contact')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Locate Boutiques</button></li>
          </ul>
        </div>

        {/* Column 4: Concierge Support */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono tracking-widest uppercase text-[#C8A25D] font-bold">
            Concierge Support
          </h4>
          <ul className="space-y-2.5 text-[11px] font-mono tracking-wider text-white/60 uppercase">
            <li><button onClick={() => handleNavClick('shop')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Track Air Cargo</button></li>
            <li><a href="#" className="hover:text-[#C8A25D] transition-colors">Express Delivery Details</a></li>
            <li><a href="#" className="hover:text-[#C8A25D] transition-colors">Lifetime Warranty Repair</a></li>
            <li><button onClick={() => handleNavClick('contact')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Bespoke Monogramming</button></li>
            <li><button onClick={() => handleNavClick('contact')} className="hover:text-[#C8A25D] transition-colors focus:outline-none cursor-pointer">Contact Support</button></li>
            <li><a href="#" className="hover:text-[#C8A25D] transition-colors">Terms & Privacy Code</a></li>
          </ul>
        </div>
      </div>

      {/* Middle Footer: Trust and Address Information */}
      <div className="max-w-7xl mx-auto border-t border-b border-white/5 py-8 my-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/40 font-light gap-6">
        <div className="flex flex-col md:flex-row items-center md:space-x-6 gap-3 md:gap-0 text-center md:text-left">
          <div className="flex items-center space-x-2 text-[#C8A25D]">
            <MapPin className="w-4 h-4" />
            <span className="font-mono text-[10px] tracking-widest uppercase">ARZEN Head Office</span>
          </div>
          <span className="leading-relaxed">Bokaro Steel City, Bokaro, Jharkhand – 827001, India</span>
          <span className="hidden md:inline text-white/10">|</span>
          <div className="flex items-center space-x-2 text-[#C8A25D]">
            <Mail className="w-4 h-4" />
            <a href="mailto:arzen.brand@gmail.com" className="font-mono text-[11px] hover:text-white transition-colors">arzen.brand@gmail.com</a>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-[10px] font-mono tracking-widest uppercase">
          <span className="flex items-center text-green-500 font-semibold">
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            3D-SECURE PAYMENTS
          </span>
          <span className="h-4 w-[1px] bg-white/10" />
          <span>EST. 2026 IN INDIA</span>
        </div>
      </div>

      {/* Bottom Footer: Legal & Payment Badges */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-[10px] font-mono text-white/30 uppercase tracking-widest text-center sm:text-left">
        <div>
          © 2026 ARZEN INDIA. BUILT DIFFERENT. ALL RIGHTS RESERVED.
        </div>
        
        {/* Sleek inline credit-card logo badges */}
        <div className="flex items-center space-x-3 text-white/20 select-none">
          <span className="border border-white/10 px-2 py-0.5 rounded-sm">VISA</span>
          <span className="border border-white/10 px-2 py-0.5 rounded-sm">MASTERCARD</span>
          <span className="border border-white/10 px-2 py-0.5 rounded-sm">AMEX</span>
          <span className="border border-white/10 px-2 py-0.5 rounded-sm">APPLE PAY</span>
          <span className="border border-white/10 px-2 py-0.5 rounded-sm">BHIM UPI</span>
        </div>
      </div>

    </footer>
  );
}
