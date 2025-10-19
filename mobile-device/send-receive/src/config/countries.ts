export interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

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
