// src/screens/transfers/TransfersScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
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
import { transferService } from "../../api/transferService";

interface Transfer {
  id: number;
  amount: number;
  createdAt: string;
  status: string;
  recipientName: string;
  fromCurrency?: string;
  toCurrency?: string;
  convertedAmount?: number;
  fromCard: boolean;
}

const TransfersScreen: React.FC = () => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "completed" | "pending" | "failed"
  >("all");

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = async () => {
    try {
      setLoading(true);
      const transfersData = await transferService.getAll();
      setTransfers(transfersData || []);
    } catch (error) {
      console.error("Failed to load transfers:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTransfers();
  };

  const filteredTransfers = transfers.filter((transfer) => {
    if (filter === "all") return true;
    return transfer.status.toLowerCase() === filter;
  });

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return colors.success;
      case "pending":
        return colors.warning;
      case "failed":
        return colors.error;
      default:
        return colors.textTertiary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "check-circle";
      case "pending":
        return "clock";
      case "failed":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const filterButtons = [
    { key: "all", label: "All", icon: "format-list-bulleted" },
    { key: "completed", label: "Completed", icon: "check" },
    { key: "pending", label: "Pending", icon: "clock" },
    { key: "failed", label: "Failed", icon: "close" },
  ];

  if (loading) {
    return <Loading message="Loading transfers..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Transfer History</Text>
          <Text style={styles.subtitle}>View your recent money transfers</Text>
        </View>

        {/* Filter Buttons */}
        <Card style={styles.filterCard}>
          <View style={styles.filterRow}>
            {filterButtons.map((button) => (
              <TouchableOpacity
                key={button.key}
                style={[
                  styles.filterButton,
                  filter === button.key && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(button.key as any)}
              >
                <Icon
                  name={button.icon}
                  size={16}
                  color={
                    filter === button.key ? colors.primary : colors.textTertiary
                  }
                />
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === button.key && styles.filterButtonTextActive,
                  ]}
                >
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Transfers List */}
        {filteredTransfers.length > 0 ? (
          <View style={styles.transfersSection}>
            <Card style={styles.transfersCard}>
              <FlatList
                data={filteredTransfers}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.transferItem}>
                    <View style={styles.transferIcon}>
                      <Icon
                        name={item.fromCard ? "credit-card" : "wallet"}
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.transferInfo}>
                      <Text style={styles.recipientName}>
                        {item.recipientName}
                      </Text>
                      <Text style={styles.transferDate}>
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.transferAmount}>
                      <Text style={styles.amountText}>
                        -{formatCurrency(item.amount, item.fromCurrency)}
                      </Text>
                      <View style={styles.statusContainer}>
                        <Icon
                          name={getStatusIcon(item.status)}
                          size={14}
                          color={getStatusColor(item.status)}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: getStatusColor(item.status) },
                          ]}
                        >
                          {item.status.toLowerCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </Card>
          </View>
        ) : (
          <Card style={styles.emptyState}>
            <Icon name="transfer" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyStateTitle}>No transfers found</Text>
            <Text style={styles.emptyStateText}>
              {filter === "all"
                ? "You haven't made any transfers yet"
                : `No ${filter} transfers found`}
            </Text>
            {filter !== "all" && (
              <Button
                title="Show All Transfers"
                onPress={() => setFilter("all")}
                variant="outline"
                size="small"
                style={styles.showAllButton}
              />
            )}
          </Card>
        )}

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Icon name="arrow-up" size={24} color={colors.success} />
              <Text style={styles.statNumber}>
                {formatCurrency(
                  transfers
                    .filter((t) => t.status === "COMPLETED")
                    .reduce((sum, t) => sum + t.amount, 0),
                  user?.currency
                )}
              </Text>
              <Text style={styles.statLabel}>Total Sent</Text>
            </Card>
            <Card style={styles.statCard}>
              <Icon name="swap-horizontal" size={24} color={colors.primary} />
              <Text style={styles.statNumber}>
                {transfers.filter((t) => t.status === "COMPLETED").length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </Card>
          </View>
        </View>
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
  filterCard: {
    margin: spacing.large,
    marginTop: 0,
    marginBottom: spacing.medium,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.tiny,
    borderRadius: 12,
    gap: spacing.tiny,
  },
  filterButtonActive: {
    backgroundColor: colors.primary + "10",
  },
  filterButtonText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: colors.primary,
  },
  transfersSection: {
    padding: spacing.large,
    paddingTop: 0,
  },
  transfersCard: {
    padding: 0,
  },
  transferItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.large,
  },
  transferIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.medium,
  },
  transferInfo: {
    flex: 1,
  },
  recipientName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
    marginBottom: spacing.tiny,
  },
  transferDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  transferAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.tiny,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.tiny,
  },
  statusText: {
    ...typography.caption,
    fontWeight: "500",
    textTransform: "capitalize",
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
  showAllButton: {
    marginTop: spacing.small,
  },
  statsSection: {
    padding: spacing.large,
    paddingTop: 0,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.medium,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: spacing.large,
  },
  statNumber: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontWeight: "700",
    marginVertical: spacing.small,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default TransfersScreen;
