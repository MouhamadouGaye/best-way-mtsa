// src/components/common/Loading.tsx
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

interface LoadingProps {
  message?: string;
  size?: "small" | "large";
}

export const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  size = "large",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#2563eb" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
});
