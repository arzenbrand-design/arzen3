import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    // Simulate luxury API register delay
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
    }, 1200);
  };

  return (
    <section className="w-full bg-transparent border-t border-[#C8A25D]/15 py-20 px-4 sm:px-8 relative overflow-hidden select-none">
      {/* Absolute Decorative Gold Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#C8A25D]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto border border-[#C8A25D]/20 bg-[#0F0F0F]/65 backdrop-blur-md rounded-xs px-6 py-12 md:py-16 text-center relative z-10 shadow-2xl">
        <span className="text-[10px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block mb-3 font-semibold">
          THE ARZEN INNER CIRCLE
        </span>
        
        <h2 className="text-2xl md:text-3xl font-sans font-medium tracking-wide text-white max-w-xl mx-auto leading-tight">
          Settle For Different. Acquire First Access.
        </h2>
        
        <p className="text-xs text-white/50 max-w-md mx-auto mt-3.5 leading-relaxed font-light">
          Join the exclusive registry to receive private collection previews, limited craftsmanship monographs, and sovereign brand events.
        </p>

        {subscribed ? (
          <div className="mt-8 flex flex-col items-center justify-center space-y-3 animate-fade-in max-w-sm mx-auto">
            <div className="w-10 h-10 rounded-full bg-[#C8A25D]/10 border border-[#C8A25D]/40 flex items-center justify-center">
              <Check className="w-5 h-5 text-[#C8A25D]" />
            </div>
            <div>
              <h4 className="text-sm font-sans font-medium text-[#C8A25D] tracking-wide uppercase">
                Welcome to the Society
              </h4>
              <p className="text-[10px] text-white/45 mt-1">
                Your credentials are secure. Private entry logs have been dispatched.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A25D]/60" />
              <input
                type="email"
                placeholder="ENTER YOUR PRESTIGIOUS EMAIL..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#161616] border border-[#C8A25D]/20 focus:border-[#C8A25D] rounded-xs py-3.5 pl-10 pr-4 text-xs font-mono tracking-widest text-white placeholder-white/20 focus:outline-none transition-all duration-300 uppercase"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-[#C8A25D] hover:bg-white text-[#0B0B0B] hover:text-[#0B0B0B] font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 rounded-xs flex items-center justify-center space-x-2 focus:outline-none cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <span>Join Society</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center space-x-6 text-[9px] font-mono tracking-wider text-white/30 uppercase">
          <span>NO ADVERTISING</span>
          <span>•</span>
          <span>PRIVACY PRESERVED</span>
          <span>•</span>
          <span>CANCEL ANYTIME</span>
        </div>
      </div>
    </section>
  );
}
