import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { authService } from "../../api/authService";

const VerifyEmailScreen = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL parameters
        const token =
          route.params?.token ||
          new URLSearchParams(window.location.search).get("token");

        if (!token) {
          setMessage("Invalid verification link");
          setLoading(false);
          return;
        }

        console.log("Verifying email with token:", token);

        // Call the backend to verify the email
        const response = await authService.verifyEmail(token);

        setMessage(response.message || "Email verified successfully!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigation.navigate("login");
        }, 3000);
      } catch (error: any) {
        console.error("Email verification error:", error);
        setMessage(error.message || "Email verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [navigation, route.params]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Verifying your email...</Text>
        </View>
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.redirectText}>Redirecting to login page...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4b5563",
  },
  messageContainer: {
    alignItems: "center",
    padding: 20,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    color: "#1f2937",
    marginBottom: 16,
  },
  redirectText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default VerifyEmailScreen;
