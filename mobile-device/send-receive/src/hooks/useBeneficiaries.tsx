// import { useState, useEffect } from "react";
// import { api } from "../api/clients";
// import { Alert } from "react-native";

// interface Beneficiary {
//   id: number;
//   name?: string;
//   country?: string;
//   email?: string;
//   phone?: string;
// }

// export const useBeneficiaries = () => {
//   const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchBeneficiaries = async () => {
//     try {
//       setLoading(true);
//       const data = await api.get<Beneficiary[]>("/beneficiaries");
//       setBeneficiaries(data);
//     } catch (error: any) {
//       Alert.alert("Error", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addBeneficiary = async (beneficiary: Omit<Beneficiary, "id">) => {
//     try {
//       const newBeneficiary = await api.post<Beneficiary>(
//         "/beneficiaries",
//         beneficiary
//       );
//       console.log("New Beneficiary: ", newBeneficiary);
//       setBeneficiaries((prev) => [...prev, newBeneficiary]);
//       console.log("Data from the useBeneficairies: ", newBeneficiary);
//     } catch (error: any) {
//       Alert.alert("Error", error.message);
//     }
//   };

//   const removeBeneficiary = async (id: number) => {
//     try {
//       await api.delete(`/beneficiaries/${id}`);
//       setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
//     } catch (error: any) {
//       Alert.alert("Error", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchBeneficiaries();
//   }, []);

//   return {
//     beneficiaries,
//     loading,
//     addBeneficiary,
//     removeBeneficiary,
//     fetchBeneficiaries,
//   };
// };
import { useState, useEffect } from "react";
import { api } from "../api/clients";
import { Alert } from "react-native";

interface Beneficiary {
  id: number;
  fullName: string;
  email?: string;
  phoneNumber: string;
  countryCode?: string;
  countryName?: string;
  currency?: string;
  currencySymbol?: string;
}

export const useBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      console.log("Fetching beneficiaries...");
      const data = await api.get<Beneficiary[]>("/beneficiaries");
      console.log("Fetched beneficiaries:", data);
      setBeneficiaries(data);
    } catch (error: any) {
      console.error("Error fetching beneficiaries:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      console.log("🔐 Checking session validity...");
      const userData = await api.get("/users/me");
      console.log("✅ Session valid, user:", userData);
      return true;
    } catch (error: any) {
      console.log("❌ Session invalid:", error.message);
      return false;
    }
  };

  // const addBeneficiary = async (beneficiary: Omit<Beneficiary, "id">) => {
  //   try {
  //     console.log("Adding beneficiary:", beneficiary);

  //     // Make sure the field names match what backend expects
  //     const beneficiaryData = {
  //       fullName: beneficiary.fullName,
  //       email: beneficiary.email || null,
  //       phoneNumber: beneficiary.phoneNumber,
  //     };

  //     const newBeneficiary = await api.post<Beneficiary>(
  //       "/beneficiaries",
  //       beneficiaryData
  //     );

  //     console.log("New Beneficiary created:", newBeneficiary);
  //     setBeneficiaries((prev) => [...prev, newBeneficiary]);

  //     Alert.alert("Success", "Beneficiary added successfully!");
  //     return newBeneficiary;
  //   } catch (error: any) {
  //     console.error("Error adding beneficiary:", error);
  //     Alert.alert("Error", error.message);
  //     throw error; // Re-throw to handle in component
  //   }
  // };

  // Update your addBeneficiary function:
  const addBeneficiary = async (beneficiary: Omit<Beneficiary, "id">) => {
    console.log(
      "------------------------addBeneficiary in useBeneficiaries----------------------------"
    );
    try {
      // Check session first
      const hasValidSession = await checkSession();
      if (!hasValidSession) {
        throw new Error("Your session has expired. Please log in again.");
      }

      console.log("➕ Adding beneficiary:", beneficiary);

      const newBeneficiary = await api.post<Beneficiary>(
        "/beneficiaries",
        beneficiary
      );

      console.log("✅ New Beneficiary created:", newBeneficiary);
      setBeneficiaries((prev) => [...prev, newBeneficiary]);

      Alert.alert("Success", "Beneficiary added successfully!");
      return newBeneficiary;
    } catch (error: any) {
      console.error("❌ Error adding beneficiary:", error);
      Alert.alert("Error", error.message);
      throw error;
    }
  };

  const removeBeneficiary = async (id: number) => {
    try {
      await api.delete(`/beneficiaries/${id}`);
      setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
      Alert.alert("Success", "Beneficiary removed successfully!");
    } catch (error: any) {
      console.error("Error removing beneficiary:", error);
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
    checkSession,
  };
};
