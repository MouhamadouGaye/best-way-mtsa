// import React, { useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   SafeAreaView,
//   StatusBar,
// } from "react-native";
// import { useTransfers } from "../../hooks/useTransfers";
// import TransactionItem from "../../components/cards/TransactionItem";

// interface HistoryScreenProps {
//   navigation: any;
// }

// const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
//   const { sendMoney, getTransfers, loading } = useTransfers();

//   const transfers = getTransfers;

//   useEffect(() => {
//     getTransfers();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
//       <Text style={styles.header}>Transaction History</Text>

//       {loading ? (
//         <Text style={styles.loading}>Loading...</Text>
//       ) : transfers.length === 0 ? (
//         <Text style={styles.empty}>No transactions found.</Text>
//       ) : (
//         <FlatList
//           data={transfers}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => <TransactionItem transaction={item} />}
//           contentContainerStyle={{ paddingBottom: 50 }}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default HistoryScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8f9fa", paddingHorizontal: 20 },
//   header: { fontSize: 24, fontWeight: "700", marginVertical: 20 },
//   loading: { fontSize: 16, color: "#555", textAlign: "center", marginTop: 20 },
//   empty: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 20 },
// });
