export function formatPrice(priceInINR: number, currency: 'INR' | 'USD' | 'EUR'): string {
  const conversionRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
  };

  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
  };

  const converted = priceInINR * conversionRates[currency];

  if (currency === 'INR') {
    // Standard Indian numbering system (e.g. 14,999 instead of 14,999.00)
    return `${symbols.INR}${Math.round(converted).toLocaleString('en-IN')}`;
  } else {
    // International currency system
    return `${symbols[currency]}${Math.round(converted).toLocaleString('en-US')}`;
  }
}
