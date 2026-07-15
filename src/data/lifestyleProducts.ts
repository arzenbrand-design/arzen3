import { Product } from '../types';

export const lifestyleProducts: Product[] = [
  {
    id: 'arz-lf-001',
    name: 'ARZEN Insulated Elixir Flask',
    tagline: 'Pure hydration, architectural silhouette',
    price: 3499,
    rating: 4.9,
    reviewsCount: 72,
    category: 'Premium Water Bottles',
    images: [
      '/assets/arzen-handbag-y.svg',
      '/assets/arzen-backpack-pink.svg'
    ],
    colors: [
      { name: 'Matte Obsidian', hex: '#0B0B0B', image: '/assets/arzen-handbag-y.svg' },
      { name: 'Polished Aurum', hex: '#C8A25D', image: '/assets/arzen-backpack-pink.svg' }
    ],
    description: 'Double-walled vacuum insulated, forged from surgical-grade stainless steel with a micro-suede slip-proof leather sleeve and a heavy solid brass carrier loop. Keeps your elixirs ice-cold for 36 hours or hot for 18 hours.',
    materials: [
      '18/10 Surgical Grade Stainless Steel',
      'Full grain vegetable-tanned Italian calfskin wrap',
      'BPA-free medical silicone gaskets'
    ],
    dimensions: '9.8" H x 2.9" Diameter',
    capacity: '750 ml',
    features: [
      'Zerocondensation vacuum seal architecture',
      'Removable modular leather sleeve with embossed gold shield',
      'Heavy solid-brass carrying clasp'
    ],
    warranty: 'Lifetime structural integrity warranty',
    shipping: 'Complimentary shipping in bespoke tubular slide-box package.',
    returns: 'Complimentary 7-day returns.',
    isBestSeller: true
  },
  {
    id: 'arz-lf-002',
    name: 'ARZEN Sentry Travel Canteen',
    tagline: 'Sleek companion for global coordinates',
    price: 2999,
    rating: 4.8,
    reviewsCount: 45,
    category: 'Travel Bottles',
    images: [
      '/assets/arzen-backpack-classic.svg'
    ],
    colors: [
      { name: 'Carbon Black', hex: '#1C1C1C', image: '/assets/arzen-backpack-classic.svg' }
    ],
    description: 'Ultra-durable, scratch-proof powder finish travel canteen designed to fit seamlessly in luxury luggage side sleeves. Ergonomically weighted for perfect physical balance.',
    materials: [
      'High density tempered steel shell',
      'Solid copper internal lining for thermal retention'
    ],
    dimensions: '8.4" H x 2.7" Diameter',
    capacity: '500 ml',
    features: [
      'TSA-approved volume profile',
      'Magnetic cap clip keeping the spout cover secure',
      'Leather-accented protective base pad'
    ],
    warranty: '5-Year thermic assurance guarantee',
    shipping: 'Complimentary luxury packing.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-003',
    name: 'ARZEN Aurum Rimmed Demitasse',
    tagline: 'Morning rituals, gold standard refinement',
    price: 1999,
    rating: 4.9,
    reviewsCount: 58,
    category: 'Coffee Mugs',
    images: [
      '/assets/arzen-backpack-pink.svg'
    ],
    colors: [
      { name: 'Shadow Ceramic', hex: '#121212', image: '/assets/arzen-backpack-pink.svg' }
    ],
    description: 'Meticulously thrown bone-china ceramic mug coated in high-tactility charcoal glaze, featuring an exquisite hand-painted 24k liquid gold rim and an architectural flat-loop handle.',
    materials: [
      'Fine kaolin bone-china porcelain',
      '24k liquid gold leaf gilding',
      'Food-safe lead-free inert glazing'
    ],
    dimensions: '3.6" H x 3.4" Diameter',
    capacity: '320 ml',
    features: [
      'Ergonomically balanced heavy baseline prevents tipping',
      'Thick thermal clay retaining perfect temperature',
      'Individually numbered signature stamp at bottom'
    ],
    warranty: 'Coverage for glaze micro-crazing over 5 years',
    shipping: 'Shipped in wooden cedar crate nestled in linen wood-shavings.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-004',
    name: 'ARZEN Commuter Thermal Vessel',
    tagline: 'Your premium brew, securely insulated',
    price: 3299,
    rating: 4.7,
    reviewsCount: 39,
    category: 'Travel Mugs',
    images: [
      '/assets/arzen-tote-vertical.svg'
    ],
    colors: [
      { name: 'Sovereign Gray', hex: '#2C2C2C', image: '/assets/arzen-tote-vertical.svg' }
    ],
    description: 'Double-walled copper-plated travel mug with high-grade leak-proof spill lock mechanism. Tailored in heavy textured charcoal silicone sleeve for premium tactility.',
    materials: [
      'Double-wall 304 food stainless steel',
      'Heavy textured tactile liquid silicone sleeve'
    ],
    dimensions: '7.1" H x 3.2" Base Width',
    capacity: '400 ml',
    features: [
      'Full 360-degree leak-safe lid lock',
      'Sized perfectly to sit in luxury sports car cup holders',
      'Single button click lock pour system'
    ],
    warranty: '2-Year mechanical seal warranty',
    shipping: 'Complimentary standard express packaging.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-005',
    name: 'ARZEN Sovereign Matte Tumbler',
    tagline: 'Elevate daily sips with metallic straw',
    price: 3999,
    rating: 4.8,
    reviewsCount: 81,
    category: 'Tumblers',
    images: [
      '/assets/arzen-tote-vertical.svg'
    ],
    colors: [
      { name: 'Matte Obsidian', hex: '#0B0B0B', image: '/assets/arzen-tote-vertical.svg' }
    ],
    description: 'Bold visual statement. Massive 900ml thermal tumbler with a matching matte black ceramic-coated interior and a solid brass-plated luxury reusable metal straw.',
    materials: [
      'Matte powder steel and internal ceramic lining',
      'Titanium-plated reusable golden straw'
    ],
    dimensions: '8.2" H x 3.8" Rim Width',
    capacity: '900 ml',
    features: [
      'Premium taste-free double ceramic-shield inner liner',
      'Included luxury golden straw cleaning kit',
      'Heavy double-insulated thermal wall'
    ],
    warranty: 'Lifetime body and lid warranty',
    shipping: 'Bespoke cylindrical box package.',
    returns: 'Complimentary 7-day returns.',
    isBestSeller: true
  },
  {
    id: 'arz-lf-006',
    name: 'ARZEN Aviator Sovereign Frame',
    tagline: 'Gilded sunglasses, sculptural precision',
    price: 9999,
    rating: 5.0,
    reviewsCount: 110,
    category: 'Sunglasses',
    images: [
      '/assets/arzen-handbag-chain.svg'
    ],
    colors: [
      { name: 'Luxury Gold & Slate', hex: '#C8A25D', image: '/assets/arzen-handbag-chain.svg' }
    ],
    description: 'Architectural hand-polished Japanese titanium wire frame, layered with 18k solid gold plating and paired with polarized carbon-composite lenses blocking 100% of UVA/UVB rays.',
    materials: [
      'Pure Japanese Titanium Core Frame',
      '18k Triple-layer Electroplated Gold Shell',
      'Anti-reflective polarized premium lenses'
    ],
    dimensions: '58mm Lens - 14mm Bridge - 145mm Temple Length',
    capacity: 'Ultra lightweight 14g',
    features: [
      'Comes with handmade pebbled leather folding hard case',
      'Gold monogrammed brand emblem on temple tip',
      'Micro-hinges for infinite flexibility'
    ],
    warranty: 'Lifetime frame alignment guarantee',
    shipping: 'Shipped in velvet-lined sliding hard chest.',
    returns: '7-Day complimentary returns.',
    isBestSeller: true
  },
  {
    id: 'arz-lf-007',
    name: 'ARZEN Tech Blue-Light Glasses',
    tagline: 'Pristine digital strain shields',
    price: 8499,
    rating: 4.8,
    reviewsCount: 63,
    category: 'Blue Light Glasses',
    images: [
      '/assets/arzen-handbag-chain.svg'
    ],
    colors: [
      { name: 'Brushed Brass', hex: '#B5945B', image: '/assets/arzen-handbag-chain.svg' }
    ],
    description: 'Slim brushed-brass aesthetic wire frame fitted with zero-tint clear lenses designed to block 98% of harmful blue frequency radiation from high-fidelity screens.',
    materials: [
      'Beta-titanium high flexibility alloy',
      'Advanced hard-coat anti-scratch blue barrier lenses'
    ],
    dimensions: '52mm Lens - 18mm Bridge - 140mm Temples',
    capacity: '11 grams',
    features: [
      'Hydrophobic and oleophobic dust-proof lens coating',
      'Adjustable soft organic silicone nose cushions',
      'Includes micro-fiber gold printed dusting cloth'
    ],
    warranty: '2-Year warranty on lens coatings',
    shipping: 'Complimentary shipping.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-008',
    name: 'ARZEN Oud Imperial Perfume',
    tagline: 'A sensory signature of extreme distinction',
    price: 11999,
    rating: 5.0,
    reviewsCount: 142,
    category: 'Perfumes',
    images: [
      '/assets/arzen-handbag-charm.svg'
    ],
    colors: [
      { name: 'Onyx Bottle', hex: '#0B0B0B', image: '/assets/arzen-handbag-charm.svg' }
    ],
    description: 'An immersive olfactory portrait of luxury. Dark Cambodian agarwood (Oud) masterfully combined with Damascene rose petals, warm saffron leather, and rich Madagascar vanilla, housed in heavy crystal glass.',
    materials: [
      'Pure organic Cambodian oud distillate',
      'Imported French perfume concentration oil (28% EDP Extract)',
      'Hand-blown crystal bottle'
    ],
    dimensions: '100 ml (3.4 FL. OZ.)',
    capacity: '100 ml',
    features: [
      'Magnetic solid metal cap with laser engraved crest',
      'High dispersion atomized micro-mist sprayer',
      'Stays vivid on garments for up to 48 hours'
    ],
    warranty: 'Authenticity of formula guarantee',
    shipping: 'Nestled in deep charcoal satin foam presentation chest.',
    returns: 'Complimentary 7-day return (if spray cell is un-broached).',
    isBestSeller: true
  },
  {
    id: 'arz-lf-009',
    name: 'ARZEN Sovereign Amber Scented Candle',
    tagline: 'Warm amber flames, slow burning poetry',
    price: 4499,
    rating: 4.9,
    reviewsCount: 89,
    category: 'Candles',
    images: [
      '/assets/arzen-handbag-charm.svg'
    ],
    colors: [
      { name: 'Amber Glow', hex: '#D4AF37', image: '/assets/arzen-handbag-charm.svg' }
    ],
    description: 'Hand-poured slow-melting soy wax infused with essential notes of leather, patchouli, and warm amber. Features an organic wood wick that crackles softly like an open hearth.',
    materials: [
      '100% Organic natural soy and coconut wax blend',
      'Dual organic flat-grain cherry wood wicks',
      'Amber-plated apothecary glass'
    ],
    dimensions: '4.2" H x 3.6" Diameter',
    capacity: '14 oz (80 Hour Burn Time)',
    features: [
      'Clean toxin-free zero-soot burn signature',
      'Crackling atmospheric sound profile',
      'Includes gold-finished metal extinguisher lid'
    ],
    warranty: 'Even melting assurance',
    shipping: 'Complimentary shipping in rigid gold-pressed box.',
    returns: '7-day returns for unburnt candle.'
  },
  {
    id: 'arz-lf-010',
    name: 'ARZEN Sovereign Desk Gift Set',
    tagline: 'The consummate offering for modern leaders',
    price: 15999,
    rating: 4.9,
    reviewsCount: 33,
    category: 'Premium Gift Sets',
    images: [
      '/assets/arzen-suit-bag.svg'
    ],
    colors: [
      { name: 'Luxe Set (Gold & Black)', hex: '#C8A25D', image: '/assets/arzen-suit-bag.svg' }
    ],
    description: 'A curated masterpiece box containing three of ARZEN\'s most iconic lifestyle elements: The Premium Pen, Suede Journal, and Bridle Leather Keychain, all custom engraved.',
    materials: [
      'Polished brass fittings and solid walnut frame box',
      'Full grain cowhide accessories trim'
    ],
    dimensions: '12" L x 10" W x 4.5" H',
    capacity: '3 Curated Luxury Units',
    features: [
      'Includes personalized calligraphed letter with 24k wax stamp',
      'Complimentary custom monogramming on all 3 inside pieces',
      'Velveteen interior dividers'
    ],
    warranty: 'Lifetime Arzen assurance',
    shipping: 'Hand-delivered or express insured courier shipment.',
    returns: 'Non-refundable once customized.',
    isBestSeller: true
  },
  {
    id: 'arz-lf-011',
    name: 'ARZEN Pebbled MagSafe Shell',
    tagline: 'Pebbled leather shell, golden shield',
    price: 3499,
    rating: 4.8,
    reviewsCount: 156,
    category: 'Phone Cases',
    images: [
      '/assets/arzen-suit-bag.svg'
    ],
    colors: [
      { name: 'Matte Black', hex: '#0B0B0B', image: '/assets/arzen-suit-bag.svg' }
    ],
    description: 'Perfect MagSafe compatibility encased in robust Saffiano leather, finished with anodized golden camera bezel trim and the Arzen triangle gold foil shield.',
    materials: [
      'Saffiano Full Grain Calfskin Cover',
      'TPU Shock-absorbent composite internal buffer',
      'Milled neodymium magnetic matrix ring'
    ],
    dimensions: 'Tailored for iPhone 15 & 16 Pro/Pro Max Series',
    capacity: 'MagSafe Compatible',
    features: [
      '10-Foot certified drop impact safety',
      'Anodized scratch-proof camera rim elevation',
      'Warm micro-fiber interior lining protects phone body'
    ],
    warranty: '1-Year leather peeling replacement warranty',
    shipping: 'Complimentary shipping.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-012',
    name: 'ARZEN Saffiano Laptop Folio',
    tagline: 'Pristine structure for essential silicon',
    price: 6999,
    rating: 4.9,
    reviewsCount: 94,
    category: 'Laptop Sleeves',
    images: [
      '/assets/arzen-suit-bag.svg'
    ],
    colors: [
      { name: 'Sovereign Black', hex: '#000000', image: '/assets/arzen-suit-bag.svg' }
    ],
    description: 'Extremely thin, sleek leather folder lined with shock-absorbing foam and luxury velvet to shield your notebook during executive travel.',
    materials: [
      'Saffiano cross-grain scratchproof leather',
      'Anti-impact interior high density foam layers',
      'Heavy velvet friction-less liner'
    ],
    dimensions: '13.8" W x 9.8" H x 0.6" D (Fits up to 14" laptop)',
    capacity: '14" Laptop Profile',
    features: [
      'Hidden magnetic lid locking mechanism',
      'Rear document slip pocket',
      'Sleek raw edge hand-painted paint coat'
    ],
    warranty: 'Lifetime leather repair cover',
    shipping: 'Complimentary shipping.',
    returns: '7-day returns.',
    isBestSeller: true
  },
  {
    id: 'arz-lf-013',
    name: 'ARZEN Tech Accessory Ledger',
    tagline: 'Perfect harmony for cables and chips',
    price: 5499,
    rating: 4.7,
    reviewsCount: 50,
    category: 'Tech Organizers',
    images: [
      '/assets/arzen-suit-bag.svg'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0B0B0B', image: '/assets/arzen-suit-bag.svg' }
    ],
    description: 'Heavy structure leather utility kit, organized internally with flexible mesh compartments, secure memory card slots, and integrated golden cable anchor clips.',
    materials: [
      'Milled full grain calfskin',
      'Industrial-grade gold teeth zippers',
      'Heavy elasticity woven elastic'
    ],
    dimensions: '8.6" W x 5.2" H x 2.4" D',
    capacity: '2 Liters',
    features: [
      '12 Dedicated organizational slots',
      'Secret micro-SD or SIM card leather pocket',
      'External grab handle for secure travel carry'
    ],
    warranty: 'Lifetime mechanical zipper guarantee',
    shipping: 'Complimentary shipping.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-014',
    name: 'ARZEN Gold Brushed Power Reserve',
    tagline: 'Backup energy, exquisite physical profile',
    price: 5999,
    rating: 4.8,
    reviewsCount: 38,
    category: 'Power Banks',
    images: [
      '/assets/arzen-backpack-built-different.svg'
    ],
    colors: [
      { name: 'Brushed Aurum', hex: '#C8A25D', image: '/assets/arzen-backpack-built-different.svg' }
    ],
    description: 'An elegant heavy metal battery pack, offering 15,000mAh capacity wrapped in brushed gold-plated casing with USB-C Power Delivery at 45W speed.',
    materials: [
      'Brushed titanium alloy with electroplated gold finish',
      'Premium high density lithium polymer cells'
    ],
    dimensions: '5.4" L x 2.7" W x 0.5" Thin',
    capacity: '15,000 mAh (45W Fast Charging)',
    features: [
      'Can charge a 13" Macbook Pro to 50% in 45 minutes',
      'Discreet microscopic LED capacity display array',
      'Over-current and thermal heat protection'
    ],
    warranty: '2-Year complete electronics replacement',
    shipping: 'Complimentary premium express shipping.',
    returns: '7-day returns.'
  },
  {
    id: 'arz-lf-015',
    name: 'ARZEN Alabaster Wireless Charger',
    tagline: 'Sovereign desk companion, zero wires',
    price: 4999,
    rating: 4.9,
    reviewsCount: 46,
    category: 'Wireless Chargers',
    images: [
      '/assets/arzen-backpack-built-different.svg'
    ],
    colors: [
      { name: 'Onyx Black Marble', hex: '#111111', image: '/assets/arzen-backpack-built-different.svg' }
    ],
    description: 'Milled from a solid slab of Italian Nero Marquina black marble with a golden solid-brass rim. Powers up your devices via QI fast-charge protocol at 15W.',
    materials: [
      'Authentic Nero Marquina Italian Marble Core',
      'Solid brass perimeter rim',
      'Nonslip velvet backing'
    ],
    dimensions: '4.0" Diameter x 0.4" Thin',
    capacity: '15W Fast Charge Output',
    features: [
      'Each charging plate contains entirely unique marble vein patterns',
      'Qi and MagSafe compliant alignment magnets',
      'Includes premium gold-braided 1.5m USB-C cable'
    ],
    warranty: '3-Year functional warranty',
    shipping: 'Premium secure packaging.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-016',
    name: 'ARZEN Resonance Bluetooth Speaker',
    tagline: 'Artisan sound, architectural metal mesh',
    price: 12999,
    rating: 4.9,
    reviewsCount: 112,
    category: 'Bluetooth Speakers',
    images: [
      '/assets/arzen-duffle.svg'
    ],
    colors: [
      { name: 'Onyx & Gold', hex: '#1C160E', image: '/assets/arzen-duffle.svg' }
    ],
    description: 'Stunning portable speaker delivering warm high-fidelity acoustics. Sculpted with gold-plated metal mesh and wrapped in supple full grain black leather.',
    materials: [
      'Aero-grade aluminum mesh with 24k gold leaf finishing',
      'Full grain vegetable tanned leather wraps',
      'Neodymium custom audio drivers'
    ],
    dimensions: '7.8" W x 3.6" H x 2.2" D',
    capacity: '20W Hi-Fi Output (16h Battery)',
    features: [
      'Ultra stable Bluetooth 5.3 protocol range up to 50ft',
      'Built-in studio grade speakerphone with noise isolation',
      'Dual passive bass resonators create full rich depth'
    ],
    warranty: 'Lifetime mechanical / 3-Year driver warranty',
    shipping: 'Insured premium package delivery with protective sleeve.',
    returns: 'Complimentary 7-day returns.',
    isBestSeller: true
  },
  {
    id: 'arz-lf-017',
    name: 'ARZEN Full Grain AirPods Case',
    tagline: 'Sovereign armor for high-fidelity audio',
    price: 2499,
    rating: 4.8,
    reviewsCount: 140,
    category: 'AirPods Cases',
    images: [
      '/assets/arzen-duffle.svg'
    ],
    colors: [
      { name: 'Cognac Gold', hex: '#B87333', image: '/assets/arzen-duffle.svg' }
    ],
    description: 'Hand-stretched French calfskin leather casing designed specifically for AirPods Pro. Finished with solid brass custom carabiner clip.',
    materials: [
      'French vegetable-tanned bridle leather',
      'Polished heavy brass modular clip'
    ],
    dimensions: '2.5" W x 1.8" H x 0.9" D',
    capacity: 'AirPods Pro 1 & 2 Fitted',
    features: [
      'Laser-aligned cutouts for speaker ports and status LED',
      'Unobstructed Qi wireless charging and cord sync compatibility',
      'Luxurious interior suede lining prevents micro-scratching'
    ],
    warranty: '1-Year leather replacement cover',
    shipping: 'Complimentary shipping.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-018',
    name: 'ARZEN Voyager Passport Portfolio',
    tagline: 'Keep your credentials in absolute sovereign order',
    price: 5999,
    rating: 4.9,
    reviewsCount: 65,
    category: 'Travel Organizers',
    images: [
      '/assets/arzen-duffle.svg'
    ],
    colors: [
      { name: 'Matte Obsidian', hex: '#0B0B0B', image: '/assets/arzen-duffle.svg' }
    ],
    description: 'Zip-around travel planner handcrafted from robust Saffiano calfskin. Accommodates dual passports, foreign currencies, boarding cards, and features an integrated heavy gold stylus.',
    materials: [
      'Full grain textured French leather core',
      'Liquid gold foil internal linings',
      'Polished brass heavy-duty zippers'
    ],
    dimensions: '8.8" L x 5.0" W x 0.8" D',
    capacity: '8 Card Slots, Dual Passports',
    features: [
      'Certified RFID protective mesh shielding layers',
      'Rear quick-slip boarding card pocket',
      'Premium gold plated miniature signature pen included'
    ],
    warranty: 'Lifetime mechanical and leather restoration assurance',
    shipping: 'Complimentary shipping in gold-crest gift sleeve.',
    returns: 'Complimentary 7-day returns.',
    isBestSeller: true
  },
  {
    id: 'arz-lf-019',
    name: 'ARZEN Premier Leather Washbag',
    tagline: 'Your personal grooming kit, elevated',
    price: 6499,
    rating: 4.9,
    reviewsCount: 78,
    category: 'Toiletry Bags',
    images: [
      '/assets/arzen-duffle.svg'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#000000', image: '/assets/arzen-duffle.svg' }
    ],
    description: 'Dual compartment luxury wash kit, tailored in water-resistant treated pebbled leather with a custom spill-proof interior lining.',
    materials: [
      'Spill-proof waterproof nylon interior lining',
      'Waterproof-treated premium pebble calfskin exterior'
    ],
    dimensions: '10.2" W x 5.8" H x 4.2" D',
    capacity: '4 Liters',
    features: [
      'Dual independent zipper vaults',
      'Four interior expandable mesh bottles secure hoops',
      'Solid-brass protective metal feet at the baseline'
    ],
    warranty: 'Lifetime zipper functional warranty',
    shipping: 'Complimentary standard express packaging.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-020',
    name: 'ARZEN Sentry Packing Cubes',
    tagline: 'Compression with absolute cosmetic order',
    price: 4999,
    rating: 4.8,
    reviewsCount: 52,
    category: 'Packing Cubes',
    images: [
      '/assets/arzen-duffle.svg'
    ],
    colors: [
      { name: 'Carbon Black Set', hex: '#1E1E1E', image: '/assets/arzen-duffle.svg' }
    ],
    description: 'Set of three ultra-lightweight water-resistant double-compressed packing vaults, designed to optimize cabinet volume inside your Arzen suitcases.',
    materials: [
      'Ultra density rip-stop woven micro-nylon',
      'Breathable visual mesh screens'
    ],
    dimensions: 'Large (14"x10"), Med (11"x8"), Small (9"x6")',
    capacity: 'Set of 3 Compression Vaults',
    features: [
      'Heavy-duty double compression zip design saves 40% volume',
      'Leather border linings and golden identification tabs',
      'Flat-collapsible profile when empty'
    ],
    warranty: '5-Year tear-free material replacement cover',
    shipping: 'Complimentary shipping.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-021',
    name: 'ARZEN Bridle Valet Keychain',
    tagline: 'Secure your assets with heavy solid brass',
    price: 1499,
    rating: 4.9,
    reviewsCount: 198,
    category: 'Keychains',
    images: [
      '/assets/arzen-handbag-charm.svg'
    ],
    colors: [
      { name: 'Sovereign Tan', hex: '#8B5A2B', image: '/assets/arzen-handbag-charm.svg' }
    ],
    description: 'Heavy solid milled brass trigger-snap clip combined with double-faced hand-stitched French bridle leather band.',
    materials: [
      'Saddle stitched French bridle leather',
      'Milled high-polish marine brass metalware'
    ],
    dimensions: '4.8" Total Length',
    capacity: 'Holds up to 10 keys',
    features: [
      'Quick-release trigger snap easily clips to Arzen bag loops',
      'Deep hot-stamped gold foil custom crest',
      'Dual metal split rings included'
    ],
    warranty: 'Lifetime structural replacement guarantee',
    shipping: 'Complimentary shipping.',
    returns: '7-day returns.',
    isBestSeller: true
  },
  {
    id: 'arz-lf-022',
    name: 'ARZEN Gilt-Edged Ledger',
    tagline: 'Record your blueprints on pure ivory parchment',
    price: 2999,
    rating: 4.9,
    reviewsCount: 120,
    category: 'Notebooks',
    images: [
      '/assets/arzen-backpack-classic.svg'
    ],
    colors: [
      { name: 'Matte Obsidian', hex: '#0B0B0B', image: '/assets/arzen-backpack-classic.svg' }
    ],
    description: 'Sleek luxury hardback notebook bound in double-face calfskin, with 240 sheets of high-density ivory paper featuring hand-brushed real gold leaf gilding on the page edges.',
    materials: [
      'Hand-stretched saffiano calf leather hard cover',
      '120gsm acid-free ultra smooth archival fountain-pen friendly paper',
      '24k gold foil gilding'
    ],
    dimensions: 'A5 Size (8.3" x 5.8")',
    capacity: '240 Gilt-Edged Pages',
    features: [
      'Double silk-ribbon place markers with golden thread finish',
      'Lays completely flat (180 degrees) for seamless writing',
      'Discrete interior expandable rear pocket'
    ],
    warranty: 'Binding structural integrity assurance',
    shipping: 'Complimentary shipping in Arzen signature wrapping.',
    returns: 'Complimentary 7-day returns for un-opened notebooks.'
  },
  {
    id: 'arz-lf-023',
    name: 'ARZEN Suede Wrapped Journal',
    tagline: 'Private thoughts, bound in velvet suede',
    price: 3499,
    rating: 4.8,
    reviewsCount: 75,
    category: 'Journals',
    images: [
      '/assets/arzen-backpack-pink.svg'
    ],
    colors: [
      { name: 'Sovereign Tan Suede', hex: '#8B5A2B', image: '/assets/arzen-backpack-pink.svg' }
    ],
    description: 'Unstructured, rustic luxury. A gorgeous journal wrapped in incredibly rich, double-sided Italian tan suede, bound with long leather laces that wrap around the ledger.',
    materials: [
      'Premium Italian calfskin velvet suede wrap',
      'Hand-stitched vintage parchment style cotton paper'
    ],
    dimensions: '7.5" H x 5.2" W',
    capacity: '200 Unlined Cotton Sheets',
    features: [
      'Deckled-edge organic cotton sheets feel wonderfully ancient',
      'Tie-strap binding ensures secure closure',
      'Perfect for sketching, journaling, or travel logging'
    ],
    warranty: 'Lifetime binding warranty',
    shipping: 'Complimentary standard express packaging.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-024',
    name: 'ARZEN Aurum Rollerball Pen',
    tagline: 'Weighty solid brass, fluid script signature',
    price: 4999,
    rating: 5.0,
    reviewsCount: 165,
    category: 'Premium Pens',
    images: [
      '/assets/arzen-backpack-classic.svg'
    ],
    colors: [
      { name: 'Polished Brass', hex: '#D4AF37', image: '/assets/arzen-backpack-classic.svg' }
    ],
    description: 'Forged from a solid bar of marine brass, this rollerball pen offers a beautifully heavy, balanced feel in the hand. Over time, the raw brass develops a completely unique golden-brown patina.',
    materials: [
      '100% Solid Milled Brass Core',
      'Premium black Schmidt ceramic liquid ink refills'
    ],
    dimensions: '5.4" Length x 0.45" Thickness',
    capacity: 'Standard Euro refill-compliant (0.5mm Tip)',
    features: [
      'Screw-on precision threaded cap sits flush with the body',
      'Beautifully weighted (48 grams) forces perfect calligraphic stroke',
      'Discrete laser-engraved Arzen logo around the cap rim'
    ],
    warranty: 'Lifetime mechanical pen assembly guarantee',
    shipping: 'Shipped in velvet-lined wooden presentation vault.',
    returns: 'Complimentary 7-day returns.',
    isBestSeller: true
  },
  {
    id: 'arz-lf-025',
    name: 'ARZEN Sovereign Valet Desk Tray',
    tagline: 'Cosmetic order for daily mental ease',
    price: 3999,
    rating: 4.8,
    reviewsCount: 42,
    category: 'Desk Accessories',
    images: [
      '/assets/arzen-tote-elevate.svg'
    ],
    colors: [
      { name: 'Sovereign Tan & Gold', hex: '#8B5A2B', image: '/assets/arzen-tote-elevate.svg' }
    ],
    description: 'An executive catchall tray designed to sit on your desk or dresser. Crafted from thick saddle-stitched leather with solid brass snap corners.',
    materials: [
      'Double layered full grain cowhide',
      'Solid-brass heavy click rivets'
    ],
    dimensions: '8.5" W x 8.5" L (Unsnapped), 6.5"x6.5"x1.5" (Snapped)',
    capacity: 'Holds watches, keys, jewelry, and wallets',
    features: [
      'Corners unsnap completely flat for absolute flat-packing travel ease',
      'Soft micro-suede gold colored interior prevents metal-on-metal scratches',
      'Embossed signature brand seal at center stage'
    ],
    warranty: 'Lifetime leather repair cover',
    shipping: 'Complimentary premium shipping.',
    returns: 'Complimentary 7-day returns.'
  },
  {
    id: 'arz-lf-026',
    name: 'ARZEN Sovereign Canopy Umbrella',
    tagline: 'Absolute rain shelter, malacca cane grip',
    price: 7999,
    rating: 4.9,
    reviewsCount: 48,
    category: 'Umbrellas',
    images: [
      '/assets/arzen-tote-elevate.svg'
    ],
    colors: [
      { name: 'British Onyx', hex: '#111111', image: '/assets/arzen-tote-elevate.svg' }
    ],
    description: 'Constructed to withstand intense winds. Features a high density waterproof canopy, a continuous solid steel center shaft, and a hand-bent natural Malacca cane wood handle.',
    materials: [
      'Continuous tempered solid-carbon steel frame',
      'High density micro-weave Teflon coated polyester canopy',
      'Genuinely hand-shaped organic Malacca cane handle'
    ],
    dimensions: '36" Long shaft - 44" Open Canopy diameter',
    capacity: 'Spacious 2-Person shelter',
    features: [
      'Double ribs reinforce framework against strong wind flips',
      'Heavy solid brass gold-plated collar around the wood handle',
      'Includes matching canopy sleeve with gold press buttons'
    ],
    warranty: 'Lifetime windbreak frame replacement shield',
    shipping: 'Shipped in heavy-duty shipping tube.',
    returns: 'Complimentary 7-day returns.',
    isBestSeller: true
  }
];
