// src/components/cards/RecipientCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface RecipientCardProps {
  recipient: {
    name: string;
    email: string;
    country: string;
  };
}

export const RecipientCard: React.FC<RecipientCardProps> = ({ recipient }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{recipient.name}</Text>
    <Text style={styles.info}>{recipient.email}</Text>
    <Text style={styles.info}>{recipient.country}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
  },
  name: { fontWeight: "700", fontSize: 16 },
  info: { color: "#555" },
});
