import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

interface ReceiveScreenProps {
  navigation: any;
}

const ReceiveScreen: React.FC<ReceiveScreenProps> = ({ navigation }) => {
  const { user } = useAuth();

  const handleCopy = () => {
    // Could use Clipboard API here
    Alert.alert("Copied", "Your user ID has been copied to clipboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Receive Money</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Your Account ID:</Text>
        <Text style={styles.userId}>{user?.id}</Text>

        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
          <Text style={styles.copyText}>Copy</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.info}>
        Share your Account ID with anyone to receive money instantly.
      </Text>
    </SafeAreaView>
  );
};

export default ReceiveScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  label: { fontSize: 16, color: "#555" },
  userId: { fontSize: 22, fontWeight: "700", marginVertical: 10 },
  copyBtn: {
    backgroundColor: "#007bff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  copyText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  info: { fontSize: 16, color: "#555", textAlign: "center" },
});
