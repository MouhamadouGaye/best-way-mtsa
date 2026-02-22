// src/hooks/useCurrencyConverter.ts
import { useCallback } from "react";

// More comprehensive conversion rates
const conversionRates: { [key: string]: number } = {
  // Major currencies
  USD: 1,
  EUR: 0.86,
  GBP: 0.73,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110.0,
  CHF: 0.92,

  // African currencies
  NGN: 1500, // Nigerian Naira
  KES: 150, // Kenyan Shilling
  GHS: 15, // Ghanaian Cedi
  ZAR: 18, // South African Rand
  EGP: 30, // Egyptian Pound
  XOF: 562, // West African CFA
  XAF: 600, // Central African CFA

  // Asian currencies
  INR: 75, // Indian Rupee
  CNY: 6.5, // Chinese Yuan
  SGD: 1.35, // Singapore Dollar
};

export const useCurrencyConverter = () => {
  const convert = useCallback(
    (amount: number, fromCurrency: string, toCurrency: string): number => {
      if (amount === 0) return 0;

      // If same currency, return same amount
      if (fromCurrency === toCurrency) return amount;

      const fromRate = conversionRates[fromCurrency] || 1;
      const toRate = conversionRates[toCurrency] || 1;

      // Convert to USD first, then to target currency
      const amountInUSD = amount / fromRate; //ex: 10 euro -> 10/0.85 = 11.63 USD
      const convertedAmount = amountInUSD * toRate; // 11.63 *  562  = 6536 XOF

      return Number(convertedAmount.toFixed(2));
    },
    []
  );

  const getConversionRate = useCallback(
    (fromCurrency: string, toCurrency: string): number => {
      if (fromCurrency === toCurrency) return 1;

      const fromRate = conversionRates[fromCurrency] || 1;
      const toRate = conversionRates[toCurrency] || 1;

      return toRate / fromRate; // france to senegal= 563/0.85 = 655 euros
    },
    []
  );

  const getAvailableCurrencies = useCallback(() => {
    return Object.keys(conversionRates);
  }, []);

  return {
    convert,
    getConversionRate,
    getAvailableCurrencies,
  };
};
