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
export const rates: any = {
  USD: 1,
  EUR: 0.91,
  GBP: 0.78,
  JPY: 145.2,
  CAD: 1.36,
  XOF: 625.95,
};

export const countryPrefixes: { prefix: string; code: string; name: string }[] =
  [
    { prefix: '+225', code: 'CI', name: 'Côte d’Ivoire' },
    { prefix: '+229', code: 'BJ', name: 'Benin' },
    { prefix: '+226', code: 'BF', name: 'Burkina Faso' },
    { prefix: '+223', code: 'ML', name: 'Mali' },
    { prefix: '+227', code: 'NE', name: 'Niger' },
    { prefix: '+228', code: 'TG', name: 'Togo' },
    { prefix: '+221', code: 'SN', name: 'Senegal' },
    { prefix: '+220', code: 'GM', name: 'Gambia' },
    { prefix: '+231', code: 'LR', name: 'Liberia' },
    { prefix: '+232', code: 'SL', name: 'Sierra Leone' },
    { prefix: '+224', code: 'GN', name: 'Guinea' },
    { prefix: '+245', code: 'GW', name: 'Guinea-Bissau' },
    { prefix: '+234', code: 'NG', name: 'Nigeria' },
    { prefix: '+238', code: 'CV', name: 'Cabo Verde' },
    { prefix: '+222', code: 'MR', name: 'Mauritania' },

    { prefix: '+1', code: 'US', name: 'United States' },
    { prefix: '+1', code: 'CA', name: 'Canada' },
    { prefix: '+86', code: 'CN', name: 'China' },
    { prefix: '+81', code: 'JP', name: 'Japan' },
    { prefix: '+49', code: 'DE', name: 'Germany' },
    { prefix: '+44', code: 'GB', name: 'United Kingdom' },
    { prefix: '+33', code: 'FR', name: 'France' },
    { prefix: '+39', code: 'IT', name: 'Italy' },
    { prefix: '+55', code: 'BR', name: 'Brazil' },
    { prefix: '+7', code: 'RU', name: 'Russia' },
    { prefix: '+91', code: 'IN', name: 'India' },
    { prefix: '+82', code: 'KR', name: 'South Korea' },
    { prefix: '+34', code: 'ES', name: 'Spain' },
    { prefix: '+61', code: 'AU', name: 'Australia' },
  ];
