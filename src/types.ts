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
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
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

export type ActiveView = 'home' | 'shop' | 'about' | 'contact' | 'admin' | 'lifestyle' | 'product-detail';

export interface GalleryImage {
  id: string;
  url: string;
  altText: string;
  size: string;
  uploadDate: string;
}

