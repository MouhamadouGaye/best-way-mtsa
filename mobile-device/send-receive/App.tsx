// import { useEffect } from "react";

// import { useState } from "react";
// import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
// import { useAuth } from "./src/hooks/useAuth";

// // ============= MAIN APP =============
// export default function App() {
//   const [currentScreen, setCurrentScreen] = useState("login");

//   const InnerApp = () => {
//     const { user, loading } = useAuth();

//     useEffect(() => {
//       if (!loading) {
//         setCurrentScreen(user ? "home" : "login");
//       }
//     }, [user, loading]);

//     const navigate = (screen) => {
//       setCurrentScreen(screen);
//     };

//     if (loading) {
//       return (
//         <View style={[styles.container, styles.centerContent]}>
//           <ActivityIndicator size="large" color="#667EEA" />
//           <Text style={styles.loadingText}>Loading...</Text>
//         </View>
//       );
//     }

//     return (
//       <View style={{ flex: 1 }}>
//         {currentScreen === "login" && <LoginScreen navigation={navigate} />}
//         {currentScreen === "register" && (
//           <RegisterScreen navigation={navigate} />
//         )}
//         {currentScreen === "home" && <HomeScreen navigation={navigate} />}
//         {currentScreen === "send" && <SendMoneyScreen navigation={navigate} />}
//         {currentScreen === "addBeneficiary" && (
//           <AddBeneficiaryScreen navigation={navigate} />
//         )}
//         {currentScreen === "beneficiaries" && (
//           <BeneficiariesScreen navigation={navigate} />
//         )}
//         {currentScreen === "receive" && <ReceiveScreen navigation={navigate} />}
//         {currentScreen === "history" && <HistoryScreen navigation={navigate} />}
//       </View>
//     );
//   };

//   return (
//     <AuthProvider>
//       <InnerApp />
//     </AuthProvider>
//   );
// }

import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { TransferProvider } from "./src/context/TransferContext";
import { StripeProvider } from "@stripe/stripe-react-native";

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51SCPMhPbpQBxJwBbKvhe3XYU6CDsSwrauS6NYKXjsXsTFW77Uk98tAlrfDincSjq89Ojt8F87Sd9X9YXL63NFRVv00KJAzUqkt";

export default function App() {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.moneytransfer"
      urlScheme="moneytranfer"
    >
      <AuthProvider>
        <TransferProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AppNavigator />
          </NavigationContainer>
        </TransferProvider>
      </AuthProvider>
    </StripeProvider>
  );
}
