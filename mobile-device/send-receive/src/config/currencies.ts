export const EXCHANGE_RATES: Record<string, number> = {
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
export const SUPPORTED_CURRENCIES = Object.keys(EXCHANGE_RATES);

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  NGN: "₦",
  ZAR: "R",
  XOF: "CFA",
  XAF: "CFA",
  MAD: "د.م.",
  EGP: "£",
};

export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_COUNTRY = "US";

export const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: DEFAULT_CURRENCY,
});

// Example usage:
// const formatted = CURRENCY_FORMATTER.format(1234.56);
// console.log(formatted); // Outputs: $1,234.56
