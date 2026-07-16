import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Truck, 
  RotateCcw, 
  Lock, 
  Instagram, 
  Search, 
  X, 
  Star, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  User,
  LogOut,
  Mail,
  KeyRound,
  Eye,
  Heart,
  CreditCard,
  Glasses,
  Sparkles,
  GlassWater,
  Compass,
  Crown,
  Gift,
  Gem,
  ShoppingBag
} from 'lucide-react';
import { Product, CartItem, ActiveView, ProductColor } from './types';
import { formatPrice } from './utils';

// Import Custom Modular Components
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import ShopView from './components/ShopView';
import AboutContact from './components/AboutContact';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/AdminDashboard';
import LifestyleView from './components/LifestyleView';
import ProductDetails from './components/ProductDetails';
import { ArzenDatabase, DbSettings } from './db';

export function getProductSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function App() {
  // Navigation & Core States
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Dynamic products database state
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<DbSettings>(() => ArzenDatabase.getSettings());
  const [gallery, setGallery] = useState<any[]>(() => ArzenDatabase.getGallery());

  useEffect(() => {
    ArzenDatabase.initialize();
    setProducts(ArzenDatabase.getActiveProducts());
    setSettings(ArzenDatabase.getSettings());
    setGallery(ArzenDatabase.getGallery());

    const handleDbUpdate = () => {
      setProducts(ArzenDatabase.getActiveProducts());
      setSettings(ArzenDatabase.getSettings());
      setGallery(ArzenDatabase.getGallery());
    };
    window.addEventListener('arzen-db-updated', handleDbUpdate);
    return () => {
      window.removeEventListener('arzen-db-updated', handleDbUpdate);
    };
  }, []);

  // Cart & Wishlist state with client-side localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('arzen_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('arzen_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Overlays & Drawers Controllers
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  // Selected product detail modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Handle product details page navigation with HTML5 history
  const handleNavigateToProduct = (product: Product) => {
    const slug = getProductSlug(product.name);
    window.history.pushState({ productId: product.id }, '', `/product/${slug}`);
    setSelectedProductDetails(product);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to popstate event for back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const path = window.location.pathname;
      if (path.startsWith('/product/')) {
        const slug = path.replace('/product/', '');
        const matched = products.find(p => getProductSlug(p.name) === slug);
        if (matched) {
          setSelectedProductDetails(matched);
          setActiveView('product-detail');
          return;
        }
      }
      
      // Default fallback
      setSelectedProductDetails(null);
      setActiveView('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [products]);

  // Initial load URL parsing
  useEffect(() => {
    if (products.length > 0) {
      const path = window.location.pathname;
      if (path.startsWith('/product/')) {
        const slug = path.replace('/product/', '');
        const matched = products.find(p => getProductSlug(p.name) === slug);
        if (matched) {
          setSelectedProductDetails(matched);
          setActiveView('product-detail');
        }
      }
    }
  }, [products]);

  // Search Live Query State
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated Login State
  const [account, setAccount] = useState({
    email: '',
    password: '',
    name: '',
    isLoggedIn: false,
    error: '',
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('arzen_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('arzen_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Handle live search suggestions filtering
  const searchResults = searchQuery.trim() === '' ? [] : products.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cart Actions
  const handleAddToCart = (product: Product, color?: ProductColor, quantity = 1, size?: string) => {
    const selectedColor = color || product.colors[0];
    const selectedSize = size || product.sizes?.[0] || 'Regular';
    setCart((prevCart) => {
      // Check if item with exact color and size already in cart
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && 
                  item.selectedColor.name === selectedColor.name &&
                  (item.selectedSize || 'Regular') === selectedSize
      );

      if (existingIdx !== -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor, selectedSize }];
      }
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist Actions
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  // Simulated Login Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.email || !account.password) {
      setAccount(prev => ({ ...prev, error: 'Please populate credentials' }));
      return;
    }
    
    // Simulate luxury client welcome
    const clientName = account.email.split('@')[0];
    const capitalizedName = clientName.charAt(0).toUpperCase() + clientName.slice(1);
    
    setAccount((prev) => ({
      ...prev,
      isLoggedIn: true,
      name: capitalizedName,
      error: '',
    }));
  };

  const handleLogout = () => {
    setAccount({
      email: '',
      password: '',
      name: '',
      isLoggedIn: false,
      error: '',
    });
  };

  // Direct checkout action from card click
  const handleBuyNowDirect = (product: Product, color?: ProductColor, quantity = 1, size?: string) => {
    const selectedColor = color || product.colors[0];
    const selectedSize = size || product.sizes?.[0] || 'Regular';
    // Clear and set cart with this single product to trigger checkout direct
    setCart([{ product, quantity, selectedColor, selectedSize }]);
    setCheckoutOpen(true);
  };

  const handleSetView = (view: ActiveView) => {
    setActiveView(view);
    setCategoryFilter('All');
    setSelectedProductDetails(null);
    window.history.pushState({}, '', '/');
  };

  const activeCategoryFilter = (cat: string) => {
    setCategoryFilter(cat);
    handleSetView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeView === 'admin') {
    return <AdminDashboard onClose={() => handleSetView('home')} />;
  }

  return (
    <div className="w-full bg-[#0B0B0B] text-white min-h-screen font-sans overflow-x-hidden flex flex-col justify-between selection:bg-[#C8A25D] selection:text-[#0B0B0B]">
      
      {/* Dynamic Header & Navigation */}
      <Header
        currentView={activeView}
        setView={handleSetView}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        onSelectCategory={activeCategoryFilter}
      />

      {/* VIEW 1: HOME PAGE */}
      {activeView === 'home' && (
        <main className="flex-grow relative bg-[#0B0B0B]">
          
          <div className="relative z-10">
            {/* Full Screen (100vh) Cinematic Hero Section */}
            {settings.heroSectionEnabled !== false && (() => {
              const textPosition = settings.heroTextPosition || 'left';
              const textPosClass = 
                textPosition === 'center' ? 'text-center mx-auto items-center' : 
                textPosition === 'right' ? 'text-right ml-auto mr-0 items-end' : 
                'text-left mr-auto ml-0 items-start';
              
              const alignClass = 
                textPosition === 'center' ? 'justify-center' : 
                textPosition === 'right' ? 'justify-end' : 
                'justify-start';

              const heroImageDesktop = settings.heroBannerImage || "/assets/arzen-duffle.svg";
              const heroImageMobile = settings.heroBannerImageMobile || heroImageDesktop;
              
              const overlayDarkness = settings.heroOverlayDarkness ?? 55;
              const showOverlay = settings.heroShowOverlay ?? true;

              const handleHeroNavigation = (link: string) => {
                if (!link) return;
                const views = ['home', 'shop', 'about', 'contact', 'admin', 'lifestyle', 'tracking', 'account'];
                if (views.includes(link)) {
                  handleSetView(link as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  const element = document.getElementById(link) || document.getElementById(link.replace('#', ''));
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    handleSetView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              };

              return (
                <section className={`relative w-full h-[100vh] min-h-[600px] px-4 sm:px-8 overflow-hidden flex items-center ${alignClass} border-b border-[#C8A25D]/15`}>
                  {/* Full-screen Background Image with desktop/mobile switching and custom zoom & focal point */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <picture className="w-full h-full">
                      <source media="(max-w: 768px)" srcSet={heroImageMobile} />
                      <img 
                        src={heroImageDesktop} 
                        alt={settings.heroImageAltText || "ARZEN Luxury Campaign Background"}
                        title={settings.heroImageTitle || "ARZEN Campaign"}
                        loading={settings.heroImageLazyLoading ? "lazy" : "eager"}
                        referrerPolicy="no-referrer"
                        style={{
                          transform: `scale(${1 + ((settings.heroImageZoom || 100) - 100) / 100})`,
                          objectPosition: `${settings.heroImageFocalPointX ?? 50}% ${settings.heroImageFocalPointY ?? 35}%`,
                        }}
                        className="w-full h-full object-cover transition-all duration-500" 
                      />
                    </picture>
                    {/* Dynamic dark overlay */}
                    {showOverlay && (
                      <div 
                        className="absolute inset-0 transition-opacity duration-300 z-1" 
                        style={{
                          backgroundColor: `rgba(0, 0, 0, ${overlayDarkness / 100})`,
                        }}
                      />
                    )}
                    {/* Extra luxury gradient overlay for text protection */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-1" />
                  </div>

                  {/* Content Container */}
                  <div className="max-w-7xl mx-auto w-full relative z-10 animate-fade-in-up">
                    <div className={`max-w-xl sm:max-w-2xl flex flex-col space-y-8 ${textPosClass}`}>
                      <div className="inline-flex items-center space-x-2 bg-[#C8A25D]/15 border border-[#C8A25D]/35 px-4 py-2 rounded-full">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#C8A25D] animate-ping" />
                        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A25D] font-bold">
                          {settings.heroSubtitle || "THE HOUSE OF ARZEN"}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-serif font-light tracking-tight text-white leading-[1.05] uppercase">
                          {settings.heroTitle || "A Legacy of Distinction"}
                        </h1>
                        <p className="text-[11.5px] font-mono tracking-[0.35em] text-[#C8A25D]/90 uppercase font-bold">
                          {settings.heroTagline || "BUILT DIFFERENT"}
                        </p>
                      </div>

                      <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans font-light max-w-lg">
                        {settings.heroDescription || 'Every ARZEN bag represents a masterclass in architectural balance. Tailored by hand from French vegetable-tanned hides, enriched with solid brass hardware, and built to survive generations in effortless grace.'}
                      </p>

                      {/* Primary CTA Buttons */}
                      <div className={`flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto ${
                        textPosition === 'center' ? 'justify-center' : 
                        textPosition === 'right' ? 'justify-end' : 
                        'justify-start'
                      }`}>
                        <button
                          onClick={() => handleHeroNavigation(settings.heroButtonLink || 'shop')}
                          className="w-full sm:w-auto px-8 py-4 bg-[#C8A25D] hover:bg-white text-[#0B0B0B] text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-xs flex items-center justify-center space-x-2 focus:outline-none cursor-pointer group shadow-lg hover:shadow-[#C8A25D]/15"
                          id="hero-explore-collection"
                        >
                          <span>{settings.heroButtonText || "Explore Masterpieces"}</span>
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                        <button
                          onClick={() => handleHeroNavigation(settings.heroButtonLinkSecondary || 'best-sellers-section')}
                          className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-[#C8A25D]/40 hover:border-white text-xs font-bold tracking-widest uppercase transition-colors duration-300 rounded-xs focus:outline-none cursor-pointer"
                        >
                          {settings.heroButtonTextSecondary || "Shop Best Sellers"}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })()}

          {/* Trust Badges Bar */}
          <section className="w-full bg-black/45 backdrop-blur-md border-b border-[#C8A25D]/10 py-10 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 select-none">
              
              <div className="flex items-center space-x-3.5 p-3 rounded-xs hover:bg-[#151515] transition-colors border border-transparent hover:border-[#C8A25D]/10">
                <Award className="w-7 h-7 text-[#C8A25D] flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] font-mono tracking-wider text-white font-bold uppercase">PREMIUM QUALITY</h4>
                  <p className="text-[10px] text-white/50 font-light mt-0.5 leading-snug">Flawless vegetable-tanned hides</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 p-3 rounded-xs hover:bg-[#151515] transition-colors border border-transparent hover:border-[#C8A25D]/10">
                <Truck className="w-7 h-7 text-[#C8A25D] flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] font-mono tracking-wider text-white font-bold uppercase">COMPLIMENTARY CARGO</h4>
                  <p className="text-[10px] text-white/50 font-light mt-0.5 leading-snug">Air priority on orders above ₹4,999</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 p-3 rounded-xs hover:bg-[#151515] transition-colors border border-transparent hover:border-[#C8A25D]/10">
                <RotateCcw className="w-7 h-7 text-[#C8A25D] flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] font-mono tracking-wider text-white font-bold uppercase">EASY RETURNS</h4>
                  <p className="text-[10px] text-white/50 font-light mt-0.5 leading-snug">Hassle-free 7-day doorstep pickup</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 p-3 rounded-xs hover:bg-[#151515] transition-colors border border-transparent hover:border-[#C8A25D]/10">
                <Lock className="w-7 h-7 text-[#C8A25D] flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] font-mono tracking-wider text-white font-bold uppercase">SECURE PAYMENT</h4>
                  <p className="text-[10px] text-white/50 font-light mt-0.5 leading-snug">100% encrypted bank vault gateway</p>
                </div>
              </div>

            </div>
          </section>

          {/* Featured Collection Section */}
          <section className="w-full py-24 sm:py-28 px-4 sm:px-8 border-b border-[#C8A25D]/10 bg-transparent">
            <div className="max-w-7xl mx-auto space-y-10">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block mb-1">HAND-MADE ARTISTRY</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-light text-white tracking-wide uppercase">
                    Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCEECB] via-[#C8A25D] to-[#A37E3E] font-medium italic">Collection</span>
                  </h2>
                  <p className="text-xs text-white/55 font-light mt-1 max-w-sm">Luxury structured silhouettes that command attention and stand out.</p>
                </div>
                <button
                  onClick={() => activeCategoryFilter('All')}
                  className="px-6 py-3 border border-[#C8A25D]/30 hover:border-[#C8A25D] text-[#C8A25D] hover:text-white font-mono text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 rounded-xs focus:outline-none cursor-pointer"
                >
                  View All Masterpieces &gt;
                </button>
              </div>

              {/* Product Card Grid (Displays first 4 or selected curated items) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(() => {
                  const featuredList = settings.featuredProductIds && settings.featuredProductIds.length > 0
                    ? products.filter(p => settings.featuredProductIds.includes(p.id))
                    : products.slice(0, 4);
                  
                  return featuredList.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={setSelectedProduct}
                      onAddToCart={(p, col) => handleAddToCart(p, col)}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some((item) => item.id === product.id)}
                      currency={currency}
                      onBuyNow={(p, col) => handleBuyNowDirect(p, col)}
                      onClick={handleNavigateToProduct}
                    />
                  ));
                })()}
              </div>

            </div>
          </section>

          {/* Interactive Best Sellers Section */}
          <section id="best-sellers-section" className="w-full py-24 sm:py-28 px-4 sm:px-8 bg-[#070707]/35 backdrop-blur-md border-b border-[#C8A25D]/10">
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="text-center max-w-xl mx-auto space-y-3 select-none">
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-semibold">SOVEREIGN FAVORITES</span>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-white tracking-wide uppercase">
                  The Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCEECB] via-[#C8A25D] to-[#A37E3E] font-medium italic">Sellers</span>
                </h2>
                <div className="w-10 h-[1px] bg-[#C8A25D] mx-auto my-3" />
                <p className="text-xs text-white/50 font-light leading-relaxed">
                  Hand-crafted leather companions preferred by our active clients worldwide. Designed to maintain their rigid, beautiful forms forever.
                </p>
              </div>

              {/* Best seller items filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.filter(p => p.isBestSeller).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                    onAddToCart={(p, col) => handleAddToCart(p, col)}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some((item) => item.id === product.id)}
                    currency={currency}
                    onBuyNow={(p, col) => handleBuyNowDirect(p, col)}
                    onClick={handleNavigateToProduct}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Immersive Premium Lifestyle Banner */}
          <section className="relative w-full py-28 md:py-36 px-4 sm:px-8 border-b border-[#C8A25D]/15 overflow-hidden flex items-center justify-center bg-transparent">
            {/* High end interior background overlay */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1600&q=80" 
                alt="Luxury background interior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-35 filter brightness-50" 
              />
              <div className="absolute inset-0 bg-[#0B0B0B]/70" />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10 space-y-5 select-none">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-semibold">
                THE BRAND CODE
              </span>
              
              <h2 className="text-3xl md:text-4xl font-sans font-medium text-white tracking-wide uppercase leading-tight">
                CRAFTED FOR THOSE WHO <br className="hidden sm:inline" /> CHOOSE EXCELLENCE.
              </h2>
              
              <div className="w-12 h-[1px] bg-[#C8A25D] mx-auto my-4" />

              <p className="text-xs text-white/70 max-w-lg mx-auto leading-relaxed font-light">
                We believe true luxury is not about excess. It is not about loud patterns. True luxury resides in the quiet confidence of immaculate alignments, thick full grain hides, and hardware that functions smoothly over a lifetime. Settle for nothing less. Settle for different.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => activeCategoryFilter('All')}
                  className="px-8 py-3.5 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white hover:text-black font-mono text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 rounded-xs focus:outline-none cursor-pointer"
                >
                  Acquire Your Piece
                </button>
              </div>
            </div>
          </section>

          {/* New Arrivals Section */}
          <section className="w-full py-24 sm:py-28 px-4 sm:px-8 border-b border-[#C8A25D]/10 bg-transparent">
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="text-center max-w-xl mx-auto space-y-3 select-none">
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-semibold">LATEST LAUNCHES</span>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-white tracking-wide uppercase">
                  New <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCEECB] via-[#C8A25D] to-[#A37E3E] font-medium italic">Arrivals</span>
                </h2>
                <div className="w-10 h-[1px] bg-[#C8A25D] mx-auto my-3" />
                <p className="text-xs text-white/50 font-light leading-relaxed">
                  Introducing our latest handcrafted creations, released in highly limited quantities. Each piece includes custom monogram tagging capabilities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.filter(p => p.isNewArrival).slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                    onAddToCart={(p, col) => handleAddToCart(p, col)}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some((item) => item.id === product.id)}
                    currency={currency}
                    onBuyNow={(p, col) => handleBuyNowDirect(p, col)}
                    onClick={handleNavigateToProduct}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Spotlight Masterpiece Showcase */}
          {settings.heroProductId && (() => {
            const spotlightProduct = products.find(p => p.id === settings.heroProductId);
            if (!spotlightProduct) return null;
            return (
              <section className="w-full py-24 sm:py-28 px-4 sm:px-8 border-b border-[#C8A25D]/10 bg-transparent relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8A25D]/5 rounded-full blur-[140px] pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Visual Gallery Showcase */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="aspect-video bg-[#0A0A0A] border border-[#C8A25D]/20 rounded-xs overflow-hidden shadow-2xl group relative">
                      <img 
                        src={spotlightProduct.images && spotlightProduct.images[0] ? spotlightProduct.images[0] : "/assets/arzen-tote-elevate.svg"} 
                        alt={spotlightProduct.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105 filter brightness-95"
                      />
                      <div className="absolute top-4 left-4 bg-black/80 border border-[#C8A25D]/30 px-3.5 py-1 text-[8.5px] font-mono tracking-widest uppercase font-bold text-[#C8A25D] rounded-full">
                        HOUSE SPOTLIGHT CREATION
                      </div>
                    </div>
                    {spotlightProduct.images && spotlightProduct.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-4">
                        {spotlightProduct.images.slice(1, 5).map((imgUrl, i) => (
                          <div key={i} className="aspect-[4/3] bg-[#0A0A0A] border border-white/5 rounded-xs overflow-hidden hover:border-[#C8A25D]/30 transition-all cursor-pointer">
                            <img src={imgUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Copywriting & Action */}
                  <div className="lg:col-span-5 space-y-6 text-left">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-[0.25em] text-[#C8A25D] uppercase block font-bold">LIMITED COMMISSION</span>
                      <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-light text-white leading-tight uppercase">
                        {spotlightProduct.name}
                      </h2>
                      <p className="text-[11px] font-mono tracking-widest text-white/50 uppercase">{spotlightProduct.category} // SKU: {spotlightProduct.sku}</p>
                    </div>

                    <p className="text-sm text-white/70 leading-relaxed font-light">
                      {spotlightProduct.description || "Every ARZEN creation represents a masterclass in architectural balance, tailored by hand with solid fittings."}
                    </p>

                    {spotlightProduct.colors && spotlightProduct.colors.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase block font-bold">AVAILABLE SHADES:</span>
                        <div className="flex gap-2.5">
                          {spotlightProduct.colors.map((col, cIdx) => (
                            <span 
                              key={cIdx} 
                              className="w-5 h-5 rounded-full border border-white/20" 
                              style={{ backgroundColor: col.hex }} 
                              title={col.name} 
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex flex-wrap gap-4">
                      <button 
                        onClick={() => setSelectedProduct(spotlightProduct)}
                        className="px-6 py-3.5 bg-transparent border border-[#C8A25D]/40 hover:border-[#C8A25D] text-[#C8A25D] hover:text-white text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 rounded-xs focus:outline-none cursor-pointer"
                      >
                        Bespoke Detailing
                      </button>
                      <button 
                        onClick={() => handleBuyNowDirect(spotlightProduct)}
                        className="px-8 py-3.5 bg-[#C8A25D] hover:bg-white text-black text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 rounded-xs focus:outline-none cursor-pointer shadow-lg shadow-[#C8A25D]/10"
                      >
                        Direct Acquisition // {formatPrice(spotlightProduct.price, 'INR')}
                      </button>
                    </div>
                  </div>

                </div>
              </section>
            );
          })()}

          {/* Why Choose ARZEN (B Pillars bento) */}
          <section className="w-full py-24 sm:py-28 px-4 sm:px-8 border-b border-[#C8A25D]/10 bg-black/45 backdrop-blur-md">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="text-center max-w-xl mx-auto space-y-3 select-none">
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-semibold">THE ARZEN PRINCIPLE</span>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-white tracking-wide uppercase">
                  Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCEECB] via-[#C8A25D] to-[#A37E3E] font-medium italic">ARZEN</span>
                </h2>
                <div className="w-10 h-[1px] bg-[#C8A25D] mx-auto my-3" />
                <p className="text-xs text-white/55 font-light leading-relaxed">
                  We are obsessed with elements that are hidden from the human eye. We invest in materials and assembly that survive decades.
                </p>
              </div>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 select-none">
                <div className="md:col-span-6 bg-black/40 backdrop-blur-md border border-white/5 hover:border-[#C8A25D]/30 p-8 rounded-xs transition-all duration-350 group flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C8A25D] tracking-widest uppercase block mb-3 font-semibold">01 / LIFETIME GUARANTEE</span>
                    <h3 className="text-lg font-sans text-white font-medium tracking-wide">Pledge of Lifelong Restoration</h3>
                    <p className="text-xs text-white/50 leading-relaxed font-light mt-3">
                      Every ARZEN bag carries a Lifetime Repair or Replace Guarantee. If a buckle tarnishes, a solid brass rivet loosens, or a heavy-duty stitched seam splits over your lifetime, we will take the bag back into our workshops and restore it by hand, free of charge.
                    </p>
                  </div>
                  <div className="h-[1px] bg-white/5 my-6" />
                  <span className="text-[10.5px] font-mono text-[#C8A25D] font-bold uppercase tracking-widest block">GENUINE LIFETIME ASSURANCE &gt;</span>
                </div>

                <div className="md:col-span-6 bg-black/40 backdrop-blur-md border border-white/5 hover:border-[#C8A25D]/30 p-8 rounded-xs transition-all duration-350 group flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C8A25D] tracking-widest uppercase block mb-3 font-semibold">02 / FLUTTERING patinas</span>
                    <h3 className="text-lg font-sans text-white font-medium tracking-wide">Organic Vegetable Tanning</h3>
                    <p className="text-xs text-white/50 leading-relaxed font-light mt-3">
                      Our full grain calf leathers are cured using raw organic bark wood vegetable tannins rather than toxic fast-acting chromium chemicals. This results in incredibly dense leather that retains its structured silhouette while slowly developing an exquisite amber patina specific to your travels.
                    </p>
                  </div>
                  <div className="h-[1px] bg-white/5 my-6" />
                  <span className="text-[10.5px] font-mono text-[#C8A25D] font-bold uppercase tracking-widest block">OUR TANNERY CODE &gt;</span>
                </div>

                <div className="md:col-span-4 bg-black/40 backdrop-blur-md border border-white/5 hover:border-[#C8A25D]/30 p-6 rounded-xs transition-all duration-350 group flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C8A25D] tracking-widest uppercase block mb-2 font-semibold">03 / SOLID METAL</span>
                    <h4 className="text-sm font-sans text-white font-medium tracking-wide">Solid Brass Fittings</h4>
                    <p className="text-[11px] text-white/55 leading-relaxed font-light mt-2">
                      No hollow alloys. All zippers and links are milled from solid marine-grade brass, polished to a mirror shine, and heavy 24k gold plated.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4 bg-black/40 backdrop-blur-md border border-white/5 hover:border-[#C8A25D]/30 p-6 rounded-xs transition-all duration-350 group flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C8A25D] tracking-widest uppercase block mb-2 font-semibold">04 / CUSTOM INITIALS</span>
                    <h4 className="text-sm font-sans text-white font-medium tracking-wide">24k Gold Monogramming</h4>
                    <p className="text-[11px] text-white/55 leading-relaxed font-light mt-2">
                      Unlock complimentary hand-embossed gold-leaf initials on your leather tag. Applied with individual heated lead plates.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4 bg-black/40 backdrop-blur-md border border-white/5 hover:border-[#C8A25D]/30 p-6 rounded-xs transition-all duration-350 group flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C8A25D] tracking-widest uppercase block mb-2 font-semibold">05 / SAFE CARGO</span>
                    <h4 className="text-sm font-sans text-white font-medium tracking-wide">Premium Wooden Crating</h4>
                    <p className="text-[11px] text-white/55 leading-relaxed font-light mt-2">
                      All luggage items are shipped inside customized cedarwood presentation crates with satin linen bags to guarantee flawless unboxing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Reviews Section */}
          <section className="w-full py-16 md:py-24 px-4 sm:px-8 border-b border-[#C8A25D]/10 bg-transparent">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="text-center max-w-xl mx-auto space-y-3 select-none">
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-semibold">THE INNER CIRCLE VERDICT</span>
                <h2 className="text-2xl md:text-3xl font-sans font-medium text-white tracking-wide uppercase">Verified Client Reviews</h2>
                <div className="w-10 h-[1px] bg-[#C8A25D] mx-auto my-3" />
                <p className="text-xs text-white/50 font-light leading-relaxed">
                  What our clients say about carrying ARZEN bags. True satisfaction from high-end corporate boardrooms and first-class cabins.
                </p>
              </div>

              {/* Verified review columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 select-none">
                {[
                  {
                    name: 'Lord Kabir Malhotra',
                    role: 'Venture Capitalist, Bokaro',
                    comment: 'I travel constantly. The Premium Duffle is an absolute masterpiece. It fits perfectly in first-class bins, the leather smells rich and handles rough trips with extreme elegance. Settle for different.',
                    date: 'June 2026'
                  },
                  {
                    name: 'Aanya Sen',
                    role: 'Design Director, Bokaro, Jharkhand',
                    comment: 'The Signature Tote is the perfect blend of structural integrity and modern minimalism. It holds its shape perfectly even when loaded with my laptop and iPad. The gold detailing looks exceptionally high-end.',
                    date: 'May 2026'
                  },
                  {
                    name: 'Rohan Mehra',
                    role: 'Senior Partner Attorney, Bokaro, Jharkhand',
                    comment: 'I carried a Swiss luxury briefcase for ten years, but the ARZEN Laptop Briefcase has replaced it. The pebble leather is flawless and the lock operates with a satisfying weight. Incredible build.',
                    date: 'June 2026'
                  },
                  {
                    name: 'Meera Deshmukh',
                    role: 'Fashion & Luxury Consultant, Bokaro',
                    comment: 'The Luxe Shoulder Bag is sculpted beautifully. I receive compliments every single time I carry it. The 24k gold curb chain has a gorgeous weight and mirror-sheen. Masterclass design!',
                    date: 'June 2026'
                  }
                ].map((rev, idx) => (
                  <div key={idx} className="bg-black/45 backdrop-blur-md border border-white/5 rounded-xs p-6 md:p-8 space-y-4 shadow-lg hover:border-[#C8A25D]/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-[#C8A25D]">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#C8A25D]" />)}
                      </div>
                      <span className="text-[10px] text-white/30 font-mono">{rev.date}</span>
                    </div>
                    <p className="text-xs text-white/80 font-light leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <div className="flex items-center space-x-3 pt-2 border-t border-white/5">
                      <div className="w-8 h-8 rounded-full bg-[#C8A25D]/10 border border-[#C8A25D]/30 flex items-center justify-center font-bold text-xs text-[#C8A25D]">
                        {rev.name[0]}
                      </div>
                      <div>
                        <strong className="block text-xs text-white font-medium">{rev.name}</strong>
                        <span className="text-[10px] text-white/40 block font-light">{rev.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Instagram Masonry Gallery Section */}
          <section className="w-full py-16 md:py-24 px-4 sm:px-8 border-b border-[#C8A25D]/10 bg-transparent">
            <div className="max-w-7xl mx-auto space-y-10 select-none">
              <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block mb-1">THE SOCIAL ARCHIVE</span>
                  <h2 className="text-2xl md:text-3xl font-sans font-medium text-white tracking-wide uppercase">Carry ARZEN Life</h2>
                  <p className="text-xs text-white/55 font-light mt-1">Tag <span className="text-[#C8A25D] font-bold font-mono">#ARZENLife</span> on Instagram to be featured in our seasonal lookbook.</p>
                </div>
                <a
                  href="https://www.instagram.com/arzen.brand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#C8A25D] hover:text-white uppercase transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow @arzen.brand</span>
                </a>
              </div>

              {/* Instagram Photos Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {gallery.length === 0 ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="relative aspect-square bg-[#0F0F0F] border border-[#C8A25D]/15 rounded-xs flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden group">
                      <div className="absolute inset-0 bg-radial-gradient from-[#C8A25D]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                      <Sparkles className="w-5 h-5 text-[#C8A25D] mb-3 animate-pulse relative z-10" />
                      <span className="text-[10px] font-mono tracking-[0.2em] text-[#C8A25D] uppercase block font-semibold leading-tight relative z-10">
                        ARZEN Collection
                      </span>
                      <span className="text-[9px] text-white/40 tracking-wider font-mono block mt-1.5 uppercase leading-relaxed relative z-10">
                        Coming Soon
                      </span>
                    </div>
                  ))
                ) : (
                  gallery.map((item, i) => (
                    <div key={item.id || i} className="group relative aspect-square bg-[#111] rounded-xs overflow-hidden border border-white/5 hover:border-[#C8A25D]/40 transition-all duration-300">
                      <img src={item.url} alt={item.altText || "ARZEN Showcase Asset"} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                        <Instagram className="w-5 h-5 text-[#C8A25D] mb-1.5" />
                        <span className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase font-bold">ARZEN LIFE</span>
                        <span className="text-[11px] text-white/90 font-light font-sans mt-0.5 leading-tight">{item.altText || "ARZEN Masterpiece"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Newsletter subscription block */}
          <Newsletter />

          </div>
        </main>
      )}

      {/* VIEW 2: SHOP CATALOG VIEW */}
      {activeView === 'shop' && (
        <main className="flex-grow">
          <ShopView
            products={products}
            onQuickView={setSelectedProduct}
            onAddToCart={(p, col) => handleAddToCart(p, col)}
            onToggleWishlist={handleToggleWishlist}
            wishlistItems={wishlist}
            currency={currency}
            onBuyNow={(p, col) => handleBuyNowDirect(p, col)}
            initialCategoryFilter={categoryFilter}
            onNavigateToProduct={handleNavigateToProduct}
          />
        </main>
      )}

      {/* VIEW 5: LIFESTYLE COLLECTION VIEW */}
      {activeView === 'lifestyle' && (
        <main className="flex-grow">
          <LifestyleView
            products={products}
            onQuickView={setSelectedProduct}
            onAddToCart={(p, col) => handleAddToCart(p, col)}
            onToggleWishlist={handleToggleWishlist}
            wishlistItems={wishlist}
            currency={currency}
            onBuyNow={(p, col) => handleBuyNowDirect(p, col)}
            onNavigateToProduct={handleNavigateToProduct}
          />
        </main>
      )}

      {/* VIEW 6: PRODUCT DETAILS VIEW */}
      {activeView === 'product-detail' && selectedProductDetails && (
        <main className="flex-grow">
          <ProductDetails
            product={selectedProductDetails}
            allProducts={products}
            onBack={() => {
              window.history.back();
            }}
            onAddToCart={(p, col, qty, size) => handleAddToCart(p, col, qty, size)}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.some((item) => item.id === selectedProductDetails.id)}
            currency={currency}
            onBuyNow={(p, col, qty, size) => {
              handleAddToCart(p, col, qty, size);
              setCartOpen(false);
              setCheckoutOpen(true);
            }}
            onNavigateToProduct={handleNavigateToProduct}
          />
        </main>
      )}

      {/* VIEW 3 & 4: ABOUT & CONTACT VIEWS */}
      {(activeView === 'about' || activeView === 'contact') && (
        <main className="flex-grow">
          <AboutContact type={activeView} />
        </main>
      )}

      {/* Global Interactive Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 px-4">
          {/* Backdrop screen */}
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
          
          <div className="relative bg-[#0F0F0F] border border-[#C8A25D]/25 rounded-xs w-full max-w-2xl shadow-2xl overflow-hidden z-10 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#C8A25D]/10">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A25D] font-bold">LIVE SEARCH PORTAL</span>
              <button 
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }} 
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="TYPE WHAT YOU ARE LOOKING FOR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#161616] border border-[#C8A25D]/30 focus:border-[#C8A25D] rounded-xs py-4 pl-4 pr-10 text-xs font-mono tracking-widest text-white uppercase focus:outline-none placeholder-white/10"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#C8A25D]/60" />
            </div>

            {/* Live Search suggestions */}
            {searchQuery.trim() !== '' && (
              <div className="mt-4 space-y-3.5 max-h-[50vh] overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-xs text-white/40 font-light">
                    No masterpieces found matching your search. Try "tote", "duffle", or "backpack".
                  </div>
                ) : (
                  searchResults.map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => {
                        handleNavigateToProduct(product);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center justify-between hover:bg-white/5 p-2 rounded-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3.5">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 rounded-xs object-cover bg-black" 
                        />
                        <div>
                          <strong className="text-xs text-white font-medium block">{product.name}</strong>
                          <span className="text-[10px] text-white/40 block font-light mt-0.5">{product.tagline}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#C8A25D]">{formatPrice(product.price, currency)}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Quick Categories links */}
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center flex-wrap gap-2 text-[10px] font-mono text-white/50">
              <span className="uppercase">SUGGESTIONS:</span>
              {['Tote', 'Duffle', 'Backpack', 'Sling'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="bg-[#151515] hover:bg-[#C8A25D] hover:text-[#0B0B0B] text-white border border-white/10 hover:border-transparent px-2.5 py-1 rounded-sm uppercase tracking-wider text-[9px] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Account Profile Concierge Drawer */}
      {accountOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setAccountOpen(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-[#0B0B0B] border-l border-[#C8A25D]/25 shadow-2xl flex flex-col h-full text-white">
              <div className="p-6 border-b border-[#C8A25D]/15 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-[#C8A25D]">
                  <User className="w-5 h-5" />
                  <h2 className="text-sm font-mono tracking-[0.2em] uppercase font-bold text-white">
                    Client Vault
                  </h2>
                </div>
                <button onClick={() => setAccountOpen(false)} className="text-[#C8A25D] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Logged In account dashboard details */}
              {account.isLoggedIn ? (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Account detail profile info */}
                  <div className="text-center p-6 bg-[#0F0F0F] border border-[#C8A25D]/20 rounded-xs space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#C8A25D]/10 border border-[#C8A25D]/40 flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 text-[#C8A25D]" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase font-semibold">Verified House Client</span>
                      <h3 className="text-base font-sans font-medium text-white tracking-wide mt-1">Lord {account.name}</h3>
                      <span className="text-[10px] text-white/40 block mt-0.5 lowercase font-mono">{account.email}</span>
                    </div>
                    <div className="pt-2">
                      <span className="inline-block bg-[#C8A25D]/20 text-[#C8A25D] border border-[#C8A25D]/30 px-3 py-1 rounded-sm text-[9px] font-mono tracking-widest uppercase">
                        ★ VIP SOVEREIGN MEMBER
                      </span>
                    </div>
                  </div>

                  {/* Real orders history ledger */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono tracking-widest uppercase text-[#C8A25D] font-bold border-b border-white/5 pb-2">
                      Acquired Masterpieces History
                    </h4>
                    
                    {ArzenDatabase.getOrders().length === 0 ? (
                      <p className="text-[10px] font-sans text-white/40 italic py-3 text-center bg-[#0F0F0F] border border-white/5 rounded-xs">
                        No transactions registered yet on this device ledger.
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                        {ArzenDatabase.getOrders().map((ord) => (
                          <div key={ord.id} className="p-4 bg-[#0F0F0F] border border-[#C8A25D]/10 rounded-xs space-y-3 text-xs">
                            <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5 text-white/50">
                              <span>ORDER REFERENCE: {ord.id}</span>
                              <span className={`font-bold uppercase ${ord.status === 'Cancelled' ? 'text-red-500' : 'text-green-500'}`}>
                                {ord.status}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                  <img 
                                    src={item.selectedColor?.image || item.product.images[0]} 
                                    alt={item.product.name} 
                                    referrerPolicy="no-referrer"
                                    className="w-10 h-12 object-cover bg-black border border-white/10 rounded-xs flex-shrink-0" 
                                  />
                                  <div className="min-w-0">
                                    <strong className="text-white font-medium block text-[11px] truncate">{item.product.name}</strong>
                                    <span className="text-[9.5px] text-white/40 font-mono mt-0.5 block uppercase">
                                      {item.selectedColor?.name || 'Standard'} • {item.selectedSize || 'Regular'} • QTY {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] font-mono">
                              <span className="text-white/40">{new Date(ord.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <span className="text-white font-bold">{formatPrice(ord.total, currency)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Account concierge support info */}
                  <div className="p-4 bg-[#C8A25D]/5 border border-[#C8A25D]/25 rounded-xs space-y-2 text-xs">
                    <span className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold">Your Private Manager</span>
                    <p className="text-white/70 leading-normal font-light">
                      Lord {account.name}, your account is assigned to Senior Concierge manager Kabir Sharma. For priority bespoke adjustments or private gallery bookings, email <a href="mailto:arzen.brand@gmail.com" className="text-[#C8A25D] hover:underline font-mono">arzen.brand@gmail.com</a> directly.
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-3.5 bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-transparent text-[#FF5A5F] hover:text-white text-[10px] font-mono font-bold tracking-widest uppercase transition-colors rounded-xs flex items-center justify-center space-x-2 cursor-pointer focus:outline-none"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Deauthorize Vault Entry</span>
                  </button>

                </div>
              ) : (
                /* Unlogged sign in simulator */
                <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="text-center space-y-2 mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#C8A25D]/10 border border-[#C8A25D]/30 flex items-center justify-center mx-auto">
                        <Lock className="w-5 h-5 text-[#C8A25D]" />
                      </div>
                      <h3 className="text-sm font-mono tracking-widest uppercase text-white font-bold">Vault Client Access</h3>
                      <p className="text-xs text-white/40 max-w-[240px] mx-auto font-light leading-relaxed">
                        Authorize registry credentials to view past order logistics and dispatch monogramming details.
                      </p>
                    </div>

                    {account.error && (
                      <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 text-[11px] text-center font-mono uppercase">
                        {account.error}
                      </div>
                    )}

                    <div>
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Your Registered Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A25D]/60" />
                        <input
                          type="email"
                          required
                          value={account.email}
                          onChange={(e) => setAccount({ ...account, email: e.target.value })}
                          placeholder="client@prestige.com"
                          className="w-full bg-[#111] border border-white/10 focus:border-[#C8A25D] rounded-xs py-3 pl-9 pr-4 text-xs text-white placeholder-white/10 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Vault Key Password</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A25D]/60" />
                        <input
                          type="password"
                          required
                          value={account.password}
                          onChange={(e) => setAccount({ ...account, password: e.target.value })}
                          placeholder="•••••••••••••••"
                          className="w-full bg-[#111] border border-white/10 focus:border-[#C8A25D] rounded-xs py-3 pl-9 pr-4 text-xs text-white placeholder-white/10 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white hover:text-[#0B0B0B] font-mono text-[10px] font-bold tracking-widest uppercase transition-colors rounded-xs flex items-center justify-center space-x-2 cursor-pointer focus:outline-none shadow-lg shadow-[#C8A25D]/5"
                    >
                      <span>Authorize Entry</span>
                    </button>
                    
                    <p className="text-[9px] text-white/30 text-center font-light mt-4 leading-normal italic">
                      Client profiles are tokenized on highly isolated local registries. We do not engage in mailing spam or sales-push data trades.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Product Detail Viewer Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, color, quantity) => {
            handleAddToCart(product, color, quantity);
            setSelectedProduct(null);
          }}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some((item) => item.id === selectedProduct.id)}
          currency={currency}
          onBuyNow={(product, color, quantity) => {
            handleBuyNowDirect(product, color, quantity);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Global Shopping Bag Slider Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        currency={currency}
        setView={handleSetView}
      />

      {/* Global Wishlist Slider Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(product) => {
          handleAddToCart(product);
          setWishlistOpen(false);
        }}
        currency={currency}
        setView={handleSetView}
      />

      {/* Global Checkout Simulation Stepper Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cart}
        currency={currency}
        onClearCart={handleClearCart}
      />

      {/* Premium Footer */}
      <Footer setView={handleSetView} setCategoryFilter={setCategoryFilter} />

    </div>
  );
}
