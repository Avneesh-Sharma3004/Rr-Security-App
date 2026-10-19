import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

import AdminDashboard from "../../module/admin/AdminDashboard";
import AdminClientsScreen from "../../module/admin/AdminClientsScreen";
import AdminEmployeesScreen from "../../module/admin/AdminEmployeesScreen";
import AdminAttendanceScreen from "../../module/admin/AdminAttendanceScreen";
import AdminShiftManagementScreen from "../../module/admin/AdminShiftManagementScreen";
import AdminDrawer from "../../module/admin/components/AdminDrawer";

const Tab = createBottomTabNavigator();

export default function AdminTabNavigator() {
  return (
    <>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          elevation: 8,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "ellipse-outline";

          if (route.name === "Dashboard") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Clients") {
            iconName = focused ? "business" : "business-outline";
          } else if (route.name === "Employees") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Attendance") {
            iconName = focused ? "checkbox" : "checkbox-outline";
          } else if (route.name === "Shift Management") {
            iconName = focused ? "time" : "time-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{
          tabBarLabel: "Dashboard",
        }}
      />
      <Tab.Screen
        name="Clients"
        component={AdminClientsScreen}
        options={{
          tabBarLabel: "Client",
        }}
      />
      <Tab.Screen
        name="Employees"
        component={AdminEmployeesScreen}
        options={{
          tabBarLabel: "Employee",
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={AdminAttendanceScreen}
        options={{
          tabBarLabel: "Attendance",
        }}
      />
      <Tab.Screen
        name="Shift Management"
        component={AdminShiftManagementScreen}
        options={{
          tabBarLabel: "Shift Mgmt",
        }}
      />
    </Tab.Navigator>
    <AdminDrawer />
  </>
  );
}
