// // Basic usage with icons
// <Button
//   title="Add New Beneficiary"
//   onPress={() => Alert.alert("Coming Soon", "Add beneficiary feature")}
//   variant="primary"
//   size="large"
//   icon="account-plus"
// />

// // Right icon
// <Button
//   title="Send Money"
//   onPress={handleSendMoney}
//   variant="primary"
//   size="large"
//   icon="send"
//   iconPosition="right"
// />

// // Custom icon size
// <Button
//   title="Delete"
//   onPress={handleDelete}
//   variant="danger"
//   size="small"
//   icon="trash-can"
//   iconSize={14}
// />

// // Full width button
// <Button
//   title="Complete Payment"
//   onPress={handlePayment}
//   variant="primary"
//   size="large"
//   icon="lock"
//   fullWidth
// />

// // Using specialized buttons
// <PrimaryButton
//   title="Save Changes"
//   onPress={handleSave}
//   icon="content-save"
// />

// <DangerButton
//   title="Delete Account"
//   onPress={handleDeleteAccount}
//   icon="alert-circle"
// />

// // Icon-only button (for FAB-like actions)
// <IconButton
//   icon="plus"
//   onPress={handleAdd}
//   size={28}
//   color={colors.background}
//   backgroundColor={colors.primary}
// />

// // Loading state
// <Button
//   title="Processing..."
//   onPress={handleAction}
//   loading={true}
//   variant="primary"
//   size="large"
// />

// // Disabled state
// <Button
//   title="Transfer Money"
//   onPress={handleTransfer}
//   disabled={!isFormValid}
//   variant="primary"
//   size="large"
//   icon="swap-horizontal"
// />

// Exemple of use cases above ☝🏼

// Enhanced Button component with full icon support
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import { LucideIcon, User, UserPlus } from "lucide-react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;

  iconPosition?: "left" | "right";
  iconSize?: number;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  style,
  textStyle,
  icon,
  iconPosition = "left",
  iconSize,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    // const baseStyle = [styles.button, styles[`button_${size}`]];
    // if (disabled) {
    //   return [...baseStyle, styles.button_disabled];
    // }
    // if (fullWidth) {
    //   baseStyle.push(styles.button_fullWidth);
    // }
    // return [...baseStyle, styles[`button_${variant}`]];
    // Create baseStyle as ViewStyle[] to allow any ViewStyle
    const baseStyle: ViewStyle[] = [styles.button, styles[`button_${size}`]];

    if (disabled) {
      baseStyle.push(styles.button_disabled);
    }

    if (fullWidth) {
      baseStyle.push(styles.button_fullWidth); // This will work now
    }

    baseStyle.push(styles[`button_${variant}`]);

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`text_${size}`]];

    if (disabled) {
      return [...baseStyle, styles.text_disabled];
    }

    return [...baseStyle, styles[`text_${variant}`]];
  };

  const getIconColor = () => {
    if (disabled) {
      return colors.textTertiary;
    }

    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        return colors.background;
      case "outline":
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  const getActualIconSize = () => {
    if (iconSize) return iconSize;

    switch (size) {
      case "small":
        return 14;
      case "medium":
        return 16;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={getIconColor()} />;
    }

    return (
      <View style={styles.content}>
        {icon && iconPosition === "left" && (
          <Icon
            name={icon}
            size={getActualIconSize()}
            color={getIconColor()}
            style={styles.iconLeft}
          />
        )}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        {icon && iconPosition === "right" && (
          <Icon
            name={icon}
            size={getActualIconSize()}
            color={getIconColor()}
            style={styles.iconRight}
          />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  button_medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  button_large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  button_fullWidth: {
    width: "100%",
  },
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.textTertiary,
  },
  button_outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  button_danger: {
    backgroundColor: colors.error,
  },
  button_disabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  text_primary: {
    color: colors.background,
  },
  text_secondary: {
    color: colors.background,
  },
  text_outline: {
    color: colors.textPrimary,
  },
  text_danger: {
    color: colors.background,
  },
  text_disabled: {
    color: colors.textTertiary,
  },
  iconLeft: {
    marginRight: spacing.small,
  },
  iconRight: {
    marginLeft: spacing.small,
  },
});

// Optional: Create specialized button components for common use cases
export const PrimaryButton: React.FC<Omit<ButtonProps, "variant">> = (
  props
) => <Button variant="primary" {...props} />;

export const SecondaryButton: React.FC<Omit<ButtonProps, "variant">> = (
  props
) => <Button variant="secondary" {...props} />;

export const OutlineButton: React.FC<Omit<ButtonProps, "variant">> = (
  props
) => <Button variant="outline" {...props} />;

export const DangerButton: React.FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button variant="danger" {...props} />
);

// Size-specific buttons
export const SmallButton: React.FC<Omit<ButtonProps, "size">> = (props) => (
  <Button size="small" {...props} />
);

export const MediumButton: React.FC<Omit<ButtonProps, "size">> = (props) => (
  <Button size="medium" {...props} />
);

export const LargeButton: React.FC<Omit<ButtonProps, "size">> = (props) => (
  <Button size="large" {...props} />
);

// Icon-only button for floating actions
export const IconButton: React.FC<{
  icon: string;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
}> = ({
  icon,
  onPress,
  size = 24,
  color = colors.primary,
  backgroundColor = "transparent",
  disabled = false,
}) => (
  <TouchableOpacity
    style={[
      iconButtonStyles.button,
      { backgroundColor },
      disabled && iconButtonStyles.disabled,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Icon
      name={icon}
      size={size}
      color={disabled ? colors.textTertiary : color}
    />
  </TouchableOpacity>
);

const iconButtonStyles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
