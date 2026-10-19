import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import EmployeeDashboard from "../../module/employee/dashboard/EmployeeDashboard";
import MyAttendance from "../../module/employee/attendance/MyAttendance";
import MyLeave from "../../module/employee/leave/MyLeave";
import SalarySlip from "../../module/employee/salarySlips/SalarySlip";
import Assets from "../../module/employee/assets/Assets";

const Tab = createBottomTabNavigator();
const icons = {
  Dashboard: "grid-outline",
  "My Attendance": "calendar-outline",
  MyLeave: "airplane-outline",
  SalarySlip: "wallet-outline",
  Assets: "cube-outline",
};

export default function EmployeeTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#3157C8",
        tabBarInactiveTintColor: "#929CAF",
        tabBarStyle: { height: 66, paddingTop: 7, paddingBottom: 8, borderTopColor: "#E9EDF4", backgroundColor: "#FFFFFF" },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name] || "ellipse-outline"} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={EmployeeDashboard} />
      <Tab.Screen name="My Attendance" component={MyAttendance} />
      <Tab.Screen name="MyLeave" component={MyLeave} options={{ title: "My Leave" }} />
      <Tab.Screen name="SalarySlip" component={SalarySlip} options={{ title: "Salary" }} />
      <Tab.Screen name="Assets" component={Assets} />
    </Tab.Navigator>
  );
}
