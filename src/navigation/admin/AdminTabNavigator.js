
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import useBottomTabBarStyle from "../useBottomTabBarStyle";

import AdminDashboard from "../../module/admin/AdminDashboard";

const Tab = createBottomTabNavigator();

export default function AdminTabNavigator() {
  const tabBarStyle = useBottomTabBarStyle({
    borderTopColor: "#E9EDF4",
    backgroundColor: "#FFFFFF",
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: "grid-outline",
          };

          return (
            <Ionicons
              name={icons[route.name] || "ellipse-outline"}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
      />
    </Tab.Navigator>
  );
}
