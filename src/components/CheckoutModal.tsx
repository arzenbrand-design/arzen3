import React, { useState } from 'react';
import { X, Lock, CreditCard, CheckCircle, Truck, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice } from '../utils';

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
  
  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    embossingInitials: '', // Optional gold monogramming
  });

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId] = useState(() => `ARZ-${Math.floor(100000 + Math.random() * 900000)}`);

  const totalINR = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!shippingForm.firstName) newErrors.firstName = 'Required';
    if (!shippingForm.lastName) newErrors.lastName = 'Required';
    if (!shippingForm.email || !shippingForm.email.includes('@')) newErrors.email = 'Invalid email';
    if (!shippingForm.phone) newErrors.phone = 'Required';
    if (!shippingForm.address) newErrors.address = 'Required';
    if (!shippingForm.city) newErrors.city = 'Required';
    if (!shippingForm.zipCode) newErrors.zipCode = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!paymentForm.cardName) newErrors.cardName = 'Required';
    if (paymentForm.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid card';
    if (!paymentForm.expiry || !paymentForm.expiry.includes('/')) newErrors.expiry = 'Invalid expiry';
    if (paymentForm.cvv.length < 3) newErrors.cvv = 'Invalid CVV';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
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

  // Calculated estimated delivery date (3 business days out)
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
      <div className="relative bg-[#0B0B0B] border border-[#C8A25D]/30 rounded-xs w-full max-w-4xl shadow-2xl overflow-hidden z-10 text-white flex flex-col md:flex-row max-h-[90vh]">
        
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

        {/* Left Side: Dynamic Checkout Form Step */}
        <div className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-none border-b md:border-b-0 md:border-r border-[#C8A25D]/10">
          
          {/* Stepper Header indicator */}
          {step !== 'success' && (
            <div className="flex items-center space-x-4 mb-6 text-[10px] font-mono tracking-widest text-white/50 uppercase">
              <span className={`pb-1 ${step === 'shipping' ? 'text-[#C8A25D] border-b border-[#C8A25D] font-bold' : ''}`}>01 Shipping</span>
              <ArrowRight className="w-3 h-3" />
              <span className={`pb-1 ${step === 'payment' ? 'text-[#C8A25D] border-b border-[#C8A25D] font-bold' : ''}`}>02 Payment</span>
            </div>
          )}

          {/* STEP 1: SHIPPING FORM */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h2 className="text-lg font-sans font-medium text-white tracking-wide border-b border-[#C8A25D]/10 pb-2 mb-4">
                Shipping & Concierge Details
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">First Name *</label>
                  <input
                    type="text"
                    value={shippingForm.firstName}
                    onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.firstName ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={shippingForm.lastName}
                    onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.lastName ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Email *</label>
                  <input
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.phone ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Delivery Street Address *</label>
                <input
                  type="text"
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  placeholder="Apartment, suite, unit, building, floor, street..."
                  className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.address ? 'border-red-500' : 'border-white/10'}`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">City *</label>
                  <input
                    type="text"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.city ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">State / Prov</label>
                  <input
                    type="text"
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Postal Code *</label>
                  <input
                    type="text"
                    value={shippingForm.zipCode}
                    onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.zipCode ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
              </div>

              {/* Complimentary gold leaf embossing for high-value orders */}
              {totalINR >= 25000 && (
                <div className="bg-[#C8A25D]/5 p-3 border border-[#C8A25D]/20 rounded-xs mt-3">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] font-bold block mb-1">
                    ✨ Complimentary Gold Embossing
                  </span>
                  <p className="text-[10px] text-white/50 leading-tight mb-2">
                    Enter up to 3 letters (A-Z) to stamp in 24k gold leaf on your bag tag.
                  </p>
                  <input
                    type="text"
                    maxLength={3}
                    value={shippingForm.embossingInitials}
                    onChange={(e) => setShippingForm({ ...shippingForm, embossingInitials: e.target.value.toUpperCase() })}
                    placeholder="E.g. KMS"
                    className="w-20 bg-[#111] border border-[#C8A25D]/30 rounded-xs px-2.5 py-1 text-center font-mono text-sm tracking-widest text-[#C8A25D] focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#C8A25D] hover:bg-white text-[#0B0B0B] hover:text-black font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 rounded-xs cursor-pointer focus:outline-none"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT FORM */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C8A25D]/10 pb-2 mb-4">
                <h2 className="text-lg font-sans font-medium text-white tracking-wide">
                  Secure Bank Vault Payment
                </h2>
                <div className="flex items-center text-green-500 text-[10px] font-mono uppercase tracking-widest">
                  <Lock className="w-3.5 h-3.5 mr-1" />
                  <span>Encrypted</span>
                </div>
              </div>

              {/* High-End Credit Card Interface Visual Mock */}
              <div className="bg-gradient-to-br from-[#1c1813] to-[#0d0a08] border border-[#C8A25D]/30 rounded-xs p-5 relative overflow-hidden shadow-xl text-white mb-6 select-none h-40 flex flex-col justify-between">
                {/* Chip & Brand */}
                <div className="flex justify-between items-start">
                  <div className="w-10 h-7 bg-[#C8A25D]/20 border border-[#C8A25D]/40 rounded-sm relative overflow-hidden flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5 w-6 h-5 opacity-40">
                      {[...Array(6)].map((_, i) => <div key={i} className="bg-white/40 h-1.5" />)}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest font-bold text-[#C8A25D]">
                    {getCardType(paymentForm.cardNumber)}
                  </span>
                </div>

                {/* Card Number display */}
                <div className="text-base font-mono tracking-widest text-[#C8A25D] font-semibold text-center my-3">
                  {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                </div>

                {/* Card Holder & Expiry display */}
                <div className="flex justify-between text-[10px] font-mono uppercase text-white/50">
                  <div>
                    <span className="block text-[8px] text-[#C8A25D]/70 mb-0.5">Card Member</span>
                    <span className="text-white tracking-wide truncate max-w-[160px] inline-block">{paymentForm.cardName || 'YOUR FULL NAME'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] text-[#C8A25D]/70 mb-0.5">Expires</span>
                    <span className="text-white tracking-widest">{paymentForm.expiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Cardholder Name *</label>
                <input
                  type="text"
                  value={paymentForm.cardName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value.toUpperCase() })}
                  placeholder="EXACT NAME ON THE CREDIT CARD"
                  className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.cardName ? 'border-red-500' : 'border-white/10'}`}
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Credit Card Number *</label>
                <input
                  type="text"
                  value={paymentForm.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4000 1234 5678 9010"
                  className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.cardNumber ? 'border-red-500' : 'border-white/10'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">Expiry Date *</label>
                  <input
                    type="text"
                    value={paymentForm.expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.expiry ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-widest uppercase text-[#C8A25D] mb-1">CVV Code *</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, '') })}
                    placeholder="•••"
                    className={`w-full bg-[#111] border rounded-xs px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-[#C8A25D] transition-colors ${errors.cvv ? 'border-red-500' : 'border-white/10'}`}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[10px] text-white/50 leading-relaxed font-light mt-4 pt-2 border-t border-white/5">
                <Lock className="w-3.5 h-3.5 text-[#C8A25D] flex-shrink-0" />
                <span>By checking out, your banking request is routed through fully 3D-secure tokenized gateways. We never cache your raw card credentials on our servers.</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="w-full py-3.5 bg-transparent text-[#C8A25D] hover:text-white border border-[#C8A25D]/30 hover:border-white/50 text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 rounded-xs focus:outline-none cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white hover:text-black text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 rounded-xs cursor-pointer focus:outline-none"
                >
                  <span>Authorize & Pay</span>
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
                  ORDER PLACED SUCCESSFULLY
                </span>
                <h1 className="text-xl font-sans font-medium text-white tracking-wide mt-2">
                  Welcome to the ARZEN Family
                </h1>
                <p className="text-xs text-white/55 mt-2 leading-relaxed max-w-[400px] mx-auto font-light">
                  A verification receipt with tracking credentials has been dispatched to <span className="text-white font-medium">{shippingForm.email}</span>. Your masterpiece is now being packaged.
                </p>
              </div>

              {/* Box Delivery schedule and logistics info */}
              <div className="bg-[#111] border border-[#C8A25D]/15 rounded-xs p-5 max-w-[460px] mx-auto text-left space-y-3.5 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-white/50 font-mono uppercase text-[9px] tracking-widest">Order Reference</span>
                  <span className="font-mono text-white font-bold tracking-widest">{orderId}</span>
                </div>
                
                <div className="flex items-start space-x-3 text-white/85">
                  <Truck className="w-4 h-4 text-[#C8A25D] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase font-mono tracking-widest">Shipment Courier</span>
                    <span className="font-medium mt-0.5 inline-block">Complimentary DHL Air-Priority Express</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-white/85">
                  <Calendar className="w-4 h-4 text-[#C8A25D] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase font-mono tracking-widest">Estimated Delivery</span>
                    <span className="font-medium mt-0.5 inline-block text-[#C8A25D] font-bold">{getDeliveryDate()}</span>
                  </div>
                </div>

                {shippingForm.embossingInitials && (
                  <div className="flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px]">
                    <span className="text-[#C8A25D] uppercase font-mono tracking-widest font-semibold">Gold monogram tag initials</span>
                    <span className="font-mono text-white font-bold bg-[#C8A25D]/20 border border-[#C8A25D]/30 px-2 py-0.5 rounded-sm tracking-widest">
                      {shippingForm.embossingInitials}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-[#C8A25D] text-[#0B0B0B] hover:bg-white hover:text-black text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-xs focus:outline-none cursor-pointer"
                >
                  Return to Boutique
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Order Summary Panel */}
        <div className="w-full md:w-2/5 p-6 md:p-8 bg-[#0F0F0F] flex flex-col justify-between max-h-[40vh] md:max-h-none overflow-y-auto">
          <div>
            <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-white/50 block border-b border-white/10 pb-2 mb-4">
              Your Purchase Summary
            </h3>

            {/* Cart item display with images and tags */}
            <div className="space-y-4 max-h-[25vh] md:max-h-[45vh] overflow-y-auto pr-1">
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
                      <span className="font-medium text-white block truncate">{item.product.name}</span>
                      <span className="text-[9px] text-white/45 block mt-0.5 uppercase font-mono">{item.selectedColor.name} • Qty {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[#C8A25D] font-bold flex-shrink-0 ml-3">{formatPrice(item.product.price * item.quantity, currency)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-6 space-y-2 text-xs">
            <div className="flex justify-between text-white/60">
              <span className="uppercase font-mono text-[9px] tracking-widest">Subtotal</span>
              <span className="font-mono text-white">{formatPrice(totalINR, currency)}</span>
            </div>
            <div className="flex justify-between text-[#C8A25D]">
              <span className="uppercase font-mono text-[9px] tracking-widest">Air Express Cargo</span>
              <span className="font-mono uppercase">Complimentary</span>
            </div>
            <div className="h-[1px] bg-white/10 my-1" />
            <div className="flex justify-between items-baseline pt-1">
              <span className="uppercase font-mono text-[10px] tracking-widest font-bold text-white">Grand Total</span>
              <span className="font-mono text-lg font-bold text-[#C8A25D]">{formatPrice(totalINR, currency)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
