import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Sliders, 
  Bookmark, 
  Gift, 
  ShieldCheck, 
  Send, 
  HelpCircle,
  TrendingUp,
  X
} from 'lucide-react';
import { Product, ProductColor } from '../types';
import ProductCard from './ProductCard';

interface LifestyleViewProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: ProductColor) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistItems: Product[];
  currency: 'INR' | 'USD' | 'EUR';
  onBuyNow: (product: Product, selectedColor: ProductColor) => void;
  onNavigateToProduct?: (product: Product) => void;
}

interface CollectionDepartment {
  id: string;
  name: string;
  categories: string[];
  description: string;
}

export default function LifestyleView({
  products,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistItems,
  currency,
  onBuyNow,
  onNavigateToProduct,
}: LifestyleViewProps) {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'popularity'>('recommended');
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [preOrderCategory, setPreOrderCategory] = useState('');
  const [preOrderEmail, setPreOrderEmail] = useState('');
  const [preOrderName, setPreOrderName] = useState('');
  const [preOrderSubmitted, setPreOrderSubmitted] = useState(false);

  const productGridRef = useRef<HTMLDivElement>(null);

  // Define logical premium departments grouping the 26 categories
  const departments: CollectionDepartment[] = [
    {
      id: 'All',
      name: 'The Full Edit',
      categories: [],
      description: 'The entire ARZEN premium lifestyle collection. Daily essentials elevated through meticulous design.'
    },
    {
      id: 'hydration',
      name: 'Daily Hydration',
      categories: ['Premium Water Bottles', 'Travel Bottles', 'Coffee Mugs', 'Travel Mugs', 'Tumblers'],
      description: 'Sleek double-insulated flasks, bone-china demitasses, and premium tumblers built for sensory temperature preservation.'
    },
    {
      id: 'scent',
      name: 'Scent & Sun',
      categories: ['Sunglasses', 'Blue Light Glasses', 'Perfumes', 'Candles'],
      description: 'Olfactory signatures of Cambodian Oud, hand-cracked organic wooden-wick candles, and 18k gold-plated eyewear frame precision.'
    },
    {
      id: 'tech',
      name: 'Executive Tech',
      categories: ['Phone Cases', 'Laptop Sleeves', 'Tech Organizers', 'Power Banks', 'Wireless Chargers', 'Bluetooth Speakers', 'AirPods Cases'],
      description: 'MagSafe shells in pebbled calfskin, solid black Italian marble charging pads, and custom audio monitors clad in rich leather.'
    },
    {
      id: 'travel',
      name: 'Elite Travel',
      categories: ['Travel Organizers', 'Toiletry Bags', 'Packing Cubes', 'Keychains', 'Umbrellas'],
      description: 'Zip-around Saffiano passport holders, dual-compartment toiletry caskets, and gents natural malacca-cane canopy umbrellas.'
    },
    {
      id: 'desk',
      name: 'Stationery & Desk',
      categories: ['Notebooks', 'Journals', 'Premium Pens', 'Desk Accessories', 'Premium Gift Sets'],
      description: 'Hand-stretched calfskin logs with gilt page edges, Italian tan suede wrapped diaries, and solid milled heavy brass rollerballs.'
    }
  ];

  // Map each of the 26 categories to elegant metadata, description, and high-quality Unsplash image matching ARZEN luxury dark theme
  const categoryMetadata: { [key: string]: { description: string; image: string; tag: string } } = {
    'Premium Water Bottles': {
      description: 'Insulated vacuum stainless-steel cylinders encased in full-grain Italian calfskin sleeves.',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      tag: 'Vacuum Insulated'
    },
    'Travel Bottles': {
      description: 'Scratch-proof steel travel flasks designed for high-end active transits.',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80',
      tag: 'Aero Grade'
    },
    'Coffee Mugs': {
      description: 'Thick-walled bone china ceramic mugs trimmed in hand-brushed 24k gold leaf rims.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      tag: '24k Gold Accents'
    },
    'Travel Mugs': {
      description: 'Leak-safe double-walled thermal traveler cups dressed in textured liquid silicone.',
      image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
      tag: 'Spill Proof'
    },
    'Tumblers': {
      description: 'Double ceramic lined vacuum cold tumblers coupled with heavy brass straws.',
      image: 'https://images.unsplash.com/photo-1563821137248-9cb943916876?auto=format&fit=crop&w=800&q=80',
      tag: 'Ceramic Shield'
    },
    'Sunglasses': {
      description: 'Japanese beta-titanium wire frames finished in triple-layer 18k gold plating.',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      tag: '18k Gilt'
    },
    'Blue Light Glasses': {
      description: 'Chic brass frames fitted with anti-glare filters shielding high-frequency screens.',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
      tag: 'Blue Block 98%'
    },
    'Perfumes': {
      description: 'Concentrated Cambodian agarwood (Oud) extracts encased in heavy crystal bottles.',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
      tag: 'Oud Extract 28%'
    },
    'Candles': {
      description: 'Slow-burning coconut soy wax candles with softly crackling cherry wood wicks.',
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      tag: 'Crackling Wood Wick'
    },
    'Premium Gift Sets': {
      description: 'Polished walnut boxes enclosing curated arrays of custom engraved leather treasures.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      tag: 'Bespoke Curated'
    },
    'Phone Cases': {
      description: 'Saffiano leather covers with anodized gold camera bezels and MagSafe arrays.',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
      tag: 'Calfskin MagSafe'
    },
    'Laptop Sleeves': {
      description: 'Super-slim scratchproof leather folders lined in velvet to cushion notebooks.',
      image: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&w=800&q=80',
      tag: 'Saffiano Velvet'
    },
    'Tech Organizers': {
      description: 'Deep structured leather zip portfolios with modular anchors for cords and drives.',
      image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80',
      tag: 'Prismatic Order'
    },
    'Power Banks': {
      description: 'Brushed metal 15,000mAh external cell reserves offering 45W fast Power Delivery.',
      image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=800&q=80',
      tag: '45W USB-C PD'
    },
    'Wireless Chargers': {
      description: 'QI chargers milled from raw Nero Marquina black marble slabs with golden rings.',
      image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=800&q=80',
      tag: 'Raw Marble 15W'
    },
    'Bluetooth Speakers': {
      description: 'High-fidelity acoustic monitors with 24k gold mesh wrapped in full-grain leather.',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      tag: 'Artisan Acoustic'
    },
    'AirPods Cases': {
      description: 'Hand-stretched French calfskin covers equipped with heavy milled brass loops.',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      tag: 'Bridle Leather'
    },
    'Travel Organizers': {
      description: 'Zip-around Saffiano document planners arranging passports, cards, and visas.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      tag: 'RFID Protected'
    },
    'Toiletry Bags': {
      description: 'Double compartment travel washbags tailored in waterproof-finished calfskin.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      tag: 'Spill Resistant'
    },
    'Packing Cubes': {
      description: 'Garment compression compartments made in ultra-dense carbon micro-ripstop nylon.',
      image: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=800&q=80',
      tag: 'Compression Set'
    },
    'Keychains': {
      description: 'Heavy solid milled brass trigger-snaps linked with hand-stitched bridle leather.',
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
      tag: 'Milled Brass'
    },
    'Notebooks': {
      description: 'Bound calfskin hardbacks filled with ivory pages carrying hand-brushed gilt edges.',
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80',
      tag: 'Gilt Page Edges'
    },
    'Journals': {
      description: 'Rustic bound diaries wrapped in rich Italian tan suede with long wrap ties.',
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
      tag: 'Italian Suede'
    },
    'Premium Pens': {
      description: 'Heavily weighted solid milled raw brass rollerball pens that patina in your grip.',
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
      tag: 'Solid Brass Core'
    },
    'Desk Accessories': {
      description: 'Snap-corner leather catchalls and pen cylinders that double-flatpack for transits.',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      tag: 'Desk Valet'
    },
    'Umbrellas': {
      description: 'Water-repellant canopies structured over continuous solid-shaft Malacca cane handles.',
      image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd50?auto=format&fit=crop&w=800&q=80',
      tag: 'Malacca Cane'
    }
  };

  // Extract all categories of the Lifestyle collection
  const allCategories = useMemo(() => {
    return Object.keys(categoryMetadata);
  }, []);

  // Filter categories displayed in the grid based on department selection and search query
  const filteredCategories = useMemo(() => {
    const currentDept = departments.find(d => d.id === selectedDepartment);
    return allCategories.filter(cat => {
      // Search matches either the name or description of the category
      const matchesSearch = cat.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            categoryMetadata[cat].description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Department matches if department is 'All' or category is included in department list
      const matchesDept = selectedDepartment === 'All' || (currentDept && currentDept.categories.includes(cat));

      return matchesSearch && matchesDept;
    });
  }, [selectedDepartment, searchQuery, allCategories]);

  // Filter and Sort actual products belonging to the Lifestyle collection
  const lifestyleProductsList = useMemo(() => {
    return products
      .filter(p => {
        // Must belong to one of the 26 lifestyle categories
        const isLifestyle = allCategories.includes(p.category);
        if (!isLifestyle) return false;

        // If a specific category is highlighted, filter by that
        if (selectedCategory && p.category !== selectedCategory) return false;

        // If a department is selected but no specific category, filter products by department categories
        if (!selectedCategory && selectedDepartment !== 'All') {
          const currentDept = departments.find(d => d.id === selectedDepartment);
          if (currentDept && !currentDept.categories.includes(p.category)) return false;
        }

        // Apply general search query
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'popularity') return b.rating - a.rating;
        // Default: recommended/bestsellers first
        const scoreA = (a.isBestSeller ? 10 : 0) + (a.isNewArrival ? 5 : 0);
        const scoreB = (b.isBestSeller ? 10 : 0) + (b.isNewArrival ? 5 : 0);
        return scoreB - scoreA;
      });
  }, [products, selectedCategory, selectedDepartment, searchQuery, sortBy, allCategories]);

  const handleCategoryCardClick = (category: string) => {
    setSelectedCategory(category);
    // Smooth scroll down to the product section
    setTimeout(() => {
      productGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const openPreOrderModal = (category: string) => {
    setPreOrderCategory(category);
    setPreOrderSubmitted(false);
    setIsPreOrderModalOpen(true);
  };

  const handlePreOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preOrderName || !preOrderEmail) return;
    
    // Simulate luxury API booking
    setPreOrderSubmitted(true);
    setTimeout(() => {
      setIsPreOrderModalOpen(false);
      setPreOrderName('');
      setPreOrderEmail('');
    }, 2500);
  };

  const activeDeptDescription = useMemo(() => {
    return departments.find(d => d.id === selectedDepartment)?.description || '';
  }, [selectedDepartment]);

  return (
    <div className="w-full bg-[#0B0B0B] text-white min-h-screen py-16 px-4 sm:px-8 relative overflow-hidden">
      
      {/* Decorative luxury glow backdrops */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C8A25D]/5 rounded-full blur-[140px] pointer-events-none select-none" />
      <div className="absolute bottom-1/3 left-0 w-[450px] h-[450px] bg-[#C8A25D]/5 rounded-full blur-[120px] pointer-events-none select-none" />

      {/* Main Luxury Title Header */}
      <div className="max-w-7xl mx-auto mb-14 text-center space-y-6 relative z-10 animate-fade-in">
        <div className="inline-flex items-center space-x-2 bg-[#C8A25D]/10 border border-[#C8A25D]/25 px-4 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A25D] animate-pulse" />
          <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#C8A25D] font-bold">The ARZEN Lifestyle Edit</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-medium tracking-tight uppercase leading-[1.05]">
          A Legacy Extended
        </h1>
        
        <p className="text-xs sm:text-sm text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
          Introducing a meticulously curated collection of premium accessories, tech implements, and travel companions. 
          Every object represents the ultimate expression of the ARZEN design code—combining absolute structural precision, 
          gilded hand-brushed accents, and premium physical sensory feedback.
        </p>

        <div className="w-14 h-[1px] bg-[#C8A25D]/40 mx-auto" />
      </div>

      {/* Interactive Toolbar: Department Filter Pills, Search Bar, Sorting */}
      <div className="max-w-7xl mx-auto mb-12 bg-[#0F0F0F] border border-[#C8A25D]/15 rounded-sm p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative z-10 select-none shadow-xl">
        
        {/* Department Filter Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0 border-b border-white/5 md:border-transparent">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => {
                setSelectedDepartment(dept.id);
                setSelectedCategory(null); // Reset highlighted category on department switch
              }}
              className={`px-4 py-2 text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 rounded-xs flex-shrink-0 cursor-pointer ${
                selectedDepartment === dept.id 
                  ? 'bg-[#C8A25D] text-[#0B0B0B] shadow-md shadow-[#C8A25D]/10' 
                  : 'bg-transparent text-white/50 border border-white/10 hover:border-[#C8A25D]/30 hover:text-white'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Search Input Box & Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
          
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search lifestyle catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151515] border border-white/10 rounded-xs py-2 pl-3.5 pr-9 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#C8A25D] focus:ring-1 focus:ring-[#C8A25D]/30 transition-all"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-white/20" />
            )}
          </div>

          {/* Sort selection dropdown */}
          <div className="relative w-full sm:w-48">
            <div className="absolute left-3 top-2.5 text-white/30 pointer-events-none flex items-center space-x-1.5">
              <ArrowUpDown className="w-3 h-3" />
              <span className="text-[9px] font-mono uppercase tracking-wider">Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-[#151515] border border-white/10 rounded-xs py-2 pl-14 pr-8 text-xs text-white focus:outline-none focus:border-[#C8A25D] appearance-none cursor-pointer uppercase tracking-widest font-mono text-[9px]"
            >
              <option value="recommended">RECOMMENDED</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="popularity">POPULARITY</option>
            </select>
          </div>

        </div>
      </div>

      {/* Group Description Banner */}
      <div className="max-w-7xl mx-auto mb-10 select-none animate-fade-in">
        <span className="text-[9px] font-mono tracking-[0.2em] text-[#C8A25D] uppercase block mb-1 font-semibold">Active Collection</span>
        <h2 className="text-xl font-sans tracking-wide font-medium text-white uppercase">
          {departments.find(d => d.id === selectedDepartment)?.name}
        </h2>
        <p className="text-[11px] text-white/40 font-light mt-1.5 max-w-2xl leading-relaxed">
          {activeDeptDescription}
        </p>
      </div>

      {/* CATEGORY GRID: Elegant Large Image Cards with Hover scale */}
      <div className="max-w-7xl mx-auto mb-20">
        {filteredCategories.length === 0 ? (
          <div className="w-full py-16 text-center border border-dashed border-white/10 rounded-xs bg-[#0F0F0F] select-none">
            <Sliders className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <h3 className="text-sm font-mono tracking-widest uppercase text-white font-bold">No Categories Found</h3>
            <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto font-light">
              Your active search filters yielded no luxury departments. Try relaxing your search terms.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedDepartment('All'); }}
              className="mt-4 px-4 py-2 bg-[#C8A25D]/10 hover:bg-[#C8A25D] border border-[#C8A25D]/30 hover:border-transparent text-[#C8A25D] hover:text-[#0B0B0B] text-[10px] font-mono tracking-widest uppercase rounded-xs cursor-pointer transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => {
              const meta = categoryMetadata[cat];
              // Check if we have active products for this category
              const catProducts = products.filter(p => p.category === cat && p.status === 'Active');
              const hasProducts = catProducts.length > 0;

              return (
                <div 
                  key={cat}
                  className={`group relative aspect-[4/3] rounded-xs overflow-hidden border transition-all duration-500 ease-out flex flex-col justify-end p-6 cursor-pointer select-none shadow-lg ${
                    selectedCategory === cat 
                      ? 'border-[#C8A25D] ring-1 ring-[#C8A25D]/30 scale-98 shadow-[#C8A25D]/10' 
                      : 'border-white/5 hover:border-[#C8A25D]/40 hover:shadow-[#C8A25D]/5'
                  }`}
                  onClick={() => handleCategoryCardClick(cat)}
                >
                  {/* Category Image Cover Backdrop */}
                  <div className="absolute inset-0 z-0 bg-[#0E0E0E]">
                    <img 
                      src={meta.image} 
                      alt={cat}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1200ms] ease-out filter brightness-[0.7] contrast-[1.05]" 
                    />
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Corner Brand Seal or Category Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center justify-between w-[calc(100%-32px)]">
                    <span className="bg-[#0B0B0B]/85 backdrop-blur-md border border-[#C8A25D]/25 text-[8px] font-mono tracking-widest text-[#C8A25D] font-bold px-2.5 py-1 rounded-sm uppercase">
                      {meta.tag}
                    </span>
                    <span className="text-[8.5px] font-mono tracking-widest text-white/30 group-hover:text-[#C8A25D] transition-colors">
                      {hasProducts ? `${catProducts.length} AVAILABLE` : 'BESPOKE COMM.'}
                    </span>
                  </div>

                  {/* Category Content Information */}
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-lg font-sans font-medium tracking-wide text-white uppercase group-hover:text-[#FCEECB] transition-colors">
                      {cat}
                    </h3>
                    <p className="text-[10.5px] text-white/55 font-light leading-relaxed max-w-md group-hover:text-white/80 transition-colors">
                      {meta.description}
                    </p>
                    
                    {/* Interactive Reveal button */}
                    <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#C8A25D] uppercase pt-2 font-bold group-hover:translate-x-1 transition-transform duration-300">
                      <span>{hasProducts ? 'Browse Masterpieces' : 'Inquire Bespoke Commission'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Outer Gilded gold thin border highlight */}
                  <div className="absolute inset-2 border border-transparent group-hover:border-[#C8A25D]/15 rounded-xs pointer-events-none transition-colors duration-500" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FILTERED PRODUCTS GALLERY SECTION */}
      <div 
        ref={productGridRef}
        className="max-w-7xl mx-auto pt-16 border-t border-[#C8A25D]/15 scroll-mt-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4 select-none">
          <div>
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#C8A25D] uppercase block font-semibold mb-1">
              {selectedCategory ? `${selectedCategory} catalog` : 'Lifestyle Catalog'}
            </span>
            <h2 className="text-2xl font-sans tracking-wide font-medium text-white uppercase flex items-center gap-3">
              <span>{selectedCategory ? selectedCategory : 'All Available Masterpieces'}</span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-[#C8A25D]/15 text-[#C8A25D] hover:bg-[#C8A25D] hover:text-[#0B0B0B] border border-[#C8A25D]/30 hover:border-transparent px-2.5 py-1 rounded-sm text-[8px] font-mono font-bold tracking-widest uppercase transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>CLEAR FILTER</span>
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </h2>
            <p className="text-xs text-white/40 mt-1 font-light max-w-xl">
              Each piece is meticulously finished, carrying the authentic ARZEN gold triangular logo stamp, 
              double saddle stitch lines, and heavy gold-plated solid hardware details.
            </p>
          </div>
          
          <div className="text-[10.5px] font-mono tracking-widest text-white/40 uppercase">
            Showing <strong className="text-white">{lifestyleProductsList.length}</strong> items of the collection
          </div>
        </div>

        {/* Real Product Grid */}
        {lifestyleProductsList.length === 0 ? (
          <div className="w-full py-16 px-6 text-center border border-dashed border-[#C8A25D]/20 rounded-xs bg-[#0F0F0F] space-y-4 select-none flex flex-col items-center justify-center">
            <Compass className="w-10 h-10 text-[#C8A25D] animate-spin-slow" />
            <div className="space-y-1">
              <h3 className="text-sm font-mono tracking-widest uppercase text-white font-bold">
                {selectedCategory ? `Bespoke Commissions Open for ${selectedCategory}` : 'No Available Masterpieces'}
              </h3>
              <p className="text-xs text-white/40 max-w-md mx-auto font-light leading-relaxed">
                We are currently crafting the launch inventory for this specific category. 
                You can place an early booking to receive an individually numbered piece with complimentary 24k gold monogramming.
              </p>
            </div>
            
            <button
              onClick={() => openPreOrderModal(selectedCategory || 'Lifestyle Item')}
              className="px-6 py-3.5 bg-[#C8A25D] hover:bg-white text-[#0B0B0B] text-[10px] font-mono font-bold tracking-widest uppercase rounded-xs transition-colors flex items-center space-x-2 cursor-pointer shadow-lg hover:shadow-[#C8A25D]/20"
            >
              <span>INQUIRE & REGISTER INTEREST</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lifestyleProductsList.map((product) => {
              const isWishlisted = wishlistItems.some((item) => item.id === product.id);
              return (
                <div key={product.id} className="animate-fade-in-up">
                  <ProductCard
                    product={product}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={isWishlisted}
                    currency={currency}
                    onBuyNow={onBuyNow}
                    onClick={onNavigateToProduct}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SEO & BRAND GUARANTEE CONTENT SECTION */}
      <section className="max-w-7xl mx-auto mt-24 border-t border-[#C8A25D]/15 pt-16 select-none relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#C8A25D]/10 border border-[#C8A25D]/30 flex items-center justify-center text-[#C8A25D] font-mono text-xs font-bold mx-auto md:mx-0">
              01
            </div>
            <h4 className="text-xs font-mono tracking-widest uppercase text-white font-bold">The Leather Standard</h4>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              We exclusively use the top 3% of French full-grain calfskins. 
              Each hide is cured using eco-sustainable oak-bark wood extracts, 
              creating a gorgeous material that will slow-patina beautifully over generations.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#C8A25D]/10 border border-[#C8A25D]/30 flex items-center justify-center text-[#C8A25D] font-mono text-xs font-bold mx-auto md:mx-0">
              02
            </div>
            <h4 className="text-xs font-mono tracking-widest uppercase text-white font-bold">Guaranteed Restoration</h4>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              All ARZEN accessories carry our signature Lifetime Repair or Replace Assurance. 
              Whether a snap rivet loosens or a heavy German nylon saddle stitch splits over your lifetimes, 
              return it to our Bokaro, Jharkhand atelier for full restoration.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#C8A25D]/10 border border-[#C8A25D]/30 flex items-center justify-center text-[#C8A25D] font-mono text-xs font-bold mx-auto md:mx-0">
              03
            </div>
            <h4 className="text-xs font-mono tracking-widest uppercase text-white font-bold">Monogramming & Gifts</h4>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              Enjoy complimentary heated gold-leaf embossing on all leather elements. 
              All lifestyle orders are packaged inside wood presentation boxes or rigid canvas cylindrical boxes, 
              unifying ultimate elegance and safe transits.
            </p>
          </div>

        </div>
      </section>

      {/* BESPOKE BOOKING / NOTIFY MODAL DIALOG */}
      {isPreOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsPreOrderModalOpen(false)} />
          
          <div className="relative bg-[#0F0F0F] border border-[#C8A25D]/30 rounded-sm w-full max-w-md p-6 sm:p-8 text-white z-10 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2 text-[#C8A25D]">
                <Bookmark className="w-4 h-4 animate-bounce" />
                <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-white">Private Commissions</h3>
              </div>
              <button 
                onClick={() => setIsPreOrderModalOpen(false)}
                className="text-[#C8A25D] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {preOrderSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500 flex items-center justify-center mx-auto text-green-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-mono tracking-widest uppercase font-bold text-white">Commission Confirmed</h4>
                  <p className="text-xs text-white/50 max-w-[280px] mx-auto leading-relaxed font-light">
                    Your luxury register booking has been authorized. 
                    A Private Client Manager will reach out to you within 12 hours with customized material and monogram options.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePreOrderSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase font-semibold">Inquiry Registry For</span>
                  <h4 className="text-sm font-sans font-medium text-white uppercase">{preOrderCategory}</h4>
                  <p className="text-[10px] text-white/40 leading-relaxed font-light">
                    Register interest in custom materials (French Calf, Croco-embossed, Suede) and secure early reservation.
                  </p>
                </div>

                <div className="h-[1px] bg-white/5" />

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Charles Windsor"
                      value={preOrderName}
                      onChange={(e) => setPreOrderName(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-xs py-2 px-3 text-white focus:outline-none focus:border-[#C8A25D]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase font-bold">Private Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. lordwindsor@sovereign.co"
                      value={preOrderEmail}
                      onChange={(e) => setPreOrderEmail(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-xs py-2 px-3 text-white focus:outline-none focus:border-[#C8A25D]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#C8A25D] hover:bg-white text-[#0B0B0B] text-[10px] font-mono font-bold tracking-widest uppercase transition-colors rounded-xs flex items-center justify-center space-x-2 cursor-pointer focus:outline-none"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>AUTHORIZE COMMISSION INQUIRY</span>
                  </button>
                </div>
              </form>
            )}

            <div className="bg-[#C8A25D]/5 border border-[#C8A25D]/15 p-3 rounded-xs text-[9.5px] font-mono text-white/50 leading-relaxed">
              * By commissioning, you secure priority access to leather allocation in the Bokaro, Jharkhand workshops. No initial deposit is charged.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
