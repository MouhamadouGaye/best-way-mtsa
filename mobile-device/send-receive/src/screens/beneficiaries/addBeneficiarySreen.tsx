// ============= ADD BENEFICIARY SCREEN =============
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useBeneficiaries } from "../../hooks/useBeneficiaries";

const AddBeneficiaryScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { addBeneficiary } = useBeneficiaries();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = async () => {
    if (!name || !country) {
      Alert.alert("Error", "Please provide name and country");
      return;
    }
    await addBeneficiary({ name, country, email, phone });
    Alert.alert("Success", "Beneficiary added!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Beneficiary</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />

      <TextInput
        style={styles.input}
        placeholder="Email (optional)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone (optional)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addText}>Add Beneficiary</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddBeneficiaryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  addBtn: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  addText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
