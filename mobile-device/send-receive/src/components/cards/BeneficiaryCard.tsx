// src/components/cards/BeneficiaryCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BeneficiaryCardProps {
  beneficiary: {
    name: string;
    country: string;
    email?: string;
    phone?: string;
  };
}

export const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({
  beneficiary,
}) => (
  <View style={styles.card}>
    <Text style={styles.name}>{beneficiary.name}</Text>
    <Text style={styles.info}>{beneficiary.country}</Text>
    {beneficiary.email && <Text style={styles.info}>{beneficiary.email}</Text>}
    {beneficiary.phone && <Text style={styles.info}>{beneficiary.phone}</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  info: { fontSize: 14, color: "#555" },
});
