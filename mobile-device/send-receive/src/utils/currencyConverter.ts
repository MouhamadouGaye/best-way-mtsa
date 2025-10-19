// ============= UTILITY FUNCTIONS =============
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 149.5,
  CNY: 7.24,
  INR: 83.12,
  NGN: 775.5,
  ZAR: 18.65,
  XOF: 603.5,
  XAF: 603.5,
  MAD: 10.12,
  EGP: 30.9,
};

const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  if (!amount || amount <= 0) return 0;
  const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
  const convertedAmount = amountInUSD * EXCHANGE_RATES[toCurrency];
  return convertedAmount;
};
export { convertCurrency };

// Example usage:
// const converted = convertCurrency(100, 'EUR', 'USD');
// console.log(`Converted amount: ${converted.toFixed(2)} USD`);
