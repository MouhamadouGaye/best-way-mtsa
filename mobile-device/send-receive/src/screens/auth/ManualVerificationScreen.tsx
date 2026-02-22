// ManualVerificationScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { authService } from "../../api/authService";

const ManualVerificationScreen = ({ navigation, route }: any) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const registeredEmail = route.params?.email || "";

  const handleVerify = async () => {
    if (!token.trim()) {
      Alert.alert("Error", "Please enter the verification token");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyEmail(token);
      Alert.alert(
        "Success",
        response.message || "Email verified successfully!"
      );
      navigation.navigate("login");
    } catch (error: any) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) {
      Alert.alert("Error", "No email address found");
      return;
    }

    try {
      await authService.resendVerificationEmail(registeredEmail);
      Alert.alert("Success", "Verification email resent!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Email Verification</Text>

      <Text style={styles.subtitle}>
        For testing - Check your email for the verification token
      </Text>

      {registeredEmail ? (
        <Text style={styles.emailText}>
          Email: <Text style={styles.emailHighlight}>{registeredEmail}</Text>
        </Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Paste verification token here"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#9ca3af"
      />

      <TouchableOpacity
        style={[
          styles.button,
          styles.primaryButton,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify Email"}
        </Text>
      </TouchableOpacity>

      {registeredEmail && (
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleResend}
        >
          <Text style={styles.secondaryButtonText}>
            Resend Verification Email
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.tertiaryButton]}
        onPress={() => navigation.navigate("login")}
      >
        <Text style={styles.tertiaryButtonText}>Back to Login</Text>
      </TouchableOpacity>

      <Text style={styles.helpText}>
        💡 How to test:
        {"\n"}1. Check your email for the verification link
        {"\n"}2. Copy the token from the URL (after ?token=)
        {"\n"}3. Paste it here and click Verify
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  emailText: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 16,
  },
  emailHighlight: {
    fontWeight: "bold",
    color: "#667eea",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    color: "#1f2937",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#667eea",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#667eea",
  },
  tertiaryButton: {
    backgroundColor: "transparent",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
  },
  tertiaryButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },
  helpText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 32,
    lineHeight: 20,
  },
});

export default ManualVerificationScreen;
