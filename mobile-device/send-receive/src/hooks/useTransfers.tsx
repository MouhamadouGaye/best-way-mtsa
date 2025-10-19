// import { useState, useCallback } from "react";
// import { API_URL } from "../utils/constants";

// interface TransferPayload {
//   amount: number;
//   currencyFrom: string;
//   currencyTo: string;
//   beneficiaryId: string;
//   description?: string;
// }

// interface TransferResponse {
//   id: string;
//   status: "PENDING" | "COMPLETED" | "FAILED";
//   transactionRef: string;
//   timestamp: string;
// }

// export function useTransfer(token?: string) {
//   const [loading, setLoading] = useState(false);
//   const [lastTransfer, setLastTransfer] = useState<TransferResponse | null>(
//     null
//   );

//   const initiateTransfer = useCallback(
//     async (payload: TransferPayload) => {
//       if (!token) throw new Error("Not authenticated");
//       setLoading(true);
//       const res = await fetch(`${API_URL}/transfers`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       setLastTransfer(data);
//       setLoading(false);
//       return data;
//     },
//     [token]
//   );

//   return { initiateTransfer, lastTransfer, loading };
// }

// src/hooks/useTransfers.ts
import { useState } from "react";
import { transferService } from "../api/transferService";

interface TransferRequest {
  fromUserId: number;
  amount: number;
  currency: string;
  beneficiaryId: number;
  recipientName: string;
  fromCard: boolean;
}

export const useTransfers = () => {
  const [loading, setLoading] = useState(false);

  const sendMoney = async (request: TransferRequest) => {
    setLoading(true);
    try {
      // Convert to match your backend DTO structure.
      // Include senderId, currency and currencyTo which are required by the service's TransferRequest type.
      const transferRequest = {
        senderId: request.fromUserId,
        beneficiaryId: request.beneficiaryId,
        amount: request.amount,
        currency: request.currency,
        // If you have a different target currency, pass it here; otherwise use the same currency.
        currencyTo: request.currency,
        fromCard: request.fromCard,
        recipientName: request.recipientName,
      };

      const response = await transferService.create(transferRequest);
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const getTransfers = async () => {
    try {
      const response = await transferService.getAll();
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch transfers");
    }
  };

  return {
    sendMoney,
    getTransfers,
    loading,
  };
};
