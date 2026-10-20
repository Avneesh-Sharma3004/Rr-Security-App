import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ClientDashboard from "../../module/client/dashboard/ClientDashboard";
import Attendance from "../../module/client/attendance/Attendance";
import Billing from "../../module/client/billing/Billing";
import Employee from "../../module/client/employee/Employee";
import Reports from "../../module/client/reports/Reports";

const Tab = createBottomTabNavigator();
const TAB_ICONS = {
  Dashboard: "grid-outline",
  Attendance: "calendar-outline",
  Billing: "receipt-outline",
  Employees: "people-outline",
  Reports: "bar-chart-outline",
};

export default function ClientTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#3157C8",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          height: 66,
          paddingTop: 7,
          paddingBottom: 8,
          borderTopColor: "#E9EDF4",
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={TAB_ICONS[route.name] || "ellipse-outline"}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={ClientDashboard} />
      <Tab.Screen name="Attendance" component={Attendance} />
      <Tab.Screen name="Billing" component={Billing} />
      <Tab.Screen
        name="Employees"
        component={Employee}
        options={{ tabBarLabel: "Employees" }}
      />
      <Tab.Screen name="Reports" component={Reports} />
    </Tab.Navigator>
  );
}
