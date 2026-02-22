// src/components/modals/AddBeneficiaryModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Input } from "../common/Input";
import { Button } from "../common/Buttons";
import { Card } from "../common/Card";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import { Beneficiary, beneficiaryService } from "../../api/beneficiaryService";
import { authService } from "../../api/authService";
import { useBeneficiaries } from "../../hooks/useBeneficiaries";

interface AddBeneficiaryModalProps {
  visible: boolean;
  onClose: () => void;
  onBeneficiaryAdded: () => void;
  navigation: any;
}

interface CountryCode {
  code: string;
  name: string;
  flag: string;
  prefix: string;
}

const AddBeneficiaryModal: React.FC<AddBeneficiaryModalProps> = ({
  visible,
  onClose,
  onBeneficiaryAdded,
  navigation,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(
    null
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const { addBeneficiary, loading: apiLoading } = useBeneficiaries();

  // Common country codes
  const countryCodes: CountryCode[] = [
    { code: "SN", name: "Senegal", flag: "🇸🇳", prefix: "+221" },
    { code: "US", name: "United States", flag: "🇺🇸", prefix: "+1" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", prefix: "+44" },
    { code: "FR", name: "France", flag: "🇫🇷", prefix: "+33" },
    { code: "NG", name: "Nigeria", flag: "🇳🇬", prefix: "+234" },
    { code: "KE", name: "Kenya", flag: "🇰🇪", prefix: "+254" },
    { code: "GH", name: "Ghana", flag: "🇬🇭", prefix: "+233" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦", prefix: "+27" },
    { code: "EG", name: "Egypt", flag: "🇪🇬", prefix: "+20" },
    { code: "IN", name: "India", flag: "🇮🇳", prefix: "+91" },
    { code: "CN", name: "China", flag: "🇨🇳", prefix: "+86" },
  ];

  useEffect(() => {
    if (visible) {
      // Set default country to Senegal
      setSelectedCountry(countryCodes[0]);
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
    });
    setErrors({
      fullName: "",
      phoneNumber: "",
      email: "",
    });
  };

  const validateForm = (): boolean => {
    const newErrors = {
      fullName: "",
      phoneNumber: "",
      email: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.phoneNumber && !newErrors.email;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
  };

  // const handleSubmit = async () => {
  //   if (!validateForm()) return;
  //   if (!selectedCountry) {
  //     Alert.alert("Error", "Please select a country");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const fullPhoneNumber = `${selectedCountry.prefix}${formData.phoneNumber}`;

  //     await beneficiaryService.create({
  //       fullName: formData.fullName.trim(),
  //       email: formData.email.trim(),
  //       phoneNumber: fullPhoneNumber,
  //     });

  //     console.log("Beneficiary created successfully");

  //     Alert.alert("Success", "Beneficiary added successfully!");
  //     resetForm();
  //     onBeneficiaryAdded();
  //     onClose();
  //   } catch (error: any) {
  //     Alert.alert("Error", error.message || "Failed to add beneficiary");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // In your component, add auth check

  // const handleSubmit = async () => {
  //   if (!validateForm()) return;
  //   if (!selectedCountry) {
  //     Alert.alert("Error", "Please select a country");
  //     return;
  //   }

  //   try {
  //     const fullPhoneNumber = `${selectedCountry.prefix}${formData.phoneNumber}`;

  //     // Use the correct field names that match the Beneficiary interface
  //     await addBeneficiary({
  //       fullName: formData.fullName.trim(), // ← fullName not name
  //       email: formData.email.trim() || undefined,
  //       phoneNumber: fullPhoneNumber, // ← phoneNumber not phone
  //     });

  //     console.log("Beneficiary created successfully");
  //     resetForm();
  //     onBeneficiaryAdded();
  //     onClose();
  //   } catch (error: any) {
  //     // Error is already handled in the hook, but you can add additional handling here
  //     console.error("Error in modal:", error);
  //   }
  // };
  const formatPhoneNumber = (value: string) => {
    // Remove any non-digit characters
    return value.replace(/\D/g, "");
  };

  // // Temporary test function - add this to your component
  // const testDirectFetch = async () => {
  //   const testData = {
  //     fullName: "Test User",
  //     email: "test@example.com",
  //     phoneNumber: "+221701234567",
  //   };

  //   try {
  //     console.log("🧪 Testing with direct fetch...");
  //     const response = await fetch("http://localhost:8080/api/beneficiaries", {
  //       method: "POST",
  //       headers: {
  //         // Add your auth headers if needed
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(testData),
  //     });

  //     console.log("📋 Direct fetch response:", {
  //       status: response.status,
  //       statusText: response.statusText,
  //       headers: Object.fromEntries(response.headers.entries()),
  //       ok: response.ok,
  //     });

  //     const responseText = await response.text();
  //     console.log("📄 Response body:", responseText);

  //     if (!response.ok) {
  //       console.log("❌ Direct fetch failed");
  //     } else {
  //       console.log("✅ Direct fetch succeeded");
  //     }
  //   } catch (error) {
  //     console.error("💥 Direct fetch error:", error);
  //   }
  // };

  // Add this temporary function to test cookie sending
  const testWithExplicitCookies = async () => {
    console.log(
      "------------------------testWithExplicitCookies----------------------------"
    );
    try {
      // First get current cookies
      const cookies = document.cookie; // For web
      console.log("🍪 Current cookies:", cookies);

      const testData = {
        fullName: "Test User",
        email: "test@example.com",
        phoneNumber: "+221701234567",
      };

      console.log("🧪 Testing with explicit cookie handling...");

      const response = await fetch("http://localhost:8080/api/beneficiaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This should send cookies
        body: JSON.stringify(testData),
      });

      console.log("📋 Response status:", response.status);
      console.log("🍪 Response cookies:", response.headers.get("set-cookie"));

      const text = await response.text();
      console.log("📄 Response body:", text);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      return JSON.parse(text);
    } catch (error) {
      console.error("💥 Test failed:", error);
      throw error;
    }
  };

  // Call this function temporarily instead of handleSubmit to test

  // const handleAddBeneficiary = async () => {
  //   if (!validateForm()) return;

  //   if (!selectedCountry) {
  //     Alert.alert("Error", "Please select a country");
  //     return;
  //   }

  //   const credentials = {
  //     fullName: formData.fullName,
  //     email: formData.email,
  //     phoneNumber: `${selectedCountry.prefix}${formData.phoneNumber}`,
  //   };

  //   console.log("Beneficiary Data added: ", credentials);

  //   try {
  //     await addBeneficiary(credentials);
  //     Alert.alert("Success", "Beneficiary added successfully!");
  //     resetForm();
  //     onBeneficiaryAdded();
  //     onClose();
  //   } catch (error: any) {
  //     Alert.alert("Error", error.message || "Failed to add beneficiary");
  //   }
  // };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Beneficiary</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Beneficiary Information</Text>

            <Input
              label="Full Name"
              placeholder="Enter full name"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange("fullName", value)}
              error={errors.fullName}
              autoCapitalize="words"
            />

            <View style={styles.phoneInputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <TouchableOpacity
                  style={styles.countrySelector}
                  onPress={() => setShowCountryPicker(!showCountryPicker)}
                >
                  <Text style={styles.countryFlag}>
                    {selectedCountry?.flag || "🇸🇳"}
                  </Text>
                  <Text style={styles.countryCode}>
                    {selectedCountry?.prefix || "+221"}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>

                <View style={styles.phoneInput}>
                  <Input
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChangeText={(value) =>
                      handleInputChange("phoneNumber", formatPhoneNumber(value))
                    }
                    keyboardType="phone-pad"
                    error={errors.phoneNumber}
                    style={styles.phoneNumberInput}
                  />
                </View>
              </View>

              {showCountryPicker && (
                <View style={styles.countryPicker}>
                  <ScrollView style={styles.countryList} nestedScrollEnabled>
                    {countryCodes.map((country) => (
                      <TouchableOpacity
                        key={country.code}
                        style={styles.countryItem}
                        onPress={() => handleCountrySelect(country)}
                      >
                        <Text style={styles.countryItemFlag}>
                          {country.flag}
                        </Text>
                        <View style={styles.countryInfo}>
                          <Text style={styles.countryName}>{country.name}</Text>
                          <Text style={styles.countryPrefix}>
                            {country.prefix}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Input
              label="Email (Optional)"
              placeholder="Enter email address"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={onClose}
                variant="outline"
                size="large"
                style={styles.cancelButton}
              />
              <Button
                title={loading ? "Adding..." : "Add Beneficiary"}
                // onPress={handleSubmit}
                onPress={testWithExplicitCookies}
                disabled={loading}
                loading={loading}
                variant="primary"
                size="large"
                style={styles.submitButton}
              />
            </View>
          </Card>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.divider,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: spacing.large,
  },
  formCard: {
    marginBottom: spacing.large,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.large,
  },
  phoneInputContainer: {
    marginBottom: spacing.medium,
  },
  inputLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
    marginBottom: spacing.small,
  },
  phoneRow: {
    flexDirection: "row",
    gap: spacing.small,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    backgroundColor: colors.surface,
    minWidth: 100,
  },
  countryFlag: {
    fontSize: 16,
    marginRight: spacing.small,
  },
  countryCode: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginRight: spacing.small,
  },
  dropdownIcon: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  phoneInput: {
    flex: 1,
  },
  phoneNumberInput: {
    textAlign: "left",
  },
  countryPicker: {
    marginTop: spacing.small,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    maxHeight: 200,
  },
  countryList: {
    padding: spacing.small,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.medium,
    borderRadius: 8,
  },
  countryItemFlag: {
    fontSize: 20,
    marginRight: spacing.medium,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  countryPrefix: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: spacing.medium,
    marginTop: spacing.large,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default AddBeneficiaryModal;
