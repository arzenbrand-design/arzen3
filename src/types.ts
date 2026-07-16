export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number; // in INR (₹)
  rating: number;
  reviewsCount: number;
  category: string;
  images: string[]; // List of alternate/gallery images
  colors: ProductColor[];
  description: string;
  materials: string[];
  dimensions: string;
  capacity: string;
  features: string[];
  warranty: string;
  shipping: string;
  returns: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  status?: 'Active' | 'Draft' | string;
  sku?: string;
  stock?: number;
  tags?: string[];
  specifications?: string[];
  sizes?: string[]; // E.g., ['Regular', 'Grande', 'Mini'] or ['S', 'M', 'L']
  codEnabled?: boolean; // Individual product override for Cash on Delivery
  returnEnabled?: boolean; // Toggle return policy
  replacementEnabled?: boolean; // Toggle replacement policy
  returnDays?: number; // 7, 10, 15, 30 days
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
  selectedSize?: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export type ActiveView = 'home' | 'shop' | 'about' | 'contact' | 'admin' | 'lifestyle' | 'product-detail' | 'tracking' | 'account';

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  altText: string;
  size: string;
  uploadDate: string;
}

