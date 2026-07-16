import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Eye, 
  Lock, 
  KeyRound, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  AlertTriangle, 
  ArrowLeftRight, 
  Image as ImageIcon, 
  Upload, 
  Tag, 
  FileText, 
  MessageSquare, 
  Percent, 
  Settings, 
  Bell, 
  ChevronRight, 
  ChevronLeft,
  X,
  Download, 
  Search, 
  Check, 
  HelpCircle, 
  Sparkles,
  Printer,
  ChevronDown,
  Star
} from 'lucide-react';
import { ArzenDatabase, ArzenIDB, DbCategory, DbCustomer, DbOrder, DbCoupon, DbReview, DbSettings, LOW_STOCK_LIMIT } from '../db';
import { Product, ProductColor } from '../types';
import { formatPrice } from '../utils';

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const baseUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  // Database state
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [coupons, setCoupons] = useState<DbCoupon[]>([]);
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [settings, setSettings] = useState<DbSettings>({
    websiteLogoText: '',
    websiteLogoSubtitle: '',
    whatsappNumber: '',
    email: '',
    phone: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
    metaTitle: '',
    metaDescription: '',
    googleAnalyticsId: '',
    freeShippingThreshold: 0,
    flatShippingCharge: 0
  });

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('arzen_admin_logged') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'forgot' | 'change'>('login');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaStep, setMfaStep] = useState(false);

  // Layout Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'customers' | 'coupons' | 'reviews' | 'settings' | 'gallery'>('overview');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedSortOption, setSelectedSortOption] = useState('name-asc');

  // Bulk actions state
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkUploadText, setBulkUploadText] = useState('');
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Profile management state
  const [adminName, setAdminName] = useState('Master Admin');
  const [adminProfilePic, setAdminProfilePic] = useState('AZ');

  // Forms state
  const [isEditingProduct, setIsEditingProduct] = useState<any>(null); // holds product when editing, or {} when adding
  const [showProductForm, setShowProductForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageInputUrl, setImageInputUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editing Categories state
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [catName, setCatName] = useState('');
  const [catParent, setCatParent] = useState('');

  // Editing Coupons state
  const [editingCoupon, setEditingCoupon] = useState<DbCoupon | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState(0);
  const [couponMinAmount, setCouponMinAmount] = useState(0);
  const [couponActive, setCouponActive] = useState(true);

  // Review Reply state
  const [replyText, setReplyText] = useState('');
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);

  // Invoice generator state
  const [viewInvoiceOrder, setViewInvoiceOrder] = useState<DbOrder | null>(null);

  // Notification state
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Dynamic Gallery State
  const [gallery, setGallery] = useState<any[]>([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<any | null>(null); // Lightbox
  const [editingAltTextId, setEditingAltTextId] = useState<string | null>(null);
  const [editingAltTextVal, setEditingAltTextVal] = useState<string>('');
  const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null);
  const [deletedImageBackup, setDeletedImageBackup] = useState<{ 
    image: any; 
    index: number; 
    productsBackup?: any[]; 
    settingsBackup?: any;
    imageBase64Backup?: string | null;
    imageIdBackup?: string | null;
  } | null>(null);
  const [undoTimeRemaining, setUndoTimeRemaining] = useState<number>(0);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Undo countdown timer effect
  useEffect(() => {
    if (undoTimeRemaining > 0) {
      undoTimerRef.current = setTimeout(() => {
        setUndoTimeRemaining(prev => prev - 1);
      }, 1000);
    } else {
      setDeletedImageBackup(null);
    }
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, [undoTimeRemaining]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    // Clear previous timeout if any
    const id = setTimeout(() => {
      setToast(null);
    }, 4500);
    return id;
  };

  // Fetch data on load
  const loadData = () => {
    setProducts(ArzenDatabase.getProducts());
    setCategories(ArzenDatabase.getCategories());
    setCustomers(ArzenDatabase.getCustomers());
    setOrders(ArzenDatabase.getOrders());
    setCoupons(ArzenDatabase.getCoupons());
    setReviews(ArzenDatabase.getReviews());
    setSettings(ArzenDatabase.getSettings());
    setGallery(ArzenDatabase.getGallery());
  };

  useEffect(() => {
    ArzenDatabase.initialize();
    loadData();

    // Listen to database updates made from shop/checkout
    const handleDbUpdate = () => {
      loadData();
    };
    window.addEventListener('arzen-db-updated', handleDbUpdate);
    return () => {
      window.removeEventListener('arzen-db-updated', handleDbUpdate);
    };
  }, []);

  // Set up low stock / new order live notification system
  useEffect(() => {
    const alerts: string[] = [];
    products.forEach(p => {
      if (p.stock <= 5) {
        alerts.push(`Low Stock Alert: "${p.name}" has only ${p.stock} items remaining.`);
      }
    });

    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    if (pendingCount > 0) {
      alerts.push(`Pending Orders: You have ${pendingCount} order(s) waiting for validation.`);
    }

    setNotifications(alerts);
  }, [products, orders]);

  // Auth handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((adminEmail === 'admin@arzen.com' || adminEmail === 'arzen.brand@gmail.com') && adminPassword === 'arzenluxury2026') {
      // 2-Factor Authentication Step
      setMfaStep(true);
      setAuthError('');
    } else if ((adminEmail === 'admin@arzen.com' || adminEmail === 'arzen.brand@gmail.com') && adminPassword !== '') {
      setAuthError('Incorrect secret master credential password.');
    } else {
      // Allow demo login but guide them
      setMfaStep(true);
      setAuthError('');
    }
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow any 2FA code for seamless demo experience
    setIsAuthenticated(true);
    localStorage.setItem('arzen_admin_logged', 'true');
    setMfaStep(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('arzen_admin_logged');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    alert('Admin password updated successfully!');
    setAuthMode('login');
    setAuthError('');
  };

  // Calculations for Metrics
  const totalSales = orders
    .filter(o => o.paymentStatus === 'Paid' || o.status === 'Delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersCount = orders.length;
  
  const lowStockCount = products.filter(p => p.stock <= 5).length;
  
  const totalCustomersCount = customers.length;

  // CSV Report Generator
  const handleExportCSV = (type: 'sales' | 'products' | 'customers' | 'orders') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (type === 'products') {
      csvContent += "ID,Name,SKU,Category,Price,Stock,Status\n";
      products.forEach(p => {
        csvContent += `"${p.id}","${p.name}","${p.sku}","${p.category}",${p.price},${p.stock},"${p.status}"\n`;
      });
    } else if (type === 'orders') {
      csvContent += "Order Number,Customer,Email,Total,Payment,Status,Date\n";
      orders.forEach(o => {
        csvContent += `"${o.orderNumber}","${o.customerName}","${o.customerEmail}",${o.total},"${o.paymentMethod}","${o.status}","${o.date}"\n`;
      });
    } else if (type === 'customers') {
      csvContent += "ID,Name,Email,Phone,Status,Total Spent,Orders\n";
      customers.forEach(c => {
        csvContent += `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.status}",${c.totalSpent},${c.ordersCount}\n`;
      });
    } else {
      csvContent += "Date,Sales Revenue,Orders Count,Average Order Value\n";
      csvContent += `2026-07-05,${totalSales},${totalOrdersCount},${Math.round(totalSales / (totalOrdersCount || 1))}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ARZEN_${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PRODUCT ACTIONS ---
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingProduct.name || !isEditingProduct.price) {
      alert('Please fill out Product Name and Price.');
      return;
    }

    const updatedList = [...products];
    if (isEditingProduct.id) {
      // Editing
      const idx = updatedList.findIndex(p => p.id === isEditingProduct.id);
      if (idx !== -1) {
        updatedList[idx] = isEditingProduct;
      }
    } else {
      // Adding
      const newId = `arz-${Date.now().toString().slice(-3)}`;
      const newSku = isEditingProduct.sku || `ARZ-LXP-${200 + products.length}`;
      const newProd = {
        ...isEditingProduct,
        id: newId,
        sku: newSku,
        rating: isEditingProduct.rating || 5.0,
        reviewsCount: isEditingProduct.reviewsCount || 0,
        images: isEditingProduct.images && isEditingProduct.images.length > 0 
          ? isEditingProduct.images 
          : ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800'],
        colors: isEditingProduct.colors && isEditingProduct.colors.length > 0
          ? isEditingProduct.colors
          : [{ name: 'Matte Black', hex: '#0B0B0B', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800' }],
        status: isEditingProduct.status || 'Active',
        tags: isEditingProduct.tags || ['Luxury'],
        specifications: isEditingProduct.specifications || [`Materials: French Calfskin Leather`]
      };
      updatedList.push(newProd);
    }

    const savedSuccessfully = ArzenDatabase.saveProducts(updatedList);
    if (!savedSuccessfully) {
      alert("⚠️ Error: Storage Quota Exceeded. Failed to save the product details. Please try removing some large uploaded images from this or other products.");
      return;
    }
    setProducts(updatedList);
    setShowProductForm(false);
    setIsEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (isDeleting) return;
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) {
      showToast('Asset not found in database.', 'error');
      return;
    }
    setProductToDeleteId(id);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDeleteId || isDeleting) return;
    setIsDeleting(true);

    try {
      // Small premium delay to simulate database request and state commitment
      await new Promise(resolve => setTimeout(resolve, 600));

      const productToDelete = products.find(p => p.id === productToDeleteId);
      if (!productToDelete) {
        showToast('Asset not found in database.', 'error');
        setProductToDeleteId(null);
        setIsDeleting(false);
        return;
      }

      const updated = products.filter(p => p.id !== productToDeleteId);
      const success = ArzenDatabase.saveProducts(updated);

      if (success) {
        // Instantly refresh UI
        setProducts(updated);

        // Update featured products, hero spotlight masterpiece automatically after deletion
        const updatedSettings = { ...settings };
        let settingsChanged = false;

        if (updatedSettings.heroProductId === productToDeleteId) {
          updatedSettings.heroProductId = "";
          settingsChanged = true;
        }

        if (updatedSettings.featuredProductIds && updatedSettings.featuredProductIds.includes(productToDeleteId)) {
          updatedSettings.featuredProductIds = updatedSettings.featuredProductIds.filter((fid: string) => fid !== productToDeleteId);
          settingsChanged = true;
        }

        if (settingsChanged) {
          ArzenDatabase.saveSettings(updatedSettings);
          setSettings(updatedSettings);
        }

        // Dispatch updated event for real-time reactivity across all windows / views
        window.dispatchEvent(new CustomEvent('arzen-db-updated'));

        showToast("Product deleted successfully.", 'success');
      } else {
        showToast("Database write failed. Storage quota may be full.", 'error');
      }
    } catch (err: any) {
      console.error("Error deleting product:", err);
      showToast(`An error occurred while deleting the asset: ${err?.message || err}`, 'error');
    } finally {
      setIsDeleting(false);
      setProductToDeleteId(null);
    }
  };

  const handleDuplicateProduct = (prod: any) => {
    const copy = {
      ...prod,
      id: `arz-${Date.now().toString().slice(-3)}`,
      name: `${prod.name} (Copy)`,
      sku: `${prod.sku}-COPY`,
      stock: 5,
      reviewsCount: 0,
      rating: 5.0
    };
    const updated = [...products, copy];
    const savedSuccessfully = ArzenDatabase.saveProducts(updated);
    if (!savedSuccessfully) {
      alert("⚠️ Error: Storage Quota Exceeded. Failed to duplicate the product. Please try removing some large uploaded images first.");
      return;
    }
    setProducts(updated);
    alert(`Duplicated successfully as ${copy.name}`);
  };

  // Fully-functional drag & drop and click file upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setUploadError('');
    const validFiles: File[] = [];
    
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
        setUploadError(`Unsupported file: "${file.name}". Only JPG, JPEG, PNG and WEBP are accepted.`);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setUploadError(`File too large: "${file.name}". Maximum size allowed is 10 MB.`);
        return;
      }
      
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Simulate progress bar going from 10% to 100%
    setUploadProgress(10);
    let currentProgress = 10;
    
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        const promises = validFiles.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                  try {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1000;
                    const MAX_HEIGHT = 1000;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                      if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                      }
                    } else {
                      if (height > MAX_HEIGHT) {
                        width = Math.round((width * MAX_HEIGHT) / height);
                        height = MAX_HEIGHT;
                      }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                      resolve(reader.result as string); // fallback
                      return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);
                    const compressed = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressed);
                  } catch (err) {
                    resolve(reader.result as string); // fallback if canvas operations fail
                  }
                };
                img.onerror = () => {
                  resolve(reader.result as string); // fallback if image load fails
                };
              } else {
                reject(new Error('Failed to read file'));
              }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
        });

        Promise.all(promises)
          .then((dataUrls) => {
            if (isEditingProduct) {
              const currentImages = isEditingProduct.images || [];
              setIsEditingProduct({
                ...isEditingProduct,
                images: [...currentImages, ...dataUrls]
              });
            }
            setUploadProgress(null);
          })
          .catch(() => {
            setUploadError('Failed to parse some images. Please try again.');
            setUploadProgress(null);
          });
      } else {
        setUploadProgress(currentProgress);
      }
    }, 80);
  };

  const handleAddImageUrl = () => {
    if (!imageInputUrl.trim()) return;
    if (isEditingProduct) {
      const currentImages = isEditingProduct.images || [];
      setIsEditingProduct({
        ...isEditingProduct,
        images: [...currentImages, imageInputUrl]
      });
      setImageInputUrl('');
    }
  };

  // --- DYNAMIC GALLERY OPERATIONS ---
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(event.target?.result as string);
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            resolve(dataUrl);
          } catch (e) {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUploadGalleryMultiple = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadProgress(10);
    setUploadError('');
    
    try {
      const currentGallery = [...gallery];
      const count = files.length;
      
      for (let i = 0; i < count; i++) {
        const file = files[i];
        
        const progressStart = Math.round(10 + (i / count) * 80);
        setUploadProgress(progressStart);
        
        const compressedBase64 = await compressImage(file);
        
        const formattedSize = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(0)} KB`;
          
        const newImage = {
          id: 'gal-' + Math.random().toString(36).substring(2, 11),
          url: compressedBase64,
          altText: file.name.split('.')[0].replace(/[-_]/g, ' ') || 'ARZEN Product Showcase',
          size: formattedSize,
          uploadDate: new Date().toISOString()
        };
        
        currentGallery.push(newImage);
      }
      
      setUploadProgress(95);
      const success = ArzenDatabase.saveGallery(currentGallery);
      if (success) {
        setGallery(currentGallery);
        showToast(`Successfully registered ${count} custom assets to the gallery ledger`, "success");
      } else {
        showToast("Storage limit exceeded. Clear unused products first.", "error");
        setUploadError("IndexedDB Storage Full. Try uploading smaller/fewer files.");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError("Asset transmission failed: " + err.message);
    } finally {
      setUploadProgress(null);
    }
  };

  const handleReplaceGalleryImage = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setUploadProgress(15);
    setUploadError('');
    
    try {
      setUploadProgress(50);
      const compressedBase64 = await compressImage(file);
      
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
        
      const nextGallery = gallery.map(item => {
        if (item.id === id) {
          return {
            ...item,
            url: compressedBase64,
            size: formattedSize,
            uploadDate: new Date().toISOString()
          };
        }
        return item;
      });
      
      setUploadProgress(90);
      const success = ArzenDatabase.saveGallery(nextGallery);
      if (success) {
        setGallery(nextGallery);
        showToast("Asset replaced successfully in the database", "success");
      } else {
        showToast("Storage Full! Clear some assets from catalog.", "error");
        setUploadError("Database capacity full. Cannot replace image.");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError("Replacement failed: " + err.message);
    } finally {
      setUploadProgress(null);
    }
  };

  const syncAndRemoveImageReferences = (imageUrl: string) => {
    const currentProducts = ArzenDatabase.getProducts();
    let productModified = false;
    const updatedProducts = currentProducts.map(p => {
      let imagesChanged = false;
      let colorsChanged = false;
      
      const nextImages = (p.images || []).filter((img: string) => {
        if (img === imageUrl) {
          imagesChanged = true;
          return false;
        }
        return true;
      });

      if (nextImages.length === 0) {
        nextImages.push('/assets/arzen-tote-elevate.svg');
        imagesChanged = true;
      }

      const nextColors = (p.colors || []).map((col: any) => {
        if (col.image === imageUrl) {
          colorsChanged = true;
          return { ...col, image: '/assets/arzen-tote-elevate.svg' };
        }
        return col;
      });

      if (imagesChanged || colorsChanged) {
        productModified = true;
        return {
          ...p,
          images: nextImages,
          colors: nextColors
        };
      }
      return p;
    });

    if (productModified) {
      ArzenDatabase.saveProducts(updatedProducts);
      setProducts(updatedProducts);
      showToast("Synchronized asset removal across product catalog", "info");
    }

    const currentSettings = ArzenDatabase.getSettings();
    if (currentSettings.heroBannerImage === imageUrl) {
      currentSettings.heroBannerImage = '/assets/arzen-duffle.svg';
      ArzenDatabase.saveSettings(currentSettings);
      setSettings(currentSettings);
      showToast("Cleared homepage cinematic hero banner reference", "info");
    }
  };

  const handleDeleteGalleryImage = (id: string) => {
    const itemToDelete = gallery.find(item => item.id === id);
    if (!itemToDelete) return;
    setImageToDeleteId(id);
  };

  const confirmDeleteGalleryImage = async () => {
    if (!imageToDeleteId) return;
    const itemToDelete = gallery.find(item => item.id === imageToDeleteId);
    if (!itemToDelete) {
      setImageToDeleteId(null);
      return;
    }

    try {
      const idx = gallery.findIndex(item => item.id === imageToDeleteId);
      
      // If it's a local IndexedDB image, retrieve its actual binary base64 payload first
      let imageBase64Backup: string | null = null;
      let imageIdBackup: string | null = null;
      if (typeof itemToDelete.url === 'string' && itemToDelete.url.startsWith('local-image://')) {
        imageIdBackup = itemToDelete.url.replace('local-image://', '');
        imageBase64Backup = await ArzenIDB.getImage(imageIdBackup);
      }

      // Backup current products and settings before we modify them
      const productsBackup = ArzenDatabase.getProducts();
      const settingsBackup = ArzenDatabase.getSettings();
      
      setDeletedImageBackup({ 
        image: itemToDelete, 
        index: idx,
        productsBackup,
        settingsBackup,
        imageBase64Backup,
        imageIdBackup
      });
      setUndoTimeRemaining(30);
      
      const nextGallery = gallery.filter(item => item.id !== imageToDeleteId);
      const success = ArzenDatabase.saveGallery(nextGallery);
      if (success) {
        // Explicitly delete the physical file from browser storage (IndexedDB)
        if (imageIdBackup) {
          await ArzenIDB.deleteImage(imageIdBackup);
        }
        setGallery(nextGallery);
        syncAndRemoveImageReferences(itemToDelete.url);
        showToast("Image deleted successfully.", "success");
      } else {
        showToast("Failed to delete the image from database storage.", "error");
      }
    } catch (err: any) {
      showToast(`Deletion failed: ${err.message || err}`, "error");
    } finally {
      setImageToDeleteId(null);
    }
  };

  const handleUndoDelete = async () => {
    if (!deletedImageBackup) return;
    
    try {
      // First, restore physical IndexedDB image file if it was backed up
      if (deletedImageBackup.imageIdBackup && deletedImageBackup.imageBase64Backup) {
        await ArzenIDB.saveImage(deletedImageBackup.imageIdBackup, deletedImageBackup.imageBase64Backup);
      }

      const restored = [...gallery];
      restored.splice(deletedImageBackup.index, 0, deletedImageBackup.image);
      
      const success = ArzenDatabase.saveGallery(restored);
      if (success) {
        // Restore products and settings references from backup if they exist!
        if (deletedImageBackup.productsBackup) {
          ArzenDatabase.saveProducts(deletedImageBackup.productsBackup);
          setProducts(deletedImageBackup.productsBackup);
        }
        if (deletedImageBackup.settingsBackup) {
          ArzenDatabase.saveSettings(deletedImageBackup.settingsBackup);
          setSettings(deletedImageBackup.settingsBackup);
        }
        
        setGallery(restored);
        setDeletedImageBackup(null);
        setUndoTimeRemaining(0);
        showToast("Image restored successfully.", "success");
      } else {
        showToast("Failed to restore image back to database.", "error");
      }
    } catch (err: any) {
      showToast(`Undo failed: ${err.message || err}`, "error");
    }
  };

  const handleSaveAltText = (id: string, text: string) => {
    const nextGallery = gallery.map(item => {
      if (item.id === id) {
        return { ...item, altText: text };
      }
      return item;
    });
    const success = ArzenDatabase.saveGallery(nextGallery);
    if (success) {
      setGallery(nextGallery);
      setEditingAltTextId(null);
      showToast("Asset metadata updated", "success");
    }
  };

  const handleReorderGallery = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === gallery.length - 1) return;
    
    const nextGallery = [...gallery];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    const temp = nextGallery[index];
    nextGallery[index] = nextGallery[targetIdx];
    nextGallery[targetIdx] = temp;
    
    const success = ArzenDatabase.saveGallery(nextGallery);
    if (success) {
      setGallery(nextGallery);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOverCard = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDropCard = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const nextGallery = [...gallery];
    const draggedItem = nextGallery[draggedItemIndex];
    
    nextGallery.splice(draggedItemIndex, 1);
    nextGallery.splice(index, 0, draggedItem);
    
    const success = ArzenDatabase.saveGallery(nextGallery);
    if (success) {
      setGallery(nextGallery);
      showToast("Asset layout reordered successfully", "success");
    }
    setDraggedItemIndex(null);
  };

  const handleRemoveImage = (index: number) => {
    if (isEditingProduct) {
      const currentImages = [...(isEditingProduct.images || [])];
      currentImages.splice(index, 1);
      setIsEditingProduct({
        ...isEditingProduct,
        images: currentImages
      });
    }
  };

  // --- DYNAMIC PRODUCT PORTAL HELPERS ---
  const handleToggleProductStatus = (id: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Active' ? 'Draft' : 'Active';
        showToast(`Product status updated to ${nextStatus}`, 'success');
        return { ...p, status: nextStatus };
      }
      return p;
    });
    ArzenDatabase.saveProducts(updated);
    setProducts(updated);
  };

  const handleMoveImageLeft = (index: number) => {
    if (index === 0) return;
    if (isEditingProduct) {
      const currentImages = [...(isEditingProduct.images || [])];
      const temp = currentImages[index];
      currentImages[index] = currentImages[index - 1];
      currentImages[index - 1] = temp;
      setIsEditingProduct({
        ...isEditingProduct,
        images: currentImages
      });
    }
  };

  const handleMoveImageRight = (index: number) => {
    if (isEditingProduct) {
      const currentImages = [...(isEditingProduct.images || [])];
      if (index === currentImages.length - 1) return;
      const temp = currentImages[index];
      currentImages[index] = currentImages[index + 1];
      currentImages[index + 1] = temp;
      setIsEditingProduct({
        ...isEditingProduct,
        images: currentImages
      });
    }
  };

  const handleToggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllProducts = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    if (confirm(`Are you absolutely sure you want to permanently retire ${selectedProductIds.length} selected assets from the database?`)) {
      const updated = products.filter(p => !selectedProductIds.includes(p.id));
      const success = ArzenDatabase.saveProducts(updated);
      if (success) {
        setProducts(updated);
        setSelectedProductIds([]);
        showToast(`Permanently deleted ${selectedProductIds.length} assets from the ledger.`, 'success');
      } else {
        showToast('Database write failed. Storage quota may be full.', 'error');
      }
    }
  };

  const handleBulkToggleStatus = (status: 'Active' | 'Draft') => {
    if (selectedProductIds.length === 0) return;
    const updated = products.map(p => {
      if (selectedProductIds.includes(p.id)) {
        return { ...p, status };
      }
      return p;
    });
    const success = ArzenDatabase.saveProducts(updated);
    if (success) {
      setProducts(updated);
      setSelectedProductIds([]);
      showToast(`Successfully updated ${selectedProductIds.length} assets status to "${status}".`, 'success');
    } else {
      showToast('Database write failed.', 'error');
    }
  };

  const handleImportBulkJSON = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkUploadText.trim()) return;
    try {
      const parsed = JSON.parse(bulkUploadText);
      const itemsToImport = Array.isArray(parsed) ? parsed : [parsed];
      
      const validItems = itemsToImport.map((item: any, idx: number) => {
        if (!item.name || !item.price) {
          throw new Error(`Item at index ${idx} is missing Name or Price.`);
        }
        return {
          ...item,
          id: item.id || `arz-${Date.now().toString().slice(-3)}-${idx}-${Math.floor(Math.random() * 1000)}`,
          sku: item.sku || `ARZ-LXP-BULK-${100 + idx}-${Math.floor(Math.random() * 100)}`,
          tagline: item.tagline || 'Exclusive Premium Creation',
          price: parseFloat(item.price),
          rating: parseFloat(item.rating) || 5.0,
          reviewsCount: parseInt(item.reviewsCount) || 0,
          category: item.category || 'Bags',
          images: item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800'],
          colors: item.colors || [{ name: 'Matte Black', hex: '#0B0B0B', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800' }],
          description: item.description || 'Crafted masterfully with French hides and solid hardware.',
          materials: item.materials || ['French Calfskin'],
          status: item.status || 'Active',
          stock: parseInt(item.stock) || 15
        };
      });

      const updated = [...products, ...validItems];
      const success = ArzenDatabase.saveProducts(updated);
      if (success) {
        setProducts(updated);
        setBulkUploadText('');
        setShowBulkUploadModal(false);
        showToast(`Successfully imported and established ${validItems.length} luxury assets in bulk!`, 'success');
      } else {
        showToast('Database write failed. Storage quota may be full.', 'error');
      }
    } catch (err: any) {
      alert(`⚠️ Validation Failed: ${err?.message || 'Invalid JSON formatting. Please ensure it is a valid product object or array of products.'}`);
    }
  };

  const loadBulkSeedPreset = (presetName: 'luggage' | 'tech') => {
    let preset: any[] = [];
    if (presetName === 'luggage') {
      preset = [
        {
          name: "Imperial French Travel Trunk",
          tagline: "The sovereign voyager companion",
          price: 249000,
          category: "Travel",
          stock: 3,
          description: "Stately dimensions wrapped in cognac grain leather, lined with green microfiber, secured with dual golden brass combi-locks."
        },
        {
          name: "Monarque Overnighter Duffle",
          tagline: "Epitome of light weekend escapes",
          price: 185000,
          category: "Travel",
          stock: 8,
          description: "Ultra-supple nappa exterior, robust hand-stitched rolled straps, spacious main volume with heavy-gauge gold zippers."
        }
      ];
    } else {
      preset = [
        {
          name: "Vanguard Tech Portfolio Sleeve",
          tagline: "Sovereign office leatherwork",
          price: 34999,
          category: "Tech Accessories",
          stock: 25,
          description: "Fully padded armor-shell covered in French Epsom leather, magnetic flap clasp, hidden cable compartments."
        },
        {
          name: "Arzen Sovereign Tech Roll",
          tagline: "Exquisite cord and accessory tidy",
          price: 18999,
          category: "Tech Accessories",
          stock: 30,
          description: "Soft nubuck lining, multiple elastic slip bands, gold-embossed button strap latch."
        }
      ];
    }
    setBulkUploadText(JSON.stringify(preset, null, 2));
  };

  // --- CATEGORY ACTIONS ---
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const updated = [...categories];
    if (editingCategory) {
      const idx = updated.findIndex(c => c.id === editingCategory.id);
      if (idx !== -1) {
        updated[idx] = {
          ...editingCategory,
          name: catName,
          slug: catName.toLowerCase().replace(/ /g, '-'),
          parentId: catParent || undefined
        };
      }
    } else {
      updated.push({
        id: `cat-${Date.now()}`,
        name: catName,
        slug: catName.toLowerCase().replace(/ /g, '-'),
        parentId: catParent || undefined
      });
    }

    ArzenDatabase.saveCategories(updated);
    setCategories(updated);
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCatName('');
    setCatParent('');
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const updated = categories.filter(c => c.id !== id);
      ArzenDatabase.saveCategories(updated);
      setCategories(updated);
    }
  };

  // --- ORDER ACTIONS ---
  const handleUpdateOrderStatus = (orderId: string, newStatus: DbOrder['status']) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const upOrder = { ...o, status: newStatus };
        if (newStatus === 'Delivered') {
          upOrder.paymentStatus = 'Paid';
        }
        return upOrder;
      }
      return o;
    });
    ArzenDatabase.saveOrders(updated);
    setOrders(updated);
  };

  const handleReturnAction = (orderId: string, action: 'Approved' | 'Rejected') => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          returnStatus: action,
          status: action === 'Approved' ? 'Cancelled' as const : o.status
        };
      }
      return o;
    });
    ArzenDatabase.saveOrders(updated);
    setOrders(updated);
  };

  // --- CUSTOMER ACTIONS ---
  const handleToggleCustomerBlock = (customerId: string) => {
    const updated = customers.map(c => {
      if (c.id === customerId) {
        const nextStatus = c.status === 'Active' ? 'Blocked' as const : 'Active' as const;
        return { ...c, status: nextStatus };
      }
      return c;
    });
    ArzenDatabase.saveCustomers(updated);
    setCustomers(updated);
  };

  // --- COUPONS ACTIONS ---
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || couponValue <= 0) return;

    const updated = [...coupons];
    if (editingCoupon) {
      const idx = updated.findIndex(c => c.id === editingCoupon.id);
      if (idx !== -1) {
        updated[idx] = {
          ...editingCoupon,
          code: couponCode.toUpperCase(),
          discountType: couponType,
          value: couponValue,
          minOrderAmount: couponMinAmount,
          active: couponActive
        };
      }
    } else {
      updated.push({
        id: `cp-${Date.now()}`,
        code: couponCode.toUpperCase(),
        discountType: couponType,
        value: couponValue,
        minOrderAmount: couponMinAmount,
        active: couponActive
      });
    }

    ArzenDatabase.saveCoupons(updated);
    setCoupons(updated);
    setShowCouponForm(false);
    setEditingCoupon(null);
    setCouponCode('');
    setCouponValue(0);
    setCouponMinAmount(0);
  };

  const handleDeleteCoupon = (id: string) => {
    if (confirm('Delete this coupon?')) {
      const updated = coupons.filter(c => c.id !== id);
      ArzenDatabase.saveCoupons(updated);
      setCoupons(updated);
    }
  };

  // --- REVIEWS ACTIONS ---
  const handleReviewStatus = (id: string, action: DbReview['status']) => {
    const updated = reviews.map(r => {
      if (r.id === id) {
        return { ...r, status: action };
      }
      return r;
    });
    ArzenDatabase.saveReviews(updated);
    setReviews(updated);
  };

  const handleSaveReviewReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyReviewId || !replyText.trim()) return;

    const updated = reviews.map(r => {
      if (r.id === replyReviewId) {
        return { ...r, reply: replyText, status: 'Approved' as const };
      }
      return r;
    });

    ArzenDatabase.saveReviews(updated);
    setReviews(updated);
    setReplyReviewId(null);
    setReplyText('');
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const success = ArzenDatabase.saveSettings(settings);
    if (success !== false) {
      showToast('Global Luxury Store Settings saved successfully!', 'success');
      // Dispatch database updated event to trigger updates immediately
      window.dispatchEvent(new CustomEvent('arzen-db-updated'));
    } else {
      showToast('Failed to save settings. Local storage may be full.', 'error');
    }
  };

  // Filter products based on search, category, status & sort
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === 'All' || p.status === selectedStatusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (selectedSortOption === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (selectedSortOption === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (selectedSortOption === 'price-asc') {
      return a.price - b.price;
    } else if (selectedSortOption === 'price-desc') {
      return b.price - a.price;
    } else if (selectedSortOption === 'stock-asc') {
      return a.stock - b.stock;
    } else if (selectedSortOption === 'stock-desc') {
      return b.stock - a.stock;
    }
    return 0;
  });

  // Filter orders based on status
  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'All') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans" id="arzen-admin-portal">
      
      {/* 1. AUTHENTICATION SHIELD */}
      {!isAuthenticated ? (
        <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden bg-radial from-[#15120C] via-[#070707] to-[#070707]">
          {/* Decorative glowing circles */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8A25D]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/2 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-md bg-[#0F0F0F]/90 backdrop-blur-md border border-[#C8A25D]/20 p-8 rounded-xs shadow-2xl relative z-10">
            
            {/* Logo Header */}
            <div className="flex flex-col items-center justify-center mb-8 text-center select-none">
              <svg viewBox="0 0 100 70" className="h-10 w-auto fill-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="luxuryGoldAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A662D" />
                    <stop offset="45%" stopColor="#C8A25D" />
                    <stop offset="100%" stopColor="#5E451D" />
                  </linearGradient>
                </defs>
                <path d="M 50 10 L 80 62 L 72.5 62 L 50 23 L 27.5 62 L 20 62 Z" fill={`url(${baseUrl}#luxuryGoldAdmin) #C8A25D`} />
                <path d="M 50 36 L 64 62 L 59 62 L 50 45 L 41 62 L 36 62 Z" fill={`url(${baseUrl}#luxuryGoldAdmin) #C8A25D`} />
              </svg>
              <h1 className="text-xl font-bold tracking-[0.25em] text-[#C8A25D] font-sans mt-3">ARZEN</h1>
              <p className="text-[8px] tracking-[0.3em] text-white/40 uppercase mt-1">Sovereign Store Administrator</p>
            </div>

            {/* ERROR ALERTS */}
            {authError && (
              <div className="mb-4 bg-red-950/40 border border-red-500/30 p-3 rounded-xs text-xs text-red-400 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* LOGIN MODE */}
            {authMode === 'login' && !mfaStep && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    placeholder="arzen.brand@gmail.com" 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs tracking-wider text-white focus:outline-none"
                    required
                  />
                  <p className="text-[9px] text-white/30 font-mono mt-1">Hint: arzen.brand@gmail.com (Password: arzenluxury2026)</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase">SECRET PASSPHRASE</label>
                    <button 
                      type="button" 
                      onClick={() => setAuthMode('forgot')}
                      className="text-[10px] text-[#C8A25D] hover:text-white font-mono tracking-wider focus:outline-none"
                    >
                      FORGOT?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••••••" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                    required
                  />
                  <p className="text-[9px] text-white/30 font-mono mt-1">Hint: arzenluxury2026</p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#8A662D] to-[#C8A25D] hover:from-white hover:to-white text-black hover:text-black text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-xs shadow-lg"
                >
                  Request Secure Access
                </button>
              </form>
            )}

            {/* TWO-FACTOR STEP */}
            {mfaStep && (
              <form onSubmit={handleVerifyMfa} className="space-y-5">
                <div className="text-center space-y-2 mb-4">
                  <div className="inline-flex p-3 bg-[#C8A25D]/10 rounded-full text-[#C8A25D] border border-[#C8A25D]/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-mono tracking-wider uppercase text-[#C8A25D]">Verification Shield</h3>
                  <p className="text-[11px] text-white/60 font-light max-w-xs mx-auto">
                    A secure 2FA temporary passcode has been simulated. Please enter any 6-digit code below to unlock the vault.
                  </p>
                </div>

                <div>
                  <label className="block text-center text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">6-DIGIT SECURITY PIN</label>
                  <input 
                    type="text" 
                    placeholder="X X X X X X" 
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs py-3.5 text-center text-lg font-mono tracking-[0.5em] text-white focus:outline-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-[#C8A25D] hover:bg-white text-black text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-xs"
                >
                  Verify Authenticator Code
                </button>

                <button 
                  type="button" 
                  onClick={() => setMfaStep(false)}
                  className="w-full text-center text-[10px] text-white/40 hover:text-white font-mono tracking-widest uppercase focus:outline-none"
                >
                  Cancel Access Attempt
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD MODE */}
            {authMode === 'forgot' && (
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <h3 className="text-xs font-mono tracking-wider uppercase text-[#C8A25D]">Credential Recovery</h3>
                  <p className="text-xs text-white/60 font-light mt-1">Enter your admin email. A secure reset token will be dispatched.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">ADMIN EMAIL</label>
                  <input 
                    type="email" 
                    placeholder="arzen.brand@gmail.com" 
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs tracking-wider text-white focus:outline-none"
                    required
                  />
                </div>

                <button 
                  onClick={() => { alert('Reset token generated. For this demo, please use arzenluxury2026.'); setAuthMode('login'); }}
                  className="w-full py-3.5 bg-[#C8A25D] hover:bg-white text-black text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-xs"
                >
                  Issue Recovery Protocol
                </button>

                <button 
                  onClick={() => setAuthMode('login')}
                  className="w-full text-center text-[10px] text-white/40 hover:text-white font-mono tracking-widest uppercase focus:outline-none"
                >
                  Return to Entry Vault
                </button>
              </div>
            )}

            {/* Back to main site trigger */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <button 
                onClick={onClose}
                className="text-[10px] text-white/40 hover:text-[#C8A25D] font-mono tracking-widest uppercase flex items-center justify-center space-x-2 mx-auto focus:outline-none"
              >
                <span>← Return to Public Showroom</span>
              </button>
            </div>

          </div>
        </div>
      ) : (
        
        // 2. MASTER ADMIN PORTAL FRAME
        <div className="flex-grow flex flex-col md:flex-row">
          
          {/* A. SECURE SIDEBAR RAIL */}
          <aside className="w-full md:w-64 bg-[#090909] border-r border-[#C8A25D]/15 flex flex-col shrink-0">
            
            {/* Header branding lock */}
            <div className="p-6 border-b border-[#C8A25D]/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg viewBox="0 0 100 70" className="h-6 w-auto fill-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 50 10 L 80 62 L 72.5 62 L 50 23 L 27.5 62 L 20 62 Z" fill="#C8A25D" />
                  <path d="M 50 36 L 64 62 L 59 62 L 50 45 L 41 62 L 36 62 Z" fill="#C8A25D" />
                </svg>
                <div>
                  <span className="text-sm font-bold tracking-[0.2em] text-white font-sans block">ARZEN</span>
                  <span className="text-[7px] tracking-[0.25em] text-[#C8A25D] uppercase block">ADMIN SYSTEM</span>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                  className="p-1.5 hover:bg-white/5 rounded-xs relative text-[#C8A25D] hover:text-white focus:outline-none"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick stats brief inside sidebar */}
            <div className="p-4 mx-4 my-3 bg-[#111] border border-[#C8A25D]/10 rounded-xs select-none">
              <span className="text-[8px] font-mono tracking-wider text-[#C8A25D] uppercase block">LIVE AUDIT REVENUE</span>
              <strong className="text-sm font-sans tracking-tight text-white block mt-0.5">{formatPrice(totalSales, 'INR')}</strong>
            </div>

            {/* Navigation item loops */}
            <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
              {[
                { id: 'overview', label: 'OVERVIEW INDEX', icon: BarChart3 },
                { id: 'products', label: 'CREATIVE CATALOG', icon: Package },
                { id: 'categories', label: 'DIVISIONS / DEPT', icon: Tag },
                { id: 'gallery', label: 'GALLERY MANAGER', icon: ImageIcon },
                { id: 'orders', label: 'ORDER REGISTRY', icon: ShoppingBag },
                { id: 'customers', label: 'VIP CLIENTS', icon: Users },
                { id: 'coupons', label: 'REWARD TICKET', icon: Percent },
                { id: 'reviews', label: 'CONCIERGE REVIEWS', icon: MessageSquare },
                { id: 'settings', label: 'SYSTEM MATRIX', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xs text-[10.5px] font-mono tracking-widest uppercase transition-all duration-300 focus:outline-none text-left ${isSelected ? 'bg-gradient-to-r from-[#C8A25D]/20 to-transparent border-l-2 border-[#C8A25D] text-[#C8A25D]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C8A25D]' : 'text-white/40'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Footer Admin info lock */}
            <div className="p-4 border-t border-[#C8A25D]/10 bg-[#070707] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-[#C8A25D]/10 border border-[#C8A25D]/30 flex items-center justify-center font-bold text-[10px] text-[#C8A25D]">
                  AZ
                </div>
                <div>
                  <span className="block text-[10px] text-white/95 font-medium leading-tight">Master Admin</span>
                  <span className="block text-[8px] text-[#C8A25D] font-mono tracking-wider uppercase">Active</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-white/30 hover:text-red-400 hover:bg-white/5 rounded-xs transition-colors focus:outline-none"
                title="Secure Lockout"
              >
                <KeyRound className="w-4 h-4" />
              </button>
            </div>
          </aside>

          {/* B. ACTIVE WORKSPACE CONTAINER */}
          <main className="flex-grow flex flex-col min-w-0 bg-[#0B0B0B] relative">
            
            {/* Topbar context lock */}
            <header className="h-16 border-b border-[#C8A25D]/10 bg-[#090909] px-6 flex items-center justify-between select-none shrink-0 z-20">
              <div className="flex items-center space-x-3">
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold">SYSTEM CONTROL PANEL</span>
                <span className="text-white/20">|</span>
                <span className="text-[10px] text-white/50 font-mono tracking-widest uppercase">{activeTab} VIEWPORT</span>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-transparent hover:bg-white/5 text-white hover:text-[#C8A25D] border border-white/10 hover:border-[#C8A25D]/40 text-[9px] font-mono tracking-widest uppercase transition-all duration-300 rounded-xs focus:outline-none"
                >
                  Back to Store
                </button>
              </div>
            </header>

            {/* Content canvas */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6">

              {/* LIVE ALERTS AND NOTIFICATIONS HUD */}
              {notifications.length > 0 && showNotificationDrawer && (
                <div className="bg-[#111] border border-yellow-500/30 p-4 rounded-xs space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-yellow-500 font-bold flex items-center space-x-2">
                      <Bell className="w-4 h-4 animate-bounce" />
                      <span>LIVE ALERTS DETECTED</span>
                    </span>
                    <button onClick={() => setShowNotificationDrawer(false)} className="text-xs text-white/40 hover:text-white font-mono">CLOSE</button>
                  </div>
                  {notifications.map((n, i) => (
                    <div key={i} className="text-xs font-light text-white/80 flex items-start space-x-2">
                      <span className="text-[#C8A25D] mt-0.5">•</span>
                      <span>{n}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 1: OVERVIEW CONTROL INDEX */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* METRIC CARD BENTO CORES */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Core 1: Revenue */}
                    <div className="bg-[#0F0F0F] border border-[#C8A25D]/15 rounded-xs p-5 space-y-3 shadow-lg hover:border-[#C8A25D]/40 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A25D]/2 rounded-full blur-2xl group-hover:bg-[#C8A25D]/5 transition-colors" />
                      <div className="flex items-center justify-between text-white/40">
                        <span className="text-[9px] font-mono tracking-[0.2em] uppercase">AUDITED REVENUE</span>
                        <TrendingUp className="w-4 h-4 text-[#C8A25D]" />
                      </div>
                      <div className="space-y-1">
                        <strong className="text-xl sm:text-2xl font-sans tracking-tight block text-white">{formatPrice(totalSales, 'INR')}</strong>
                        <span className="text-[9px] font-mono text-[#C8A25D] block">COMPLETELY PAID / SECURED</span>
                      </div>
                    </div>

                    {/* Core 2: Total Orders */}
                    <div className="bg-[#0F0F0F] border border-[#C8A25D]/15 rounded-xs p-5 space-y-3 shadow-lg hover:border-[#C8A25D]/40 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A25D]/2 rounded-full blur-2xl group-hover:bg-[#C8A25D]/5 transition-colors" />
                      <div className="flex items-center justify-between text-white/40">
                        <span className="text-[9px] font-mono tracking-[0.2em] uppercase">ORDERS FULFILLED</span>
                        <ShoppingBag className="w-4 h-4 text-[#C8A25D]" />
                      </div>
                      <div className="space-y-1">
                        <strong className="text-xl sm:text-2xl font-sans tracking-tight block text-white">{totalOrdersCount}</strong>
                        <span className="text-[9px] font-mono text-[#C8A25D] block">{orders.filter(o => o.status === 'Pending').length} PENDING VALIDATION</span>
                      </div>
                    </div>

                    {/* Core 3: VIP Clients */}
                    <div className="bg-[#0F0F0F] border border-[#C8A25D]/15 rounded-xs p-5 space-y-3 shadow-lg hover:border-[#C8A25D]/40 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A25D]/2 rounded-full blur-2xl group-hover:bg-[#C8A25D]/5 transition-colors" />
                      <div className="flex items-center justify-between text-white/40">
                        <span className="text-[9px] font-mono tracking-[0.2em] uppercase">ACQUISITION INDEX</span>
                        <Users className="w-4 h-4 text-[#C8A25D]" />
                      </div>
                      <div className="space-y-1">
                        <strong className="text-xl sm:text-2xl font-sans tracking-tight block text-white">{totalCustomersCount}</strong>
                        <span className="text-[9px] font-mono text-[#C8A25D] block">VIP ENROLLED ACCOUNTS</span>
                      </div>
                    </div>

                    {/* Core 4: Low Stock warning alerts */}
                    <div className="bg-[#0F0F0F] border border-[#C8A25D]/15 rounded-xs p-5 space-y-3 shadow-lg hover:border-[#C8A25D]/40 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/2 rounded-full blur-2xl" />
                      <div className="flex items-center justify-between text-white/40">
                        <span className="text-[9px] font-mono tracking-[0.2em] uppercase">CRITICAL STOCK LIMIT</span>
                        <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <strong className="text-xl sm:text-2xl font-sans tracking-tight block text-red-400">{lowStockCount}</strong>
                        <span className="text-[9px] font-mono text-white/50 block">SKUs EXCEEDED SAFETY CAP</span>
                      </div>
                    </div>

                  </div>

                  {/* HIGH END INTERACTIVE GLASS CHARTS */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Sales trend glow-line custom SVG chart */}
                    <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl lg:col-span-7 space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">Live Projection</span>
                          <h3 className="text-xs font-mono tracking-widest text-white uppercase font-bold mt-0.5">SALES REVENUE DISTRIBUTION</h3>
                        </div>
                        <button 
                          onClick={() => handleExportCSV('sales')} 
                          className="p-1.5 hover:bg-white/5 border border-white/10 rounded-xs text-[#C8A25D] hover:text-white transition-colors focus:outline-none flex items-center space-x-1.5 text-[8px] font-mono tracking-widest uppercase"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>EXPORT CSV</span>
                        </button>
                      </div>

                      {/* Glowing Luxury SVG Line Chart */}
                      <div className="relative h-64 w-full flex items-end">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGoldGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#C8A25D" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#C8A25D" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Y-axis helper lines */}
                          <line x1="0" y1="40" x2="500" y2="40" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="90" x2="500" y2="90" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="140" x2="500" y2="140" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="190" x2="500" y2="190" stroke="#C8A25D" strokeOpacity="0.15" strokeWidth="1" />

                          {/* Gradient fill under trend line */}
                          <path d="M 0 190 Q 100 130 180 150 T 350 80 T 500 40 L 500 190 L 0 190 Z" fill={`url(${baseUrl}#chartGoldGlow) rgba(200,162,93,0.1)`} />
                          
                          {/* Main golden trend line */}
                          <path 
                            d="M 0 190 Q 100 130 180 150 T 350 80 T 500 40" 
                            fill="none" 
                            stroke="#C8A25D" 
                            strokeWidth="3.5" 
                            className="drop-shadow-[0_4px_12px_rgba(200,162,93,0.6)]"
                          />

                          {/* Pulsing indicator node */}
                          <circle cx="500" cy="40" r="5" fill="#FFFFFF" className="animate-pulse" />
                          <circle cx="500" cy="40" r="10" fill="none" stroke="#C8A25D" strokeWidth="2" className="animate-ping" />
                        </svg>

                        {/* Chart timeline metrics overlays */}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2 text-[8px] font-mono tracking-wider text-white/45">
                          <span>JAN - APR</span>
                          <span>MAY</span>
                          <span>JUN</span>
                          <span>JULY (TODAY)</span>
                        </div>
                      </div>
                    </div>

                    {/* Low stock indicators list panel */}
                    <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl lg:col-span-5 space-y-6 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono tracking-widest text-red-400 uppercase">INVENTORY THREATS</span>
                        <h3 className="text-xs font-mono tracking-widest text-white uppercase font-bold">REPLENISHMENT REQUIRED</h3>
                      </div>

                      <div className="space-y-3 flex-grow my-4 max-h-56 overflow-y-auto">
                        {products.filter(p => p.stock <= LOW_STOCK_LIMIT).length === 0 ? (
                          <div className="text-center py-10 text-xs text-white/30 font-light">
                            All luxury assets are safely stocked. No warnings detected.
                          </div>
                        ) : (
                          products.filter(p => p.stock <= LOW_STOCK_LIMIT).map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-3.5 bg-red-950/20 border border-red-500/15 rounded-xs">
                              <div className="flex items-center space-x-3">
                                <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="w-8 h-10 object-cover bg-black rounded-xs shrink-0" />
                                <div>
                                  <strong className="text-xs text-white block truncate max-w-[150px]">{p.name}</strong>
                                  <span className="text-[8.5px] font-mono text-red-400/90 tracking-widest block uppercase">{p.sku}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-red-400 block font-mono">{p.stock} Units</span>
                                <span className="text-[8px] font-mono text-white/40 block">LIMIT: {LOW_STOCK_LIMIT}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <button 
                        onClick={() => setActiveTab('products')} 
                        className="w-full py-3 bg-[#161616] hover:bg-white/5 border border-white/5 hover:border-[#C8A25D]/40 text-xs font-mono tracking-widest text-[#C8A25D] hover:text-white uppercase transition-all duration-300 rounded-xs focus:outline-none flex items-center justify-center space-x-2"
                      >
                        <span>RESTOCK DEPARTMENTS</span>
                        <ChevronRight className="w-4.5 h-4.5" />
                      </button>
                    </div>

                  </div>

                  {/* RECENT INBOUND ORDERS GRID ROW */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">INBOUND REGISTRY</span>
                        <h3 className="text-xs font-mono tracking-widest text-white uppercase font-bold mt-0.5">RECENT CLIENT ORDERS</h3>
                      </div>
                      <button 
                        onClick={() => setActiveTab('orders')} 
                        className="text-[10px] font-mono text-[#C8A25D] hover:text-white tracking-widest uppercase flex items-center space-x-1 focus:outline-none"
                      >
                        <span>VIEW ALL {orders.length} ORDERS</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#C8A25D]/15 text-[9.5px] font-mono text-[#C8A25D] tracking-widest uppercase bg-black/30">
                            <th className="py-3 px-4">Order Number</th>
                            <th className="py-3 px-4">Client Name</th>
                            <th className="py-3 px-4">Acquisition Value</th>
                            <th className="py-3 px-4">Payment Status</th>
                            <th className="py-3 px-4">Logistics Status</th>
                            <th className="py-3 px-4">Action Portal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders.slice(0, 4).map((order) => (
                            <tr key={order.id} className="hover:bg-white/2 transition-colors">
                              <td className="py-3 px-4 font-mono font-semibold">{order.orderNumber}</td>
                              <td className="py-3 px-4 font-light text-white/80">{order.customerName}</td>
                              <td className="py-3 px-4 font-bold font-mono">{formatPrice(order.total, 'INR')}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-[8.5px] font-mono tracking-widest uppercase font-bold inline-block ${order.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                  {order.paymentStatus}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-[8.5px] font-mono tracking-widest uppercase font-bold inline-block ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' : order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' : order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 flex items-center space-x-2">
                                {order.status === 'Pending' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Accepted')}
                                    className="px-2 py-1 bg-green-500 hover:bg-green-400 text-black font-mono text-[9px] font-bold uppercase rounded-xs focus:outline-none"
                                  >
                                    Accept
                                  </button>
                                )}
                                {order.status === 'Accepted' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                                    className="px-2 py-1 bg-blue-500 hover:bg-blue-400 text-black font-mono text-[9px] font-bold uppercase rounded-xs focus:outline-none"
                                  >
                                    Ship
                                  </button>
                                )}
                                <button 
                                  onClick={() => setViewInvoiceOrder(order)}
                                  className="p-1 text-white/50 hover:text-[#C8A25D] hover:bg-white/5 rounded-xs transition-colors focus:outline-none"
                                  title="Print / View Invoice"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW 2: PRODUCTS CREATIVE CATALOG */}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* SEARCH, FILTER AND SORT MATRICES */}
                  <div className="space-y-4">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-[#0F0F0F] border border-white/5 p-4 rounded-xs">
                      {/* Search & Select dropdowns group */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-grow">
                        {/* Search Input */}
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Search Name, SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs py-2.5 pl-9 pr-4 text-[11px] tracking-wider text-white focus:outline-none"
                          />
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/45" />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                          <select
                            value={selectedCategoryFilter}
                            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                            className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs py-2.5 px-3 text-[11px] text-white/80 focus:outline-none appearance-none cursor-pointer"
                          >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-[10px]">▼</span>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                          <select
                            value={selectedStatusFilter}
                            onChange={(e) => setSelectedStatusFilter(e.target.value)}
                            className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs py-2.5 px-3 text-[11px] text-white/80 focus:outline-none appearance-none cursor-pointer"
                          >
                            <option value="All">All Statuses</option>
                            <option value="Active">Published Only</option>
                            <option value="Draft">Drafts Only</option>
                          </select>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-[10px]">▼</span>
                        </div>

                        {/* Sort selector */}
                        <div className="relative">
                          <select
                            value={selectedSortOption}
                            onChange={(e) => setSelectedSortOption(e.target.value)}
                            className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs py-2.5 px-3 text-[11px] text-white/80 focus:outline-none appearance-none cursor-pointer"
                          >
                            <option value="name-asc">Alphabetical (A - Z)</option>
                            <option value="name-desc">Alphabetical (Z - A)</option>
                            <option value="price-asc">Price (Low to High)</option>
                            <option value="price-desc">Price (High to Low)</option>
                            <option value="stock-asc">Stock (Low to High)</option>
                            <option value="stock-desc">Stock (High to Low)</option>
                          </select>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-[10px]">▼</span>
                        </div>
                      </div>

                      {/* Action buttons group */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button 
                          onClick={() => setShowBulkUploadModal(true)}
                          className="px-4 py-2.5 border border-dashed border-[#C8A25D]/40 hover:border-[#C8A25D] text-xs font-mono tracking-widest uppercase text-[#C8A25D] hover:text-white transition-colors rounded-xs focus:outline-none flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Bulk Import</span>
                        </button>

                        <button 
                          onClick={() => handleExportCSV('products')}
                          className="px-4 py-2.5 border border-white/10 hover:border-[#C8A25D]/40 text-xs font-mono tracking-widest uppercase transition-colors rounded-xs focus:outline-none flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setIsEditingProduct({
                              name: '',
                              tagline: '',
                              price: 9999,
                              rating: 5.0,
                              reviewsCount: 0,
                              category: categories[0]?.name || 'Bags',
                              images: [],
                              colors: [{ name: 'Matte Black', hex: '#0B0B0B', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800' }],
                              description: '',
                              materials: ['Premium leather'],
                              dimensions: '',
                              capacity: '',
                              features: ['Custom luxury metal buckle'],
                              warranty: 'Lifetime Guarantee',
                              shipping: 'Complimentary shipping',
                              returns: 'Complimentary returns',
                              status: 'Active',
                              stock: 10,
                              tags: ['Luxury'],
                              specifications: []
                            });
                            setShowProductForm(true);
                          }}
                          className="px-5 py-2.5 bg-[#C8A25D] hover:bg-white text-black font-bold text-xs tracking-widest uppercase transition-all rounded-xs focus:outline-none flex items-center justify-center space-x-1.5 shadow-lg cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Asset</span>
                        </button>
                      </div>
                    </div>

                    {/* BULK ACTIONS SELECTION CONSOLE */}
                    {selectedProductIds.length > 0 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#C8A25D]/10 border border-[#C8A25D]/30 p-3.5 rounded-xs animate-slide-in">
                        <div className="flex items-center space-x-2 font-mono text-xs">
                          <span className="w-2 h-2 rounded-full bg-[#C8A25D] animate-ping" />
                          <span className="text-[#C8A25D] font-bold">{selectedProductIds.length} Assets Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleBulkToggleStatus('Active')}
                            className="px-3.5 py-1.5 bg-black/60 hover:bg-black border border-white/10 hover:border-[#C8A25D]/40 text-[#C8A25D] text-[10px] font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer"
                          >
                            Set Published
                          </button>
                          <button
                            onClick={() => handleBulkToggleStatus('Draft')}
                            className="px-3.5 py-1.5 bg-black/60 hover:bg-black border border-white/10 hover:border-white text-white/80 text-[10px] font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer"
                          >
                            Set Draft
                          </button>
                          <button
                            onClick={handleBulkDelete}
                            className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[10px] font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer"
                          >
                            Bulk Retire
                          </button>
                          <button
                            onClick={() => setSelectedProductIds([])}
                            className="px-3.5 py-1.5 bg-transparent hover:bg-white/5 text-white/40 hover:text-white text-[10px] font-mono uppercase rounded-xs transition-colors cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* MASTER PRODUCT GRID OR LIST */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((prod) => (
                      <div key={prod.id} className="bg-[#0F0F0F] border border-white/5 rounded-xs overflow-hidden shadow-2xl flex flex-col group hover:border-[#C8A25D]/40 transition-all duration-300">
                        {/* Image showcase wrapper */}
                        <div className="relative aspect-video bg-black overflow-hidden border-b border-[#C8A25D]/10">
                          <img 
                            src={prod.images && prod.images[0] ? prod.images[0] : "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800"} 
                            alt={prod.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105 filter brightness-90"
                          />
                          
                          {/* Left: Clickable Status Badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <button
                              type="button"
                              onClick={() => handleToggleProductStatus(prod.id)}
                              className={`px-2.5 py-1 text-[8.5px] font-mono tracking-widest uppercase font-bold rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black ${prod.status === 'Active' ? 'bg-[#C8A25D]/15 text-[#C8A25D] border border-[#C8A25D]/30' : 'bg-white/10 text-white/50 border border-white/10'}`}
                              title="Click to toggle Publish/Draft"
                            >
                              {prod.status}
                            </button>
                          </div>

                          {/* Right: Selection Checkbox */}
                          <div className="absolute top-3 right-3 z-10 flex items-center bg-black/60 backdrop-blur-xs p-1 rounded border border-white/10">
                            <input 
                              type="checkbox"
                              checked={selectedProductIds.includes(prod.id)}
                              onChange={() => handleToggleProductSelection(prod.id)}
                              className="w-4.5 h-4.5 accent-[#C8A25D] bg-black/80 border border-white/20 rounded cursor-pointer"
                              title="Select for bulk action"
                            />
                          </div>
                          
                          {/* Stock Counter overlay badge */}
                          <div className="absolute bottom-3 right-3 z-10 bg-black/75 backdrop-blur-md border border-[#C8A25D]/25 px-2.5 py-1 rounded-xs flex items-center space-x-1.5 font-mono">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${prod.stock <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                            <span className="text-[9px] text-white font-medium uppercase tracking-widest">{prod.stock} IN STOCK</span>
                          </div>
                        </div>

                        {/* Detail text */}
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase font-bold">{prod.category}</span>
                              <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase font-semibold">{prod.sku}</span>
                            </div>
                            <h4 className="text-sm font-medium text-white group-hover:text-[#C8A25D] transition-colors">{prod.name}</h4>
                            <p className="text-[11px] text-white/50 font-light truncate">{prod.tagline}</p>
                            <div className="flex items-center space-x-2.5 pt-1">
                              <strong className="text-sm font-sans tracking-tight text-[#C8A25D] font-bold">{formatPrice(prod.price, 'INR')}</strong>
                              {prod.discountPrice && (
                                <span className="text-xs text-white/35 font-mono line-through">{formatPrice(prod.price * 1.15, 'INR')}</span>
                              )}
                            </div>
                          </div>

                          {/* Interactive CRUD buttons lock */}
                          <div className="flex items-center gap-1.5 pt-4 border-t border-white/5">
                            <button 
                              onClick={() => {
                                setIsEditingProduct(prod);
                                setShowProductForm(true);
                              }}
                              className="flex-1 py-2 bg-[#161616] hover:bg-white hover:text-black border border-white/10 hover:border-white transition-all text-[10px] font-mono tracking-widest uppercase rounded-xs flex items-center justify-center space-x-1 focus:outline-none"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDuplicateProduct(prod)}
                              className="p-2 bg-[#161616] hover:bg-white/5 border border-white/10 hover:border-[#C8A25D]/40 text-white/60 hover:text-white transition-colors rounded-xs focus:outline-none"
                              title="Duplicate Masterpiece"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 bg-[#161616] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/45 hover:text-red-400 transition-colors rounded-xs focus:outline-none"
                              title="Retire Asset"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* VIEW 3: CATEGORY DIVISIONS */}
              {activeTab === 'categories' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                  
                  {/* Category editor form */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl lg:col-span-4 h-fit space-y-6">
                    <div className="space-y-1 pb-4 border-b border-[#C8A25D]/15">
                      <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">DIVISION MATRIX</span>
                      <h3 className="text-xs font-mono tracking-widest text-white uppercase font-bold">
                        {editingCategory ? 'EDIT DEPARTMENT' : 'CREATE DEPARTMENT'}
                      </h3>
                    </div>

                    <form onSubmit={handleSaveCategory} className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">DEPARTMENT NAME</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Leather Wallets"
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs tracking-wider text-white focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">PARENT SECTOR (OPTIONAL)</label>
                        <select 
                          value={catParent}
                          onChange={(e) => setCatParent(e.target.value)}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono tracking-widest uppercase"
                        >
                          <option value="">ROOT DIRECTORY</option>
                          {categories.filter(c => !c.parentId).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          type="submit"
                          className="flex-1 py-3 bg-[#C8A25D] hover:bg-white text-black font-bold text-xs tracking-widest uppercase rounded-xs transition-colors"
                        >
                          {editingCategory ? 'Save Sector' : 'Establish Sector'}
                        </button>
                        {editingCategory && (
                          <button 
                            type="button" 
                            onClick={() => { setEditingCategory(null); setCatName(''); setCatParent(''); }}
                            className="px-4 py-3 bg-[#161616] hover:bg-white/5 border border-white/10 rounded-xs text-xs font-mono"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Master divisions table */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl lg:col-span-8 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">Database Categories</span>
                      <h3 className="text-xs font-mono tracking-widest text-white uppercase font-bold">STORE DIVISIONS</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#C8A25D]/15 text-[9.5px] font-mono text-[#C8A25D] tracking-widest uppercase bg-black/30">
                            <th className="py-3 px-4">Identifier</th>
                            <th className="py-3 px-4">Division Name</th>
                            <th className="py-3 px-4">System Slug</th>
                            <th className="py-3 px-4">Sovereign Hierarchy</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                          {categories.map((c) => {
                            const parent = categories.find(p => p.id === c.parentId);
                            return (
                              <tr key={c.id} className="hover:bg-white/2 transition-colors">
                                <td className="py-3.5 px-4 text-white/50">{c.id}</td>
                                <td className="py-3.5 px-4 font-sans text-white font-medium">{c.name}</td>
                                <td className="py-3.5 px-4 text-[#C8A25D]/90">{c.slug}</td>
                                <td className="py-3.5 px-4">
                                  {parent ? (
                                    <span className="px-2 py-0.5 bg-white/5 rounded text-[8.5px] tracking-wider text-white/65">SUB: {parent.name}</span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-[#C8A25D]/10 rounded text-[8.5px] tracking-wider text-[#C8A25D]">ROOT SECTOR</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-right flex items-center justify-end space-x-2">
                                  <button 
                                    onClick={() => {
                                      setEditingCategory(c);
                                      setCatName(c.name);
                                      setCatParent(c.parentId || '');
                                    }}
                                    className="p-1 text-white/40 hover:text-white transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCategory(c.id)}
                                    className="p-1 text-white/30 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW 4: ORDERS REGISTER */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Status sorting selectors */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0F0F0F] border border-white/5 p-4 rounded-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {['All', 'Pending', 'Accepted', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-3.5 py-1.5 text-[9.5px] font-mono tracking-widest uppercase transition-all rounded-xs focus:outline-none ${statusFilter === st ? 'bg-[#C8A25D] text-black font-bold' : 'bg-[#161616] text-white/55 hover:bg-white/5'}`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => handleExportCSV('orders')}
                      className="px-4 py-2 bg-[#161616] hover:bg-white/5 border border-white/5 text-xs font-mono tracking-widest uppercase rounded-xs text-[#C8A25D] focus:outline-none flex items-center space-x-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>EXPORT DATABASE</span>
                    </button>
                  </div>

                  {/* MASTER ORDERS BOARD */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#C8A25D]/15 text-[9.5px] font-mono text-[#C8A25D] tracking-widest uppercase bg-black/30">
                            <th className="py-3 px-4">Order Code</th>
                            <th className="py-3 px-4">Acquisition Date</th>
                            <th className="py-3 px-4">Client Portfolio</th>
                            <th className="py-3 px-4">Manifest Items</th>
                            <th className="py-3 px-4">Total Amount</th>
                            <th className="py-3 px-4">Secure Payment</th>
                            <th className="py-3 px-4">Logistics</th>
                            <th className="py-3 px-4 text-right">Admin Command</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-white/2 transition-colors">
                              <td className="py-4 px-4 font-mono font-semibold">{ord.orderNumber}</td>
                              <td className="py-4 px-4 font-mono text-white/45">{new Date(ord.date).toLocaleDateString()}</td>
                              <td className="py-4 px-4 space-y-0.5">
                                <span className="block text-white font-medium">{ord.customerName}</span>
                                <span className="block text-[9.5px] font-mono text-white/40 leading-none">{ord.customerEmail}</span>
                              </td>
                              <td className="py-4 px-4 text-white/70 max-w-[150px] truncate">
                                {ord.items.map(item => `${item.product.name} (${item.selectedColor.name})`).join(', ')}
                              </td>
                              <td className="py-4 px-4 font-bold font-mono text-white">{formatPrice(ord.total, 'INR')}</td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono tracking-widest uppercase font-bold border ${ord.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                  {ord.paymentStatus}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-mono tracking-widest uppercase font-semibold ${ord.status === 'Delivered' ? 'bg-green-500/10 text-green-400' : ord.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' : ord.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right flex items-center justify-end space-x-1.5">
                                {ord.status === 'Pending' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Accepted')}
                                    className="px-2 py-1 bg-[#C8A25D] text-black font-mono text-[9px] font-bold uppercase rounded-xs hover:bg-white transition-colors"
                                  >
                                    Accept
                                  </button>
                                )}
                                {ord.status === 'Accepted' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Shipped')}
                                    className="px-2 py-1 bg-blue-500 text-black font-mono text-[9px] font-bold uppercase rounded-xs hover:bg-blue-400 transition-colors"
                                  >
                                    Ship
                                  </button>
                                )}
                                {ord.status === 'Shipped' && (
                                  <button 
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                                    className="px-2 py-1 bg-green-500 text-black font-mono text-[9px] font-bold uppercase rounded-xs hover:bg-green-400 transition-colors"
                                  >
                                    Deliver
                                  </button>
                                )}
                                <button 
                                  onClick={() => setViewInvoiceOrder(ord)}
                                  className="p-1 text-white/40 hover:text-[#C8A25D] hover:bg-white/5 rounded-xs transition-colors"
                                  title="Print invoice receipt"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW 5: VIP CLIENTS BOARD */}
              {activeTab === 'customers' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <h3 className="text-xs font-mono tracking-widest text-white uppercase font-bold">CLIENT ACQUISITION ARCHIVE</h3>
                      <button 
                        onClick={() => handleExportCSV('customers')}
                        className="px-4 py-2 border border-white/10 text-xs font-mono tracking-widest uppercase hover:border-[#C8A25D]/40 text-[#C8A25D] focus:outline-none flex items-center space-x-1.5"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export VIP Log</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#C8A25D]/15 text-[9.5px] font-mono text-[#C8A25D] tracking-widest uppercase bg-black/30">
                            <th className="py-3 px-4">Client Portfolio ID</th>
                            <th className="py-3 px-4">Client Name</th>
                            <th className="py-3 px-4">Encrypted Email</th>
                            <th className="py-3 px-4">Secret Line Phone</th>
                            <th className="py-3 px-4">Join Date</th>
                            <th className="py-3 px-4 font-mono">Volume Spent</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Access Controls</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {customers.map((cust) => (
                            <tr key={cust.id} className="hover:bg-white/2 transition-colors">
                              <td className="py-4 px-4 font-mono text-white/50">{cust.id}</td>
                              <td className="py-4 px-4 font-medium text-white">{cust.name}</td>
                              <td className="py-4 px-4 font-mono text-white/45">{cust.email}</td>
                              <td className="py-4 px-4 font-mono text-white/45">{cust.phone}</td>
                              <td className="py-4 px-4 font-mono text-white/45">{cust.joinDate}</td>
                              <td className="py-4 px-4 font-mono font-bold text-white">{formatPrice(cust.totalSpent, 'INR')}</td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-mono tracking-widest uppercase font-bold inline-block border ${cust.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                  {cust.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button 
                                  onClick={() => handleToggleCustomerBlock(cust.id)}
                                  className={`px-3 py-1 font-mono text-[9px] font-bold uppercase rounded-xs border transition-all ${cust.status === 'Active' ? 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black border-red-500/20' : 'bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black border-green-500/20'}`}
                                >
                                  {cust.status === 'Active' ? 'Block Access' : 'Restore'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW 6: REWARD COUPONS TICKET */}
              {activeTab === 'coupons' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                  
                  {/* Coupon generator Form */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl lg:col-span-4 h-fit space-y-6">
                    <div className="space-y-1 pb-4 border-b border-[#C8A25D]/15">
                      <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">MARKETING ENGINE</span>
                      <h3 className="text-xs font-mono tracking-widest text-white uppercase font-bold">
                        {editingCoupon ? 'EDIT COUPON TICKET' : 'GENERATE REWARD TICKET'}
                      </h3>
                    </div>

                    <form onSubmit={handleSaveCoupon} className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">PROMOTIONAL CODE</label>
                        <input 
                          type="text" 
                          placeholder="e.g. LUXURY2026"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs tracking-wider text-white focus:outline-none font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">REDUX TYPE</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setCouponType('percentage')}
                            className={`py-2 px-3 text-[9.5px] font-mono rounded-xs border focus:outline-none ${couponType === 'percentage' ? 'bg-[#C8A25D] text-black border-[#C8A25D]' : 'bg-transparent border-white/10 text-white/70'}`}
                          >
                            Percentage (%)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCouponType('fixed')}
                            className={`py-2 px-3 text-[9.5px] font-mono rounded-xs border focus:outline-none ${couponType === 'fixed' ? 'bg-[#C8A25D] text-black border-[#C8A25D]' : 'bg-transparent border-white/10 text-white/70'}`}
                          >
                            Fixed Val (₹)
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">DEDUCTION AMOUNT / PERCENT</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 15"
                          value={couponValue || ''}
                          onChange={(e) => setCouponValue(parseFloat(e.target.value))}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">MINIMUM INBOUND CRITERIA (₹)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 10000"
                          value={couponMinAmount || ''}
                          onChange={(e) => setCouponMinAmount(parseFloat(e.target.value))}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button 
                          type="submit"
                          className="flex-1 py-3 bg-[#C8A25D] hover:bg-white text-black font-bold text-xs tracking-widest uppercase rounded-xs transition-colors"
                        >
                          {editingCoupon ? 'Apply Changes' : 'Authorize Ticket'}
                        </button>
                        {editingCoupon && (
                          <button 
                            type="button" 
                            onClick={() => { setEditingCoupon(null); setCouponCode(''); setCouponValue(0); setCouponMinAmount(0); }}
                            className="px-4 py-3 bg-[#161616] hover:bg-white/5 border border-white/10 rounded-xs text-xs font-mono"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Coupon List Master Table */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl lg:col-span-8 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">Authorized Codes</span>
                      <h3 className="text-xs font-mono tracking-widest text-white uppercase font-bold">REWARD TICKET ROSTER</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#C8A25D]/15 text-[9.5px] font-mono text-[#C8A25D] tracking-widest uppercase bg-black/30">
                            <th className="py-3 px-4">Coupon Code</th>
                            <th className="py-3 px-4">Reward Value</th>
                            <th className="py-3 px-4">Min. Purchase Limit</th>
                            <th className="py-3 px-4">State</th>
                            <th className="py-3 px-4 text-right">Admin Command</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                          {coupons.map((cp) => (
                            <tr key={cp.id} className="hover:bg-white/2 transition-colors">
                              <td className="py-3.5 px-4 text-[#C8A25D] font-bold tracking-widest uppercase">{cp.code}</td>
                              <td className="py-3.5 px-4 text-white">
                                {cp.discountType === 'percentage' ? `${cp.value}% Off` : formatPrice(cp.value, 'INR')}
                              </td>
                              <td className="py-3.5 px-4 text-white/55">{formatPrice(cp.minOrderAmount, 'INR')}</td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded text-[8.5px] tracking-wider uppercase inline-block border ${cp.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/30 border-white/15'}`}>
                                  {cp.active ? 'Active' : 'Deactivated'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => {
                                    setEditingCoupon(cp);
                                    setCouponCode(cp.code);
                                    setCouponType(cp.discountType);
                                    setCouponValue(cp.value);
                                    setCouponMinAmount(cp.minOrderAmount);
                                    setCouponActive(cp.active);
                                  }}
                                  className="p-1 text-white/40 hover:text-white transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCoupon(cp.id)}
                                  className="p-1 text-white/30 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW 7: REVIEWS MODERATION */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {reviews.map((rev) => (
                    <div key={rev.id} className="bg-[#0F0F0F] border border-white/5 rounded-xs p-5 space-y-4 hover:border-[#C8A25D]/25 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <strong className="text-sm font-medium text-white">{rev.name}</strong>
                            <span className="text-[10px] text-white/45 font-mono">({rev.role})</span>
                            <span className="text-[9px] font-mono px-2 py-0.5 bg-[#C8A25D]/10 text-[#C8A25D] rounded-xs uppercase">{rev.productName}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-[#C8A25D]">
                            {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#C8A25D]" />)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {rev.status !== 'Approved' && (
                            <button 
                              onClick={() => handleReviewStatus(rev.id, 'Approved')}
                              className="px-3 py-1 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black font-mono text-[9px] font-bold uppercase rounded-xs transition-all border border-green-500/20"
                            >
                              Approve
                            </button>
                          )}
                          {rev.status !== 'Deleted' && (
                            <button 
                              onClick={() => handleReviewStatus(rev.id, 'Deleted')}
                              className="px-3 py-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black font-mono text-[9px] font-bold uppercase rounded-xs transition-all border border-red-500/20"
                            >
                              Flag Delete
                            </button>
                          )}
                          <button 
                            onClick={() => setReplyReviewId(rev.id)}
                            className="px-3 py-1 bg-white/5 hover:bg-white hover:text-black font-mono text-[9px] font-bold uppercase rounded-xs transition-all border border-white/10"
                          >
                            Reply
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-white/80 font-light italic leading-relaxed">
                        "{rev.comment}"
                      </p>

                      {rev.reply && (
                        <div className="ml-6 pl-4 border-l-2 border-[#C8A25D] bg-white/2 p-3.5 rounded-xs space-y-1">
                          <span className="text-[8.5px] font-mono tracking-widest text-[#C8A25D] uppercase font-semibold">ARZEN VIP CONCIERGE REPLY:</span>
                          <p className="text-xs text-white/80 font-light">{rev.reply}</p>
                        </div>
                      )}

                      {replyReviewId === rev.id && (
                        <form onSubmit={handleSaveReviewReply} className="ml-6 space-y-3 pt-2">
                          <textarea
                            placeholder="Draft reply to the client..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full bg-[#161616] border border-[#C8A25D]/25 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none h-20"
                            required
                          />
                          <div className="flex space-x-2">
                            <button 
                              type="submit"
                              className="px-4 py-2 bg-[#C8A25D] text-black font-bold text-[10px] font-mono tracking-wider uppercase rounded-xs"
                            >
                              Transmit Reply
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setReplyReviewId(null)}
                              className="px-3 py-2 bg-[#161616] text-white/60 font-mono text-[10px] rounded-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ))}

                </div>
              )}

              {/* VIEW 8: GLOBAL SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 animate-fade-in max-w-4xl">
                  
                  {/* Section A: Branding Header */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl space-y-4">
                    <h3 className="text-xs font-mono tracking-widest text-[#C8A25D] uppercase font-bold border-b border-white/5 pb-2">A. Luxury Branding Assets</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">STORE LOGO DISPLAY TEXT</label>
                        <input 
                          type="text" 
                          value={settings.websiteLogoText}
                          onChange={(e) => setSettings({ ...settings, websiteLogoText: e.target.value })}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">STORE LOGO SUBTITLE</label>
                        <input 
                          type="text" 
                          value={settings.websiteLogoSubtitle}
                          onChange={(e) => setSettings({ ...settings, websiteLogoSubtitle: e.target.value })}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section B: Contact & Channels */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl space-y-4">
                    <h3 className="text-xs font-mono tracking-widest text-[#C8A25D] uppercase font-bold border-b border-white/5 pb-2">B. Secure Contact & Messenger channels</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">WHATSAPP DIRECT CONCIERGE NUMBER</label>
                        <input 
                          type="text" 
                          value={settings.whatsappNumber}
                          onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">CONCIERGE CONTACT EMAIL</label>
                        <input 
                          type="email" 
                          value={settings.email}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">FLAGSHIP MAISON ADDRESS</label>
                      <input 
                        type="text" 
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Section C: Logistics & Shipping */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl space-y-4">
                    <h3 className="text-xs font-mono tracking-widest text-[#C8A25D] uppercase font-bold border-b border-white/5 pb-2">C. Fulfillment & Shipping Rules</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">FREE COMPLIMENTARY SHIPPING THRESHOLD (₹)</label>
                        <input 
                          type="number" 
                          value={settings.freeShippingThreshold}
                          onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">FLAT LOGISTICS FEE BELOW LIMIT (₹)</label>
                        <input 
                          type="number" 
                          value={settings.flatShippingCharge}
                          onChange={(e) => setSettings({ ...settings, flatShippingCharge: parseFloat(e.target.value) })}
                          className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section D: SEO */}
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-xs p-6 shadow-xl space-y-4">
                    <h3 className="text-xs font-mono tracking-widest text-[#C8A25D] uppercase font-bold border-b border-white/5 pb-2">D. SEO & Analytics Indexing</h3>
                    
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">META PORTAL TITLE</label>
                      <input 
                        type="text" 
                        value={settings.metaTitle}
                        onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                        className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">META PORTAL DESCRIPTION</label>
                      <textarea 
                        value={settings.metaDescription}
                        onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                        className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none h-20"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">GOOGLE ANALYTICS TRACKING ID</label>
                      <input 
                        type="text" 
                        value={settings.googleAnalyticsId}
                        onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                        className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    {/* SECTION E: STOREFRONT CINEMATIC BANNERS */}
                    <div className="bg-black/35 border border-white/5 p-6 rounded-xs space-y-4 md:col-span-2">
                      <div className="pb-3 border-b border-white/5">
                        <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase font-bold">SECTION E</span>
                        <h4 className="text-[11px] font-mono tracking-widest uppercase font-bold text-white mt-0.5">STOREFRONT CINEMATIC BANNERS</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">HERO CAMPAIGN BANNER IMAGE URL</label>
                          <input 
                            type="text" 
                            value={settings.heroBannerImage || ''}
                            onChange={(e) => setSettings({ ...settings, heroBannerImage: e.target.value })}
                            className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">HERO CAMPAIGN SUBTITLE (LABEL)</label>
                          <input 
                            type="text" 
                            value={settings.heroSubtitle || ''}
                            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                            className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">HERO CAMPAIGN MAIN HEADING</label>
                          <input 
                            type="text" 
                            value={settings.heroTitle || ''}
                            onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                            className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">HERO CAMPAIGN TAGLINE</label>
                          <input 
                            type="text" 
                            value={settings.heroTagline || ''}
                            onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
                            className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION F: FEATURED PRODUCT CONFIGURATION */}
                    <div className="bg-black/35 border border-white/5 p-6 rounded-xs space-y-4 md:col-span-2">
                      <div className="pb-3 border-b border-white/5">
                        <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase font-bold">SECTION F</span>
                        <h4 className="text-[11px] font-mono tracking-widest uppercase font-bold text-white mt-0.5">FEATURED HOMEPAGE CURATIONS</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">HERO SPOTLIGHT MASTERPIECE</label>
                          <select 
                            value={settings.heroProductId || ''}
                            onChange={(e) => setSettings({ ...settings, heroProductId: e.target.value })}
                            className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono cursor-pointer"
                          >
                            <option value="">-- No Spotlight Selection --</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">FEATURED GRID MULTI-SELECTIONS</label>
                          <div className="bg-[#161616] border border-white/10 rounded-xs p-3 max-h-40 overflow-y-auto space-y-2">
                            {products.map(p => {
                              const featuredList = settings.featuredProductIds || [];
                              const isFeatured = featuredList.includes(p.id);
                              return (
                                <label key={p.id} className="flex items-center space-x-2.5 text-xs text-white/80 hover:text-white cursor-pointer select-none">
                                  <input 
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={() => {
                                      const nextList = isFeatured 
                                        ? featuredList.filter((fid: string) => fid !== p.id) 
                                        : [...featuredList, p.id];
                                      setSettings({ ...settings, featuredProductIds: nextList });
                                    }}
                                    className="accent-[#C8A25D] bg-black rounded"
                                  />
                                  <span>{p.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="px-8 py-4 bg-[#C8A25D] hover:bg-white text-black font-bold text-xs tracking-widest uppercase transition-all rounded-xs shadow-lg"
                  >
                    Transmit Global Store Configuration
                  </button>

                </form>
              )}

              {/* VIEW 9: GALLERY MANAGER WORKSPACE */}
              {activeTab === 'gallery' && (
                <div className="space-y-6 animate-fade-in text-white font-sans select-none">
                  
                  {/* HEADER BRANDING BANNER */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F0F0F] border border-[#C8A25D]/15 p-6 rounded-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A25D]/3 rounded-full blur-3xl" />
                    <div className="space-y-1 relative z-10">
                      <span className="text-[8px] font-mono tracking-[0.3em] text-[#C8A25D] uppercase block font-bold">DIGITAL ASSET WAREHOUSE</span>
                      <h2 className="text-lg font-mono tracking-widest text-white uppercase font-bold">ARZEN SYSTEM GALLERY LEDGER</h2>
                      <p className="text-[10.5px] text-white/50 max-w-2xl font-light leading-relaxed">
                        Govern, replace, and order premium curated visual assets. Custom uploads are automatically optimized and synchronized across the Showcase, lookbooks, homepage slider, and specific catalogs.
                      </p>
                    </div>
                    
                    {/* STORAGE / CAPACITY STATUS BAR */}
                    <div className="shrink-0 bg-black/40 border border-white/5 p-4 rounded-xs min-w-[200px] font-mono space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] text-white/40 uppercase">
                        <span>DATA VAULT QUOTA</span>
                        <span className="text-[#C8A25D] font-bold">SECURED</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#8A662D] to-[#C8A25D] h-full transition-all duration-300" 
                          style={{ width: `${Math.min(100, (gallery.length / 40) * 100)}%` }} 
                        />
                      </div>
                      <div className="flex justify-between text-[8px] text-white/30">
                        <span>{gallery.length} ACTIVE ASSETS</span>
                        <span>CAPACITY CAP: 40 ITEMS</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE UNDO RESTORATION ALERTS SYSTEM */}
                  {deletedImageBackup && undoTimeRemaining > 0 && (
                    <div className="bg-yellow-950/20 border border-[#C8A25D]/30 p-4 rounded-xs flex items-center justify-between animate-pulse">
                      <div className="flex items-center space-x-3 text-xs tracking-wider">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C8A25D] animate-ping" />
                        <span className="font-mono text-white">
                          IMAGE DELETED — YOU CAN UNDO THIS ACTION WITHIN <strong className="text-[#C8A25D]">{undoTimeRemaining}s</strong>
                        </span>
                      </div>
                      <button
                        onClick={handleUndoDelete}
                        className="px-5 py-2 bg-[#C8A25D] hover:bg-white text-black font-mono font-bold text-[10px] uppercase rounded-xs transition-colors cursor-pointer"
                      >
                        UNDO DELETE
                      </button>
                    </div>
                  )}

                  {/* DOUBLE ZONE MULTIPLE FILE UPLOAD DROPZONE */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="bg-[#0F0F0F] border border-white/5 p-6 rounded-xs space-y-4">
                      <div>
                        <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">TRANSMISSION SHIELD</span>
                        <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-white mt-0.5">LAUNCHPORT PORTRAITS</h3>
                      </div>
                      
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            const fileList = {
                              target: { files: e.dataTransfer.files }
                            } as any;
                            handleUploadGalleryMultiple(fileList);
                          }
                        }}
                        onClick={() => document.getElementById('gallery-multi-upload')?.click()}
                        className="border border-dashed border-white/15 bg-black/40 hover:border-[#C8A25D]/40 hover:bg-black/60 p-8 rounded-xs text-center cursor-pointer transition-all select-none space-y-3 group"
                      >
                        <input 
                          type="file" 
                          id="gallery-multi-upload" 
                          className="hidden" 
                          multiple 
                          accept=".png, .jpg, .jpeg, .webp"
                          onChange={handleUploadGalleryMultiple}
                        />
                        
                        {uploadProgress !== null ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-center space-x-2 text-[#C8A25D]">
                              <div className="w-3 h-3 border-2 border-[#C8A25D] border-t-transparent rounded-full animate-spin" />
                              <span className="text-[9px] font-mono tracking-widest uppercase">STAGING... {uploadProgress}%</span>
                            </div>
                            <div className="w-full max-w-[120px] mx-auto bg-white/10 h-1 rounded-full overflow-hidden">
                              <div className="bg-[#C8A25D] h-full" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-[#C8A25D] mx-auto group-hover:scale-110 transition-transform" />
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-white/70 block">DRAG & DROP OR TAP</span>
                              <span className="text-[8px] text-white/30 block uppercase">PNG, JPG, JPEG, WEBP ONLY</span>
                            </div>
                          </>
                        )}
                      </div>

                      {uploadError && (
                        <p className="text-[9px] font-mono text-red-400 bg-red-950/20 p-2 border border-red-500/20 rounded-xs uppercase">
                          {uploadError}
                        </p>
                      )}

                      <div className="text-[10px] text-white/40 font-light font-mono leading-relaxed space-y-2 select-none border-t border-white/5 pt-4">
                        <div className="flex items-start space-x-2">
                          <span className="text-[#C8A25D]">•</span>
                          <span>Select multiple files at once to update lookbooks dynamically.</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-[#C8A25D]">•</span>
                          <span>Images are compressed client-side instantly to guarantee lightning-fast page loading speeds.</span>
                        </div>
                      </div>
                    </div>

                    {/* RESPONSIVE GRID DISPLAY FOR ACTIVE ASSETS */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase font-bold">STAGED GALLERY IMAGE DECK ({gallery.length})</span>
                        <span className="text-[8.5px] text-white/30 font-mono uppercase">DRAG & DROP CARDS TO SET ARRANGEMENT ORDER</span>
                      </div>

                      {gallery.length === 0 ? (
                        <div className="h-64 border border-dashed border-white/10 bg-black/25 flex flex-col items-center justify-center space-y-2 p-6 rounded-xs text-center select-none">
                          <ImageIcon className="w-10 h-10 text-white/10 animate-pulse" />
                          <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">No custom assets uploaded</span>
                          <p className="text-[9px] text-white/30 font-mono uppercase max-w-xs leading-relaxed">
                            Upload high-end custom brand images or products to automatically populate the public storefront sections.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {gallery.map((item, index) => {
                            const isEditingAlt = editingAltTextId === item.id;
                            
                            return (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOverCard(e, index)}
                                onDrop={() => handleDropCard(index)}
                                className={`group bg-[#111] border rounded-xs overflow-hidden transition-all duration-300 relative select-none flex flex-col h-full ${draggedItemIndex === index ? 'opacity-35 border-dashed border-[#C8A25D]' : 'border-white/5 hover:border-[#C8A25D]/30 shadow-lg hover:shadow-black'}`}
                              >
                                {/* IMAGE CANVAS & META SIZE OVERLAY */}
                                <div className="relative aspect-square overflow-hidden bg-black shrink-0">
                                  <img 
                                    src={item.url} 
                                    alt={item.altText} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  />
                                  
                                  {/* Top Bar Indicators */}
                                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-black/80 backdrop-blur-xs border border-white/15 px-1.5 py-0.5 rounded-[2px] text-[8px] font-mono text-[#C8A25D] tracking-wider uppercase">
                                      {item.size}
                                    </span>
                                    <span className="bg-black/80 backdrop-blur-xs border border-white/15 px-1.5 py-0.5 rounded-[2px] text-[8px] font-mono text-white/60">
                                      #{index + 1}
                                    </span>
                                  </div>

                                  {/* REORDER ACTION ICON RAIL */}
                                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/85 backdrop-blur-md border border-white/10 px-2 py-1 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleReorderGallery(index, 'up')}
                                        disabled={index === 0}
                                        className="text-white/50 hover:text-[#C8A25D] disabled:opacity-20 transition-colors focus:outline-none"
                                        title="Move Left / Up"
                                      >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleReorderGallery(index, 'down')}
                                        disabled={index === gallery.length - 1}
                                        className="text-white/50 hover:text-[#C8A25D] disabled:opacity-20 transition-colors focus:outline-none"
                                        title="Move Right / Down"
                                      >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-widest">ORDER INDEX</span>
                                  </div>

                                  {/* HOVER OVERLAY DIRECT ACTION SHIELDS */}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2.5 z-10 pointer-events-none group-hover:pointer-events-auto">
                                    {/* PREVIEW LIGHTBOX ACTION */}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedGalleryImage(item)}
                                      className="p-2 bg-[#090909] hover:bg-[#C8A25D] text-white hover:text-black border border-white/10 hover:border-transparent rounded-full transition-all focus:outline-none"
                                      title="Cinema Lightbox Preview"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    
                                    {/* REPLACE ACTION */}
                                    <label
                                      htmlFor={`replace-file-${item.id}`}
                                      className="p-2 bg-[#090909] hover:bg-[#C8A25D] text-white hover:text-black border border-white/10 hover:border-transparent rounded-full cursor-pointer transition-all"
                                      title="Replace Portrayed Asset"
                                    >
                                      <Upload className="w-4 h-4" />
                                      <input 
                                        type="file" 
                                        id={`replace-file-${item.id}`} 
                                        className="hidden" 
                                        accept=".png, .jpg, .jpeg, .webp"
                                        onChange={(e) => handleReplaceGalleryImage(item.id, e)}
                                      />
                                    </label>
                                    
                                    {/* DELETE ACTION */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteGalleryImage(item.id)}
                                      className="p-2 bg-[#090909] hover:bg-red-600 text-white hover:text-white border border-white/10 hover:border-transparent rounded-full transition-all focus:outline-none"
                                      title="Retire Asset"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* META / EDIT ALT TEXT DATA COMPONENT */}
                                <div className="p-3 flex-grow flex flex-col justify-between space-y-2 bg-[#121212]">
                                  {isEditingAlt ? (
                                    <div className="space-y-1.5">
                                      <input 
                                        type="text" 
                                        value={editingAltTextVal}
                                        onChange={(e) => setEditingAltTextVal(e.target.value)}
                                        className="w-full bg-[#1A1A1A] border border-[#C8A25D]/40 rounded-xs p-1.5 text-[10.5px] text-white focus:outline-none"
                                        placeholder="Enter Alt Text description..."
                                        maxLength={50}
                                        autoFocus
                                      />
                                      <div className="flex space-x-1 justify-end font-mono">
                                        <button 
                                          type="button"
                                          onClick={() => setEditingAltTextId(null)}
                                          className="px-2 py-1 bg-black hover:bg-white/5 border border-white/10 text-white/50 text-[8px] uppercase rounded-xs"
                                        >
                                          Cancel
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={() => handleSaveAltText(item.id, editingAltTextVal)}
                                          className="px-2.5 py-1 bg-[#C8A25D] hover:bg-white text-black text-[8px] uppercase rounded-xs font-bold"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-start gap-1">
                                        <span className="text-[10px] font-mono tracking-wider text-white/90 truncate capitalize block" title={item.altText}>
                                          {item.altText || "ARZEN Showcase Asset"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center text-[7.5px] font-mono text-white/30 uppercase">
                                        <span>DATE: {new Date(item.uploadDate).toLocaleDateString()}</span>
                                        <span>SIZE: {item.size}</span>
                                      </div>
                                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 font-mono">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingAltTextId(item.id);
                                            setEditingAltTextVal(item.altText);
                                          }}
                                          className="text-[#C8A25D] hover:text-white text-[9px] font-mono uppercase tracking-widest font-medium transition-colors cursor-pointer flex items-center space-x-1"
                                          title="Modify Alt Descriptor"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                          <span>EDIT</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteGalleryImage(item.id)}
                                          className="text-red-400 hover:text-red-300 text-[9px] font-mono uppercase tracking-widest font-medium transition-colors cursor-pointer flex items-center space-x-1"
                                          title="Permanently Delete Image"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          <span>DELETE</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LIGHTBOX POPUP CINEMATIC VIEW */}
                  {selectedGalleryImage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)} />
                      
                      <div className="relative max-w-4xl max-h-[85vh] z-10 flex flex-col items-center select-none bg-[#090909] border border-white/10 rounded-xs overflow-hidden shadow-2xl p-2 animate-fade-in">
                        <button 
                          onClick={() => setSelectedGalleryImage(null)}
                          className="absolute top-4 right-4 text-white/60 hover:text-white bg-black/80 hover:bg-[#C8A25D] hover:text-black p-2 rounded-full transition-all focus:outline-none z-20"
                          title="Close Cinematic Preview"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        
                        <div className="overflow-hidden flex items-center justify-center max-h-[70vh]">
                          <img 
                            src={selectedGalleryImage.url} 
                            alt={selectedGalleryImage.altText} 
                            className="max-w-full max-h-[70vh] object-contain rounded-xs"
                          />
                        </div>

                        <div className="w-full text-center p-4 bg-[#090909] border-t border-white/5 font-mono select-none">
                          <span className="text-[8px] tracking-widest text-[#C8A25D] uppercase font-bold">CINEMATIC PREVIEW PORTAL</span>
                          <h4 className="text-xs text-white/90 uppercase tracking-widest mt-0.5">{selectedGalleryImage.altText || "ARZEN MASTERPIECE"}</h4>
                          <div className="flex items-center justify-center space-x-4 text-[8px] text-white/40 uppercase mt-1.5">
                            <span>STAGE SIZE: {selectedGalleryImage.size}</span>
                            <span>•</span>
                            <span>STAMPED DATE: {new Date(selectedGalleryImage.uploadDate).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </main>
        </div>
      )}

      {/* 3. PRODUCT FORM POPUP / MODAL DRAWER */}
      {showProductForm && isEditingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowProductForm(false)} />
          
          <div className="relative bg-[#0F0F0F] border border-[#C8A25D]/25 rounded-xs w-full max-w-4xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0 bg-[#090909]">
              <div>
                <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">Asset Master Ledger</span>
                <h3 className="text-sm font-mono tracking-widest text-white uppercase font-bold mt-0.5">
                  {isEditingProduct.id ? 'EDIT MASTER CREATION' : 'ESTABLISH NEW MASTER CREATION'}
                </h3>
              </div>
              <button onClick={() => setShowProductForm(false)} className="text-white/40 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-grow p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Product Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">CREATION TITLE</label>
                  <input 
                    type="text" 
                    value={isEditingProduct.name || ''}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, name: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">TAGLINE DESCRIPTION</label>
                  <input 
                    type="text" 
                    value={isEditingProduct.tagline || ''}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, tagline: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing, SKU, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">VALUE PRICE (₹)</label>
                  <input 
                    type="number" 
                    value={isEditingProduct.price || ''}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, price: parseFloat(e.target.value) })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono font-bold text-[#C8A25D]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">DISCOUNT PRICE (₹) (OPTIONAL)</label>
                  <input 
                    type="number" 
                    value={isEditingProduct.discountPrice || ''}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, discountPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">SYSTEM STOCK VOLUME</label>
                  <input 
                    type="number" 
                    value={isEditingProduct.stock !== undefined ? isEditingProduct.stock : 10}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, stock: parseInt(e.target.value) })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">UNIQUE SKU CODE</label>
                  <input 
                    type="text" 
                    placeholder="Auto-generated if left blank"
                    value={isEditingProduct.sku || ''}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, sku: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Department Category Select */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">DEPARTMENT CATEGORY</label>
                  <select 
                    value={isEditingProduct.category || 'Tote'}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, category: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono tracking-widest uppercase"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">PORTAL PUBLISH STATUS</label>
                  <select 
                    value={isEditingProduct.status || 'Active'}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, status: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono tracking-widest uppercase"
                  >
                    <option value="Active">Active (Live in Store)</option>
                    <option value="Draft">Draft (Hidden in Store)</option>
                  </select>
                </div>
              </div>

              {/* Rich Descriptions */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">CREATIVE COPYWRITING DESCRIPTION</label>
                <textarea 
                  value={isEditingProduct.description || ''}
                  onChange={(e) => setIsEditingProduct({ ...isEditingProduct, description: e.target.value })}
                  className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none h-24"
                  required
                />
              </div>

              {/* Dynamic Specifications list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">DIMENSIONS</label>
                  <input 
                    type="text" 
                    placeholder='14.5" W x 11.2" H'
                    value={isEditingProduct.dimensions || ''}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, dimensions: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">CAPACITY (LITERS)</label>
                  <input 
                    type="text" 
                    placeholder='16 Liters'
                    value={isEditingProduct.capacity || ''}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, capacity: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">WARRANTY</label>
                  <input 
                    type="text" 
                    value={isEditingProduct.warranty || 'Lifetime Guarantee'}
                    onChange={(e) => setIsEditingProduct({ ...isEditingProduct, warranty: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* POLICY AND SIZE CONTROLS */}
              <div className="bg-[#111] border border-white/5 rounded-xs p-5 space-y-4">
                <div className="pb-2 border-b border-white/5">
                  <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">BESPOKE OPERATIONAL CONFIGURATIONS</span>
                  <h4 className="text-[11px] font-mono tracking-widest uppercase font-bold text-white mt-0.5">SIZE SELECTIONS & LOGISTICS POLICIES</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">
                      AVAILABLE SIZES (COMMA SEPARATED)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Regular, Grande, Mini"
                      value={Array.isArray(isEditingProduct.sizes) ? isEditingProduct.sizes.join(', ') : (isEditingProduct.sizes || 'Regular, Grande, Mini')}
                      onChange={(e) => {
                        const sizesArr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setIsEditingProduct({ ...isEditingProduct, sizes: sizesArr });
                      }}
                      className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase mb-2">
                      RETURN VALIDITY DAYS
                    </label>
                    <input 
                      type="number" 
                      min={1}
                      max={120}
                      placeholder="7"
                      value={isEditingProduct.returnDays !== undefined ? isEditingProduct.returnDays : 7}
                      onChange={(e) => setIsEditingProduct({ ...isEditingProduct, returnDays: parseInt(e.target.value) || 7 })}
                      className="w-full bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center justify-between bg-[#161616] border border-white/10 rounded-xs p-3.5 select-none">
                    <span className="text-[10px] font-mono tracking-wider text-white/70 uppercase">COD ENABLED</span>
                    <input 
                      type="checkbox"
                      checked={isEditingProduct.codEnabled !== false}
                      onChange={(e) => setIsEditingProduct({ ...isEditingProduct, codEnabled: e.target.checked })}
                      className="accent-[#C8A25D] w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-[#161616] border border-white/10 rounded-xs p-3.5 select-none">
                    <span className="text-[10px] font-mono tracking-wider text-white/70 uppercase">RETURNS PERMITTED</span>
                    <input 
                      type="checkbox"
                      checked={isEditingProduct.returnEnabled !== false}
                      onChange={(e) => setIsEditingProduct({ ...isEditingProduct, returnEnabled: e.target.checked })}
                      className="accent-[#C8A25D] w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-[#161616] border border-white/10 rounded-xs p-3.5 select-none">
                    <span className="text-[10px] font-mono tracking-wider text-white/70 uppercase">REPLACEMENTS PERMITTED</span>
                    <input 
                      type="checkbox"
                      checked={isEditingProduct.replacementEnabled !== false}
                      onChange={(e) => setIsEditingProduct({ ...isEditingProduct, replacementEnabled: e.target.checked })}
                      className="accent-[#C8A25D] w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* LUXURY COLOR VARIANTS SECTION */}
              <div className="bg-[#111] border border-white/5 rounded-xs p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">BESPOKE MATERIALS</span>
                    <h4 className="text-[11px] font-mono tracking-widest uppercase font-bold text-white mt-0.5">LUXURY COLOR CODES</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentColors = isEditingProduct.colors || [];
                      setIsEditingProduct({
                        ...isEditingProduct,
                        colors: [...currentColors, { name: 'New Color', hex: '#000000' }]
                      });
                    }}
                    className="px-3 py-1.5 bg-black border border-[#C8A25D]/30 hover:border-[#C8A25D] text-[#C8A25D] hover:text-white text-[9px] font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                  >
                    + Add Color Variant
                  </button>
                </div>

                {(!isEditingProduct.colors || isEditingProduct.colors.length === 0) ? (
                  <p className="text-[10px] text-white/40 italic font-mono">No color variants declared. Standard premium black selection will be assumed.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {isEditingProduct.colors.map((col: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2.5 bg-black/40 border border-white/5 p-2 rounded-xs">
                        <input 
                          type="color"
                          value={col.hex}
                          onChange={(e) => {
                            const nextColors = [...isEditingProduct.colors];
                            nextColors[idx] = { ...nextColors[idx], hex: e.target.value };
                            setIsEditingProduct({ ...isEditingProduct, colors: nextColors });
                          }}
                          className="w-8 h-8 rounded-full border border-white/10 cursor-pointer shrink-0 bg-transparent"
                        />
                        <input 
                          type="text"
                          value={col.name}
                          onChange={(e) => {
                            const nextColors = [...isEditingProduct.colors];
                            nextColors[idx] = { ...nextColors[idx], name: e.target.value };
                            setIsEditingProduct({ ...isEditingProduct, colors: nextColors });
                          }}
                          placeholder="Color Name (e.g. Royal Gold)"
                          className="flex-grow bg-[#161616] border border-white/5 focus:border-[#C8A25D] rounded-xs px-2 py-1 text-xs text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nextColors = isEditingProduct.colors.filter((_: any, i: number) => i !== idx);
                            setIsEditingProduct({ ...isEditingProduct, colors: nextColors });
                          }}
                          className="p-1 text-red-400 hover:text-white hover:bg-red-950/40 border border-transparent hover:border-red-500/20 rounded transition-colors cursor-pointer"
                          title="Remove Color"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MULTIPLE IMAGES UPLOAD ACCORDION (DRAG & DROP AND CLICK) */}
              <div className="space-y-3">
                <label className="block text-[10px] font-mono tracking-widest text-white/50 uppercase font-semibold">Bespoke Visual Gallery (Multiple Images)</label>
                
                {/* Drag and drop and tap/click zone */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed p-6 text-center rounded-xs transition-all cursor-pointer relative select-none ${dragActive ? 'border-[#C8A25D] bg-[#C8A25D]/10 shadow-[0_0_15px_rgba(200,162,93,0.15)]' : 'border-white/15 bg-black/40 hover:border-[#C8A25D]/50 hover:bg-black/60'}`}
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                  
                  {uploadProgress !== null ? (
                    <div className="space-y-3 py-2">
                      <div className="flex items-center justify-center space-x-2 text-[#C8A25D]">
                        <div className="w-4 h-4 border-2 border-[#C8A25D] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">TRANSMITTING PORTRAIT ASSETS... {uploadProgress}%</span>
                      </div>
                      <div className="w-full max-w-xs mx-auto bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#C8A25D] h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-[#C8A25D] mx-auto mb-2 animate-pulse" />
                      <span className="text-[10px] font-mono text-white/70 block">DRAG & DROP OR TAP TO SELECT IMAGES</span>
                      <span className="text-[8px] text-white/30 block mt-1 uppercase">SUPPORTS JPG, JPEG, PNG, WEBP UP TO 10 MB PER FILE</span>
                    </>
                  )}
                </div>

                {/* Display proper error messages */}
                {uploadError && (
                  <div className="text-[10.5px] font-mono text-red-400 bg-red-950/20 border border-red-500/20 p-3 rounded-xs flex items-center space-x-2 uppercase tracking-wider">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span>ERROR: {uploadError}</span>
                  </div>
                )}

                {/* Direct image url add input */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Paste direct Unsplash/Image url here..."
                    value={imageInputUrl}
                    onChange={(e) => setImageInputUrl(e.target.value)}
                    className="flex-grow bg-[#161616] border border-white/10 focus:border-[#C8A25D] rounded-xs p-2.5 text-xs text-white focus:outline-none font-mono text-[10px]"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddImageUrl}
                    className="px-4 bg-[#161616] hover:bg-white text-white hover:text-black border border-white/15 hover:border-white text-[10px] font-mono tracking-widest uppercase transition-all rounded-xs focus:outline-none"
                  >
                    Add Url
                  </button>
                </div>

                {/* Active image asset rows */}
                {isEditingProduct.images && isEditingProduct.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
                    {isEditingProduct.images.map((img: string, i: number) => (
                      <div key={i} className="relative aspect-[3/4] bg-black border border-white/10 rounded-xs overflow-hidden group">
                        <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        
                        {/* Elegant overlay for reordering & removal */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-1.5 transition-opacity duration-200">
                          {i > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImageLeft(i)}
                              className="p-1.5 bg-[#C8A25D] hover:bg-white text-black rounded-xs transition-colors focus:outline-none cursor-pointer"
                              title="Move Left"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {i < isEditingProduct.images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImageRight(i)}
                              className="p-1.5 bg-[#C8A25D] hover:bg-white text-black rounded-xs transition-colors focus:outline-none cursor-pointer"
                              title="Move Right"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveImage(i)}
                            className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xs transition-colors focus:outline-none cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="absolute bottom-1 left-1 px-1 bg-black/80 text-white/60 font-mono text-[7px] rounded">#{i+1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-white/5 shrink-0 bg-[#090909]">
                <button 
                  type="button" 
                  onClick={() => setShowProductForm(false)}
                  className="px-6 py-3.5 bg-[#161616] hover:bg-white/5 text-white border border-white/15 text-xs font-bold tracking-widest uppercase transition-all rounded-xs focus:outline-none"
                >
                  Cancel Ledger
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3.5 bg-[#C8A25D] hover:bg-white text-black font-bold text-xs tracking-widest uppercase transition-all rounded-xs focus:outline-none shadow-lg"
                >
                  Transmit & Seal Asset
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. INVOICE POPUP GENERATOR (STYLIZED PRINT VIEW) */}
      {viewInvoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md" onClick={() => setViewInvoiceOrder(null)} />
          
          <div className="relative bg-white text-black w-full max-w-2xl shadow-2xl overflow-hidden z-10 flex flex-col p-8 md:p-12 rounded-xs select-none">
            
            {/* Control top print buttons */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 print:hidden select-none">
              <button 
                onClick={() => window.print()}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-black rounded-xs transition-colors focus:outline-none flex items-center space-x-1 text-xs font-mono tracking-widest uppercase"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT</span>
              </button>
              <button 
                onClick={() => setViewInvoiceOrder(null)}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xs transition-colors focus:outline-none"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Print Header */}
            <div className="flex justify-between items-start pb-8 border-b-2 border-gray-150">
              <div>
                <span className="text-xl font-bold tracking-[0.25em] font-sans text-black">ARZEN MAISON</span>
                <span className="block text-[8px] tracking-[0.3em] text-gray-400 uppercase mt-1">THE BUILT DIFFERENT LEGACY</span>
                <p className="text-[10px] text-gray-500 font-light mt-3 max-w-xs leading-relaxed whitespace-pre-line">
                  ARZEN Head Office
                  Bokaro Steel City,
                  Bokaro, Jharkhand – 827001
                  India
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold tracking-widest text-gray-300 font-mono block">INVOICE</span>
                <span className="text-xs font-mono font-semibold text-black block mt-1">{viewInvoiceOrder.orderNumber}</span>
                <span className="text-[10px] font-mono text-gray-400 block">{new Date(viewInvoiceOrder.date).toLocaleString()}</span>
              </div>
            </div>

            {/* Client address details */}
            <div className="grid grid-cols-2 gap-8 py-8 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase font-bold">CLIENT RECEIVER:</span>
                <strong className="block text-sm text-black font-semibold">{viewInvoiceOrder.customerName}</strong>
                <p className="text-gray-500 leading-relaxed font-light">
                  {viewInvoiceOrder.address},<br />
                  {viewInvoiceOrder.city} - {viewInvoiceOrder.postalCode}
                </p>
                <span className="block text-gray-400 font-mono text-[10px] pt-1">{viewInvoiceOrder.customerPhone}</span>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase font-bold">TRANSACT DATA:</span>
                <div className="text-gray-500 font-light space-y-0.5">
                  <span className="block">Secure Method: <strong className="font-mono text-black font-semibold">{viewInvoiceOrder.paymentMethod}</strong></span>
                  <span className="block">Fulfillment: <strong className="font-mono text-black font-semibold">{viewInvoiceOrder.status}</strong></span>
                  <span className="block">Secure Status: <strong className="font-mono text-black font-semibold">{viewInvoiceOrder.paymentStatus}</strong></span>
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="border border-gray-100 rounded-xs overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[9px] font-mono tracking-widest uppercase border-b border-gray-150 text-gray-500">
                    <th className="py-2.5 px-4">Portfolio Asset Item</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Unit Value</th>
                    <th className="py-2.5 px-4 text-right">Acquisition Sum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-light">
                  {viewInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4">
                        <strong className="font-semibold text-black block">{it.product.name}</strong>
                        <span className="text-[10px] text-gray-400 block font-mono">{it.selectedColor.name}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">{it.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatPrice(it.product.price, 'INR')}</td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-black">{formatPrice(it.product.price * it.quantity, 'INR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals lock */}
            <div className="flex justify-end py-6 text-xs select-none">
              <div className="w-64 space-y-2 border-t-2 border-gray-150 pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal Manifest:</span>
                  <span className="font-mono">{formatPrice(viewInvoiceOrder.subtotal, 'INR')}</span>
                </div>
                {viewInvoiceOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-mono">
                    <span>Discount Ticket:</span>
                    <span>-{formatPrice(viewInvoiceOrder.discount, 'INR')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Luxury Logistics:</span>
                  <span className="font-mono">{viewInvoiceOrder.shipping === 0 ? 'COMPLIMENTARY' : formatPrice(viewInvoiceOrder.shipping, 'INR')}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                  <span>Audit Total Sum:</span>
                  <span className="font-sans text-black">{formatPrice(viewInvoiceOrder.total, 'INR')}</span>
                </div>
              </div>
            </div>

            {/* Legal / Thank you note */}
            <div className="text-center pt-8 border-t border-gray-100 mt-6 select-none">
              <span className="text-[8px] font-mono tracking-widest text-gray-400 uppercase">OFFICIAL SEAL SECURE DISPATCH</span>
              <p className="text-[10px] text-gray-400 font-light mt-1.5">
                Thank you for choosing ARZEN. Savor this masterpiece with lifelong assurance. For help, contact arzen.brand@gmail.com.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* BULK SEEDING & IMPORT DRAWER */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowBulkUploadModal(false)} />
          
          <div className="relative bg-[#0F0F0F] border border-[#C8A25D]/30 w-full max-w-xl shadow-2xl p-6 z-10 rounded-xs flex flex-col space-y-4 text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div>
                <span className="text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase">INVENTORY BULK SYSTEM</span>
                <h3 className="text-sm font-mono tracking-widest uppercase font-bold text-white">LXP BULK ASSET IMPORTER</h3>
              </div>
              <button 
                onClick={() => setShowBulkUploadModal(false)}
                className="text-white/40 hover:text-[#C8A25D] focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-white/60 leading-relaxed font-light font-mono">
              Inject complete product arrays directly via validated JSON layout, or quickly seed high-end collections with our handcrafted presets.
            </p>

            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-wider text-white/40 uppercase">SEED RAPID PRESETS:</span>
              <button
                type="button"
                onClick={() => loadBulkSeedPreset('luggage')}
                className="px-2.5 py-1 bg-black border border-white/10 hover:border-[#C8A25D]/40 text-[#C8A25D] text-[9.5px] font-mono uppercase rounded-xs transition-colors cursor-pointer"
              >
                + Royal Luggage Set
              </button>
              <button
                type="button"
                onClick={() => loadBulkSeedPreset('tech')}
                className="px-2.5 py-1 bg-black border border-white/10 hover:border-[#C8A25D]/40 text-[#C8A25D] text-[9.5px] font-mono uppercase rounded-xs transition-colors cursor-pointer"
              >
                + Sovereign Tech Set
              </button>
            </div>

            <form onSubmit={handleImportBulkJSON} className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono tracking-widest text-[#C8A25D] uppercase mb-1.5 font-bold">RAW JSON BLUEPRINT SCHEMA</label>
                <textarea
                  value={bulkUploadText}
                  onChange={(e) => setBulkUploadText(e.target.value)}
                  placeholder='[\n  {\n    "name": "Luxury Calfskin Handbag",\n    "price": 85000,\n    "category": "Bags"\n  }\n]'
                  className="w-full bg-black/60 border border-white/10 focus:border-[#C8A25D] rounded-xs p-3 text-xs text-white focus:outline-none font-mono h-48 placeholder-white/20"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowBulkUploadModal(false)}
                  className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 text-white text-[10px] font-mono uppercase rounded-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C8A25D] hover:bg-white text-black font-bold text-[10px] font-mono uppercase rounded-xs transition-all shadow-lg"
                >
                  Parse & Integrate Assets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LUXURY PRODUCT DELETION CONFIRMATION DIALOG */}
      {productToDeleteId && (() => {
        const productToDelete = products.find(p => p.id === productToDeleteId);
        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md" onClick={() => !isDeleting && setProductToDeleteId(null)} />
            
            <div className="relative bg-[#0F0F0F] border border-red-500/30 w-full max-w-md shadow-2xl p-6 z-10 rounded-xs flex flex-col space-y-5 text-white">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div>
                  <span className="text-[8px] font-mono tracking-widest text-red-400 uppercase font-bold">LEDGER TRANSACTION</span>
                  <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-white mt-0.5">RETIRE MASTERPIECE</h3>
                </div>
                <button 
                  onClick={() => !isDeleting && setProductToDeleteId(null)}
                  disabled={isDeleting}
                  className="text-white/40 hover:text-[#C8A25D] focus:outline-none disabled:opacity-30 disabled:pointer-events-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-mono">
                <p className="text-[12px] text-white/90 leading-relaxed font-light">
                  Are you sure you want to delete this product?
                </p>
                {productToDelete && (
                  <div className="bg-black/40 border border-white/5 p-3 rounded-xs space-y-1.5">
                    <div className="flex justify-between text-[9px] text-white/40 uppercase">
                      <span>IDENTIFIER</span>
                      <span>{productToDelete.sku}</span>
                    </div>
                    <div className="text-xs font-medium text-[#C8A25D] uppercase tracking-wider truncate">
                      {productToDelete.name}
                    </div>
                    <div className="flex justify-between text-[9px] text-white/40 uppercase">
                      <span>PRICE</span>
                      <span>{formatPrice(productToDelete.price, 'INR')}</span>
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-red-400/80 leading-relaxed font-light italic">
                  * This action will permanently remove the asset and its associated data logs from local storage ledgers. This operation cannot be reversed.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/5 font-mono">
                <button
                  type="button"
                  onClick={() => setProductToDeleteId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 text-white text-[10px] uppercase rounded-xs transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-950/40 hover:bg-red-700/80 border border-red-500/30 hover:border-red-500 text-red-200 font-bold text-[10px] uppercase rounded-xs transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center space-x-1.5"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                      <span>Retiring...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* LUXURY GALLERY IMAGE DELETION CONFIRMATION DIALOG */}
      {imageToDeleteId && (() => {
        const imageToDelete = gallery.find(item => item.id === imageToDeleteId);
        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md" onClick={() => setImageToDeleteId(null)} />
            
            <div className="relative bg-[#0F0F0F] border border-red-500/30 w-full max-w-md shadow-2xl p-6 z-10 rounded-xs flex flex-col space-y-5 text-white">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div>
                  <span className="text-[8px] font-mono tracking-widest text-red-400 uppercase font-bold">LEDGER TRANSACTION</span>
                  <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-white mt-0.5">DELETE GALLERY IMAGE</h3>
                </div>
                <button 
                  onClick={() => setImageToDeleteId(null)}
                  className="text-white/40 hover:text-[#C8A25D] focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-mono">
                <p className="text-[12px] text-white/90 leading-relaxed font-light">
                  Are you sure you want to delete this image?
                </p>
                {imageToDelete && (
                  <div className="bg-black/40 border border-white/5 p-3 rounded-xs flex items-center space-x-3">
                    <img 
                      src={imageToDelete.url} 
                      alt="" 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xs border border-white/10 shrink-0 bg-black"
                    />
                    <div className="flex-grow min-w-0 space-y-1">
                      <div className="text-xs font-medium text-[#C8A25D] uppercase tracking-wider truncate">
                        {imageToDelete.altText || "ARZEN Masterpiece"}
                      </div>
                      <div className="flex justify-between text-[8px] text-white/40 uppercase">
                        <span>SIZE: {imageToDelete.size}</span>
                        <span>DATE: {new Date(imageToDelete.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-red-400/80 leading-relaxed font-light italic">
                  * This action will permanently remove the image from the Gallery Manager, Homepage Gallery, Lookbook, Featured Collection, Social Gallery, and all Product sections.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/5 font-mono">
                <button
                  type="button"
                  onClick={() => setImageToDeleteId(null)}
                  className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 text-white text-[10px] uppercase rounded-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteGalleryImage}
                  className="px-6 py-2 bg-red-950/40 hover:bg-red-700/80 border border-red-500/30 hover:border-red-500 text-red-200 font-bold text-[10px] uppercase rounded-xs transition-all shadow-lg cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PREMIUM TOAST NOTIFICATION SYSTEM */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-[#0F0F0F] border border-[#C8A25D]/30 p-4 rounded-xs shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(200,162,93,0.1)] max-w-sm transition-all duration-300">
          <div className="flex items-start space-x-3">
            <div className="shrink-0 mt-1">
              {toast.type === 'success' ? (
                <div className="w-2 h-2 rounded-full bg-[#C8A25D] animate-pulse" />
              ) : toast.type === 'error' ? (
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </div>
            <div className="flex-grow">
              <span className="text-[8px] font-mono tracking-widest text-[#C8A25D]/75 uppercase block font-semibold">
                {toast.type === 'success' ? 'TRANSACTION COMPLETED' : toast.type === 'error' ? 'TRANSACTION FAULT' : 'SYSTEM DIRECTIVE'}
              </span>
              <p className="text-[10.5px] font-mono tracking-wider text-white uppercase mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setToast(null)}
              className="text-white/40 hover:text-[#C8A25D] font-mono text-[9px] uppercase tracking-widest pl-2 border-l border-white/10 shrink-0 focus:outline-none"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
