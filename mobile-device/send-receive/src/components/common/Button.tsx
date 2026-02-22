// Button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";
import Icon from "./Icon"; // the dynamic Icon component we built
import { UserDto } from "../../../types/UserDto";

interface ButtonProps {
  title: string;
  onPress: (userData: any) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  icon?: keyof typeof import("lucide-react-native");
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  fullWidth = false,
}) => {
  const iconSize = size === "large" ? 28 : 20;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        fullWidth && { alignSelf: "stretch" },
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        {icon && iconPosition === "left" && (
          <Icon name={icon} size={iconSize} color="white" />
        )}
        {loading ? (
          <ActivityIndicator color="white" style={styles.loader} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
        {icon && iconPosition === "right" && (
          <Icon name={icon} size={iconSize} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  loader: {
    marginLeft: 8,
  },
});

export default Button;
