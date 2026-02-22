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
//   ScrollView,
// } from "react-native";
// import { useAuth } from "../../context/AuthContext";

// interface RegisterScreenProps {
//   navigation: any;
// }

// const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
//   const { register, loading } = useAuth();

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");

//   const handleRegister = async () => {
//     if (!username || !email || !password) {
//       Alert.alert("Error", "Please fill in all required fields");
//       return;
//     }

//     try {
//       await register(username, email, password, phoneNumber);
//       Alert.alert("Success", "Account created successfully!");
//       navigation.navigate("login");
//     } catch (err: any) {
//       Alert.alert("Registration failed", err.message || "Try again");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#28a745" />

//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <View style={styles.header}>
//             <Text style={styles.logo}>💸</Text>
//             <Text style={styles.title}>Create Account</Text>
//             <Text style={styles.subtitle}>Register to start sending money</Text>
//           </View>

//           <View style={styles.form}>
//             <TextInput
//               style={styles.input}
//               placeholder="Username"
//               value={username}
//               onChangeText={setUsername}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number (optional)"
//               value={phoneNumber}
//               onChangeText={setPhoneNumber}
//               keyboardType="phone-pad"
//             />

//             <TouchableOpacity
//               style={[styles.button, loading && styles.buttonDisabled]}
//               onPress={handleRegister}
//               disabled={loading}
//             >
//               <Text style={styles.buttonText}>
//                 {loading ? "Registering..." : "Register"}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => navigation.navigate("login")}>
//               <Text style={styles.loginText}>
//                 Already have an account?{" "}
//                 <Text style={styles.loginLink}>Login</Text>
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default RegisterScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#28a745" },
//   scrollContainer: { flexGrow: 1, justifyContent: "center" },
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
//     backgroundColor: "#28a745",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   buttonDisabled: { opacity: 0.6 },
//   buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

//   loginText: { textAlign: "center", color: "#555", fontSize: 14 },
//   loginLink: { color: "#28a745", fontWeight: "700" },
// });
// src/screens/auth/RegisterScreen.tsx
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StatusBar,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Animated,
//   TextInput,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useAuth } from "../../context/AuthContext";
// import { Input } from "../../components/common/Input";
// // import { Button } from "../../components/common/Buttons";
// import { colors } from "../../styles/colors";
// import { typography } from "../../styles/typography";
// import { spacing } from "../../styles/spacing";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// interface RegisterScreenProps {
//   navigation: any;
// }

// // const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
// //   const { register, loading } = useAuth();
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     phoneNumber: "",
// //     password: "",
// //     confirmPassword: "",
// //   });
// //   const [errors, setErrors] = useState({
// //     username: "",
// //     email: "",
// //     phoneNumber: "",
// //     password: "",
// //     confirmPassword: "",
// //   });
// //   const [fadeAnim] = useState(new Animated.Value(0));
// //   const [slideAnim] = useState(new Animated.Value(50));

// //   React.useEffect(() => {
// //     Animated.parallel([
// //       Animated.timing(fadeAnim, {
// //         toValue: 1,
// //         duration: 800,
// //         useNativeDriver: true,
// //       }),
// //       Animated.timing(slideAnim, {
// //         toValue: 0,
// //         duration: 600,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();
// //   }, []);

// //   const validateForm = (): boolean => {
// //     const newErrors = {
// //       username: "",
// //       email: "",
// //       phoneNumber: "",
// //       password: "",
// //       confirmPassword: "",
// //     };

// //     if (!formData.username.trim()) {
// //       newErrors.username = "Full name is required";
// //     } else if (formData.username.trim().length < 2) {
// //       newErrors.username = "Name must be at least 2 characters";
// //     }

// //     if (!formData.email.trim()) {
// //       newErrors.email = "Email is required";
// //     } else if (!isValidEmail(formData.email)) {
// //       newErrors.email = "Please enter a valid email address";
// //     }

// //     if (!formData.phoneNumber.trim()) {
// //       newErrors.phoneNumber = "Phone number is required";
// //     } else if (!isValidPhoneNumber(formData.phoneNumber)) {
// //       newErrors.phoneNumber = "Please enter a valid phone number";
// //     }

// //     if (!formData.password) {
// //       newErrors.password = "Password is required";
// //     } else if (formData.password.length < 6) {
// //       newErrors.password = "Password must be at least 6 characters";
// //     }

// //     if (!formData.confirmPassword) {
// //       newErrors.confirmPassword = "Please confirm your password";
// //     } else if (formData.password !== formData.confirmPassword) {
// //       newErrors.confirmPassword = "Passwords do not match";
// //     }

// //     setErrors(newErrors);
// //     return !Object.values(newErrors).some((error) => error !== "");
// //   };

// //   const isValidEmail = (email: string): boolean => {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     return emailRegex.test(email);
// //   };

// //   const isValidPhoneNumber = (phone: string): boolean => {
// //     const phoneRegex = /^\+?[\d\s-()]{10,}$/;
// //     return phoneRegex.test(phone);
// //   };

// //   const handleRegister = async () => {
// //     if (!validateForm()) return;

// //     try {
// //       await register(
// //         formData.email,
// //         formData.password,
// //         formData.username,
// //         formData.phoneNumber
// //       );
// //       console.log(
// //         "Register data: ",
// //         formData.email,
// //         formData.password,
// //         formData.username,
// //         formData.phoneNumber
// //       );
// //     } catch (err: any) {
// //       Alert.alert("Registration Failed", err.message);
// //     }
// //   };

// //   const updateFormData = (field: string, value: string) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //     if (errors[field as keyof typeof errors]) {
// //       setErrors((prev) => ({ ...prev, [field]: "" }));
// //     }
// //   };

// //   const formatPhoneNumber = (value: string) => {
// //     return value.replace(/\D/g, "");
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

// //       <KeyboardAvoidingView
// //         style={styles.keyboardAvoid}
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //       >
// //         <ScrollView
// //           contentContainerStyle={styles.scrollContent}
// //           showsVerticalScrollIndicator={false}
// //           keyboardShouldPersistTaps="handled"
// //         >
// //           {/* Header Section */}
// //           <Animated.View
// //             style={[
// //               styles.header,
// //               {
// //                 opacity: fadeAnim,
// //                 transform: [{ translateY: slideAnim }],
// //               },
// //             ]}
// //           >
// //             <TouchableOpacity
// //               style={styles.backButton}
// //               onPress={() => navigation.goBack()}
// //             >
// //               <Icon name="arrow-left" size={24} color={colors.textPrimary} />
// //             </TouchableOpacity>

// //             <View style={styles.logoContainer}>
// //               <View style={styles.logo}>
// //                 <Icon name="account-plus" size={32} color={colors.background} />
// //               </View>
// //             </View>
// //             <Text style={styles.title}>Create Account</Text>
// //             <Text style={styles.subtitle}>
// //               Join us to start transferring money globally
// //             </Text>
// //           </Animated.View>

// //           {/* Form Section */}
// //           <Animated.View
// //             style={[
// //               styles.formContainer,
// //               {
// //                 opacity: fadeAnim,
// //                 transform: [{ translateY: slideAnim }],
// //               },
// //             ]}
// //           >
// //             <View style={styles.form}>
// //               <Input
// //                 label="Full Name"
// //                 placeholder="Enter your full name"
// //                 value={formData.username}
// //                 onChangeText={(value) => updateFormData("username", value)}
// //                 autoCapitalize="words"
// //                 error={errors.username}
// //                 editable={!loading}
// //                 icon="account-outline"
// //               />

// //               <Input
// //                 label="Email Address"
// //                 placeholder="Enter your email"
// //                 value={formData.email}
// //                 onChangeText={(value) => updateFormData("email", value)}
// //                 keyboardType="email-address"
// //                 autoCapitalize="none"
// //                 error={errors.email}
// //                 editable={!loading}
// //                 icon="email-outline"
// //               />

// //               <Input
// //                 label="Phone Number"
// //                 placeholder="Enter your phone number"
// //                 value={formData.phoneNumber}
// //                 onChangeText={(value) =>
// //                   updateFormData("phoneNumber", formatPhoneNumber(value))
// //                 }
// //                 keyboardType="phone-pad"
// //                 error={errors.phoneNumber}
// //                 editable={!loading}
// //                 icon="phone-outline"
// //               />

// //               <Input
// //                 label="Password"
// //                 placeholder="Create a password"
// //                 value={formData.password}
// //                 onChangeText={(value) => updateFormData("password", value)}
// //                 secureTextEntry
// //                 error={errors.password}
// //                 editable={!loading}
// //                 icon="lock-outline"
// //               />

// //               <Input
// //                 label="Confirm Password"
// //                 placeholder="Confirm your password"
// //                 value={formData.confirmPassword}
// //                 onChangeText={(value) =>
// //                   updateFormData("confirmPassword", value)
// //                 }
// //                 secureTextEntry
// //                 error={errors.confirmPassword}
// //                 editable={!loading}
// //                 icon="lock-check-outline"
// //               />

// //               {/* Terms and Conditions */}
// //               <View style={styles.termsContainer}>
// //                 <Text style={styles.termsText}>
// //                   By creating an account, you agree to our{" "}
// //                   <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
// //                   <Text style={styles.termsLink}>Privacy Policy</Text>
// //                 </Text>
// //               </View>

// //               <Button
// //                 title={loading ? "Creating Account..." : "Create Account"}
// //                 onPress={handleRegister}
// //                 disabled={loading}
// //                 loading={loading}
// //                 variant="primary"
// //                 size="large"
// //                 icon="account-plus"
// //                 iconPosition="right"
// //                 fullWidth
// //               />

// //               {/* Login Link */}
// //               <View style={styles.loginContainer}>
// //                 <Text style={styles.loginText}>Already have an account? </Text>
// //                 <TouchableOpacity
// //                   onPress={() => navigation.navigate("login")}
// //                   disabled={loading}
// //                 >
// //                   <Text
// //                     style={[styles.loginLink, loading && styles.disabledLink]}
// //                   >
// //                     Sign In
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </Animated.View>
// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // };

// import CountryPicker, {
//   Country,
//   CountryCode,
// } from "react-native-country-picker-modal";
// import { authService } from "../../api/authService";
// import {
//   ArrowLeft,
//   ArrowLeftCircle,
//   ChevronDown,
//   UserPlus,
// } from "lucide-react-native";
// import Button from "../../components/common/Button";
// import { UserDto } from "../../../types/UserDto";

// const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
//   const { register, loading } = useAuth();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({
//     username: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [showVerificationMessage, setShowVerificationMessage] = useState(false);
//   const [registeredEmail, setRegisteredEmail] = useState("");

//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [slideAnim] = useState(new Animated.Value(50));

//   // Country picker state
//   const [countryCode, setCountryCode] = useState<CountryCode>("US");
//   const [country, setCountry] = useState<Country>({
//     callingCode: ["1"],
//     cca2: "US",
//     currency: ["USD"],
//     flag: "flag-us",
//     name: "United States",
//     region: "Americas",
//     subregion: "North America",
//   });
//   const [showCountryPicker, setShowCountryPicker] = useState(false);

//   React.useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const validateForm = (): boolean => {
//     const newErrors = {
//       username: "",
//       email: "",
//       phoneNumber: "",
//       password: "",
//       confirmPassword: "",
//     };

//     if (!formData.username.trim()) {
//       newErrors.username = "Full name is required";
//     } else if (formData.username.trim().length < 2) {
//       newErrors.username = "Userame must be at least 2 characters";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!isValidEmail(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     // if (!formData.phoneNumber.trim()) {
//     //   newErrors.phoneNumber = "Phone number is required";
//     // } else if (!isValidPhoneNumber(formData.phoneNumber)) {
//     //   newErrors.phoneNumber = "Please enter a valid phone number";
//     // }

//     if (!formData.phoneNumber.trim()) {
//       newErrors.phoneNumber = "Phone number is required";
//     } else {
//       const fullPhone = `+${country.callingCode[0]}${formData.phoneNumber}`;
//       if (!isValidPhoneNumber(fullPhone)) {
//         newErrors.phoneNumber = "Please enter a valid phone number";
//       }
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return !Object.values(newErrors).some((error) => error !== "");
//   };

//   const isValidEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   //          / ... /	        The regex literal syntax in JavaScript
//   //          ^	              Start of the string
//   //          [^\s@]+	        One or more characters that are not whitespace (\s) or @
//   //          @	              The literal “@” character
//   //          [^\s@]+	        One or more characters that are not whitespace or @ (this is the domain part before the dot)
//   //          \.	            A literal dot . (escaped because . normally means “any character”)
//   //          [^\s@]+	        One or more characters again — for the domain suffix (com, org, etc.)
//   //          $	              End of the string

//   const isValidPhoneNumber = (phone: string): boolean => {
//     // Strict E.164 format validation (matches backend)
//     const phoneRegex = /^\+[1-9]\d{1,14}$/;
//     return phoneRegex.test(phone);
//   };

//   //           ^	            Start of the string
//   //           \+	            Literal plus sign "+" (all E.164 numbers start with +)
//   //           [1-9]	        The first digit after + must be 1–9 (can’t start with 0) — that’s the country code
//   //           \d{1,14}	      Followed by 1 to 14 digits (\d means any digit). Total length including country code = up to 15 digits.
//   //           $	            End of the string

//   // const handleRegister = async () => {
//   //   if (!validateForm()) return;

//   //   try {
//   //     // Format phone number with country code
//   //     const fullPhoneNumber = `+${country.callingCode[0]}${formData.phoneNumber}`;

//   //     console.log(
//   //       "Register data: ",
//   //       formData.email,
//   //       formData.password,
//   //       formData.username,
//   //       fullPhoneNumber
//   //     );

//   //     await register(
//   //       formData.email,
//   //       formData.password,
//   //       formData.username,
//   //       fullPhoneNumber
//   //     );
//   //   } catch (err: any) {
//   //     Alert.alert("Registration Failed", err.message);
//   //   }
//   // };

//   const handleRegister = async (userData: any) => {
//     if (!validateForm()) return;

//     try {
//       // Format phone number with country code
//       const fullPhoneNumber = `+${country.callingCode[0]}${formData.phoneNumber}`;

//       console.log(
//         "Registrantion Data: ",
//         userData.username,
//         userData.email,
//         userData.password,
//         fullPhoneNumber
//       );

//       const result = await register(
//         userData.email,
//         userData.password,
//         userData.username,
//         fullPhoneNumber
//       );

//       // Check if verification is required
//       if (result.requiresVerification || !result.authenticated) {
//         setShowVerificationMessage(true);
//         setRegisteredEmail(userData.email);
//         navigation.navigate("manualVerify", { email: userData.email });
//       } else {
//         navigation.navigate("MainTabs");
//       }
//     } catch (error: any) {
//       alert(error.message);
//     }
//   };

//   const updateFormData = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field as keyof typeof errors]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   const formatPhoneNumber = (value: string) => {
//     return value.replace(/\D/g, "");
//   };

//   const onSelectCountry = (selectedCountry: Country) => {
//     setCountryCode(selectedCountry.cca2 as CountryCode);
//     setCountry(selectedCountry);
//     setShowCountryPicker(false);
//   };

//   // const PhoneInputWithCountryPicker = () => (
//   //   <View style={styles.phoneInputContainer}>
//   //     <Text style={styles.label}>Phone Number</Text>

//   //     <View style={styles.phoneInputRow}>
//   //       {/* Country Picker Button */}
//   //       <TouchableOpacity
//   //         style={styles.countryPickerButton}
//   //         onPress={() => setShowCountryPicker(true)}
//   //         disabled={loading}
//   //       >
//   //         <View style={styles.countryCodeContainer}>
//   //           <CountryPicker
//   //             countryCode={countryCode}
//   //             withFilter
//   //             withFlag
//   //             withCallingCode
//   //             // withCallingCodeButton
//   //             withCountryNameButton
//   //             withEmoji
//   //             visible={showCountryPicker}
//   //             onSelect={onSelectCountry}
//   //             onClose={() => setShowCountryPicker(false)}
//   //             containerButtonStyle={styles.countryPickerButtonInner}
//   //           />
//   //           {/* <Icon name="chevron-down" size={16} color={colors.textSecondary} /> */}
//   //           <ChevronDown size={16} color={colors.textSecondary} />
//   //         </View>
//   //       </TouchableOpacity>

//   //       {/* Phone Number Input */}
//   //       <View style={styles.phoneNumberInput}>
//   //         <Text style={styles.callingCode}>+{country.callingCode[0]}</Text>
//   //         <TextInput
//   //           style={styles.phoneInput}
//   //           placeholder="Enter phone number"
//   //           value={formData.phoneNumber}
//   //           onChangeText={(value) =>
//   //             updateFormData("phoneNumber", formatPhoneNumber(value))
//   //           }
//   //           keyboardType="phone-pad"
//   //           editable={!loading}
//   //           placeholderTextColor={colors.textSecondary}
//   //         />
//   //       </View>
//   //     </View>

//   //     {errors.phoneNumber ? (
//   //       <Text style={styles.errorText}>{errors.phoneNumber}</Text>
//   //     ) : null}
//   //   </View>
//   // );

//   if (showVerificationMessage) {
//     return (
//       <View style={styles.container2}>
//         <Text style={styles.title2}>Check Your Email</Text>
//         <Text style={styles.message}>
//           We've sent a verification link to {registeredEmail}
//         </Text>
//         <Text style={styles.instruction}>
//           Please check your email and click the verification link to activate
//           your account.
//         </Text>

//         <Button
//           title="Back to Login"
//           onPress={() => navigation.navigate("login")}
//         />

//         <Button
//           title="Resend Verification Email"
//           onPress={async () => {
//             try {
//               await authService.resendVerificationEmail(registeredEmail);
//               alert("Verification email resent!");
//             } catch (error: any) {
//               alert(error.message);
//             }
//           }}
//         />

//         <Text style={styles.note}>
//           After verifying your email, you can login to your account.
//         </Text>
//       </View>
//     );
//   }

//   const PhoneInputWithCountryPicker = () => (
//     <View style={styles.phoneInputContainer}>
//       <Text style={styles.label}>Phone Number</Text>

//       <View style={styles.phoneInputRow}>
//         {/* Country Picker Button */}
//         <TouchableOpacity
//           style={styles.countryPickerButton}
//           onPress={() => setShowCountryPicker(true)}
//           disabled={loading}
//         >
//           <View style={styles.countryCodeContainer}>
//             <CountryPicker
//               countryCode={countryCode}
//               withFilter
//               withFlag
//               withCallingCode
//               withCallingCodeButton
//               withEmoji
//               visible={showCountryPicker}
//               onSelect={onSelectCountry}
//               onClose={() => setShowCountryPicker(false)}
//               containerButtonStyle={styles.countryPickerButtonInner}
//             />
//             <Icon name="chevron-down" size={16} color={colors.textSecondary} />
//           </View>
//         </TouchableOpacity>

//         {/* Phone Number Input - FIXED */}
//         <View style={styles.phoneNumberInput}>
//           <Text style={styles.callingCode}>+{country.callingCode[0]}</Text>
//           <TextInput
//             style={styles.phoneInput}
//             placeholder="Enter phone number"
//             value={formData.phoneNumber}
//             onChangeText={(value) => {
//               // Remove all non-digit characters and limit length
//               const digitsOnly = value.replace(/\D/g, "").slice(0, 15);
//               updateFormData("phoneNumber", digitsOnly);
//             }}
//             keyboardType="phone-pad"
//             editable={!loading}
//             placeholderTextColor={colors.textSecondary}
//             maxLength={15}
//           />
//         </View>
//       </View>

//       {/* Phone number preview - helps user see the final format */}
//       {formData.phoneNumber ? (
//         <Text style={styles.phonePreview}>
//           Full number: +{country.callingCode[0]}
//           {formData.phoneNumber}
//         </Text>
//       ) : null}

//       {errors.phoneNumber ? (
//         <Text style={styles.errorText}>{errors.phoneNumber}</Text>
//       ) : (
//         <Text style={styles.helperText}>
//           Enter your phone number without the country code
//         </Text>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

//       <KeyboardAvoidingView
//         style={styles.keyboardAvoid}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Header Section */}
//           <Animated.View
//             style={[
//               styles.header,
//               {
//                 opacity: fadeAnim,
//                 transform: [{ translateY: slideAnim }],
//               },
//             ]}
//           >
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//             >
//               {/* <Icon name="arrow-left" size={24} color={colors.textPrimary} /> */}
//               <ArrowLeft size={24} color={colors.textPrimary} />
//             </TouchableOpacity>

//             <View style={styles.logoContainer}>
//               <View style={styles.logo}>
//                 {/* <Icon name="account-plus" size={32} color={colors.background} /> */}
//                 <UserPlus size={32} color={colors.background} />
//               </View>
//             </View>
//             <Text style={styles.title}>Create Account</Text>
//             <Text style={styles.subtitle}>
//               Join us to start transferring money globally
//             </Text>
//           </Animated.View>

//           {/* Form Section */}
//           <Animated.View
//             style={[
//               styles.formContainer,
//               {
//                 opacity: fadeAnim,
//                 transform: [{ translateY: slideAnim }],
//               },
//             ]}
//           >
//             <View style={styles.form}>
//               <Input
//                 label="Full Name"
//                 placeholder="Enter your full name"
//                 value={formData.username}
//                 onChangeText={(value) => updateFormData("username", value)}
//                 autoCapitalize="words"
//                 error={errors.username}
//                 editable={!loading}
//                 icon="account-outline"
//               />

//               <Input
//                 label="Email Address"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChangeText={(value) => updateFormData("email", value)}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 error={errors.email}
//                 editable={!loading}
//                 icon="email-outline"
//               />

//               {/* Replace the old phone input with the country picker version */}
//               <PhoneInputWithCountryPicker />

//               <Input
//                 label="Password"
//                 placeholder="Create a password"
//                 value={formData.password}
//                 onChangeText={(value) => updateFormData("password", value)}
//                 secureTextEntry
//                 error={errors.password}
//                 editable={!loading}
//                 icon="lock-outline"
//               />

//               <Input
//                 label="Confirm Password"
//                 placeholder="Confirm your password"
//                 value={formData.confirmPassword}
//                 onChangeText={(value) =>
//                   updateFormData("confirmPassword", value)
//                 }
//                 secureTextEntry
//                 error={errors.confirmPassword}
//                 editable={!loading}
//                 icon="lock-check-outline"
//               />

//               {/* Terms and Conditions */}
//               <View style={styles.termsContainer}>
//                 <Text style={styles.termsText}>
//                   By creating an account, you agree to our{" "}
//                   <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
//                   <Text style={styles.termsLink}>Privacy Policy</Text>
//                 </Text>
//               </View>

//               <Button
//                 title={loading ? "Creating Account..." : "Create Account"}
//                 onPress={() => handleRegister(formData)}
//                 disabled={loading}
//                 loading={loading}
//                 variant="primary"
//                 size="large"
//                 icon="UserPlus"
//                 iconPosition="right"
//                 fullWidth
//               />

//               {/* Login Link */}
//               <View style={styles.loginContainer}>
//                 <Text style={styles.loginText}>Already have an account? </Text>
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate("login")}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={[styles.loginLink, loading && styles.disabledLink]}
//                   >
//                     Sign In
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Animated.View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   keyboardAvoid: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//   },
//   header: {
//     alignItems: "center",
//     paddingHorizontal: spacing.large,
//     paddingBottom: spacing.extraLarge,
//   },
//   backButton: {
//     position: "absolute",
//     left: spacing.large,
//     top: 0,
//     padding: spacing.small,
//   },
//   logoContainer: {
//     marginBottom: spacing.large,
//     marginTop: spacing.medium,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: colors.primary,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: colors.primary,
//     shadowOffset: {
//       width: 0,
//       height: 12,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 8,
//   },
//   title: {
//     ...typography.heading1,
//     color: colors.textPrimary,
//     textAlign: "center",
//     marginBottom: spacing.small,
//   },
//   subtitle: {
//     ...typography.bodyLarge,
//     color: colors.textSecondary,
//     textAlign: "center",
//     lineHeight: 24,
//   },
//   formContainer: {
//     paddingHorizontal: spacing.large,
//   },
//   form: {
//     backgroundColor: colors.card,
//     borderRadius: 24,
//     padding: spacing.extraLarge,
//     shadowColor: colors.shadow,
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 24,
//     elevation: 8,
//   },
//   termsContainer: {
//     marginBottom: spacing.large,
//     padding: spacing.medium,
//     backgroundColor: colors.surface,
//     borderRadius: 12,
//   },
//   termsText: {
//     ...typography.bodySmall,
//     color: colors.textSecondary,
//     textAlign: "center",
//     lineHeight: 18,
//   },
//   termsLink: {
//     color: colors.primary,
//     fontWeight: "500",
//   },
//   loginContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: spacing.extraLarge,
//   },
//   loginText: {
//     ...typography.bodyMedium,
//     color: colors.textSecondary,
//   },
//   loginLink: {
//     ...typography.bodyMedium,
//     color: colors.primary,
//     fontWeight: "600",
//   },
//   disabledLink: {
//     opacity: 0.5,
//   },

//   // Phone Input Styles
//   phoneInputContainer: {
//     marginBottom: 20,
//   },
//   phoneInputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     backgroundColor: colors.surface,
//     overflow: "hidden",
//   },
//   countryPickerButton: {
//     borderRightWidth: 1,
//     borderRightColor: colors.border,
//     backgroundColor: colors.surface,
//   },
//   countryPickerButtonInner: {
//     fontSize: 9,
//     paddingHorizontal: 10,
//     paddingVertical: 14,
//   },
//   countryCodeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     minWidth: 80,
//   },
//   phoneNumberInput: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//   },
//   callingCode: {
//     fontSize: 16,
//     color: colors.textPrimary,
//     marginRight: 8,
//     fontWeight: "500",
//   },
//   phoneInput: {
//     flex: 1,
//     fontSize: 16,
//     color: colors.textPrimary,
//     paddingVertical: 16,
//     paddingHorizontal: 0,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: colors.textPrimary,
//     marginBottom: 8,
//   },
//   errorText: {
//     color: colors.error,
//     fontSize: 12,
//     marginTop: 4,
//     marginLeft: 4,
//   },

//   container2: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//     backgroundColor: "#f8fafc",
//   },
//   title2: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#1f2937",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   message: {
//     fontSize: 18,
//     color: "#4b5563",
//     textAlign: "center",
//     marginBottom: 16,
//     lineHeight: 24,
//   },
//   instruction: {
//     fontSize: 16,
//     color: "#6b7280",
//     textAlign: "center",
//     marginBottom: 32,
//     lineHeight: 22,
//   },
//   note: {
//     fontSize: 14,
//     color: "#9ca3af",
//     textAlign: "center",
//     marginTop: 24,
//     lineHeight: 20,
//     fontStyle: "italic",
//   },
//   buttonContainer: {
//     width: "100%",
//     marginVertical: 8,
//   },
//   // If you want custom button styles instead of default Button
//   primaryButton: {
//     backgroundColor: "#667eea",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     marginVertical: 8,
//     width: "100%",
//   },
//   primaryButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   secondaryButton: {
//     backgroundColor: "#e5e7eb",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     marginVertical: 8,
//     width: "100%",
//   },
//   secondaryButtonText: {
//     color: "#374151",
//     fontSize: 16,
//     fontWeight: "600",
//     textAlign: "center",
//   },
// });

// export default RegisterScreen;
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
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/common/Input";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface RegisterScreenProps {
  navigation: any;
}

import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { authService } from "../../api/authService";
import {
  ArrowLeft,
  ArrowLeftCircle,
  ChevronDown,
  UserPlus,
} from "lucide-react-native";
import Button from "../../components/common/Button";
import PasswordInput from "../../components/common/PasswordInput";

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Country picker state
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [country, setCountry] = useState<Country>({
    callingCode: ["1"],
    cca2: "US",
    currency: ["USD"],
    flag: "flag-us",
    name: "United States",
    region: "Americas",
    subregion: "North America",
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);

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
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Username must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const fullPhone = `+${country.callingCode[0]}${formData.phoneNumber}`;
      if (!isValidPhoneNumber(fullPhone)) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      // ISSUE: Backend expects 8 characters, frontend only checks for 6
      newErrors.password = "Password must be at least 8 characters"; // FIXED: Changed from 6 to 8
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  // const handleRegister = async () => {
  //   // ISSUE: Changed parameter - was receiving userData but should use formData
  //   if (!validateForm()) return;

  //   try {
  //     // Format phone number with country code
  //     const fullPhoneNumber = `+${country.callingCode[0]}${formData.phoneNumber}`;

  //     console.log(
  //       "Registration Data: ",
  //       formData.username, // FIXED: Use formData instead of userData parameter
  //       formData.email,
  //       formData.password,
  //       fullPhoneNumber
  //     );

  //     // ISSUE: The register function might not return the expected result structure
  //     const result = await register(
  //       formData.email,
  //       formData.password,
  //       formData.username,
  //       fullPhoneNumber
  //     );

  //     console.log("Registration result:", result); // DEBUG: Check what's actually returned

  //     // ISSUE: The result might not have requiresVerification or authenticated properties
  //     // Let's check different possible response structures
  //     if (
  //       result &&
  //       (result.requiresVerification || !result.authenticated || result.message)
  //     ) {
  //       setShowVerificationMessage(true);
  //       setRegisteredEmail(formData.email);
  //       // Navigate to manual verification screen
  //       if (navigation.navigate) {
  //         navigation.navigate("manualVerify", { email: formData.email });
  //       }
  //     } else if (result && result.email) {
  //       // If user is returned directly (already authenticated)
  //       navigation.navigate("MainTabs");
  //     } else {
  //       // Default case - assume verification is required
  //       setShowVerificationMessage(true);
  //       setRegisteredEmail(formData.email);
  //       if (navigation.navigate) {
  //         navigation.navigate("manualVerify", { email: formData.email });
  //       }
  //     }
  //   } catch (error: any) {
  //     console.error("Registration error:", error);
  //     Alert.alert(
  //       "Registration Failed",
  //       error.message || "An error occurred during registration"
  //     );
  //   }
  // };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      // Format phone number with country code
      const fullPhoneNumber = `+${country.callingCode[0]}${formData.phoneNumber}`;

      console.log(
        "Registration Data: ",
        formData.name,
        formData.email,
        "Pwd***",
        fullPhoneNumber
      );

      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        fullPhoneNumber
      );

      console.log("Registration result:", result);

      // FIXED: Simplified response handling
      if (result.requiresVerification) {
        setShowVerificationMessage(true);
        setRegisteredEmail(formData.email);
        // Navigate to manual verification screen
        navigation.navigate("manualVerify", { email: formData.email });
      } else {
        // User is already verified, go to main app
        navigation.navigate("MainTabs");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        error.message || "An error occurred during registration"
      );
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // FIXED: Type-safe error clearing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const onSelectCountry = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2 as CountryCode);
    setCountry(selectedCountry);
    setShowCountryPicker(false);
  };

  // ISSUE: Missing helperText style - added below
  const helperText = {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 4,
  };

  // ISSUE: Missing phonePreview style - added below
  const phonePreview = {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  };

  if (showVerificationMessage) {
    return (
      <View style={styles.container2}>
        <Text style={styles.title2}>Check Your Email</Text>
        <Text style={styles.message}>
          We've sent a verification link to{" "}
          <Text style={{ fontWeight: "bold", color: "#667eea" }}>
            {registeredEmail}
          </Text>
        </Text>
        <Text style={styles.instruction}>
          Please check your email and click the verification link to activate
          your account.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Back to Login"
            onPress={() => navigation.navigate("login")}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Resend Verification Email"
            onPress={async () => {
              try {
                await authService.resendVerificationEmail(registeredEmail);
                Alert.alert("Success", "Verification email resent!");
              } catch (error: any) {
                Alert.alert("Error", error.message);
              }
            }}
          />
        </View>

        <Text style={styles.note}>
          After verifying your email, you can login to your account.
        </Text>
      </View>
    );
  }

  const PhoneInputWithCountryPicker = () => (
    <View style={styles.phoneInputContainer}>
      <Text style={styles.label}>Phone Number</Text>

      <View style={styles.phoneInputRow}>
        {/* Country Picker Button */}
        <TouchableOpacity
          style={styles.countryPickerButton}
          onPress={() => setShowCountryPicker(true)}
          disabled={loading}
        >
          <View style={styles.countryCodeContainer}>
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withCallingCodeButton
              withEmoji
              visible={showCountryPicker}
              onSelect={onSelectCountry}
              onClose={() => setShowCountryPicker(false)}
              containerButtonStyle={styles.countryPickerButtonInner}
            />
            <Icon name="chevron-down" size={16} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Phone Number Input */}
        <View style={styles.phoneNumberInput}>
          <Text style={styles.callingCode}>+{country.callingCode[0]}</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChangeText={(value) => {
              const digitsOnly = value.replace(/\D/g, "").slice(0, 15);
              updateFormData("phoneNumber", digitsOnly);
            }}
            keyboardType="phone-pad"
            editable={!loading}
            placeholderTextColor={colors.textSecondary}
            maxLength={15}
          />
        </View>
      </View>

      {/* Phone number preview */}
      {formData.phoneNumber ? (
        <Text style={styles.phonePreview}>
          Full number: +{country.callingCode[0]}
          {formData.phoneNumber}
        </Text>
      ) : null}

      {errors.phoneNumber ? (
        <Text style={styles.errorText}>{errors.phoneNumber}</Text>
      ) : (
        <Text style={styles.helperText}>
          Enter your phone number without the country code
        </Text>
      )}
    </View>
  );

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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <UserPlus size={32} color={colors.background} />
              </View>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us to start transferring money globally
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
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                autoCapitalize="words"
                error={errors.name}
                editable={!loading}
                icon="account-outline"
              />

              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                editable={!loading}
                icon="email-outline"
              />

              <PhoneInputWithCountryPicker />

              {/* <Input
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                secureTextEntry
                error={errors.password}
                editable={!loading}
                icon="lock-outline"
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  updateFormData("confirmPassword", value)
                }
                secureTextEntry
                error={errors.confirmPassword}
                editable={!loading}
                icon="lock-check-outline"
              /> */}

              <PasswordInput
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                error={errors.password}
                editable={!loading}
                showPassword={showPassword}
                onToggleVisibility={() => setShowPassword(!showPassword)}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  updateFormData("confirmPassword", value)
                }
                error={errors.confirmPassword}
                editable={!loading}
                showPassword={showConfirmPassword}
                onToggleVisibility={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>

              <Button
                title={loading ? "Creating Account..." : "Create Account"}
                onPress={handleRegister} // FIXED: Removed parameter
                disabled={loading}
                loading={loading}
                variant="primary"
                size="large"
                icon="UserPlus"
                iconPosition="right"
                fullWidth
              />

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("login")}
                  disabled={loading}
                >
                  <Text
                    style={[styles.loginLink, loading && styles.disabledLink]}
                  >
                    Sign In
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
  backButton: {
    position: "absolute",
    left: spacing.large,
    top: 0,
    padding: spacing.small,
  },
  logoContainer: {
    marginBottom: spacing.large,
    marginTop: spacing.medium,
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
  termsContainer: {
    marginBottom: spacing.large,
    padding: spacing.medium,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  termsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.extraLarge,
  },
  loginText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: "600",
  },
  disabledLink: {
    opacity: 0.5,
  },

  // Phone Input Styles
  phoneInputContainer: {
    marginBottom: 20,
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  countryPickerButton: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: colors.surface,
  },
  countryPickerButtonInner: {
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 80,
  },
  phoneNumberInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  callingCode: {
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 8,
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    // ADDED: Missing style
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 4,
  },
  phonePreview: {
    // ADDED: Missing style
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },

  // Verification Message Styles
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title2: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  instruction: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  note: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 24,
    lineHeight: 20,
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 8,
  },
});

export default RegisterScreen;
