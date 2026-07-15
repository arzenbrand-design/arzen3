import React, { useState } from 'react';
import { Mail, Phone, MapPin, Compass, Shield, Heart, Send, Check } from 'lucide-react';

interface AboutContactProps {
  type: 'about' | 'contact';
}

export default function AboutContact({ type }: AboutContactProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Bespoke Inquiries',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: 'Bespoke Inquiries', message: '' });
    }, 1200);
  };

  if (type === 'about') {
    return (
      <div className="w-full bg-[#0B0B0B] text-white py-16 px-4 sm:px-8 select-none">
        
        {/* Editorial Brand Intro */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-semibold">
            THE HOUSE STORY
          </span>
          <h1 className="text-3xl md:text-4xl font-sans font-medium tracking-wide">
            Built Different. Tailored for Distinction.
          </h1>
          <div className="w-16 h-[1px] bg-[#C8A25D] mx-auto my-6" />
          <p className="text-sm text-white/70 leading-relaxed font-light max-w-2xl mx-auto italic">
            "We do not design mere storage bags. We sculpt structural statements that align with the high standards of modern leaders."
          </p>
        </div>

        {/* Editorial Grid: Philosophy */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-5">
            <span className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase">
              01 / MASTER CRAFTSMANSHIP
            </span>
            <h2 className="text-2xl font-sans font-medium text-white tracking-wide">
              Meticulous Hand-Formed Assembly
            </h2>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Every ARZEN masterpiece begins as raw, hand-selected Argentine leather hides. Meticulously inspected for natural grain perfection, each panel is individually skived, hand-creased, and edge-painted. Our master craftsmen assemble each bag using saddle stitching, requiring years of training to master.
            </p>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              This ancient method ensures that even if a thread is worn through or sheared over decades of active duty, the adjacent stitches remain fully secured—a lock-stitch durability that standard assembly lines can never match.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-xs overflow-hidden border border-[#C8A25D]/15 bg-[#111]">
            <img 
              src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop" 
              alt="Handcrafting leather" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
        </div>

        {/* Editorial Grid: Materials */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="aspect-[4/3] rounded-xs overflow-hidden border border-[#C8A25D]/15 bg-[#111] md:order-last">
            <img 
              src="https://images.unsplash.com/photo-1605733513597-a8f8d410f286?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury leather materials" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
          <div className="space-y-5">
            <span className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase">
              02 / SOVEREIGN INGREDIENTS
            </span>
            <h2 className="text-2xl font-sans font-medium text-white tracking-wide">
              Vegetable Hides & 24k Gold Plates
            </h2>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              We settle for nothing less than the finest ingredients. Our leathers are sourced exclusively from sustainable tanneries in Tuscany and Buenos Aires, utilizing ancient organic bark vegetable tannins rather than harmful chrome chemicals. This gives the hide its thick, supportive body and rich woody aroma.
            </p>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              All zippers, locks, and rivets are machined from solid brass billets, polished to a mirror shine, and finished with a robust, heavy plating of genuine 24k gold. They do not tarnish, jam, or chip, offering absolute luxury in active use.
            </p>
          </div>
        </div>

        {/* Brand Values Row */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#C8A25D]/15">
          <div className="text-center p-6 space-y-3 bg-[#0F0F0F] border border-white/5 rounded-xs">
            <Compass className="w-6 h-6 text-[#C8A25D] mx-auto" />
            <h4 className="text-sm font-sans font-medium text-white">Ethically Sourced</h4>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              Sourced strictly from certified organic vegetable leather tanneries that protect their regional ecological waterways.
            </p>
          </div>
          <div className="text-center p-6 space-y-3 bg-[#0F0F0F] border border-white/5 rounded-xs">
            <Shield className="w-6 h-6 text-[#C8A25D] mx-auto" />
            <h4 className="text-sm font-sans font-medium text-white">Lifetime Warranty</h4>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              We stand by our work forever. If a stitch shears or buckle fails over your lifetime, we restore it in our workshops.
            </p>
          </div>
          <div className="text-center p-6 space-y-3 bg-[#0F0F0F] border border-white/5 rounded-xs">
            <Heart className="w-6 h-6 text-[#C8A25D] mx-auto" />
            <h4 className="text-sm font-sans font-medium text-white">Bespoke Monograms</h4>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              We emboss custom initials in gold-leaf foil onto structural leather tags to give each piece an individual spirit.
            </p>
          </div>
        </div>

      </div>
    );
  }

  // CONTACT FORM AND INFO
  return (
    <div className="w-full bg-[#0B0B0B] text-white py-16 px-4 sm:px-8">
      
      {/* Contact Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 select-none">
        <span className="text-[10px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-semibold">
          CONCIERGE DESK
        </span>
        <h1 className="text-3xl font-sans font-medium tracking-wide">
          Private Assistance Inquiries
        </h1>
        <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed font-light">
          Have a bespoke order request or need custom monogramming? Our brand concierge desk operates 24 hours a day, 7 days a week.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        
        {/* Contact Info (2/5 Width) */}
        <div className="lg:col-span-2 bg-[#0F0F0F] border border-[#C8A25D]/15 rounded-xs p-6 md:p-8 space-y-8 select-none">
          <h3 className="text-sm font-mono tracking-widest uppercase text-[#C8A25D] font-bold border-b border-white/5 pb-3">
            Boutiques &amp; Head Office
          </h3>
          
          <div className="space-y-6 text-xs font-light">
            {/* Head Office */}
            <div className="flex items-start space-x-3.5">
              <MapPin className="w-5 h-5 text-[#C8A25D] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-sans text-xs tracking-wide font-semibold text-[#C8A25D]">ARZEN Head Office</strong>
                <p className="text-white mt-1">Bokaro Steel City,</p>
                <p className="text-white">Bokaro, Jharkhand – 827001</p>
                <p className="text-white">India</p>
                <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest mt-1.5">Mon - Sat: 10:00 AM - 6:00 PM</p>
              </div>
            </div>

            {/* Location 1 */}
            <div className="flex items-start space-x-3.5 pt-4 border-t border-white/5">
              <MapPin className="w-5 h-5 text-[#C8A25D] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-sans text-xs tracking-wide font-medium">ARZEN Private Lounge</strong>
                <p className="text-white mt-1">Bokaro Steel City,</p>
                <p className="text-white">Bokaro, Jharkhand – 827001</p>
                <p className="text-white">India</p>
                <p className="text-[10px] text-[#C8A25D] font-mono uppercase tracking-widest mt-1.5">Mon - Sun: 11:00 AM - 9:00 PM</p>
              </div>
            </div>

            {/* Location 2 */}
            <div className="flex items-start space-x-3.5 pt-4 border-t border-white/5">
              <MapPin className="w-5 h-5 text-[#C8A25D] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-sans text-xs tracking-wide font-medium">ARZEN Heritage Gallery</strong>
                <p className="text-white mt-1">Bokaro Steel City,</p>
                <p className="text-white">Bokaro, Jharkhand – 827001</p>
                <p className="text-white">India</p>
                <p className="text-[10px] text-[#C8A25D] font-mono uppercase tracking-widest mt-1.5">Mon - Sun: 11:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5 text-xs text-white/60">
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold">
              Direct Contact
            </h4>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-[#C8A25D]" />
              <a href="mailto:arzen.brand@gmail.com" className="font-mono hover:text-[#C8A25D] transition-colors">arzen.brand@gmail.com</a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-[#C8A25D]" />
              <a href="tel:+917679847319" className="font-mono hover:text-[#C8A25D] transition-colors">+91 76798 47319</a>
            </div>
          </div>

          {/* Google Maps Section pointing to Bokaro, Jharkhand */}
          <div className="pt-6 border-t border-white/5 space-y-3">
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold">
              Google Maps Section
            </h4>
            <div className="w-full h-48 rounded-xs overflow-hidden border border-white/10 relative">
              <iframe
                title="ARZEN Bokaro, Jharkhand Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58434.84655458025!2d86.11303107085734!3d23.669641775791784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f422e690000001%3A0x6b801a6132f7b8c8!2sBokaro%20Steel%20City%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale invert opacity-75 hover:opacity-100 transition-opacity duration-300 contrast-125"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Message Form (3/5 Width) */}
        <div className="lg:col-span-3 bg-[#0F0F0F] border border-[#C8A25D]/15 rounded-xs p-6 md:p-8">
          
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#C8A25D]/10 border border-[#C8A25D]/50 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-[#C8A25D]" />
              </div>
              <div>
                <h3 className="text-base font-sans font-medium text-[#C8A25D] tracking-wide uppercase">
                  MESSAGE SECURED
                </h3>
                <p className="text-xs text-white/50 mt-2 max-w-sm mx-auto leading-relaxed font-light">
                  Thank you. Your message has been logged by the luxury private registry. An ARZEN house manager will follow up with you within 4-12 hours.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 bg-[#111] hover:bg-[#C8A25D] text-[#C8A25D] hover:text-[#0B0B0B] border border-[#C8A25D]/30 hover:border-transparent text-[10px] font-mono font-bold tracking-widest uppercase transition-colors"
              >
                Send Another Inquire
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#C8A25D] font-bold border-b border-white/5 pb-3 mb-4 select-none">
                Dispatch an Inquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1 select-none">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xs px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1 select-none">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xs px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1 select-none">Department Topic</label>
                <select
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xs px-3 py-3 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors uppercase font-mono tracking-wider"
                >
                  <option value="Bespoke Inquiries">BESPOKE CUSTOM MONOGRAMMING</option>
                  <option value="Store Appointment">STORE CONSULTATION APPOINTMENT</option>
                  <option value="Warranty Repair">LIFETIME WARRANTY & RESTORATION</option>
                  <option value="Careers">HOUSE CAREERS & PARTNERSHIPS</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1 select-none">Your Inquiry Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="How may our private concierge assist your search?"
                  className="w-full bg-[#111] border border-white/10 rounded-xs px-3.5 py-3 text-xs text-white placeholder-white/15 focus:outline-none focus:border-[#C8A25D] transition-colors leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#C8A25D] hover:bg-white text-[#0B0B0B] hover:text-black font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 rounded-xs focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Dispatching...</span>
                ) : (
                  <>
                    <span>Dispatch Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
