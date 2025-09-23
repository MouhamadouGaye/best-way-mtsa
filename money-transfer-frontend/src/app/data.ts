export const beneficiaries = [
  { id: 1, name: 'kobe', phoneNumber: '+1234567890' },
  { id: 3, name: 'lima', phoneNumber: '0635544534' },
  { id: 3, name: 'Hawa', phoneNumber: '0789897856' },
  { id: 4, name: 'Ameth', phoneNumber: '0664741506' },
];
export const countries = [
  { id: 1, name: 'United States', currency: 'USD' },
  { id: 2, name: 'European Union', currency: 'EUR' },
  { id: 3, name: 'United Kingdom', currency: 'GBP' },
  { id: 4, name: 'Japan', currency: 'JPY' },
  { id: 5, name: 'Canada', currency: 'CAD' },
  { id: 6, name: 'CFA Franc BCEAO', currency: 'XOF' },
];
// export const rates: any = {
//   USD: 1,
//   EUR: 0.91,
//   GBP: 0.78,
//   JPY: 145.2,
//   CAD: 1.36,
//   XOF: 625.95,
// };

export const rates: { [currency: string]: number } = {
  USD: 1.0, // baseline

  // Europe & G7-ish
  EUR: 0.85, // 1 USD ≈ 0.85 EUR :contentReference[oaicite:0]{index=0}
  GBP: 0.74, // 1 USD ≈ 0.74 GBP :contentReference[oaicite:1]{index=1}
  JPY: 147.8, // 1 USD ≈ 147.8 JPY :contentReference[oaicite:2]{index=2}
  CAD: 1.383, // 1 USD ≈ 1.383 CAD :contentReference[oaicite:3]{index=3}
  AUD: 1.52, // 1 USD ≈ 1.52 AUD :contentReference[oaicite:4]{index=4}

  // African & other currencies from your list
  XOF: 627.0, // West African CFA franc (approx)
  NGN: 775.0, // Nigerian naira (approx), might vary quite a lot
  BRL: 5.29, // Brazilian real :contentReference[oaicite:5]{index=5}
  INR: 88.78, // Indian rupee :contentReference[oaicite:6]{index=6}

  // Others
  KRW: 1390.0, // South Korean won (approx)
  RUB: 83.6, // Russian ruble approx USD/RUB :contentReference[oaicite:7]{index=7}
  // Add more as needed...
};

export const countryPrefixes: {
  prefix: string;
  code: string;
  name: string;
  currency: string;
  flag: string;
}[] = [
  {
    prefix: '+225',
    code: 'CI',
    name: 'Côte d’Ivoire',
    currency: 'XOF',
    flag: '🇨🇮',
  },
  { prefix: '+229', code: 'BJ', name: 'Benin', currency: 'XOF', flag: '🇧🇯' },
  {
    prefix: '+226',
    code: 'BF',
    name: 'Burkina Faso',
    currency: 'XOF',
    flag: '🇧🇫',
  },
  { prefix: '+223', code: 'ML', name: 'Mali', currency: 'XOF', flag: '🇲🇱' },
  { prefix: '+227', code: 'NE', name: 'Niger', currency: 'XOF', flag: '🇳🇪' },
  { prefix: '+228', code: 'TG', name: 'Togo', currency: 'XOF', flag: '🇹🇬' },
  { prefix: '+221', code: 'SN', name: 'Senegal', currency: 'XOF', flag: '🇸🇳' },
  { prefix: '+220', code: 'GM', name: 'Gambia', currency: 'GMD', flag: '🇬🇲' },
  { prefix: '+231', code: 'LR', name: 'Liberia', currency: 'LRD', flag: '🇱🇷' },
  {
    prefix: '+232',
    code: 'SL',
    name: 'Sierra Leone',
    currency: 'SLL',
    flag: '🇸🇱',
  },
  { prefix: '+224', code: 'GN', name: 'Guinea', currency: 'GNF', flag: '🇬🇳' },
  {
    prefix: '+245',
    code: 'GW',
    name: 'Guinea-Bissau',
    currency: 'XOF',
    flag: '🇬🇼',
  },
  { prefix: '+234', code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
  {
    prefix: '+238',
    code: 'CV',
    name: 'Cabo Verde',
    currency: 'CVE',
    flag: '🇨🇻',
  },
  {
    prefix: '+222',
    code: 'MR',
    name: 'Mauritania',
    currency: 'MRU',
    flag: '🇲🇷',
  },

  {
    prefix: '+1',
    code: 'US',
    name: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
  },
  { prefix: '+1', code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { prefix: '+86', code: 'CN', name: 'China', currency: 'CNY', flag: '🇨🇳' },
  { prefix: '+81', code: 'JP', name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  { prefix: '+49', code: 'DE', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  {
    prefix: '+44',
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
  },
  { prefix: '+33', code: 'FR', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { prefix: '+39', code: 'IT', name: 'Italy', currency: 'EUR', flag: '🇮🇹' },
  { prefix: '+55', code: 'BR', name: 'Brazil', currency: 'BRL', flag: '🇧🇷' },
  { prefix: '+7', code: 'RU', name: 'Russia', currency: 'RUB', flag: '🇷🇺' },
  { prefix: '+91', code: 'IN', name: 'India', currency: 'INR', flag: '🇮🇳' },
  {
    prefix: '+82',
    code: 'KR',
    name: 'South Korea',
    currency: 'KRW',
    flag: '🇰🇷',
  },
  { prefix: '+34', code: 'ES', name: 'Spain', currency: 'EUR', flag: '🇪🇸' },
  { prefix: '+61', code: 'AU', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
];
// [
//   { prefix: '+225', code: 'CI', name: 'Côte d’Ivoire' },
//   { prefix: '+229', code: 'BJ', name: 'Benin' },
//   { prefix: '+226', code: 'BF', name: 'Burkina Faso' },
//   { prefix: '+223', code: 'ML', name: 'Mali' },
//   { prefix: '+227', code: 'NE', name: 'Niger' },
//   { prefix: '+228', code: 'TG', name: 'Togo' },
//   { prefix: '+221', code: 'SN', name: 'Senegal' },
//   { prefix: '+220', code: 'GM', name: 'Gambia' },
//   { prefix: '+231', code: 'LR', name: 'Liberia' },
//   { prefix: '+232', code: 'SL', name: 'Sierra Leone' },
//   { prefix: '+224', code: 'GN', name: 'Guinea' },
//   { prefix: '+245', code: 'GW', name: 'Guinea-Bissau' },
//   { prefix: '+234', code: 'NG', name: 'Nigeria' },
//   { prefix: '+238', code: 'CV', name: 'Cabo Verde' },
//   { prefix: '+222', code: 'MR', name: 'Mauritania' },

//   { prefix: '+1', code: 'US', name: 'United States' },
//   { prefix: '+1', code: 'CA', name: 'Canada' },
//   { prefix: '+86', code: 'CN', name: 'China' },
//   { prefix: '+81', code: 'JP', name: 'Japan' },
//   { prefix: '+49', code: 'DE', name: 'Germany' },
//   { prefix: '+44', code: 'GB', name: 'United Kingdom' },
//   { prefix: '+33', code: 'FR', name: 'France' },
//   { prefix: '+39', code: 'IT', name: 'Italy' },
//   { prefix: '+55', code: 'BR', name: 'Brazil' },
//   { prefix: '+7', code: 'RU', name: 'Russia' },
//   { prefix: '+91', code: 'IN', name: 'India' },
//   { prefix: '+82', code: 'KR', name: 'South Korea' },
//   { prefix: '+34', code: 'ES', name: 'Spain' },
//   { prefix: '+61', code: 'AU', name: 'Australia' },
// ];
