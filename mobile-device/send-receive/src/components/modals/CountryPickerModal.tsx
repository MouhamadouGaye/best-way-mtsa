import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { COUNTRIES_CURRENCIES } from "../../config/countries";

interface CountryPickerModalProps {
  beneficiaries?: any[];
  visible?: boolean;
  onSelect: (item: any) => void;
  onClose?: () => void;
}

export const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
  beneficiaries,
  visible = true,
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState("");

  const list = beneficiaries || COUNTRIES_CURRENCIES;
  const filtered = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.header}>
            {beneficiaries ? "Select Beneficiary" : "Select Country"}
          </Text>

          <TextInput
            style={styles.search}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code || item.id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect(item);
                  onClose?.();
                }}
              >
                <Text style={styles.flag}>{item.flag || "🏳️"}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Text style={styles.subText}>
                    {item.currency || item.email || ""}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  flag: { fontSize: 24, marginRight: 10 },
  itemText: { fontSize: 16, fontWeight: "500" },
  subText: { fontSize: 13, color: "#888" },
  closeBtn: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "600" },
});
