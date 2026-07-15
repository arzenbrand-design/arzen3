import { Product, Review } from './types';

export const products: Product[] = [
  {
    id: 'arz-001',
    name: 'ARZEN Signature Tote',
    tagline: 'Luxury that speaks for itself',
    price: 14999,
    rating: 4.9,
    reviewsCount: 128,
    category: 'Tote',
    images: [
      '/assets/arzen-tote-elevate.svg',
      '/assets/arzen-tote-vertical.svg',
      '/assets/arzen-tote-elevate.svg'
    ],
    colors: [
      { name: 'Matte Black', hex: '#0B0B0B', image: '/assets/arzen-tote-elevate.svg' },
      { name: 'Luxury Gold', hex: '#C8A25D', image: '/assets/arzen-tote-elevate.svg' },
      { name: 'Sovereign Tan', hex: '#8B5A2B', image: '/assets/arzen-tote-vertical.svg' }
    ],
    description: 'Exquisitely tailored from double-faced full grain calfskin leather, the ARZEN Signature Tote combines a structured silhouette with unmatched utility. Accented by hand-polished golden brass hardware and our custom gold triangular seal, it represents the absolute peak of modern luxury.',
    materials: [
      '100% Full-grain calfskin leather with velvet-like finish',
      'Hand-brushed 24k gold-plated solid brass buckles and loops',
      'Water-resistant micro-suede protective lining',
      'Saddle-stitched heavy-duty German nylon thread'
    ],
    dimensions: '14.5" W x 11.2" H x 6.3" D',
    capacity: '16 Liters',
    features: [
      'Dedicated padded sleeve fits up to a 14" MacBook Pro',
      'Secret magnetic slip pocket in front under the brand tag',
      'Dual-layered reinforced rolled leather handles',
      'Removable and adjustable matching leather shoulder strap'
    ],
    warranty: 'Lifetime Repair or Replace Guarantee',
    shipping: 'Complimentary Express Shipping. Delivered in customized rigid premium dust-box package within 2-4 business days.',
    returns: 'Complimentary 7-day hassle-free returns with doorstep pickup.',
    isBestSeller: true
  },
  {
    id: 'arz-002',
    name: 'ARZEN Luxe Shoulder Bag',
    tagline: 'Sculpted for visual poetry',
    price: 12999,
    rating: 4.8,
    reviewsCount: 98,
    category: 'Shoulder Bag',
    images: [
      '/assets/arzen-handbag-y.svg',
      '/assets/arzen-handbag-charm.svg',
      '/assets/arzen-handbag-chain.svg'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0B0B0B', image: '/assets/arzen-handbag-y.svg' },
      { name: 'Imperial Gold', hex: '#C8A25D', image: '/assets/arzen-handbag-charm.svg' },
      { name: 'Pearl White', hex: '#F5F5F0', image: '/assets/arzen-handbag-chain.svg' }
    ],
    description: 'An artistic statement piece crafted in a sculpted crescent contour. Made with premium croco-embossed full-grain calfskin leather and featuring a high-polish golden curb chain, the Luxe Shoulder Bag transitions effortlessly from high-profile business lunches to red-carpet soirées.',
    materials: [
      'Premium croco-embossed full-grain French calf leather',
      'Solid brass curb chain with 24k mirror-gold plating',
      'Silky soft Italian satin jacquard lining'
    ],
    dimensions: '10.2" W x 6.5" H x 3.1" D',
    capacity: '4.5 Liters',
    features: [
      'Interlocking magnetic gold closure with signature triangle insignia',
      'Interior zip pocket and three micro-stitched card slots',
      'Convertible chain strap for shoulder or crossbody style'
    ],
    warranty: 'Lifetime Repair or Replace Guarantee',
    shipping: 'Complimentary Express Shipping. Delivered in signature gift box with felt dustcover.',
    returns: 'Complimentary 7-day returns with pre-paid labels.',
    isBestSeller: true
  },
  {
    id: 'arz-003',
    name: 'ARZEN Elite Backpack',
    tagline: 'The executive companion',
    price: 17999,
    rating: 4.9,
    reviewsCount: 156,
    category: 'Backpack',
    images: [
      '/assets/arzen-backpack-built-different.svg',
      '/assets/arzen-backpack-classic.svg',
      '/assets/arzen-backpack-pink.svg'
    ],
    colors: [
      { name: 'Matte Black', hex: '#0B0B0B', image: '/assets/arzen-backpack-built-different.svg' },
      { name: 'Sovereign Gray', hex: '#4A4A4A', image: '/assets/arzen-backpack-classic.svg' },
      { name: 'Obsidian Gold', hex: '#1C1813', image: '/assets/arzen-backpack-pink.svg' }
    ],
    description: 'Designed for modern leaders, the Elite Backpack combines architectural elegance with smart ergonomics. Outfitted with heavy-duty gold zipper chains and tailored in scratch-proof Saffiano leather, it offers pristine protection for your essential gear.',
    materials: [
      'Italian Saffiano leather with durable water-resistant coating',
      'Gold-toned metal alloy heavy duty zippers',
      'Heavy duty military-grade ballistic nylon bottom guard',
      'Breathable contoured comfort mesh back panel'
    ],
    dimensions: '12.0" W x 16.5" H x 7.0" D',
    capacity: '22 Liters',
    features: [
      'Dedicated shock-absorbent laptop compartment fits up to 16" MacBook Pro',
      'Hidden passport-size lumbar pocket for travel security',
      'Luggage pass-through strap for travel convenience',
      'Internal organizer for tech chargers, tablets, and luxury pens'
    ],
    warranty: 'Lifetime Repair or Replace Guarantee',
    shipping: 'Complimentary Express Shipping. Dispatched same day.',
    returns: 'Complimentary 7-day hassle-free returns.',
    isNewArrival: true
  },
  {
    id: 'arz-004',
    name: 'ARZEN Premium Duffle',
    tagline: 'Travel, elevated',
    price: 18999,
    rating: 4.9,
    reviewsCount: 112,
    category: 'Duffle',
    images: [
      '/assets/arzen-duffle.svg',
      '/assets/arzen-duffle.svg',
      '/assets/arzen-duffle.svg'
    ],
    colors: [
      { name: 'Sovereign Tan', hex: '#8B5A2B', image: '/assets/arzen-duffle.svg' },
      { name: 'Matte Black', hex: '#0B0B0B', image: '/assets/arzen-duffle.svg' },
      { name: 'Emerald Hunter', hex: '#0F2C22', image: '/assets/arzen-duffle.svg' }
    ],
    description: 'The quintessential travel duffle. Beautifully hand-formed from thick, supple pull-up leather that develops a breathtaking vintage patina with time. Accented by high-capacity gold hardware, it is sized perfectly to fit all airline carry-on regulations.',
    materials: [
      'Premium pull-up vegetable-tanned Argentine leather',
      'Extra-thick dual-layered rolled leather handles',
      'Corrosion-resistant custom gold-toned metal buckles',
      'Waterproof internal ripstop premium lining'
    ],
    dimensions: '20.5" W x 11.5" H x 10.0" D',
    capacity: '38 Liters',
    features: [
      'Double-zip extra wide wide-mouth doctor opening',
      'Dedicated vented shoe compartment on side panel',
      'Detachable leather strap with cushioned shoulder pad',
      'Double-reinforced bottom brass studs'
    ],
    warranty: 'Lifetime Repair or Replace Guarantee',
    shipping: 'Complimentary Express Shipping. Delivered in bespoke wooden luxury presentation crate.',
    returns: 'Complimentary 7-day hassle-free returns.',
    isBestSeller: true
  },
  {
    id: 'arz-005',
    name: 'ARZEN Urban Sling',
    tagline: 'Freedom of movement, redefined',
    price: 9999,
    rating: 4.7,
    reviewsCount: 76,
    category: 'Sling',
    images: [
      '/assets/arzen-backpack-pink.svg',
      '/assets/arzen-backpack-pink.svg',
      '/assets/arzen-backpack-pink.svg'
    ],
    colors: [
      { name: 'Matte Black', hex: '#0B0B0B', image: '/assets/arzen-backpack-pink.svg' },
      { name: 'Slate Gray', hex: '#708090', image: '/assets/arzen-backpack-pink.svg' },
      { name: 'Crimson Royale', hex: '#58111A', image: '/assets/arzen-backpack-pink.svg' }
    ],
    description: 'A compact crossbody companion engineered for the active urbanite. Striking a perfect balance between technical utility and high luxury, the Urban Sling keeps your high-priority items safe, lightweight, and incredibly accessible.',
    materials: [
      'Waterproof premium ballistic nylon with Saffiano leather paneling',
      'Secure gold-plated quick-release Fidlock magnetic clasp',
      'Soft scratch-proof micro-fleece protective compartment'
    ],
    dimensions: '7.1" W x 11.8" H x 3.5" D',
    capacity: '5 Liters',
    features: [
      'Ambidextrous shoulder strap with swift golden adjustment loop',
      'Hidden back anti-theft zipper compartment for passports',
      'RFID-blocking card and wallet sleeve inside',
      'Tactile heavy gold-plated luxury zipper pulls'
    ],
    warranty: 'Lifetime Repair or Replace Guarantee',
    shipping: 'Complimentary Express Shipping. Delivered in bespoke velvet dustbag.',
    returns: 'Complimentary 7-day hassle-free returns.',
    isNewArrival: true
  },
  {
    id: 'arz-006',
    name: 'ARZEN Executive Laptop Bag',
    tagline: 'Precision built for boardrooms',
    price: 16999,
    rating: 4.8,
    reviewsCount: 101,
    category: 'Laptop Bag',
    images: [
      '/assets/arzen-suit-bag.svg',
      '/assets/arzen-suit-bag.svg',
      '/assets/arzen-suit-bag.svg'
    ],
    colors: [
      { name: 'Matte Black', hex: '#0B0B0B', image: '/assets/arzen-suit-bag.svg' },
      { name: 'Classic Mahogany', hex: '#4A150B', image: '/assets/arzen-suit-bag.svg' },
      { name: 'Charcoal Gold', hex: '#2A2A2A', image: '/assets/arzen-suit-bag.svg' }
    ],
    description: 'An architecturally structured briefcase meticulously designed for modern executives. Featuring dual main sleeves, fully secure locking zippers, and exquisite pebble leather texture, this laptop briefcase is built different to make standard board meetings feel historic.',
    materials: [
      'Premium full grain pebble Italian leather',
      'Rigid internal structural supports to retain pristine form',
      '24k hand-brushed heavy gold zippers and key lock buckles'
    ],
    dimensions: '15.7" W x 11.8" H x 4.5" D',
    capacity: '14 Liters',
    features: [
      'Dual main compartments with rich internal organizers and card bays',
      'Padded center protective divider fits up to a 16" laptop',
      'Quick-slip back trolley luggage strap',
      'Adjustable custom-padded premium luxury shoulder strap'
    ],
    warranty: 'Lifetime Repair or Replace Guarantee',
    shipping: 'Complimentary Express Shipping. Packaged in custom rigid executive presentation box.',
    returns: 'Complimentary 7-day hassle-free returns.',
    isBestSeller: true
  },
  {
    id: 'arz-007',
    name: 'ARZEN Luxe Crossbody Clutch',
    tagline: 'Sleek. Striking. Sovereign.',
    price: 11499,
    rating: 4.8,
    reviewsCount: 43,
    category: 'Shoulder Bag',
    images: [
      '/assets/arzen-handbag-chain.svg',
      '/assets/arzen-handbag-charm.svg',
      '/assets/arzen-handbag-chain.svg'
    ],
    colors: [
      { name: 'Polar Alabaster', hex: '#F5F5F0', image: '/assets/arzen-handbag-chain.svg' },
      { name: 'Matte Black', hex: '#0B0B0B', image: '/assets/arzen-handbag-charm.svg' },
      { name: 'Imperial Gold', hex: '#C8A25D', image: '/assets/arzen-handbag-chain.svg' }
    ],
    description: 'Designed for minimal luxury. Crafted from premium full grain French leather, the Crossbody Clutch has an integrated magnetic locking flap with our iconic triangle brand crest. Holds phone, cards, keys, and cosmetics in sleek comfort.',
    materials: [
      'French full-grain smooth leather skin',
      'Bespoke velvet protective microfiber lining',
      'Heavy solid brass front buckle with light gold polish'
    ],
    dimensions: '8.5" W x 5.1" H x 2.2" D',
    capacity: '2.5 Liters',
    features: [
      'Eight internal credit card pockets and a zippered spacer pocket',
      'Magnetic automatic alignment front locking flap',
      'Detachable matching leather-gold chain strap'
    ],
    warranty: 'Lifetime Repair or Replace Guarantee',
    shipping: 'Complimentary Express Shipping inside rigid branded jewelry bag.',
    returns: 'Complimentary 7-day hassle-free returns.',
    isNewArrival: true
  },
  {
    id: 'arz-008',
    name: 'ARZEN Weekender Duffel',
    tagline: 'A masterclass in journeying',
    price: 21999,
    rating: 4.9,
    reviewsCount: 88,
    category: 'Duffle',
    images: [
      '/assets/arzen-duffle.svg',
      '/assets/arzen-duffle.svg',
      '/assets/arzen-duffle.svg'
    ],
    colors: [
      { name: 'Matte Black', hex: '#0B0B0B', image: '/assets/arzen-duffle.svg' },
      { name: 'Cognac Amber', hex: '#9E5B26', image: '/assets/arzen-duffle.svg' },
      { name: 'Emerald Hunter', hex: '#0F2C22', image: '/assets/arzen-duffle.svg' }
    ],
    description: 'An oversized luxury travel statement. Crafted with pristine pebble leather panels, double-stitched reinforcements, and custom brass rivets, the Weekender provides the perfect volume for three-day escapes in supreme confidence.',
    materials: [
      'Hand-selected premium Saffiano & pebble cowhide leather combination',
      'Reinforced solid copper rivets with golden brass wash coating',
      'Spun nylon high-tension bonded thread work'
    ],
    dimensions: '22.0" W x 13.0" H x 11.0" D',
    capacity: '45 Liters',
    features: [
      'Dedicated zippered bottom shoe closet',
      'RFID-protected quick-access side passport and wallet pocket',
      'Premium padded heavy load leather shoulder strap',
      'Fully security-friendly wide flat-lay zipper structure'
    ],
    warranty: 'Lifetime Repair or Replace Guarantee',
    shipping: 'Complimentary Express Shipping in luxury rigid cedar luggage chest.',
    returns: 'Complimentary 7-day returns with pre-arranged home courier pickup.',
    isNewArrival: true
  }
];

export const reviews: Review[] = [
  {
    id: 'rev-1',
    name: 'Kabir Malhotra',
    role: 'Venture Capitalist',
    rating: 5,
    comment: 'I travel constantly between Bokaro and London. The Premium Duffle is an absolute masterpiece. Sized perfectly for first-class cabins, the leather smells rich and handles tough trips with elegance. Truly Built Different.',
    date: 'June 18, 2026',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Aanya Sen',
    role: 'Design Director',
    rating: 5,
    comment: 'The Signature Tote is the perfect blend of structural integrity and modern minimalism. It holds its shape perfectly even when loaded with my iPad, laptop, and sketchbooks. The gold details look and feel exceptionally high-end.',
    date: 'May 29, 2026',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Rohan Mehra',
    role: 'Senior Attorney',
    rating: 5,
    comment: 'I carried a Swiss luxury briefcase for ten years, but the ARZEN Executive Laptop Bag has replaced it. The pebble leather is flawless and the brass locks operate with a satisfying weight. Incredible build quality and trustworthy service.',
    date: 'June 05, 2026',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Meera Deshmukh',
    role: 'Fashion Consultant',
    rating: 5,
    comment: 'The Luxe Shoulder Bag is sculpted beautifully. I receive compliments every time I carry it. The 24k gold-plated curb chain has a gorgeous weight and mirror sheen. Hands down, my best luxury purchase this year.',
    date: 'June 22, 2026',
    verified: true
  }
];
