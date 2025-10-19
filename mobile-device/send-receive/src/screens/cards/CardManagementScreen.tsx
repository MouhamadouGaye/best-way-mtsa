// src/screens/cards/CardManagementScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Buttons";
import { Loading } from "../../components/common/Loading";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import { paymentService } from "../../api/paymentService";
import { useStripe } from "@stripe/stripe-react-native";

interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  isDefault: boolean;
}

const CardManagementScreen: React.FC = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCard, setAddingCard] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await paymentService.getPaymentMethods();
      const methodsWithDefault = methods.map((method) => ({
        ...method,
        isDefault: false,
      }));
      setPaymentMethods(methodsWithDefault);
    } catch (error: any) {
      console.error("Failed to load payment methods:", error);
      Alert.alert("Error", "Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    try {
      setAddingCard(true);

      // Create setup intent
      const { clientSecret, customerId } =
        await paymentService.createSetupIntent();

      // Initialize payment sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: "MoneyTransfer App",
        customerId: customerId,
        customerEphemeralKeySecret: clientSecret,
        setupIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        returnURL: "moneytranfer://stripe-redirect",
      });

      if (error) {
        throw new Error(error.message);
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        throw new Error(presentError.message);
      }

      // Payment method was added successfully
      Alert.alert("Success", "Card added successfully!");
      await loadPaymentMethods(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to add card:", error);
      if (error.message !== "Payment sheet canceled") {
        Alert.alert("Error", error.message || "Failed to add card");
      }
    } finally {
      setAddingCard(false);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await paymentService.setDefaultPaymentMethod(paymentMethodId);
      Alert.alert("Success", "Default card updated!");
      await loadPaymentMethods(); // Refresh the list
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update default card");
    }
  };

  const handleDeleteCard = async (paymentMethodId: string) => {
    Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await paymentService.detachPaymentMethod(paymentMethodId);
            Alert.alert("Success", "Card deleted successfully!");
            await loadPaymentMethods(); // Refresh the list
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete card");
          }
        },
      },
    ]);
  };

  const getCardBrandIcon = (brand: string) => {
    const icons: { [key: string]: string } = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      discover: "💳",
      diners: "💳",
      jcb: "💳",
      unionpay: "💳",
    };
    return icons[brand.toLowerCase()] || "💳";
  };

  const formatExpiryDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  };

  if (loading) {
    return <Loading message="Loading cards..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Payment Methods</Text>
          <Text style={styles.subtitle}>
            Manage your credit and debit cards
          </Text>
        </View>

        {/* Add Card Button */}
        <Card style={styles.addCardSection}>
          <Button
            title={addingCard ? "Adding Card..." : "Add New Card"}
            onPress={handleAddCard}
            disabled={addingCard}
            loading={addingCard}
            variant="primary"
            size="large"
            // icon="➕"
          />
        </Card>

        {/* Cards List */}
        {paymentMethods.length > 0 ? (
          <View style={styles.cardsSection}>
            <Text style={styles.sectionTitle}>Your Cards</Text>
            <FlatList
              data={paymentMethods}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Card
                  style={StyleSheet.flatten([
                    styles.cardItem,
                    item.isDefault && styles.defaultCardItem,
                  ])}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardBrand}>
                      <Text style={styles.cardBrandIcon}>
                        {getCardBrandIcon(item.card.brand)}
                      </Text>
                      <Text style={styles.cardBrandText}>
                        {item.card.brand.charAt(0).toUpperCase() +
                          item.card.brand.slice(1)}
                      </Text>
                    </View>
                    {item.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardDetails}>
                    <Text style={styles.cardNumber}>
                      •••• •••• •••• {item.card.last4}
                    </Text>
                    <Text style={styles.cardExpiry}>
                      Expires{" "}
                      {formatExpiryDate(
                        item.card.exp_month,
                        item.card.exp_year
                      )}
                    </Text>
                  </View>

                  <View style={styles.cardActions}>
                    {!item.isDefault && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleSetDefault(item.id)}
                      >
                        <Text style={styles.actionButtonText}>
                          Set as Default
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteCard(item.id)}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          styles.deleteButtonText,
                        ]}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              )}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        ) : (
          <Card style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💳</Text>
            <Text style={styles.emptyStateTitle}>No Cards Added</Text>
            <Text style={styles.emptyStateText}>
              Add a card to make payments faster and more secure
            </Text>
          </Card>
        )}

        {/* Security Notice */}
        <Card style={styles.securityNotice}>
          <Text style={styles.securityTitle}>🔒 Secure Payment</Text>
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure. We use Stripe to
            process payments safely.
          </Text>
        </Card>
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
  addCardSection: {
    margin: spacing.large,
    marginTop: 0,
  },
  cardsSection: {
    padding: spacing.large,
    paddingTop: 0,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
  },
  cardItem: {
    padding: spacing.large,
  },
  defaultCardItem: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.medium,
  },
  cardBrand: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardBrandIcon: {
    fontSize: 20,
    marginRight: spacing.small,
  },
  cardBrandText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  defaultBadge: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.tiny,
    borderRadius: 12,
  },
  defaultBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },
  cardDetails: {
    marginBottom: spacing.medium,
  },
  cardNumber: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.tiny,
  },
  cardExpiry: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  cardActions: {
    flexDirection: "row",
    gap: spacing.medium,
  },
  actionButton: {
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: colors.error + "10",
    borderColor: colors.error + "30",
  },
  deleteButtonText: {
    color: colors.error,
  },
  separator: {
    height: spacing.medium,
  },
  emptyState: {
    margin: spacing.large,
    alignItems: "center",
    padding: spacing.huge,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: spacing.medium,
  },
  emptyStateTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  emptyStateText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
  },
  securityNotice: {
    margin: spacing.large,
    marginTop: spacing.medium,
    backgroundColor: colors.info + "10",
    borderColor: colors.info + "20",
  },
  securityTitle: {
    ...typography.bodyMedium,
    color: colors.info,
    fontWeight: "600",
    marginBottom: spacing.small,
  },
  securityText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

export default CardManagementScreen;
