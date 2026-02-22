// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { useAuth } from "../../context/AuthContext";

// interface LoginScreenProps {
//   navigation: any;
// }

// const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
//   const { login, loading } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     try {
//       await login(email, password);
//       // ✅ Navigate to Home after successful login
//       navigation.reset({
//         index: 0,
//         routes: [{ name: "home" }],
//       });
//     } catch (err: any) {
//       Alert.alert("Login failed", err.message || "Invalid credentials");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#007bff" />

//       <KeyboardAvoidingView
//         style={styles.innerContainer}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <View style={styles.header}>
//           <Text style={styles.logo}>💸3</Text>
//           <Text style={styles.title}>MoneyTransfer</Text>
//           <Text style={styles.subtitle}>Send & Receive Money Globally</Text>
//         </View>

//         <View style={styles.form}>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />

//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             <Text style={styles.buttonText}>
//               {loading ? "Logging in..." : "Login"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate("register")}>
//             <Text style={styles.registerText}>
//               Don't have an account?{" "}
//               <Text style={styles.registerLink}>Register</Text>
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "purple" },
//   innerContainer: { flex: 1, justifyContent: "center" },
//   header: { alignItems: "center", marginBottom: 40, paddingHorizontal: 20 },
//   logo: { fontSize: 60 },
//   title: { fontSize: 28, fontWeight: "700", color: "#fff", marginTop: 10 },
//   subtitle: { fontSize: 16, color: "#fff", marginTop: 4, textAlign: "center" },

//   form: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     padding: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//     fontSize: 16,
//     backgroundColor: "#f9f9f9",
//   },
//   button: {
//     backgroundColor: "purple",

//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   buttonDisabled: { opacity: 0.6 },
//   buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

//   registerText: { textAlign: "center", color: "#555", fontSize: 14 },
//   registerLink: { color: "#007bff", fontWeight: "700" },
// });

// src/screens/auth/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useBeneficiaries } from "../../hooks/useBeneficiaries";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Buttons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Apple, AppleIcon, LucideApple } from "lucide-react-native";

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const { checkSession } = useBeneficiaries();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = (): boolean => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const handleLogin = async () => {
  //   if (!validateForm()) return;

  //   try {
  //     await login(formData.email, formData.password);
  //     navigation.navigate("Maintabs"); // Make sure 'home' screen exists
  //   } catch (err: any) {
  //     Alert.alert("Login Failed", err.message);
  //   }
  // };

  // After successful login, verify the session
  const handleLogin = async () => {
    try {
      await login(formData.email, formData.password);

      // Verify session was created
      const sessionValid = await checkSession();
      if (!sessionValid) {
        throw new Error("Login successful but session not created");
      }

      console.log("✅ Login and session creation successful");
      navigation.navigate("Maintabs");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Icon
                  name="swap-horizontal"
                  size={32}
                  color={colors.background}
                />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your account to continue
            </Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.form}>
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                autoComplete="email"
                editable={!loading}
                icon="email-outline"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                secureTextEntry
                error={errors.password}
                autoComplete="password"
                editable={!loading}
                icon="lock-outline"
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title={loading ? "Signing In..." : "Sign In"}
                onPress={handleLogin}
                disabled={loading}
                loading={loading}
                variant="primary"
                size="large"
                icon="arrow-right"
                iconPosition="right"
                fullWidth
              />

              {/* Social Login Options */}
              <View style={styles.socialSection}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Icon name="google" size={20} color={colors.error} />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton}>
                    {/* <Icon name="apple" size={20} color={colors.textPrimary} /> */}
                    <AppleIcon size={20} color={colors.textPrimary} />

                    <Text style={styles.socialButtonText}>Apple</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("register")}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.registerLink,
                      loading && styles.disabledLink,
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.extraLarge,
  },
  logoContainer: {
    marginBottom: spacing.large,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    ...typography.heading1,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.small,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    paddingHorizontal: spacing.large,
  },
  form: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.extraLarge,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: spacing.large,
  },
  forgotPasswordText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: "500",
  },
  socialSection: {
    marginTop: spacing.extraLarge,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.large,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    paddingHorizontal: spacing.medium,
  },
  socialButtons: {
    flexDirection: "row",
    gap: spacing.medium,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.small,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  socialButtonText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.extraLarge,
  },
  registerText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: "600",
  },
  disabledLink: {
    opacity: 0.5,
  },
});

export default LoginScreen;
