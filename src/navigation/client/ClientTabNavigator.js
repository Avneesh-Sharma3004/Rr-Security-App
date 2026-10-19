
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ClientDashboard from "../../module/client/ClientDashboard";

const Tab = createBottomTabNavigator();

export default function ClientTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#16A34A",
        tabBarInactiveTintColor: "#94A3B8",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={ClientDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
