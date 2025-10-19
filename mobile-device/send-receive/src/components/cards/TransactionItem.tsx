// src/components/cards/TransactionItem.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TransactionItemProps {
  transaction: {
    id: number;
    recipientName: string;
    amount: number;
    currency: string;
    date: string;
    status: string;
  };
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => (
  <View style={styles.item}>
    <View>
      <Text style={styles.name}>{transaction.recipientName}</Text>
      <Text style={styles.date}>
        {new Date(transaction.date).toLocaleDateString()}
      </Text>
    </View>
    <Text
      style={[
        styles.amount,
        transaction.status === "FAILED" && { color: "red" },
      ]}
    >
      {transaction.amount.toFixed(2)} {transaction.currency}
    </Text>
  </View>
);

export default TransactionItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  name: { fontWeight: "700", fontSize: 16 },
  date: { color: "#555", fontSize: 12 },
  amount: { fontWeight: "700", fontSize: 16 },
});
