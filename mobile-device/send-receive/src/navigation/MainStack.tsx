// import React from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import BeneficiariesScreen from "../screens/beneficiaries/BeneficiariesListScreen";
// import AddBeneficiaryScreen from "../screens/beneficiaries/addBeneficiarySreen";
// import HomeScreen from "../screens/home/HomeSreen";
// import SendMoneyScreen from "../screens/transfer/SendMoneyScreen";
// import ReceiveScreen from "../screens/transfer/ReceiveScreen";
// import HistoryScreen from "../screens/transfer/HistoryScreen";

// export type MainStackParamList = {
//   home: undefined;
//   send: undefined;
//   receive: undefined;
//   history: undefined;
//   beneficiaries: undefined;
//   addBeneficiary: undefined;
// };

// const Stack = createNativeStackNavigator<MainStackParamList>();

// const MainStack = () => (
//   <Stack.Navigator
//     initialRouteName="home"
//     screenOptions={{ headerShown: false }}
//   >
//     <Stack.Screen name="home" component={HomeScreen} />
//     <Stack.Screen name="send" component={SendMoneyScreen} />
//     <Stack.Screen name="receive" component={ReceiveScreen} />
//     <Stack.Screen name="history" component={HistoryScreen} />
//     <Stack.Screen name="beneficiaries" component={BeneficiariesScreen} />
//     <Stack.Screen name="addBeneficiary" component={AddBeneficiaryScreen} />
//   </Stack.Navigator>
// );

// export default MainStack;
