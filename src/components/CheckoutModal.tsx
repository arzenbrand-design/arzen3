import React, { useState, useEffect } from 'react';
import { X, Lock, CreditCard, CheckCircle, Truck, Calendar, ShoppingBag, ArrowRight, MapPin, Tag, Smartphone, ShieldCheck } from 'lucide-react';
import { CartItem, SavedAddress } from '../types';
import { formatPrice } from '../utils';
import { ArzenDatabase, DbCoupon, DbOrder, DbSettings } from '../db';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: 'INR' | 'USD' | 'EUR';
  onClearCart: () => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'success';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  currency,
  onClearCart,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [dbSettings, setDbSettings] = useState<DbSettings>(() => ArzenDatabase.getSettings());
  
  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const stored = localStorage.getItem('arzen_saved_addresses');
      if (stored) return JSON.parse(stored);
    } catch {}
    
    // Default saved addresses for client demo
    const defaults: SavedAddress[] = [
      {
        id: 'addr-1',
        fullName: 'Devashish Sen',
        email: 'devashish.sen@venturecap.co',
        phone: '+91 98310 74319',
        address: 'Suite 402, Block C, Executive Towers, Sector V',
        city: 'Kolkata',
        state: 'West Bengal',
        zipCode: '700091',
        landmark: 'Near SDF Building',
        isDefault: true,
      },
      {
        id: 'addr-2',
        fullName: 'Devashish Sen (Home)',
        email: 'devashish.sen@venturecap.co',
        phone: '+91 98310 74319',
        address: 'Plot 12, Road No. 4, Cooperative Colony',
        city: 'Bokaro Steel City',
        state: 'Jharkhand',
        zipCode: '827001',
        landmark: 'Opposite Sector 4 Ground',
        isDefault: false,
      }
    ];
    try {
      localStorage.setItem('arzen_saved_addresses', JSON.stringify(defaults));
    } catch {}
    return defaults;
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [saveThisAddress, setSaveThisAddress] = useState(false);

  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    embossingInitials: '', // Optional gold monogramming
  });

  // Separate Billing Address State
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingForm, setBillingForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Coupon Code State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DbCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId] = useState(() => `ARZ-${Math.floor(100000 + Math.random() * 900000)}`);

  // Populate form when selecting a saved address
  useEffect(() => {
    if (selectedAddressId) {
      const addr = savedAddresses.find(a => a.id === selectedAddressId);
      if (addr) {
        setShippingForm({
          fullName: addr.fullName,
          email: addr.email,
          phone: addr.phone,
          address: addr.address,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          landmark: addr.landmark || '',
          embossingInitials: shippingForm.embossingInitials,
        });
      }
    }
  }, [selectedAddressId, savedAddresses]);

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Tax calculation (18% GST standard)
  const gstRate = 0.18;
  const taxAmount = Math.round(subtotal * gstRate);

  // Shipping charge based on threshold in dbSettings
  const freeShippingThreshold = dbSettings.freeShippingThreshold || 25000;
  const flatShippingCharge = dbSettings.flatShippingCharge !== undefined ? dbSettings.flatShippingCharge : 500;
  const shippingCharge = subtotal >= freeShippingThreshold ? 0 : flatShippingCharge;

  // Coupon calculations
  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round(subtotal * (appliedCoupon.value / 100));
    }
    return appliedCoupon.value;
  };

  const discountAmount = getDiscountAmount();
  const grandTotal = Math.max(subtotal + taxAmount + shippingCharge - discountAmount, 0);

  // Check if all items allow COD
  const cartAllowsCod = cartItems.every(item => item.product.codEnabled !== false);
  const codAvailable = cartAllowsCod && (dbSettings.enabledPaymentMethods?.includes('cod') !== false);

  // Handle coupon application
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const coupons = ArzenDatabase.getCoupons();
    const found = coupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase());

    if (!found) {
      setCouponError('This coupon code is invalid.');
      return;
    }

    if (!found.active) {
      setCouponError('This coupon is no longer active.');
      return;
    }

    if (subtotal < found.minOrderAmount) {
      setCouponError(`Requires a minimum purchase value of ${formatPrice(found.minOrderAmount, currency)}.`);
      return;
    }

    setAppliedCoupon(found);
    setCouponSuccess(`Coupon applied! Saved ${found.discountType === 'percentage' ? `${found.value}%` : formatPrice(found.value, currency)}.`);
  };

  // Shipping Validation & Submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!shippingForm.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingForm.email.trim() || !shippingForm.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!shippingForm.phone.trim()) newErrors.phone = 'Mobile number is required';
    if (!shippingForm.address.trim()) newErrors.address = 'Street address is required';
    if (!shippingForm.city.trim()) newErrors.city = 'City is required';
    if (!shippingForm.state.trim()) newErrors.state = 'State is required';
    if (!shippingForm.zipCode.trim()) newErrors.zipCode = 'Postal code is required';

    if (!sameAsShipping) {
      if (!billingForm.fullName.trim()) newErrors.billName = 'Billing name is required';
      if (!billingForm.address.trim()) newErrors.billAddress = 'Billing address is required';
      if (!billingForm.city.trim()) newErrors.billCity = 'Billing city is required';
      if (!billingForm.state.trim()) newErrors.billState = 'Billing state is required';
      if (!billingForm.zipCode.trim()) newErrors.billZipCode = 'Billing zip code is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll form area into view
      return;
    }

    setErrors({});

    // Save Address if checked
    if (saveThisAddress) {
      const isDuplicate = savedAddresses.some(
        a => a.fullName.toLowerCase() === shippingForm.fullName.toLowerCase() && 
             a.address.toLowerCase() === shippingForm.address.toLowerCase()
      );
      if (!isDuplicate) {
        const newAddr: SavedAddress = {
          id: `addr-${Date.now()}`,
          fullName: shippingForm.fullName,
          email: shippingForm.email,
          phone: shippingForm.phone,
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          zipCode: shippingForm.zipCode,
          landmark: shippingForm.landmark,
          isDefault: savedAddresses.length === 0,
        };
        const updated = [...savedAddresses, newAddr];
        setSavedAddresses(updated);
        try {
          localStorage.setItem('arzen_saved_addresses', JSON.stringify(updated));
        } catch {}
      }
    }

    // Advance to payment step
    setStep('payment');
  };

  // Payment Validation & Final Authorization
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!paymentForm.cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (paymentForm.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Valid card number is required';
      if (!paymentForm.expiry.includes('/')) newErrors.expiry = 'Expiry MM/YY required';
      if (paymentForm.cvv.length < 3) newErrors.cvv = 'Valid CVV required';
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) newErrors.upiId = 'Valid UPI ID (e.g. name@upi) is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Register Order in Arzen Database
    const orders = ArzenDatabase.getOrders();
    const newOrder: DbOrder = {
      id: orderId,
      orderNumber: `ARZ-ORD-${1000 + orders.length + 1}`,
      customerId: 'current-user-demoid',
      customerName: shippingForm.fullName,
      customerEmail: shippingForm.email,
      customerPhone: shippingForm.phone,
      address: shippingForm.address + (shippingForm.landmark ? `, Landmark: ${shippingForm.landmark}` : ''),
      city: `${shippingForm.city}, ${shippingForm.state}`,
      postalCode: shippingForm.zipCode,
      items: cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize || 'Regular',
      })),
      subtotal: subtotal,
      discount: discountAmount,
      shipping: shippingCharge,
      total: grandTotal,
      paymentMethod: paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'COD',
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      status: 'Pending',
      date: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    ArzenDatabase.saveOrders(updatedOrders);

    // Also deduct stock dynamically in database
    const products = ArzenDatabase.getProducts();
    const updatedProducts = products.map(prod => {
      const match = cartItems.find(item => item.product.id === prod.id);
      if (match && prod.stock !== undefined) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - match.quantity)
        };
      }
      return prod;
    });
    ArzenDatabase.saveProducts(updatedProducts);

    // Complete Checkout
    setStep('success');
    onClearCart();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setPaymentForm({ ...paymentForm, cardNumber: formatted.substring(0, 19) });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setPaymentForm({ ...paymentForm, expiry: value.substring(0, 5) });
  };

  const getCardType = (num: string) => {
    const cleaned = num.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'VISA';
    if (cleaned.startsWith('5')) return 'MASTERCARD';
    if (cleaned.startsWith('37') || cleaned.startsWith('34')) return 'AMEX';
    return 'CREDIT CARD';
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-[#0B0B0B] border border-[#C8A25D]/30 rounded-xs w-full max-w-5xl shadow-2xl overflow-hidden z-10 text-white flex flex-col md:flex-row max-h-[95vh]">
        
        {/* Close Button */}
        {step !== 'success' && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 text-[#C8A25D] hover:text-white transition-colors focus:outline-none cursor-pointer"
            title="Cancel Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Left Side: Dynamic Forms */}
        <div className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto max-h-[55vh] md:max-h-[85vh] border-b md:border-b-0 md:border-r border-[#C8A25D]/10">
          
          {/* Stepper Header */}
          {step !== 'success' && (
            <div className="flex items-center space-x-4 mb-6 text-[10px] font-mono tracking-widest text-white/50 uppercase">
              <span className={`pb-1 ${step === 'shipping' ? 'text-[#C8A25D] border-b border-[#C8A25D] font-bold' : ''}`}>01 SHIPPING</span>
              <ArrowRight className="w-3 h-3" />
              <span className={`pb-1 ${step === 'payment' ? 'text-[#C8A25D] border-b border-[#C8A25D] font-bold' : ''}`}>02 PAYMENT</span>
            </div>
          )}

          {/* STEP 1: SHIPPING & ADDRESS MANAGEMENT */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h2 className="text-base font-serif font-light text-white tracking-wide border-b border-[#C8A25D]/10 pb-2 mb-4 uppercase">
                Bespoke Shipment & Concierge
              </h2>

              {/* Saved Address Selection Drawer */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2 border-b border-white/5 pb-4">
                  <span className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold">
                    SELECT SAVED COURIER DESTINATION
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {savedAddresses.map((addr) => (
                      <button
                        type="button"
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3 text-left border rounded-xs transition-all flex flex-col justify-between cursor-pointer min-h-[84px] ${
                          selectedAddressId === addr.id
                            ? 'border-[#C8A25D] bg-[#C8A25D]/5'
                            : 'border-white/10 bg-black/40 hover:border-white/30'
                        }`}
                      >
                        <div className="text-xs">
                          <strong className="text-white block font-mono text-[10px] uppercase mb-0.5">{addr.fullName}</strong>
                          <p className="text-white/60 text-[10.5px] leading-tight line-clamp-2">{addr.address}, {addr.city}</p>
                        </div>
                        <span className="text-[9px] font-mono text-[#C8A25D]/80 mt-1 block">
                          {addr.phone} {addr.isDefault && '• DEFAULT'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddressId('');
                      setShippingForm({
                        fullName: '',
                        email: '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        landmark: '',
                        embossingInitials: '',
                      });
                    }}
                    className="text-[9.5px] font-mono text-[#C8A25D] hover:text-white uppercase tracking-wider block focus:outline-none"
                  >
                    Clear Selection & Enter New Address
                  </button>
                </div>
              )}

              {/* Shipping Inputs */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Sovereign Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.fullName}
                    onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                    placeholder="E.g. Devashish Sen"
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.fullName ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.fullName && <span className="text-red-500 text-[10px] font-mono">{errors.fullName}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Concierge Email *</label>
                    <input
                      type="email"
                      required
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      placeholder="e.g. sen@venturecap.co"
                      className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.email && <span className="text-red-500 text-[10px] font-mono">{errors.email}</span>}
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Mobile Contact Number *</label>
                    <input
                      type="tel"
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      placeholder="+91 98310 74319"
                      className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.phone ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.phone && <span className="text-red-500 text-[10px] font-mono">{errors.phone}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Delivery Street Address *</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    placeholder="Apartment, suite, unit, building, floor, street..."
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.address ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {errors.address && <span className="text-red-500 text-[10px] font-mono">{errors.address}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.city ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.city && <span className="text-red-500 text-[10px] font-mono">{errors.city}</span>}
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.state ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.state && <span className="text-red-500 text-[10px] font-mono">{errors.state}</span>}
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                      className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.zipCode ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.zipCode && <span className="text-red-500 text-[10px] font-mono">{errors.zipCode}</span>}
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Landmark</label>
                    <input
                      type="text"
                      value={shippingForm.landmark}
                      onChange={(e) => setShippingForm({ ...shippingForm, landmark: e.target.value })}
                      placeholder="Optional"
                      className="w-full bg-[#111] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors"
                    />
                  </div>
                </div>

                {/* Save Address options */}
                <div className="flex items-center space-x-2 border-t border-white/5 pt-3 select-none">
                  <input
                    type="checkbox"
                    id="save_addr"
                    checked={saveThisAddress}
                    onChange={(e) => setSaveThisAddress(e.target.checked)}
                    className="accent-[#C8A25D] cursor-pointer"
                  />
                  <label htmlFor="save_addr" className="text-[11px] text-white/70 cursor-pointer font-sans">
                    Save this address to my profile ledger for future purchase allocation
                  </label>
                </div>
              </div>

              {/* Dynamic Billing Address Form */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center space-x-2 select-none">
                  <input
                    type="checkbox"
                    id="same_as_shipping"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="accent-[#C8A25D] cursor-pointer"
                  />
                  <label htmlFor="same_as_shipping" className="text-[11px] text-[#C8A25D] font-mono uppercase tracking-wider font-bold cursor-pointer">
                    Billing address is the same as shipping
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="bg-[#111]/30 p-4 border border-white/5 rounded-xs space-y-3 animate-fade-in">
                    <span className="text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold block">
                      SEPARATE BILLING RECIPIENT DETAILS
                    </span>
                    <div>
                      <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Billing Recipient Full Name *</label>
                      <input
                        type="text"
                        required
                        value={billingForm.fullName}
                        onChange={(e) => setBillingForm({ ...billingForm, fullName: e.target.value })}
                        className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.billName ? 'border-red-500' : 'border-white/10'}`}
                      />
                      {errors.billName && <span className="text-red-500 text-[10px] font-mono">{errors.billName}</span>}
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Billing Address *</label>
                      <input
                        type="text"
                        required
                        value={billingForm.address}
                        onChange={(e) => setBillingForm({ ...billingForm, address: e.target.value })}
                        className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.billAddress ? 'border-red-500' : 'border-white/10'}`}
                      />
                      {errors.billAddress && <span className="text-red-500 text-[10px] font-mono">{errors.billAddress}</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={billingForm.city}
                          onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                          className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.billCity ? 'border-red-500' : 'border-white/10'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={billingForm.state}
                          onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                          className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.billState ? 'border-red-500' : 'border-white/10'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Postal Code *</label>
                        <input
                          type="text"
                          required
                          value={billingForm.zipCode}
                          onChange={(e) => setBillingForm({ ...billingForm, zipCode: e.target.value })}
                          className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.billZipCode ? 'border-red-500' : 'border-white/10'}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Complimentary gold leaf embossing */}
              {subtotal >= 25000 && (
                <div className="bg-[#C8A25D]/5 p-3.5 border border-[#C8A25D]/25 rounded-xs mt-3 space-y-1">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold block">
                    ✨ COMPLIMENTARY GOLD LEAF MONOGRAMMING
                  </span>
                  <p className="text-[10.5px] text-white/50 leading-tight">
                    Add up to 3 sovereign initials stamped in real 24k gold leaf on your leather key ring.
                  </p>
                  <input
                    type="text"
                    maxLength={3}
                    value={shippingForm.embossingInitials}
                    onChange={(e) => setShippingForm({ ...shippingForm, embossingInitials: e.target.value.toUpperCase() })}
                    placeholder="E.g. ADS"
                    className="w-20 bg-[#111] border border-[#C8A25D]/30 rounded-xs px-2.5 py-1 text-center font-mono text-sm tracking-widest text-[#C8A25D] focus:outline-none mt-1 uppercase"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-6 py-4 bg-[#C8A25D] hover:bg-white text-[#0B0B0B] font-mono font-bold text-[10.5px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 rounded-xs cursor-pointer focus:outline-none"
              >
                <span>CONTINUE TO VAULT PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT & SECURITY CHECK */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C8A25D]/10 pb-2 mb-4">
                <h2 className="text-base font-serif font-light text-white tracking-wide uppercase">
                  Secure Bank Vault Authorization
                </h2>
                <div className="flex items-center text-green-500 text-[10px] font-mono uppercase tracking-widest font-bold">
                  <Lock className="w-3.5 h-3.5 mr-1" />
                  <span>3D-SECURE GATEWAY</span>
                </div>
              </div>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-1 border font-mono text-[9.5px] tracking-wider rounded-xs uppercase flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#C8A25D] text-black border-[#C8A25D]'
                      : 'bg-transparent border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-3 px-1 border font-mono text-[9.5px] tracking-wider rounded-xs uppercase flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-[#C8A25D] text-black border-[#C8A25D]'
                      : 'bg-transparent border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI Payment</span>
                </button>

                <button
                  type="button"
                  disabled={!codAvailable}
                  onClick={() => setPaymentMethod('cod')}
                  className={`py-3 px-1 border font-mono text-[9.5px] tracking-wider rounded-xs uppercase flex flex-col items-center justify-center space-y-1 transition-all ${
                    !codAvailable ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'
                  } ${
                    paymentMethod === 'cod'
                      ? 'bg-[#C8A25D] text-black border-[#C8A25D]'
                      : 'bg-transparent border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>CASH ON DELIVERY</span>
                </button>
              </div>

              {/* COD Warning details */}
              {!cartAllowsCod && (
                <p className="text-[10px] text-[#FF5A5F] font-mono leading-normal">
                  ⚠️ COD is unavailable because one of the bespoke masterpieces in your cart does not permit cash handovers.
                </p>
              )}

              {/* CARD PAYMENT DETAILS */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 animate-fade-in">
                  {/* High-End Credit Card Visual */}
                  <div className="bg-gradient-to-br from-[#1c1813] to-[#0d0a08] border border-[#C8A25D]/30 rounded-xs p-5 relative overflow-hidden shadow-xl text-white select-none h-40 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-7 bg-[#C8A25D]/20 border border-[#C8A25D]/40 rounded-sm relative overflow-hidden flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-0.5 w-6 h-5 opacity-40">
                          {[...Array(6)].map((_, i) => <div key={i} className="bg-white/40 h-1.5" />)}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono tracking-widest font-bold text-[#C8A25D]">
                        {getCardType(paymentForm.cardNumber)}
                      </span>
                    </div>

                    <div className="text-base font-mono tracking-widest text-[#C8A25D] font-semibold text-center my-2">
                      {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between text-[9px] font-mono uppercase text-white/50">
                      <div>
                        <span className="block text-[7.5px] text-[#C8A25D]/70 mb-0.5">Card Member</span>
                        <span className="text-white tracking-wide truncate max-w-[170px] inline-block">{paymentForm.cardName || 'CLIENT NAME'}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[7.5px] text-[#C8A25D]/70 mb-0.5">Expires</span>
                        <span className="text-white tracking-widest">{paymentForm.expiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Fields */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Cardholder Name *</label>
                      <input
                        type="text"
                        required
                        value={paymentForm.cardName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value.toUpperCase() })}
                        placeholder="NAME ON THE CREDIT CARD"
                        className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.cardName ? 'border-red-500' : 'border-white/10'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Credit Card Number *</label>
                      <input
                        type="text"
                        required
                        value={paymentForm.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4000 1234 5678 9010"
                        className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.cardNumber ? 'border-red-500' : 'border-white/10'}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Expiry Date *</label>
                        <input
                          type="text"
                          required
                          value={paymentForm.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.expiry ? 'border-red-500' : 'border-white/10'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">CVV Code *</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, '') })}
                          placeholder="•••"
                          className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.cvv ? 'border-red-500' : 'border-white/10'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI PAYMENT DETAILS */}
              {paymentMethod === 'upi' && (
                <div className="bg-[#111]/40 border border-white/5 p-4 rounded-xs space-y-3.5 animate-fade-in text-xs">
                  <span className="text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold block">
                    INSTANT UPI DEBIT LEDGER
                  </span>
                  <p className="text-[11px] text-white/50 font-sans leading-normal">
                    Initiate transaction via secure BHIM UPI protocol. Input your address ID below to receive the smartphone ping.
                  </p>
                  <div>
                    <label className="block text-[8.5px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">UPI Address / VPA ID *</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. devashish@ybl"
                      className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.upiId ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.upiId && <span className="text-red-500 text-[10px] font-mono">{errors.upiId}</span>}
                  </div>
                </div>
              )}

              {/* CASH ON DELIVERY DETAILS */}
              {paymentMethod === 'cod' && (
                <div className="bg-[#C8A25D]/5 border border-[#C8A25D]/25 p-4 rounded-xs space-y-2 animate-fade-in text-xs">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold block">
                    CASH ON COURIER ARRIVAL CONFIRMED
                  </span>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    You have chosen cash handover. Please ensure that an amount of{' '}
                    <strong className="text-white font-mono">{formatPrice(grandTotal, currency)}</strong> is allocated in physical currency upon DHL courier doorstep arrival.
                  </p>
                  <p className="text-[10px] text-white/40 leading-normal font-sans">
                    A telephone verification representative will call your number ({shippingForm.phone}) inside 4 hours to verify dispatch.
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-[10px] text-white/40 leading-relaxed font-light mt-4 pt-2 border-t border-white/5">
                <ShieldCheck className="w-4 h-4 text-[#C8A25D] flex-shrink-0" />
                <span>Routed through fully tokenized bank portals. Arzen never views nor caches credit card data.</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="w-full py-3.5 bg-transparent text-[#C8A25D] hover:text-white border border-[#C8A25D]/30 hover:border-white/50 text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 rounded-xs focus:outline-none cursor-pointer"
                >
                  RETURN TO SHIPPING
                </button>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 rounded-xs cursor-pointer focus:outline-none"
                >
                  <span>AUTHORIZE PURCHASE</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER SUCCESS RECEIPT */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-[#C8A25D]/10 border-2 border-[#C8A25D] flex items-center justify-center shadow-lg shadow-[#C8A25D]/10">
                  <CheckCircle className="w-8 h-8 text-[#C8A25D]" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A25D] font-bold block">
                  BESPOKE RESERVATION SECURED
                </span>
                <h1 className="text-xl font-serif font-light text-white tracking-wide mt-2 uppercase">
                  Welcome to the ARZEN Circle
                </h1>
                <p className="text-xs text-white/55 mt-2 leading-relaxed max-w-[420px] mx-auto font-light">
                  A premium signature dispatch receipt with DHL Air-Priority tracking ledger coordinates has been sent to <span className="text-white font-mono font-bold">{shippingForm.email}</span>.
                </p>
              </div>

              <div className="bg-[#111] border border-[#C8A25D]/15 rounded-xs p-5 max-w-[460px] mx-auto text-left space-y-3.5 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-white/50 font-mono uppercase text-[9px] tracking-widest">Order Ledger Reference</span>
                  <span className="font-mono text-[#C8A25D] font-bold tracking-widest">{orderId}</span>
                </div>
                
                <div className="flex items-start space-x-3 text-white/85">
                  <Truck className="w-4 h-4 text-[#C8A25D] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase font-mono tracking-widest">Courier Partner</span>
                    <span className="font-semibold mt-0.5 inline-block text-[11px]">DHL Air-Priority Sealed Case Cargo</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-white/85">
                  <Calendar className="w-4 h-4 text-[#C8A25D] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase font-mono tracking-widest">Handover Estimate</span>
                    <span className="font-mono text-[#C8A25D] font-bold mt-0.5 inline-block">{getDeliveryDate()}</span>
                  </div>
                </div>

                {shippingForm.embossingInitials && (
                  <div className="flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px]">
                    <span className="text-[#C8A25D] uppercase font-mono tracking-widest font-semibold">Gold Stamped monogram</span>
                    <span className="font-mono text-white font-bold bg-[#C8A25D]/20 border border-[#C8A25D]/30 px-2.5 py-0.5 rounded-sm tracking-widest">
                      {shippingForm.embossingInitials}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3.5 bg-[#C8A25D] text-black hover:bg-white font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 rounded-xs focus:outline-none cursor-pointer"
                >
                  RETURN TO ARCHIVE
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Order Summary Panel */}
        <div className="w-full md:w-2/5 p-6 md:p-8 bg-[#0F0F0F] flex flex-col justify-between max-h-[40vh] md:max-h-none overflow-y-auto">
          <div>
            <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 block border-b border-white/10 pb-2 mb-4">
              Your Purchase Summary
            </h3>

            {/* Cart item display with images and tags */}
            <div className="space-y-4 max-h-[25vh] md:max-h-[40vh] overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img 
                      src={item.selectedColor.image || item.product.images[0]} 
                      alt={item.product.name} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 rounded-xs object-cover bg-black flex-shrink-0 border border-white/10" 
                    />
                    <div className="min-w-0">
                      <span className="font-medium text-white block truncate text-[11.5px]">{item.product.name}</span>
                      <span className="text-[9.5px] text-white/45 block mt-0.5 uppercase font-mono leading-tight">
                        {item.selectedColor.name} • {item.selectedSize || 'Regular'} • Qty {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[#C8A25D] font-bold flex-shrink-0 ml-3 text-[11.5px]">
                    {formatPrice(item.product.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-3.5">
            {/* Coupon Code Entry Form */}
            {step !== 'success' && (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <span className="block text-[8px] font-mono tracking-widest text-[#C8A25D] uppercase font-bold">
                  APPLY COOPERATION / LUXURY TOKEN
                </span>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="E.G. COZYARZEN"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-[#111] border border-white/10 rounded-xs px-2.5 py-1.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-[#C8A25D]"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-[#C8A25D]/20 hover:bg-[#C8A25D] text-[#C8A25D] hover:text-black border border-[#C8A25D]/40 hover:border-transparent font-mono text-[10px] font-bold tracking-widest uppercase rounded-xs cursor-pointer focus:outline-none"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-[10px] font-mono leading-normal">{couponError}</p>}
                {couponSuccess && <p className="text-[#C8A25D] text-[10px] font-mono leading-normal">{couponSuccess}</p>}
              </form>
            )}

            {/* Calculations Panel */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white/60 text-[11px]">
                <span className="uppercase font-mono text-[9px] tracking-widest">Subtotal</span>
                <span className="font-mono text-white">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-white/60 text-[11px]">
                <span className="uppercase font-mono text-[9px] tracking-widest">Taxes (18% GST)</span>
                <span className="font-mono text-white">{formatPrice(taxAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-white/60 text-[11px]">
                <span className="uppercase font-mono text-[9px] tracking-widest">Air Express Cargo</span>
                <span className="font-mono text-[#C8A25D]">
                  {shippingCharge === 0 ? 'Complimentary' : formatPrice(shippingCharge, currency)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-400 text-[11px]">
                  <span className="uppercase font-mono text-[9px] tracking-widest">Token Discount ({appliedCoupon.code})</span>
                  <span className="font-mono">- {formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              <div className="h-[1px] bg-white/10 my-1" />
              <div className="flex justify-between items-baseline pt-1">
                <span className="uppercase font-mono text-[10px] tracking-widest font-bold text-white">Grand Total</span>
                <span className="font-mono text-base font-bold text-[#C8A25D]">{formatPrice(grandTotal, currency)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
