// Enhanced ProfileScreen.tsx with edit functionality
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Buttons";
import { Loading } from "../../components/common/Loading";
import { Input } from "../../components/common/Input";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Bell,
  ChevronRight,
  ClosedCaption,
  ClosedCaptionIcon,
  Edit,
  Edit2,
  Fingerprint,
  HelpCircle,
  HelpCircleIcon,
  Info,
  Shield,
  X,
} from "lucide-react-native";

const ProfileScreen: React.FC = () => {
  const { user, logout, updateProfile } = useAuth(); // Now updateProfile is available
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(editForm);
      setEditModalVisible(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      // icon: "account-edit",
      icon: <Edit2 size={18} />,
      title: "Edit Profile",
      subtitle: "Update your personal information",
      onPress: () => setEditModalVisible(true),
    },
    {
      // icon: "shield-account",
      icon: <Shield size={18} />,
      title: "Security",
      subtitle: "Change password, 2FA",
      onPress: () =>
        Alert.alert("Coming Soon", "Security settings coming soon!"),
    },
    {
      // icon: "bell",
      icon: <Bell size={18} />,
      title: "Notifications",
      subtitle: "Manage your notifications",
      rightComponent: (
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.background}
        />
      ),
    },
    {
      // icon: "fingerprint",
      icon: <Fingerprint size={18} />,
      title: "Biometric Login",
      subtitle: "Use fingerprint or face ID",
      rightComponent: (
        <Switch
          value={biometric}
          onValueChange={setBiometric}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.background}
        />
      ),
    },
    {
      // icon: "help-circle",
      icon: <HelpCircleIcon size={18} />,
      title: "Help & Support",
      subtitle: "Get help and contact support",
      onPress: () => Alert.alert("Coming Soon", "Help center coming soon!"),
    },
    {
      // icon: "information",
      icon: <Info size={18} />,
      title: "About",
      subtitle: "App version and information",
      onPress: () => Alert.alert("About", "MoneyTransfer App v1.0.0"),
    },
  ];

  if (loading) {
    return <Loading message="Loading profile..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.username?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => setEditModalVisible(true)}
            >
              <Icon name="pencil" size={14} color={colors.background} />
            </TouchableOpacity>
            <View style={styles.verifiedBadge}>
              <Icon name="check-decagram" size={16} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.userName}>{user?.username || "User"}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.memberSince}>
            <Icon name="calendar" size={14} color={colors.textTertiary} />
            <Text style={styles.memberSinceText}>
              Member since {new Date().getFullYear()}
            </Text>
          </View>
        </View>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                ${user?.balance?.toFixed(2) || "0.00"}
              </Text>
              <Text style={styles.statLabel}>Balance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Transfers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Cards</Text>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
                disabled={!item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    {/* <Icon name={item.icon} size={18} color={colors.primary} /> */}
                    {item.icon}
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                {/* {item.rightComponent || (
                  <Icon
                    name="chevron-right"
                    size={18}
                    color={colors.textTertiary}
                  />
                )} */}
                {item.rightComponent || (
                  <ChevronRight size={18} color={colors.textTertiary} />
                )}
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            icon="logout"
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={styles.closeButton}
            >
              {/* <Icon name="close" size={24} color={colors.textPrimary} /> */}
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Card style={styles.editFormCard}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={editForm.name}
                onChangeText={(text) =>
                  setEditForm((prev) => ({ ...prev, name: text }))
                }
              />

              <Input
                label="Email"
                placeholder="Enter your email"
                value={editForm.email}
                onChangeText={(text) =>
                  setEditForm((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false} // Email might not be editable
              />

              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                value={editForm.phoneNumber}
                onChangeText={(text) =>
                  setEditForm((prev) => ({ ...prev, phoneNumber: text }))
                }
                keyboardType="phone-pad"
              />

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setEditModalVisible(false)}
                  variant="outline"
                  size="large"
                  style={styles.cancelButton}
                />
                <Button
                  title={loading ? "Saving..." : "Save Changes"}
                  onPress={handleSaveProfile}
                  disabled={loading}
                  loading={loading}
                  variant="primary"
                  size="large"
                  style={styles.saveButton}
                />
              </View>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    alignItems: "center",
    padding: spacing.large,
    paddingBottom: spacing.medium,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.medium,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: {
    ...typography.heading1,
    color: colors.background,
    fontWeight: "700",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.tiny,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  memberSince: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.tiny,
  },
  memberSinceText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  statsCard: {
    margin: spacing.large,
    marginTop: 0,
    marginBottom: spacing.medium,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: spacing.tiny,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  menuSection: {
    padding: spacing.medium,
    paddingTop: 0,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
  },
  menuCard: {
    padding: 0,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.large,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.medium,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
    marginBottom: spacing.tiny,
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  logoutSection: {
    padding: spacing.large,
    paddingTop: spacing.medium,
  },
  logoutButton: {
    borderColor: colors.error,
    marginBottom: 28,
  },
  logoutButtonText: {
    color: colors.error,
  },

  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.small,
  },
  modalContent: {
    flex: 1,
    padding: spacing.large,
  },
  editFormCard: {
    marginBottom: spacing.large,
  },
  modalButtons: {
    flexDirection: "row",
    gap: spacing.medium,
    marginTop: spacing.large,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});

export default ProfileScreen;
