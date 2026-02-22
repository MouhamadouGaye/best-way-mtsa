// src/screens/beneficiaries/BeneficiariesListScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Buttons";
import { Loading } from "../../components/common/Loading";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { beneficiaryService } from "../../api/beneficiaryService";

interface Beneficiary {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  countryCode: string;
  currency?: string;
}

const BeneficiariesScreen: React.FC = () => {
  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      setLoading(true);
      const beneficiariesData = await beneficiaryService.getAll();
      setBeneficiaries(beneficiariesData || []);
    } catch (error) {
      console.error("Failed to load beneficiaries:", error);
      Alert.alert("Error", "Failed to load beneficiaries");
    } finally {
      setLoading(false);
    }
  };

  const getFlagEmoji = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      SN: "🇸🇳",
      US: "🇺🇸",
      UK: "🇬🇧",
      GB: "🇬🇧",
      CA: "🇨🇦",
      FR: "🇫🇷",
      DE: "🇩🇪",
      ES: "🇪🇸",
      IT: "🇮🇹",
      NG: "🇳🇬",
      KE: "🇰🇪",
      GH: "🇬🇭",
    };
    return flags[countryCode] || "🌍";
  };

  if (loading) {
    return <Loading message="Loading beneficiaries..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Beneficiaries</Text>
          <Text style={styles.subtitle}>Manage your saved recipients</Text>
        </View>

        {/* Add Beneficiary Button */}
        <Card style={styles.addCard}>
          <Button
            title="Add New Beneficiary"
            onPress={() =>
              Alert.alert("Coming Soon", "Add beneficiary feature")
            }
            variant="primary"
            size="large"
            icon="account-plus"
          />
        </Card>

        {/* Beneficiaries List */}
        {beneficiaries.length > 0 ? (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>
              Your Beneficiaries ({beneficiaries.length})
            </Text>
            <Card style={styles.listCard}>
              <FlatList
                data={beneficiaries}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.beneficiaryItem}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {item.fullName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.beneficiaryInfo}>
                      <Text style={styles.beneficiaryName}>
                        {item.fullName}
                      </Text>
                      <Text style={styles.beneficiaryDetails}>
                        {item.phoneNumber} • {getFlagEmoji(item.countryCode)}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.menuButton}>
                      <Icon
                        name="dots-vertical"
                        size={20}
                        color={colors.textTertiary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </Card>
          </View>
        ) : (
          <Card style={styles.emptyState}>
            <Icon name="account-group" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyStateTitle}>No Beneficiaries</Text>
            <Text style={styles.emptyStateText}>
              Add beneficiaries to make transfers faster and easier
            </Text>
            <Button
              title="Add Your First Beneficiary"
              onPress={() =>
                Alert.alert("Coming Soon", "Add beneficiary feature")
              }
              variant="primary"
              size="medium"
              style={styles.addFirstButton}
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.large,
    paddingBottom: spacing.medium,
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  addCard: {
    margin: spacing.large,
    marginTop: 0,
    marginBottom: spacing.medium,
  },
  listSection: {
    padding: spacing.large,
    paddingTop: 0,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
  },
  listCard: {
    padding: 0,
  },
  beneficiaryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.large,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.medium,
  },
  avatarText: {
    ...typography.bodyMedium,
    color: colors.background,
    fontWeight: "600",
  },
  beneficiaryInfo: {
    flex: 1,
  },
  beneficiaryName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
    marginBottom: spacing.tiny,
  },
  beneficiaryDetails: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  menuButton: {
    padding: spacing.small,
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: spacing.large,
  },
  emptyState: {
    margin: spacing.large,
    alignItems: "center",
    padding: spacing.huge,
  },
  emptyStateTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginTop: spacing.medium,
    marginBottom: spacing.small,
  },
  emptyStateText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.medium,
  },
  addFirstButton: {
    marginTop: spacing.small,
  },
});

export default BeneficiariesScreen;
