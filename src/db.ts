import { Product, Review, ProductColor, GalleryImage } from './types';
import { products as initialProducts, reviews as initialReviews } from './data';
import { lifestyleProducts } from './data/lifestyleProducts';

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface DbCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'Active' | 'Blocked';
  joinDate: string;
  ordersCount: number;
  totalSpent: number;
}

export interface DbOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  postalCode: string;
  items: {
    product: Product;
    quantity: number;
    selectedColor: ProductColor;
    selectedSize?: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'Razorpay' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  status: 'Pending' | 'Accepted' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  trackingNumber?: string;
  returnRequested?: boolean;
  returnStatus?: 'None' | 'Requested' | 'Approved' | 'Rejected';
}

export interface DbCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  active: boolean;
  expiryDate?: string;
}

export interface DbReview {
  id: string;
  productId: string;
  productName: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  status: 'Pending' | 'Approved' | 'Deleted';
  reply?: string;
}

export interface DbSettings {
  websiteLogoText: string;
  websiteLogoSubtitle: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  metaTitle: string;
  metaDescription: string;
  googleAnalyticsId: string;
  freeShippingThreshold: number;
  flatShippingCharge: number;
  heroBannerImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroTagline?: string;
  featuredProductIds?: string[];
  heroProductId?: string;
  enabledPaymentMethods?: string[];
}

// Low Stock limit configuration
export const LOW_STOCK_LIMIT = 5;

// Default categories requested by the user
const DEFAULT_CATEGORIES: DbCategory[] = [
  { id: 'cat-1', name: 'Bags', slug: 'bags' },
  { id: 'cat-2', name: 'Wallets', slug: 'wallets' },
  { id: 'cat-3', name: 'Backpacks', slug: 'backpacks' },
  { id: 'cat-4', name: 'Travel', slug: 'travel' },
  { id: 'cat-5', name: 'Accessories', slug: 'accessories' },
  { id: 'cat-6', name: 'Apparel', slug: 'apparel' },
  { id: 'cat-7', name: 'Footwear', slug: 'footwear' },
  { id: 'cat-8', name: 'Eyewear', slug: 'eyewear' },
  { id: 'cat-9', name: 'Lifestyle', slug: 'lifestyle' },
  { id: 'cat-10', name: 'Bottles', slug: 'bottles' },
  { id: 'cat-11', name: 'Tech Accessories', slug: 'tech-accessories' }
];

// Enriching the initial products with Stock, SKU, Discount Price, Status, and Tags
const enrichProducts = (prods: Product[]): (Product & { sku: string; stock: number; discountPrice?: number; status: 'Active' | 'Draft'; tags: string[]; specifications: string[] })[] => {
  return prods.map((p, index) => ({
    ...p,
    sku: `ARZ-LXP-${100 + index}`,
    stock: p.stock !== undefined ? p.stock : (p.id === 'arz-005' ? 3 : p.id === 'arz-003' ? 4 : 15 + index), // Some low stock for triggers
    discountPrice: p.price > 15000 ? Math.round(p.price * 0.9) : undefined,
    status: 'Active',
    tags: ['Luxury', 'Premium', p.category, 'Handmade'],
    sizes: p.sizes || ['Regular', 'Grande', 'Mini'],
    codEnabled: p.codEnabled !== undefined ? p.codEnabled : true,
    returnEnabled: p.returnEnabled !== undefined ? p.returnEnabled : true,
    replacementEnabled: p.replacementEnabled !== undefined ? p.replacementEnabled : true,
    returnDays: p.returnDays !== undefined ? p.returnDays : 7,
    specifications: [
      `Materials: ${p.materials ? p.materials[0] : 'French Leather'}`,
      `Dimensions: ${p.dimensions || 'Standard'}`,
      `Capacity: ${p.capacity || 'N/A'}`
    ]
  }));
};

const DEFAULT_CUSTOMERS: DbCustomer[] = [
  {
    id: 'cust-1',
    name: 'Kabir Malhotra',
    email: 'kabir.m@venturecap.co',
    phone: '+91 76798 47319',
    status: 'Active',
    joinDate: '2026-01-15',
    ordersCount: 2,
    totalSpent: 33998
  },
  {
    id: 'cust-2',
    name: 'Aanya Sen',
    email: 'aanya.sen@designstudio.in',
    phone: '+91 76798 47319',
    status: 'Active',
    joinDate: '2026-02-28',
    ordersCount: 1,
    totalSpent: 14999
  },
  {
    id: 'cust-3',
    name: 'Rohan Mehra',
    email: 'rohan.mehra@supremecourt.gov.in',
    phone: '+91 76798 47319',
    status: 'Active',
    joinDate: '2026-03-10',
    ordersCount: 1,
    totalSpent: 16999
  },
  {
    id: 'cust-4',
    name: 'Meera Deshmukh',
    email: 'meera.d@vogueindia.com',
    phone: '+91 76798 47319',
    status: 'Active',
    joinDate: '2026-04-22',
    ordersCount: 1,
    totalSpent: 11499
  },
  {
    id: 'cust-5',
    name: 'Devansh Roy',
    email: 'devroy@techlead.org',
    phone: '+91 76798 47319',
    status: 'Blocked',
    joinDate: '2026-05-01',
    ordersCount: 0,
    totalSpent: 0
  }
];

const DEFAULT_ORDERS = (enriched: any[]): DbOrder[] => [
  {
    id: 'ord-1001',
    orderNumber: 'ARZ-ORD-1001',
    customerId: 'cust-1',
    customerName: 'Kabir Malhotra',
    customerEmail: 'kabir.m@venturecap.co',
    customerPhone: '+91 76798 47319',
    address: 'Bokaro Steel City',
    city: 'Bokaro, Jharkhand',
    postalCode: '827001',
    items: [
      {
        product: enriched[3], // Premium Duffle
        quantity: 1,
        selectedColor: enriched[3].colors[0]
      },
      {
        product: enriched[0], // Signature Tote
        quantity: 1,
        selectedColor: enriched[0].colors[0]
      }
    ],
    subtotal: 33998,
    discount: 0,
    shipping: 0,
    total: 33998,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Delivered',
    date: '2026-06-18T14:32:00Z',
    trackingNumber: 'BLUEDART87319'
  },
  {
    id: 'ord-1002',
    orderNumber: 'ARZ-ORD-1002',
    customerId: 'cust-2',
    customerName: 'Aanya Sen',
    customerEmail: 'aanya.sen@designstudio.in',
    customerPhone: '+91 76798 47319',
    address: 'Bokaro Steel City',
    city: 'Bokaro, Jharkhand',
    postalCode: '827001',
    items: [
      {
        product: enriched[0], // Signature Tote
        quantity: 1,
        selectedColor: enriched[0].colors[1]
      }
    ],
    subtotal: 14999,
    discount: 1000,
    shipping: 0,
    total: 13999,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Shipped',
    date: '2026-07-02T10:15:00Z',
    trackingNumber: 'ARZENXP449210'
  },
  {
    id: 'ord-1003',
    orderNumber: 'ARZ-ORD-1003',
    customerId: 'cust-3',
    customerName: 'Rohan Mehra',
    customerEmail: 'rohan.mehra@supremecourt.gov.in',
    customerPhone: '+91 76798 47319',
    address: 'Bokaro Steel City',
    city: 'Bokaro, Jharkhand',
    postalCode: '827001',
    items: [
      {
        product: enriched[5], // Laptop Bag
        quantity: 1,
        selectedColor: enriched[5].colors[0]
      }
    ],
    subtotal: 16999,
    discount: 0,
    shipping: 0,
    total: 16999,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Paid',
    status: 'Accepted',
    date: '2026-07-04T18:45:00Z'
  },
  {
    id: 'ord-1004',
    orderNumber: 'ARZ-ORD-1004',
    customerId: 'cust-4',
    customerName: 'Meera Deshmukh',
    customerEmail: 'meera.d@vogueindia.com',
    customerPhone: '+91 76798 47319',
    address: 'Bokaro Steel City',
    city: 'Bokaro, Jharkhand',
    postalCode: '827001',
    items: [
      {
        product: enriched[1], // Shoulder Bag
        quantity: 1,
        selectedColor: enriched[1].colors[0]
      }
    ],
    subtotal: 11499,
    discount: 1500,
    shipping: 150,
    total: 10149,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Pending',
    date: '2026-07-05T01:20:00Z'
  }
];

const DEFAULT_COUPONS: DbCoupon[] = [
  { id: 'cp-1', code: 'ARZENLUXE', discountType: 'percentage', value: 15, minOrderAmount: 10000, active: true },
  { id: 'cp-2', code: 'WELCOME10', discountType: 'fixed', value: 1000, minOrderAmount: 8000, active: true },
  { id: 'cp-3', code: 'GOLD20', discountType: 'percentage', value: 20, minOrderAmount: 20000, active: true, expiryDate: '2027-01-01' }
];

const DEFAULT_SETTINGS: DbSettings = {
  websiteLogoText: 'ARZEN',
  websiteLogoSubtitle: 'BUILT DIFFERENT',
  whatsappNumber: '+917679847319',
  email: 'arzen.brand@gmail.com',
  phone: '+91 76798 47319',
  address: 'ARZEN Head Office, Bokaro Steel City, Bokaro, Jharkhand – 827001, India',
  facebook: 'https://www.facebook.com/share/1CwR6azJ2Y/',
  instagram: 'https://www.instagram.com/arzen.brand?igsh=MWNxYjdzeHRpa3A4Ng==',
  twitter: 'https://twitter.com/arzenluxury',
  metaTitle: 'ARZEN Luxury Leather Masterpieces | Built Different',
  metaDescription: 'Discover ARZEN, a legacy of distinction. Exquisite bags tailored by hand in France, lined with micro-suede, accented in 24k gold, and guaranteed for a lifetime.',
  googleAnalyticsId: 'UA-1928374-12',
  freeShippingThreshold: 10000,
  flatShippingCharge: 250,
  heroBannerImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80',
  heroTitle: 'A Legacy of Distinction',
  heroSubtitle: 'THE HOUSE OF ARZEN',
  heroTagline: 'BUILT DIFFERENT',
  featuredProductIds: ['arz-001', 'arz-002', 'arz-003', 'arz-004'],
  heroProductId: 'arz-001',
  enabledPaymentMethods: ['COD', 'UPI', 'CreditCard', 'DebitCard', 'NetBanking', 'Wallets']
};

const DEFAULT_GALLERY: GalleryImage[] = [
  { id: 'gal-1', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', altText: 'Signature Tote (Sovereign Tan)', size: '142 KB', uploadDate: '2026-07-12T07:42:16-07:00' },
  { id: 'gal-2', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', altText: 'Luxe Shoulder Bag (Obsidian Black)', size: '198 KB', uploadDate: '2026-07-12T07:42:16-07:00' },
  { id: 'gal-3', url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80', altText: 'Signature Tote (Matte Black)', size: '220 KB', uploadDate: '2026-07-12T07:42:16-07:00' },
  { id: 'gal-4', url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80', altText: 'Elite Backpack (Matte Black)', size: '175 KB', uploadDate: '2026-07-12T07:42:16-07:00' },
  { id: 'gal-5', url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15aeb9?auto=format&fit=crop&w=800&q=80', altText: 'Signature Tote (Luxury Gold)', size: '184 KB', uploadDate: '2026-07-12T07:42:16-07:00' },
  { id: 'gal-6', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', altText: 'Sovereign Travel Duffle (Sovereign Tan)', size: '210 KB', uploadDate: '2026-07-12T07:42:16-07:00' },
];

// --- ADVANCED INDEXEDDB & LOCALSTORAGE HYBRID DATABASE ENGINE ---

// Helper to generate a unique ID for locally stored custom files
function generateUUID(): string {
  return 'img-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Helper to identify if a string is a heavy base64 data URL
function isBase64Image(str: any): boolean {
  return typeof str === 'string' && str.startsWith('data:image/');
}

// Low-level IndexedDB Wrapper for large binary payloads (images) and heavy data stores
export class ArzenIDB {
  private static dbName = 'ArzenLuxuryDB';
  private static version = 1;
  private static db: IDBDatabase | null = null;

  static async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images');
        }
        if (!db.objectStoreNames.contains('store')) {
          db.createObjectStore('store');
        }
      };
    });
  }

  static async getImage(id: string): Promise<string | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('images', 'readonly');
        const store = tx.objectStore('images');
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      console.error('Error reading image from IndexedDB:', e);
      return null;
    }
  }

  static async saveImage(id: string, base64: string): Promise<boolean> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('images', 'readwrite');
        const store = tx.objectStore('images');
        const req = store.put(base64, id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch (e) {
      console.error('Error saving image to IndexedDB:', e);
      return false;
    }
  }

  static async deleteImage(id: string): Promise<boolean> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('images', 'readwrite');
        const store = tx.objectStore('images');
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch (e) {
      console.error('Error deleting image from IndexedDB:', e);
      return false;
    }
  }

  static async getAllImageKeys(): Promise<string[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('images', 'readonly');
        const store = tx.objectStore('images');
        const req = store.getAllKeys();
        req.onsuccess = () => resolve((req.result as string[]) || []);
        req.onerror = () => resolve([]);
      });
    } catch (e) {
      console.error('Error getting image keys from IndexedDB:', e);
      return [];
    }
  }

  static async getStoreVal<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('store', 'readonly');
        const store = tx.objectStore('store');
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result !== undefined ? req.result : defaultValue);
        req.onerror = () => resolve(defaultValue);
      });
    } catch (e) {
      console.error('Error reading store from IndexedDB:', e);
      return defaultValue;
    }
  }

  static async saveStoreVal<T>(key: string, value: T): Promise<boolean> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('store', 'readwrite');
        const store = tx.objectStore('store');
        const req = store.put(value, key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch (e) {
      console.error('Error saving store to IndexedDB:', e);
      return false;
    }
  }
}

// Helper: replace raw base64 data URLs in a single product with local-image://<id> reference URLs
async function persistProductImagesAndGetCleanProduct(product: any): Promise<any> {
  const cleanProduct = { ...product };
  
  if (cleanProduct.images && Array.isArray(cleanProduct.images)) {
    const cleanImages: string[] = [];
    for (const img of cleanProduct.images) {
      if (isBase64Image(img)) {
        const imgId = generateUUID();
        await ArzenIDB.saveImage(imgId, img);
        cleanImages.push(`local-image://${imgId}`);
      } else {
        cleanImages.push(img);
      }
    }
    cleanProduct.images = cleanImages;
  }

  if (cleanProduct.colors && Array.isArray(cleanProduct.colors)) {
    const cleanColors = [];
    for (const col of cleanProduct.colors) {
      const cleanCol = { ...col };
      if (cleanCol.image && isBase64Image(cleanCol.image)) {
        const imgId = generateUUID();
        await ArzenIDB.saveImage(imgId, cleanCol.image);
        cleanCol.image = `local-image://${imgId}`;
      }
      cleanColors.push(cleanCol);
    }
    cleanProduct.colors = cleanColors;
  }

  return cleanProduct;
}

// Helper: replace raw base64 data URLs in a list of products
async function persistAllProductsImagesAndGetCleanList(productsList: any[]): Promise<any[]> {
  const cleanList = [];
  for (const prod of productsList) {
    const cleanProd = await persistProductImagesAndGetCleanProduct(prod);
    cleanList.push(cleanProd);
  }
  return cleanList;
}

// Helper: replace raw base64 data URLs in gallery with local-image://<id> reference URLs
async function persistGalleryImagesAndGetCleanGallery(galleryList: GalleryImage[]): Promise<GalleryImage[]> {
  const cleanList: GalleryImage[] = [];
  for (const item of galleryList) {
    if (isBase64Image(item.url)) {
      const imgId = generateUUID();
      await ArzenIDB.saveImage(imgId, item.url);
      cleanList.push({ ...item, url: `local-image://${imgId}` });
    } else {
      cleanList.push(item);
    }
  }
  return cleanList;
}

// Helper: restore local-image://<id> reference URLs in gallery
async function restoreGalleryWithRealImages(galleryList: GalleryImage[]): Promise<GalleryImage[]> {
  const restoredList: GalleryImage[] = [];
  for (const item of galleryList) {
    if (typeof item.url === 'string' && item.url.startsWith('local-image://')) {
      const imgId = item.url.replace('local-image://', '');
      const realBase64 = await ArzenIDB.getImage(imgId);
      if (realBase64) {
        restoredList.push({ ...item, url: realBase64 });
      } else {
        restoredList.push({ ...item, url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800' });
      }
    } else {
      restoredList.push(item);
    }
  }
  return restoredList;
}

// Helper: restore local-image://<id> reference URLs back to full base64 strings in memory
async function restoreProductWithRealImages(product: any): Promise<any> {
  const restoredProduct = { ...product };

  if (restoredProduct.images && Array.isArray(restoredProduct.images)) {
    const restoredImages: string[] = [];
    for (const img of restoredProduct.images) {
      if (typeof img === 'string' && img.startsWith('local-image://')) {
        const imgId = img.replace('local-image://', '');
        const realBase64 = await ArzenIDB.getImage(imgId);
        if (realBase64) {
          restoredImages.push(realBase64);
        } else {
          restoredImages.push('https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800');
        }
      } else {
        restoredImages.push(img);
      }
    }
    restoredProduct.images = restoredImages;
  }

  if (restoredProduct.colors && Array.isArray(restoredProduct.colors)) {
    const restoredColors = [];
    for (const col of restoredProduct.colors) {
      const restoredCol = { ...col };
      if (restoredCol.image && typeof restoredCol.image === 'string' && restoredCol.image.startsWith('local-image://')) {
        const imgId = restoredCol.image.replace('local-image://', '');
        const realBase64 = await ArzenIDB.getImage(imgId);
        if (realBase64) {
          restoredCol.image = realBase64;
        } else {
          restoredCol.image = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800';
        }
      }
      restoredColors.push(restoredCol);
    }
    restoredProduct.colors = restoredColors;
  }

  return restoredProduct;
}

// Helper: restore local-image://<id> references for an entire products list
async function restoreAllProductsWithRealImages(productsList: any[]): Promise<any[]> {
  const restoredList = [];
  for (const prod of productsList) {
    const restoredProd = await restoreProductWithRealImages(prod);
    restoredList.push(restoredProd);
  }
  return restoredList;
}

// Helper: replace raw base64 data URLs in settings
async function persistSettingsImagesAndGetCleanSettings(settings: any): Promise<any> {
  const cleanSettings = { ...settings };
  if (cleanSettings.heroBannerImage && isBase64Image(cleanSettings.heroBannerImage)) {
    const imgId = generateUUID();
    await ArzenIDB.saveImage(imgId, cleanSettings.heroBannerImage);
    cleanSettings.heroBannerImage = `local-image://${imgId}`;
  }
  return cleanSettings;
}

// Helper: restore local-image://<id> reference URLs in settings
async function restoreSettingsWithRealImages(settings: any): Promise<any> {
  const restoredSettings = { ...settings };
  if (restoredSettings.heroBannerImage && typeof restoredSettings.heroBannerImage === 'string' && restoredSettings.heroBannerImage.startsWith('local-image://')) {
    const imgId = restoredSettings.heroBannerImage.replace('local-image://', '');
    const realBase64 = await ArzenIDB.getImage(imgId);
    if (realBase64) {
      restoredSettings.heroBannerImage = realBase64;
    } else {
      restoredSettings.heroBannerImage = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800';
    }
  }
  return restoredSettings;
}

// Helper: clean unused images from the IndexedDB store
async function cleanUnusedImages(productsList: any[], settings: any) {
  try {
    const referencedIds = new Set<string>();

    productsList.forEach(prod => {
      if (prod.images && Array.isArray(prod.images)) {
        prod.images.forEach((img: any) => {
          if (typeof img === 'string' && img.startsWith('local-image://')) {
            referencedIds.add(img.replace('local-image://', ''));
          }
        });
      }
      if (prod.colors && Array.isArray(prod.colors)) {
        prod.colors.forEach((col: any) => {
          if (col.image && typeof col.image === 'string' && col.image.startsWith('local-image://')) {
            referencedIds.add(col.image.replace('local-image://', ''));
          }
        });
      }
    });

    if (settings && settings.heroBannerImage && typeof settings.heroBannerImage === 'string' && settings.heroBannerImage.startsWith('local-image://')) {
      referencedIds.add(settings.heroBannerImage.replace('local-image://', ''));
    }

    // Preserve gallery image references from garbage collection
    const galleryList = ArzenDatabase.getGallery();
    if (Array.isArray(galleryList)) {
      galleryList.forEach(item => {
        if (typeof item.url === 'string' && item.url.startsWith('local-image://')) {
          referencedIds.add(item.url.replace('local-image://', ''));
        }
      });
    }

    const allKeys = await ArzenIDB.getAllImageKeys();
    for (const key of allKeys) {
      if (!referencedIds.has(key)) {
        await ArzenIDB.deleteImage(key);
        console.log(`Garbage Collection: Safely deleted unused cached image file: ${key}`);
      }
    }
  } catch (e) {
    console.error('Error cleaning unused images:', e);
  }
}

export class ArzenDatabase {
  private static cache: Record<string, any> = {};
  private static isLoaded = false;
  private static initPromise: Promise<void> | null = null;

  static getStorage<T>(key: string, defaultValue: T): T {
    if (this.cache[key] !== undefined) {
      return this.cache[key];
    }
    try {
      const data = localStorage.getItem(`arzen_db_${key}`);
      if (data) {
        const parsed = JSON.parse(data);
        this.cache[key] = parsed;
        return parsed;
      }
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
    }
    return defaultValue;
  }

  static setStorage<T>(key: string, value: T): boolean {
    this.cache[key] = value;
    
    // Instantly notify React components synchronously for sub-second UI updates
    window.dispatchEvent(new CustomEvent('arzen-db-updated', { detail: { key } }));

    // Persist asynchronously in the background to IndexedDB and LocalStorage (without any heavy base64 strings!)
    (async () => {
      try {
        if (key === 'products' && Array.isArray(value)) {
          const cleanProducts = await persistAllProductsImagesAndGetCleanList(value);
          await ArzenIDB.saveStoreVal('products', cleanProducts);
          localStorage.setItem(`arzen_db_products`, JSON.stringify(cleanProducts));

          const cleanSettings = await persistSettingsImagesAndGetCleanSettings(this.cache['settings'] || DEFAULT_SETTINGS);
          await cleanUnusedImages(cleanProducts, cleanSettings);

        } else if (key === 'settings' && value) {
          const cleanSettings = await persistSettingsImagesAndGetCleanSettings(value);
          await ArzenIDB.saveStoreVal('settings', cleanSettings);
          localStorage.setItem(`arzen_db_settings`, JSON.stringify(cleanSettings));

          const cleanProducts = await persistAllProductsImagesAndGetCleanList(this.cache['products'] || []);
          await cleanUnusedImages(cleanProducts, cleanSettings);

        } else if (key === 'gallery' && Array.isArray(value)) {
          const cleanGallery = await persistGalleryImagesAndGetCleanGallery(value as GalleryImage[]);
          await ArzenIDB.saveStoreVal('gallery', cleanGallery);
          
          const storedGallery = cleanGallery.map(item => ({
            ...item,
            url: (typeof item.url === 'string' && item.url.startsWith('local-image://')) ? 'local-image://reference' : item.url
          }));
          localStorage.setItem(`arzen_db_gallery`, JSON.stringify(storedGallery));

          const cleanProducts = await persistAllProductsImagesAndGetCleanList(this.cache['products'] || []);
          const cleanSettings = await persistSettingsImagesAndGetCleanSettings(this.cache['settings'] || DEFAULT_SETTINGS);
          await cleanUnusedImages(cleanProducts, cleanSettings);

        } else {
          await ArzenIDB.saveStoreVal(key, value);
          localStorage.setItem(`arzen_db_${key}`, JSON.stringify(value));
        }
      } catch (err) {
        console.error(`Failed to save ${key} in background database:`, err);
      }
    })();

    return true;
  }

  static initialize(): void {
    if (this.initPromise) return;

    // Load lightweight initial copies from LocalStorage immediately for instant first-paint
    const keys = ['products', 'categories', 'customers', 'orders', 'coupons', 'reviews', 'settings', 'gallery'];
    keys.forEach(k => {
      const defaultValue = k === 'products' ? [] : k === 'categories' ? DEFAULT_CATEGORIES : k === 'customers' ? DEFAULT_CUSTOMERS : k === 'settings' ? DEFAULT_SETTINGS : k === 'gallery' ? DEFAULT_GALLERY : [];
      this.cache[k] = this.getStorage(k, defaultValue);
    });

    if (!localStorage.getItem('arzen_db_initialized')) {
      const enriched = enrichProducts(initialProducts);
      this.cache['products'] = enriched;
      this.cache['categories'] = DEFAULT_CATEGORIES;
      this.cache['customers'] = DEFAULT_CUSTOMERS;
      this.cache['orders'] = DEFAULT_ORDERS(enriched);
      this.cache['coupons'] = DEFAULT_COUPONS;
      this.cache['settings'] = DEFAULT_SETTINGS;
      this.cache['gallery'] = DEFAULT_GALLERY;

      const dbReviews: DbReview[] = initialReviews.map((r, idx) => ({
        id: r.id,
        productId: enriched[idx % enriched.length].id,
        productName: enriched[idx % enriched.length].name,
        name: r.name,
        role: r.role,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
        verified: r.verified,
        status: 'Approved'
      }));
      this.cache['reviews'] = dbReviews;

      this.saveLightweightToLocalStorage();
      localStorage.setItem('arzen_db_initialized', 'true');
    }

    // Connect to IndexedDB, migrate old localStorage data if needed, and restore heavy assets asynchronously
    this.initPromise = (async () => {
      try {
        console.log('Initializing secure database layers with IndexedDB...');

        // Safe migration: extract legacy base64 image strings from localStorage
        let localProducts = [];
        try {
          const raw = localStorage.getItem('arzen_db_products');
          if (raw) localProducts = JSON.parse(raw);
        } catch (e) {}

        let needsMigration = false;
        if (localProducts && localProducts.length > 0) {
          for (const prod of localProducts) {
            const hasBase64 = (prod.images && prod.images.some(isBase64Image)) || 
                             (prod.colors && prod.colors.some((c: any) => isBase64Image(c.image)));
            if (hasBase64) {
              needsMigration = true;
              break;
            }
          }
        }

        if (needsMigration) {
          console.log('Safe Migration: Extracting legacy base64 images into IndexedDB...');
          const cleanProducts = await persistAllProductsImagesAndGetCleanList(localProducts);
          await ArzenIDB.saveStoreVal('products', cleanProducts);

          let localSettings = DEFAULT_SETTINGS;
          try {
            const rawS = localStorage.getItem('arzen_db_settings');
            if (rawS) localSettings = JSON.parse(rawS);
          } catch (e) {}
          const cleanSettings = await persistSettingsImagesAndGetCleanSettings(localSettings);
          await ArzenIDB.saveStoreVal('settings', cleanSettings);

          // Update LocalStorage with pristine, lightweight schemas immediately
          localStorage.setItem('arzen_db_products', JSON.stringify(cleanProducts));
          localStorage.setItem('arzen_db_settings', JSON.stringify(cleanSettings));
          console.log('Safe Migration complete! LocalStorage is now fully optimized and lightweight.');
        }

        // Pull stored items from IndexedDB
        for (const k of keys) {
          const idbVal = await ArzenIDB.getStoreVal(k, null);
          if (idbVal !== null) {
            this.cache[k] = idbVal;
          } else {
            // Backfill IndexedDB if empty
            const cleanVal = k === 'products'
              ? await persistAllProductsImagesAndGetCleanList(this.cache[k])
              : k === 'settings'
              ? await persistSettingsImagesAndGetCleanSettings(this.cache[k])
              : k === 'gallery'
              ? await persistGalleryImagesAndGetCleanGallery(this.cache[k])
              : this.cache[k];
            await ArzenIDB.saveStoreVal(k, cleanVal);
          }
        }

        // Seamlessly restore heavy assets to memory for a smooth synchronous UI experience
        const cleanProdsInCache = this.cache['products'] || [];
        const restoredProds = await restoreAllProductsWithRealImages(cleanProdsInCache);
        this.cache['products'] = restoredProds;

        const cleanSettingsInCache = this.cache['settings'] || DEFAULT_SETTINGS;
        const restoredSettings = await restoreSettingsWithRealImages(cleanSettingsInCache);
        this.cache['settings'] = restoredSettings;

        const cleanGalleryInCache = this.cache['gallery'] || [];
        const restoredGallery = await restoreGalleryWithRealImages(cleanGalleryInCache);
        this.cache['gallery'] = restoredGallery;

        this.isLoaded = true;
        console.log('ArzenDatabase: Successfully restored high-res local image assets to RAM.');

        // Broadcast to trigger instant React components visual refresh
        window.dispatchEvent(new CustomEvent('arzen-db-updated', { detail: { key: 'all_restored' } }));

        // Automatic old cached image garbage collection
        await cleanUnusedImages(cleanProdsInCache, cleanSettingsInCache);

      } catch (err) {
        console.error('Failed to initialize or restore IndexedDB tables:', err);
      }
    })();
  }

  private static saveLightweightToLocalStorage(): void {
    try {
      const keys = ['products', 'categories', 'customers', 'orders', 'coupons', 'reviews', 'settings', 'gallery'];
      keys.forEach(async (k) => {
        const valToSave = this.cache[k];
        if (k === 'products' && Array.isArray(valToSave)) {
          const cleanProds = valToSave.map(prod => {
            const cleanProd = { ...prod };
            if (cleanProd.images && Array.isArray(cleanProd.images)) {
              cleanProd.images = cleanProd.images.map((img: any) => 
                isBase64Image(img) ? 'local-image://reference' : img
              );
            }
            if (cleanProd.colors && Array.isArray(cleanProd.colors)) {
              cleanProd.colors = cleanProd.colors.map((c: any) => ({
                ...c,
                image: isBase64Image(c.image) ? 'local-image://reference' : c.image
              }));
            }
            return cleanProd;
          });
          localStorage.setItem(`arzen_db_${k}`, JSON.stringify(cleanProds));
        } else if (k === 'settings' && valToSave) {
          const cleanSettings = { ...valToSave };
          if (cleanSettings.heroBannerImage && isBase64Image(cleanSettings.heroBannerImage)) {
            cleanSettings.heroBannerImage = 'local-image://reference';
          }
          localStorage.setItem(`arzen_db_${k}`, JSON.stringify(cleanSettings));
        } else if (k === 'gallery' && Array.isArray(valToSave)) {
          const cleanGallery = valToSave.map(item => ({
            ...item,
            url: isBase64Image(item.url) ? 'local-image://reference' : item.url
          }));
          localStorage.setItem(`arzen_db_${k}`, JSON.stringify(cleanGallery));
        } else {
          localStorage.setItem(`arzen_db_${k}`, JSON.stringify(valToSave));
        }
      });
    } catch (e) {
      console.warn('Could not write lightweight data to localStorage:', e);
    }
  }

  // --- PRODUCTS ---
  static getProducts() {
    this.initialize();
    let prods = this.getStorage<any[]>('products', []);
    const hasLifestyle = prods.some(p => p.id && p.id.startsWith('arz-lf-'));
    if (!hasLifestyle) {
      const enrichedLifestyle = lifestyleProducts.map((p, index) => ({
        ...p,
        sku: `ARZ-LXP-LF-${100 + index}`,
        stock: p.stock !== undefined ? p.stock : (p.id === 'arz-lf-001' ? 3 : p.id === 'arz-lf-008' ? 4 : 20 + index),
        status: 'Active',
        tags: ['Luxury', 'Premium', p.category, 'Lifestyle'],
        sizes: p.sizes || ['Regular', 'Grande', 'Mini'],
        codEnabled: p.codEnabled !== undefined ? p.codEnabled : true,
        returnEnabled: p.returnEnabled !== undefined ? p.returnEnabled : true,
        replacementEnabled: p.replacementEnabled !== undefined ? p.replacementEnabled : true,
        returnDays: p.returnDays !== undefined ? p.returnDays : 7,
        specifications: [
          `Materials: ${p.materials ? p.materials[0] : 'Premium Composite'}`,
          `Dimensions: ${p.dimensions || 'Standard'}`,
          `Capacity: ${p.capacity || 'N/A'}`
        ]
      }));
      prods = [...prods, ...enrichedLifestyle];
      this.setStorage('products', prods);
    }
    return prods;
  }

  static getActiveProducts() {
    return this.getProducts().filter(p => p.status === 'Active');
  }

  static saveProducts(prods: any[]): boolean {
    return this.setStorage('products', prods);
  }

  // --- CATEGORIES ---
  static getCategories() {
    this.initialize();
    let cats = this.getStorage<DbCategory[]>('categories', []);
    const hasLifestyleCat = cats.some(c => c.slug.startsWith('lf-'));
    if (!hasLifestyleCat) {
      const lifestyleCats = [
        'Premium Water Bottles',
        'Travel Bottles',
        'Coffee Mugs',
        'Travel Mugs',
        'Tumblers',
        'Sunglasses',
        'Blue Light Glasses',
        'Perfumes',
        'Candles',
        'Premium Gift Sets',
        'Phone Cases',
        'Laptop Sleeves',
        'Tech Organizers',
        'Power Banks',
        'Wireless Chargers',
        'Bluetooth Speakers',
        'AirPods Cases',
        'Travel Organizers',
        'Toiletry Bags',
        'Packing Cubes',
        'Keychains',
        'Notebooks',
        'Journals',
        'Premium Pens',
        'Desk Accessories',
        'Umbrellas'
      ].map((name, index) => ({
        id: `cat-lf-${index + 1}`,
        name,
        slug: `lf-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      }));
      cats = [...cats, ...lifestyleCats];
      this.setStorage('categories', cats);
    }
    return cats;
  }

  static saveCategories(cats: DbCategory[]) {
    this.setStorage('categories', cats);
  }

  // --- CUSTOMERS ---
  static getCustomers() {
    this.initialize();
    return this.getStorage<DbCustomer[]>('customers', []);
  }

  static saveCustomers(custs: DbCustomer[]) {
    this.setStorage('customers', custs);
  }

  // --- ORDERS ---
  static getOrders() {
    this.initialize();
    return this.getStorage<DbOrder[]>('orders', []);
  }

  static saveOrders(ords: DbOrder[]) {
    this.setStorage('orders', ords);
  }

  // --- COUPONS ---
  static getCoupons() {
    this.initialize();
    return this.getStorage<DbCoupon[]>('coupons', []);
  }

  static saveCoupons(coups: DbCoupon[]) {
    this.setStorage('coupons', coups);
  }

  // --- REVIEWS ---
  static getReviews() {
    this.initialize();
    return this.getStorage<DbReview[]>('reviews', []);
  }

  static saveReviews(revs: DbReview[]): boolean {
    return this.setStorage('reviews', revs);
  }

  // --- SETTINGS ---
  static getSettings() {
    this.initialize();
    const settings = this.getStorage<DbSettings>('settings', DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...settings };
  }

  static saveSettings(settings: DbSettings): boolean {
    return this.setStorage('settings', settings);
  }

  // --- GALLERY ---
  static getGallery(): GalleryImage[] {
    this.initialize();
    return this.getStorage<GalleryImage[]>('gallery', DEFAULT_GALLERY);
  }

  static saveGallery(gallery: GalleryImage[]): boolean {
    return this.setStorage('gallery', gallery);
  }
}
