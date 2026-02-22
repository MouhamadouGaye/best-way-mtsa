// // src/context/TransferContext.tsx
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
//   useCallback,
//   ReactNode,
// } from "react";
// import { Alert } from "react-native";
// import { useCurrencyConverter } from "../hooks/useCurrencyConverter";
// import { useTransfers } from "../hooks/useTransfers";
// import { useAuth } from "./AuthContext";

// interface TransferContextType {
//   // Amount states
//   amount: string;
//   setAmount: (amount: string) => void;
//   convertedAmount: string;
//   setConvertedAmount: (amount: string) => void;

//   // Currency states
//   fromCurrency: string;
//   toCurrency: string;
//   setFromCurrency: (currency: string) => void;
//   setToCurrency: (currency: string) => void;

//   // Conversion
//   conversionRate: number;
//   isConvertingFromMain: boolean;

//   // Actions
//   sendMoney: (
//     beneficiaryId: number,
//     amount: number,
//     currency: string,
//     recipientName: string,
//     fromCard?: boolean
//   ) => Promise<void>;
//   updateBeneficiaryCurrency: (currency: string) => void;

//   // State
//   loading: boolean;
// }

// const TransferContext = createContext<TransferContextType>({
//   amount: "",
//   setAmount: () => {},
//   convertedAmount: "",
//   setConvertedAmount: () => {},
//   fromCurrency: "USD",
//   toCurrency: "USD",
//   setFromCurrency: () => {},
//   setToCurrency: () => {},
//   conversionRate: 1,
//   isConvertingFromMain: true,
//   sendMoney: async () => {},
//   updateBeneficiaryCurrency: () => {},
//   loading: false,
// });

// export function TransferProvider({ children }: { children: ReactNode }) {
//   const { user } = useAuth();
//   const [amount, setAmount] = useState<string>("");
//   const [convertedAmount, setConvertedAmount] = useState<string>("");
//   const [fromCurrency, setFromCurrency] = useState<string>("USD");
//   const [toCurrency, setToCurrency] = useState<string>("USD");
//   const [isConvertingFromMain, setIsConvertingFromMain] =
//     useState<boolean>(true);
//   const [conversionRate, setConversionRate] = useState<number>(1);

//   const { convert, getConversionRate } = useCurrencyConverter();
//   const { sendMoney: sendMoneyApi, loading } = useTransfers();

//   // Sync fromCurrency when user changes
//   useEffect(() => {
//     if (user?.currency) {
//       setFromCurrency(user.currency);
//     }
//   }, [user]);

//   // Update conversion rate when currencies change
//   useEffect(() => {
//     const rate = getConversionRate(fromCurrency, toCurrency);
//     setConversionRate(rate);
//   }, [fromCurrency, toCurrency, getConversionRate]);

//   // Convert amount when input changes
//   useEffect(() => {
//     if (amount && isConvertingFromMain) {
//       const numAmount = parseFloat(amount);
//       if (!isNaN(numAmount)) {
//         const converted = convert(numAmount, fromCurrency, toCurrency);
//         setConvertedAmount(converted.toFixed(2));
//       }
//     }
//   }, [amount, fromCurrency, toCurrency, convert, isConvertingFromMain]);

//   // Convert back when converted amount changes
//   useEffect(() => {
//     if (convertedAmount && !isConvertingFromMain) {
//       const numConverted = parseFloat(convertedAmount);
//       if (!isNaN(numConverted)) {
//         const convertedBack = convert(numConverted, toCurrency, fromCurrency);
//         setAmount(convertedBack.toFixed(2));
//       }
//     }
//   }, [
//     convertedAmount,
//     fromCurrency,
//     toCurrency,
//     convert,
//     isConvertingFromMain,
//   ]);

//   const handleSetAmount = useCallback((value: string) => {
//     // Allow only numbers and decimal point
//     const cleanedValue = value.replace(/[^0-9.]/g, "");

//     // Ensure only one decimal point
//     const parts = cleanedValue.split(".");
//     if (parts.length > 2) {
//       return;
//     }

//     setAmount(cleanedValue);
//     setIsConvertingFromMain(true);
//   }, []);

//   const handleSetConvertedAmount = useCallback((value: string) => {
//     // Allow only numbers and decimal point
//     const cleanedValue = value.replace(/[^0-9.]/g, "");

//     // Ensure only one decimal point
//     const parts = cleanedValue.split(".");
//     if (parts.length > 2) {
//       return;
//     }

//     setConvertedAmount(cleanedValue);
//     setIsConvertingFromMain(false);
//   }, []);

//   const updateBeneficiaryCurrency = useCallback((currency: string) => {
//     setToCurrency(currency);
//   }, []);

//   // Memoize sendMoney to prevent unnecessary re-renders
//   const sendMoney = useCallback(
//     async (
//       beneficiaryId: number,
//       amount: number,
//       currency: string,
//       recipientName: string,
//       fromCard: boolean = false
//     ) => {
//       try {
//         if (!user?.id) {
//           throw new Error("User not authenticated");
//         }

//         await sendMoneyApi({
//           fromUserId: user.id,
//           amount,
//           currency,
//           beneficiaryId,
//           recipientName,
//           fromCard,
//         });

//         Alert.alert("Success", "Transfer completed!");

//         // Reset amounts after successful transfer
//         setAmount("");
//         setConvertedAmount("");
//       } catch (err: any) {
//         Alert.alert("Transfer failed", err.message);
//         throw err;
//       }
//     },
//     [user?.id, sendMoneyApi]
//   );

//   const contextValue = useMemo(
//     () => ({
//       amount,
//       setAmount: handleSetAmount,
//       convertedAmount,
//       setConvertedAmount: handleSetConvertedAmount,
//       fromCurrency,
//       toCurrency,
//       setFromCurrency,
//       setToCurrency,
//       conversionRate,
//       isConvertingFromMain,
//       sendMoney,
//       updateBeneficiaryCurrency,
//       loading,
//     }),
//     [
//       amount,
//       convertedAmount,
//       fromCurrency,
//       toCurrency,
//       conversionRate,
//       isConvertingFromMain,
//       handleSetAmount,
//       handleSetConvertedAmount,
//       sendMoney,
//       updateBeneficiaryCurrency,
//       loading,
//     ]
//   );

//   return (
//     <TransferContext.Provider value={contextValue}>
//       {children}
//     </TransferContext.Provider>
//   );
// }

// export const useTransfer = () => {
//   const context = useContext(TransferContext);
//   if (!context) {
//     throw new Error("useTransfer must be used within a TransferProvider");
//   }
//   return context;
// };

// src/context/TransferContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { useCurrencyConverter } from "../hooks/useCurrencyConverter";
import { useTransfers } from "../hooks/useTransfers";
import { useAuth } from "./AuthContext";

interface TransferContextType {
  // Amount states
  amount: string;
  setAmount: (amount: string) => void;
  convertedAmount: string;
  setConvertedAmount: (amount: string) => void;

  // Currency states
  fromCurrency: string;
  toCurrency: string;
  setFromCurrency: (currency: string) => void;
  setToCurrency: (currency: string) => void;

  // Conversion
  conversionRate: number;
  isConvertingFromMain: boolean;

  // Actions
  sendMoney: (
    beneficiaryId: number,
    amount: number,
    currency: string,
    recipientName: string,
    fromCard?: boolean
  ) => Promise<void>;
  updateBeneficiaryCurrency: (currency: string, phoneNumber?: string) => void;
  detectCurrencyFromPhoneNumber: (phoneNumber: string) => string;

  // State
  loading: boolean;
}

const TransferContext = createContext<TransferContextType>(
  {} as TransferContextType
);

export function TransferProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("XOF");
  const [isConvertingFromMain, setIsConvertingFromMain] =
    useState<boolean>(true);
  const [conversionRate, setConversionRate] = useState<number>(1);

  const { convert, getConversionRate } = useCurrencyConverter();
  const { sendMoney: sendMoneyApi, loading } = useTransfers();

  // Sync fromCurrency when user changes
  useEffect(() => {
    if (user?.currency) {
      setFromCurrency(user.currency);
    }
  }, [user]);

  // Detect currency from phone number
  const detectCurrencyFromPhoneNumber = useCallback(
    (phoneNumber: string): string => {
      const countryCode = extractCountryCode(phoneNumber);

      const countryToCurrency: { [key: string]: string } = {
        // North America
        "1": "USD", // USA/Canada

        // Europe
        "44": "GBP", // UK
        "33": "EUR", // France
        "49": "EUR", // Germany
        "34": "EUR", // Spain
        "39": "EUR", // Italy

        // Africa
        "221": "XOF",
        "234": "NGN", // Nigeria
        "254": "KES", // Kenya
        "233": "GHS", // Ghana
        "27": "ZAR", // South Africa
        "20": "EGP", // Egypt

        // Asia
        "91": "INR", // India
        "86": "CNY", // China
        "81": "JPY", // Japan
        "65": "SGD", // Singapore

        // Default to USD
        default: "USD",
      };

      return countryToCurrency[countryCode] || countryToCurrency["default"];
    },
    []
  );

  // Extract country code from phone number
  const extractCountryCode = (phoneNumber: string): string => {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Common country codes
    const countryCodes = [
      "221",
      "234",
      "254",
      "233",
      "27",
      "20", // Africa
      "91",
      "86",
      "81",
      "65", // Asia
      "44",
      "33",
      "49",
      "34",
      "39", // Europe
      "1", // North America
    ];

    for (const code of countryCodes) {
      if (cleanNumber.startsWith(code)) {
        return code;
      }
    }

    // If no specific code found, check for US/Canada
    if (cleanNumber.startsWith("1")) {
      return "1";
    }

    return "default";
  };

  // Update conversion rate when currencies change
  useEffect(() => {
    const rate = getConversionRate(fromCurrency, toCurrency);
    setConversionRate(rate);
  }, [fromCurrency, toCurrency, getConversionRate]);

  // Convert amount when input changes
  useEffect(() => {
    if (amount && isConvertingFromMain) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        const converted = convert(numAmount, fromCurrency, toCurrency);
        setConvertedAmount(converted.toFixed(2));
      }
    }
  }, [amount, fromCurrency, toCurrency, convert, isConvertingFromMain]);

  // Convert back when converted amount changes
  useEffect(() => {
    if (convertedAmount && !isConvertingFromMain) {
      const numConverted = parseFloat(convertedAmount);
      if (!isNaN(numConverted)) {
        const convertedBack = convert(numConverted, toCurrency, fromCurrency);
        setAmount(convertedBack.toFixed(2));
      }
    }
  }, [
    convertedAmount,
    fromCurrency,
    toCurrency,
    convert,
    isConvertingFromMain,
  ]);

  const handleSetAmount = useCallback((value: string) => {
    const cleanedValue = value.replace(/[^0-9.]/g, "");
    const parts = cleanedValue.split(".");
    if (parts.length > 2) return;

    setAmount(cleanedValue);
    setIsConvertingFromMain(true);
  }, []);

  const handleSetConvertedAmount = useCallback((value: string) => {
    // Removes all characters except digits (0–9) and decimal points (.)
    const cleanedValue = value.replace(/[^0-9.]/g, "");
    const parts = cleanedValue.split(".");
    if (parts.length > 2) return;

    setConvertedAmount(cleanedValue);
    setIsConvertingFromMain(false);
  }, []);

  const updateBeneficiaryCurrency = useCallback(
    (currency: string, phoneNumber?: string) => {
      if (phoneNumber && !currency) {
        // Auto-detect currency from phone number if no currency provided
        const detectedCurrency = detectCurrencyFromPhoneNumber(phoneNumber);
        setToCurrency(detectedCurrency);
      } else {
        setToCurrency(currency || "USD");
      }
    },
    [detectCurrencyFromPhoneNumber]
  );

  // Memoize sendMoney to prevent unnecessary re-renders
  const sendMoney = useCallback(
    async (
      beneficiaryId: number,
      amount: number,
      currency: string,
      recipientName: string,
      fromCard: boolean = false
    ) => {
      try {
        if (!user?.id) {
          throw new Error("User not authenticated");
        }

        await sendMoneyApi({
          fromUserId: user.id,
          amount,
          currency,
          beneficiaryId,
          recipientName,
          fromCard,
        });

        Alert.alert("Success", "Transfer completed!");

        // Reset amounts after successful transfer
        setAmount("");
        setConvertedAmount("");
      } catch (err: any) {
        Alert.alert("Transfer failed", err.message);
        throw err;
      }
    },
    [user?.id, sendMoneyApi]
  );

  const contextValue = useMemo(
    () => ({
      amount,
      setAmount: handleSetAmount,
      convertedAmount,
      setConvertedAmount: handleSetConvertedAmount,
      fromCurrency,
      toCurrency,
      setFromCurrency,
      setToCurrency,
      conversionRate,
      isConvertingFromMain,
      sendMoney,
      updateBeneficiaryCurrency,
      detectCurrencyFromPhoneNumber,
      loading,
    }),
    [
      amount,
      convertedAmount,
      fromCurrency,
      toCurrency,
      conversionRate,
      isConvertingFromMain,
      handleSetAmount,
      handleSetConvertedAmount,
      sendMoney,
      updateBeneficiaryCurrency,
      detectCurrencyFromPhoneNumber,
      loading,
    ]
  );

  return (
    <TransferContext.Provider value={contextValue}>
      {children}
    </TransferContext.Provider>
  );
}

export const useTransfer = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error("useTransfer must be used within a TransferProvider");
  }
  return context;
};
