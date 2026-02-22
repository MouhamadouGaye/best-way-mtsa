// src/components/cards/BalanceCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BalanceCardProps {
  balance: number;
  currency: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  currency,
}) => (
  <View style={styles.card}>
    <Text style={styles.label}>Available Balance</Text>
    <Text style={styles.amount}>
      {balance.toFixed(2)} {currency}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#007bff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
  },
  label: { color: "#fff", fontSize: 16, marginBottom: 8 },
  amount: { color: "#fff", fontSize: 24, fontWeight: "700" },
});
