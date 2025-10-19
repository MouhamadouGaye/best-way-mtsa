// ============= CONSTANTS =============
// export const API_URL = "http://localhost:8080/api";

export const API_URL = "http://192.168.1.100:8080/api"; // your LAN IP

interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}
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

export const COUNTRIES_CURRENCIES: Country[] = [
  { code: "US", name: "United States", currency: "USD", flag: "🇺🇸" },
  { code: "EU", name: "European Union", currency: "EUR", flag: "🇪🇺" },
  { code: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧" },
  { code: "CA", name: "Canada", currency: "CAD", flag: "🇨🇦" },
  { code: "AU", name: "Australia", currency: "AUD", flag: "🇦🇺" },
  { code: "JP", name: "Japan", currency: "JPY", flag: "🇯🇵" },
  { code: "CN", name: "China", currency: "CNY", flag: "🇨🇳" },
  { code: "IN", name: "India", currency: "INR", flag: "🇮🇳" },
  { code: "NG", name: "Nigeria", currency: "NGN", flag: "🇳🇬" },
  { code: "ZA", name: "South Africa", currency: "ZAR", flag: "🇿🇦" },
  { code: "SN", name: "Senegal", currency: "XOF", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", flag: "🇨🇮" },
  { code: "CM", name: "Cameroon", currency: "XAF", flag: "🇨🇲" },
  { code: "MA", name: "Morocco", currency: "MAD", flag: "🇲🇦" },
  { code: "EG", name: "Egypt", currency: "EGP", flag: "🇪🇬" },
];
