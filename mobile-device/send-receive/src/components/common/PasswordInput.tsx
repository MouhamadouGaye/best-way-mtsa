import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../styles/colors";

interface PasswordInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  editable?: boolean;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  editable = true,
  showPassword,
  onToggleVisibility,
}) => (
  <View style={styles.passwordContainer}>
    <Text style={styles.label}>{label}</Text>
    <View
      style={[
        styles.passwordInputRow,
        error && styles.inputError,
        !editable && styles.inputDisabled,
      ]}
    >
      <Icon
        name="lock-outline"
        size={20}
        color={colors.textSecondary}
        style={styles.passwordIcon}
      />
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        editable={editable}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={styles.eyeButton}
        onPress={onToggleVisibility}
        disabled={!editable}
      >
        <Icon
          name={showPassword ? "eye-off-outline" : "eye-outline"}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  passwordContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  passwordInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  passwordIcon: {
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default PasswordInput;
