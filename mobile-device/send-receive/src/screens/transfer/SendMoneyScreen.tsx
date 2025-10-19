// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { useBeneficiaries } from "../../hooks/useBeneficiaries";
// import { useCurrencyConverter } from "../../hooks/useCurrencyConverter";
// import { useTransfers } from "../../hooks/useTransfers";

// interface SendMoneyScreenProps {
//   navigation: any;
// }

// const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({ navigation }) => {
//   const { beneficiaries } = useBeneficiaries();
//   const { convert } = useCurrencyConverter();
//   const { sendMoney } = useTransfers();

//   const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<
//     number | null
//   >(null);
//   const [amount, setAmount] = useState<string>("");
//   const [currency, setCurrency] = useState<string>("USD");
//   const [convertedAmount, setConvertedAmount] = useState<number>(0);

//   useEffect(() => {
//     if (amount && currency && selectedBeneficiaryId) {
//       const beneficiary = beneficiaries.find(
//         (b) => b.id === selectedBeneficiaryId
//       );
//       if (beneficiary) {
//         const result = convert(
//           parseFloat(amount),
//           currency,
//           beneficiary.country
//         );
//         setConvertedAmount(result);
//       }
//     }
//   }, [amount, currency, selectedBeneficiaryId, beneficiaries]);

//   const handleSend = async () => {
//     if (!selectedBeneficiaryId || !amount) {
//       Alert.alert("Error", "Please select a beneficiary and enter an amount");
//       return;
//     }
//     try {
//       const beneficiary = beneficiaries.find(
//         (b) => b.id === selectedBeneficiaryId
//       );
//       // Replace with actual user ID retrieval logic as needed
//       const fromUserId = 1; // TODO: Replace with actual logged-in user ID
//       await sendMoney({
//         beneficiaryId: selectedBeneficiaryId,
//         amount: parseFloat(amount),
//         currency,
//         fromUserId,
//         recipientName: beneficiary?.name || "",
//       });
//       Alert.alert("Success", "Money sent successfully!");
//       navigation.goBack();
//     } catch (err: any) {
//       Alert.alert("Transfer failed", err.message || "Try again");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.header}>Send Money</Text>

//         {/* Beneficiary selection */}
//         <Text style={styles.label}>Select Beneficiary</Text>
//         {beneficiaries.map((b) => (
//           <TouchableOpacity
//             key={b.id}
//             style={[
//               styles.beneficiaryBtn,
//               selectedBeneficiaryId === b.id && styles.beneficiarySelected,
//             ]}
//             onPress={() => setSelectedBeneficiaryId(b.id)}
//           >
//             <Text style={styles.beneficiaryText}>
//               {b.name} ({b.phone})
//             </Text>
//           </TouchableOpacity>
//         ))}

//         {/* Amount input */}
//         <Text style={styles.label}>Amount ({currency})</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="0.00"
//           keyboardType="numeric"
//           value={amount}
//           onChangeText={setAmount}
//         />

//         {/* Converted amount */}
//         {selectedBeneficiaryId && (
//           <Text style={styles.converted}>
//             Recipient will receive: {convertedAmount.toFixed(2)}{" "}
//             {beneficiaries.find((b) => b.id === selectedBeneficiaryId)?.country}
//           </Text>
//         )}

//         <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
//           <Text style={styles.sendText}>Send Money</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SendMoneyScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8f9fa" },
//   scrollContainer: { padding: 20 },
//   header: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
//   label: { fontSize: 16, fontWeight: "600", marginTop: 15 },
//   beneficiaryBtn: {
//     padding: 15,
//     borderRadius: 12,
//     backgroundColor: "#fff",
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   beneficiarySelected: { borderColor: "#007bff", backgroundColor: "#e6f0ff" },
//   beneficiaryText: { fontSize: 16 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 12,
//     padding: 15,
//     marginTop: 10,
//     backgroundColor: "#fff",
//     fontSize: 16,
//   },
//   converted: { fontSize: 16, color: "#555", marginTop: 10 },
//   sendBtn: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 30,
//   },
//   sendText: { color: "#fff", fontWeight: "700", fontSize: 16 },
// });
