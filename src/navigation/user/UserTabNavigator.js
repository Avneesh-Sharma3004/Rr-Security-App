import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import UserDashboard from "../../module/user/dashboard/UserDashboard";
import ClientDashboard from "../../module/client/ClientDashboard";
import EmployeeDashboard from "../../module/employee/dashboard/EmployeeDashboard";
import MyAttendance from "../../module/employee/attendance/MyAttendance";
import ShiftManagement from "../../module/user/shifts/ShiftManagement";
import Clients from "../../module/user/clients/Clients"

const Tab = createBottomTabNavigator();
const icons = {
  Dashboard: "grid-outline",
  Clients: "briefcase-outline",
  Employees: "people-outline",
  Attendance: "calendar-outline",
  Shifts: "time-outline",
};

export default function UserTabNavigator() {
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
      <Tab.Screen name="Dashboard" component={UserDashboard} />
      <Tab.Screen name="Clients" component={Clients} />
      <Tab.Screen name="Employees" component={EmployeeDashboard} />
      <Tab.Screen name="Attendance" component={MyAttendance} />
      <Tab.Screen name="Shifts" component={ShiftManagement} options={{ title: "Shift Management", tabBarLabel: "Shifts" }} />
    </Tab.Navigator>
  );
}
