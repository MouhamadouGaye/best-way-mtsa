// // import React from "react";
// // import { NavigationContainer } from "@react-navigation/native";
// // import { createNativeStackNavigator } from "@react-navigation/native-stack";
// // import { useAuth } from "../context/AuthContext";
// // import AuthStack from "./AuthStack";
// // import MainStack from "./MainStack";

// // const Stack = createNativeStackNavigator();

// // const AppNavigator = () => {
// //   const { user } = useAuth();

// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// //         {user ? (
// //           <Stack.Screen name="Main" component={MainStack} />
// //         ) : (
// //           <Stack.Screen name="Auth" component={AuthStack} />
// //         )}
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // };

// // export default AppNavigator;
// import React from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import LoginScreen from "../screens/auth/LoginScreen";
// import RegisterScreen from "../screens/auth/RegisterScreen";
// // import HomeScreen from "../screens/home/HomeScreen";
// import SendMoneyScreen from "../screens/transfer/SendMoneyScreen";
// import ReceiveScreen from "../screens/transfer/ReceiveScreen";
// import HistoryScreen from "../screens/transfer/HistoryScreen";
// import BeneficiariesScreen from "../screens/beneficiaries/BeneficiariesListScreen";
// import HomeScreen from "../screens/home/HomeSreen";
// // import BeneficiariesScreen from "../screens/beneficiaries/BeneficiariesScreen";

// export type RootStackParamList = {
//   login: undefined;
//   register: undefined;
//   home: undefined;
//   send: undefined;
//   receive: undefined;
//   history: undefined;
//   beneficiaries: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const AppNavigator = () => (
//   <Stack.Navigator
//     initialRouteName="register"
//     screenOptions={{ headerShown: false }}
//   >
//     <Stack.Screen name="login" component={LoginScreen} />
//     <Stack.Screen name="register" component={RegisterScreen} />
//     <Stack.Screen name="home" component={HomeScreen} />
//     <Stack.Screen name="send" component={SendMoneyScreen} />
//     <Stack.Screen name="receive" component={ReceiveScreen} />
//     <Stack.Screen name="history" component={HistoryScreen} />
//     <Stack.Screen name="beneficiaries" component={BeneficiariesScreen} />
//   </Stack.Navigator>
// );

// export default AppNavigator;

// src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
// import SendMoneyScreen from "../screens/transfer/SendMoneyScreen";
import ReceiveScreen from "../screens/transfer/ReceiveScreen";
// import HistoryScreen from "../screens/transfer/HistoryScreen";
import BeneficiariesScreen from "../screens/beneficiaries/BeneficiariesListScreen";
import CardManagementScreen from "../screens/cards/CardManagementScreen";
import MainTabNavigator from "./MainTabNavigator";
import { Loading } from "../components/common/Loading";
import TransfersScreen from "../screens/transfer/TransfersScreen";
import HomeScreen from "../screens/home/HomeSreen";

export type RootStackParamList = {
  login: undefined;
  register: undefined;
  MainTabs: undefined;
  send: undefined;
  receive: undefined;
  history: undefined;
  beneficiaries: undefined;
  CardManagement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "MainTabs" : "login"}
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        // Authenticated screens
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="send" component={HomeScreen} />
          <Stack.Screen name="receive" component={ReceiveScreen} />
          <Stack.Screen name="history" component={TransfersScreen} />
          <Stack.Screen name="beneficiaries" component={BeneficiariesScreen} />
          <Stack.Screen
            name="CardManagement"
            component={CardManagementScreen}
          />
        </>
      ) : (
        // Auth screens
        <>
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
