// // src/navigation/MainTabNavigator.tsx
// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { StyleSheet, View, Animated } from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// // Import your screens
// import CardManagementScreen from "../screens/cards/CardManagementScreen";
// import ProfileScreen from "../screens/profile/ProfileScreen";
// import BeneficiariesScreen from "../screens/beneficiaries/BeneficiariesListScreen";
// import { colors } from "../styles/colors";
// import HomeScreen from "../screens/home/HomeSreen";
// import TransfersScreen from "../screens/transfer/TransfersScreen";
// import { typography } from "../styles/typography";
// // import { typography } from "../../styles/typography";
// // import HomeScreen from "../screens/home/HomeScreen";
// // import TransfersScreen from "../screens/transfers/TransfersScreen";

// const Tab = createBottomTabNavigator();

// const MainTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarStyle: styles.tabBar,
//         tabBarBackground: () => <View style={styles.tabBarBackground} />,
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === "Home") {
//             iconName = focused ? "home" : "home-outline";
//           } else if (route.name === "Transfers") {
//             iconName = focused ? "swap-horizontal-bold" : "swap-horizontal";
//           } else if (route.name === "Beneficiaries") {
//             iconName = focused ? "account-group" : "account-group-outline";
//           } else if (route.name === "Cards") {
//             iconName = focused ? "credit-card" : "credit-card-outline";
//           } else if (route.name === "Profile") {
//             iconName = focused ? "account" : "account-outline";
//           }

//           return (
//             <AnimatedIcon
//               name={iconName}
//               size={size}
//               color={color}
//               focused={focused}
//             />
//           );
//         },
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: colors.textTertiary,
//         tabBarLabelStyle: styles.tabBarLabel,
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarLabel: "Home",
//         }}
//       />
//       <Tab.Screen
//         name="Transfers"
//         component={TransfersScreen}
//         options={{
//           tabBarLabel: "Transfers",
//         }}
//       />
//       <Tab.Screen
//         name="Beneficiaries"
//         component={BeneficiariesScreen}
//         options={{
//           tabBarLabel: "Beneficiaries",
//         }}
//       />
//       <Tab.Screen
//         name="Cards"
//         component={CardManagementScreen}
//         options={{
//           tabBarLabel: "Cards",
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           tabBarLabel: "Profile",
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// // Animated Icon Component
// const AnimatedIcon = ({ name, size, color, focused }: any) => {
//   const scaleAnim = React.useRef(new Animated.Value(1)).current;

//   React.useEffect(() => {
//     if (focused) {
//       Animated.spring(scaleAnim, {
//         toValue: 1.2,
//         friction: 3,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 3,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [focused, scaleAnim]);

//   return (
//     <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//       <View style={focused ? styles.iconContainerActive : styles.iconContainer}>
//         <Icon name={name} size={size - 2} color={color} />
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//     height: 70,
//     borderRadius: 25,
//     backgroundColor: "transparent",
//     borderTopWidth: 0,
//     elevation: 0,
//     shadowOpacity: 0,
//   },
//   tabBarBackground: {
//     flex: 1,
//     backgroundColor: colors.card,
//     borderRadius: 25,
//     shadowColor: colors.shadow,
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   tabBarLabel: {
//     ...typography.caption,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   iconContainerActive: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: colors.primary + "15",
//   },
// });

// export default MainTabNavigator;

// src/navigation/MainTabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Animated } from "react-native";
import {
  Home,
  Home as HomeFilled,
  ArrowLeftRight,
  ArrowLeftRight as ArrowLeftRightFilled,
  Users,
  Users as UsersFilled,
  CreditCard,
  CreditCard as CreditCardFilled,
  User,
  User as UserFilled,
} from "lucide-react-native";

// Import your screens
import CardManagementScreen from "../screens/cards/CardManagementScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import BeneficiariesScreen from "../screens/beneficiaries/BeneficiariesListScreen";
import { colors } from "../styles/colors";
import HomeScreen from "../screens/home/HomeSreen";
import TransfersScreen from "../screens/transfer/TransfersScreen";
import { typography } from "../styles/typography";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
        tabBarIcon: ({ focused, color, size }) => {
          const iconProps = {
            size: size - 2,
            color: color,
          };

          if (route.name === "Home") {
            return focused ? (
              <AnimatedIcon>
                <HomeFilled {...iconProps} fill={color} />
              </AnimatedIcon>
            ) : (
              <AnimatedIcon>
                <Home {...iconProps} />
              </AnimatedIcon>
            );
          } else if (route.name === "Transfers") {
            return focused ? (
              <AnimatedIcon>
                <ArrowLeftRightFilled {...iconProps} />
              </AnimatedIcon>
            ) : (
              <AnimatedIcon>
                <ArrowLeftRight {...iconProps} />
              </AnimatedIcon>
            );
          } else if (route.name === "Beneficiaries") {
            return focused ? (
              <AnimatedIcon>
                <UsersFilled {...iconProps} />
              </AnimatedIcon>
            ) : (
              <AnimatedIcon>
                <Users {...iconProps} />
              </AnimatedIcon>
            );
          } else if (route.name === "Cards") {
            return focused ? (
              <AnimatedIcon>
                <CreditCardFilled {...iconProps} />
              </AnimatedIcon>
            ) : (
              <AnimatedIcon>
                <CreditCard {...iconProps} />
              </AnimatedIcon>
            );
          } else if (route.name === "Profile") {
            return focused ? (
              <AnimatedIcon>
                <UserFilled {...iconProps} />
              </AnimatedIcon>
            ) : (
              <AnimatedIcon>
                <User {...iconProps} />
              </AnimatedIcon>
            );
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Transfers"
        component={TransfersScreen}
        options={{
          tabBarLabel: "Transfers",
        }}
      />
      <Tab.Screen
        name="Beneficiaries"
        component={BeneficiariesScreen}
        options={{
          tabBarLabel: "Beneficiaries",
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardManagementScreen}
        options={{
          tabBarLabel: "Cards",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

// Animated Icon Component for Lucide
const AnimatedIcon = ({ children, focused = true }: any) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (focused) {
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [focused, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={focused ? styles.iconContainerActive : styles.iconContainer}>
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 5,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 25,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarBackground: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 25,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tabBarLabel: {
    ...typography.caption,
    fontWeight: "600",
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  iconContainerActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary + "15",
  },
});

export default MainTabNavigator;
