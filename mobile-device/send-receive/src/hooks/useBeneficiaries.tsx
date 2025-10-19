// import { useState, useEffect, useCallback } from "react";
// import { API_URL } from "../utils/constants";

// interface Beneficiary {
//   id: string;
//   name: string;
//   accountNumber: string;
//   bankName: string;
//   country: string;
//   currency: string;
// }

// export function useBeneficiaries(token?: string) {
//   const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchBeneficiaries = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);
//     const res = await fetch(`${API_URL}/beneficiaries`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setBeneficiaries(data);
//     setLoading(false);
//   }, [token]);

//   const addBeneficiary = useCallback(
//     async (beneficiary: Omit<Beneficiary, "id">) => {
//       if (!token) throw new Error("Not authenticated");
//       const res = await fetch(`${API_URL}/beneficiaries`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(beneficiary),
//       });
//       const newB = await res.json();
//       setBeneficiaries((prev) => [...prev, newB]);
//     },
//     [token]
//   );

//   const removeBeneficiary = useCallback(
//     async (id: string) => {
//       if (!token) throw new Error("Not authenticated");
//       await fetch(`${API_URL}/beneficiaries/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
//     },
//     [token]
//   );

//   useEffect(() => {
//     fetchBeneficiaries();
//   }, [fetchBeneficiaries]);

//   return {
//     beneficiaries,
//     addBeneficiary,
//     removeBeneficiary,
//     loading,
//     refresh: fetchBeneficiaries,
//   };
// }

import { useState, useEffect } from "react";
import { api } from "../api/clients";
import { Alert } from "react-native";

interface Beneficiary {
  id: number;
  name: string;
  country: string;
  email?: string;
  phone?: string;
}

export const useBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const data = await api.get<Beneficiary[]>("/beneficiaries");
      setBeneficiaries(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const addBeneficiary = async (beneficiary: Omit<Beneficiary, "id">) => {
    try {
      const newBeneficiary = await api.post<Beneficiary>(
        "/beneficiaries",
        beneficiary
      );
      setBeneficiaries((prev) => [...prev, newBeneficiary]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const removeBeneficiary = async (id: number) => {
    try {
      await api.delete(`/beneficiaries/${id}`);
      setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  return {
    beneficiaries,
    loading,
    addBeneficiary,
    removeBeneficiary,
    fetchBeneficiaries,
  };
};
