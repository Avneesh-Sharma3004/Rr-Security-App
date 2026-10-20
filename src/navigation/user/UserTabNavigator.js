import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import useBottomTabBarStyle from "../useBottomTabBarStyle";
import UserDashboard from "../../module/user/dashboard/UserDashboard";
import ShiftManagement from "../../module/user/shifts/ShiftManagement";
import Clients from "../../module/user/clients/Clients"
import Employee from "../../module/user/employee/Employee";
import Attendance from "../../module/user/attendance/Attendance";

const Tab = createBottomTabNavigator();
const icons = {
  Dashboard: "grid-outline",
  Clients: "briefcase-outline",
  Employees: "people-outline",
  Attendance: "calendar-outline",
  Shifts: "time-outline",
};

export default function UserTabNavigator() {
  const tabBarStyle = useBottomTabBarStyle({
    borderTopColor: "#E9EDF4",
    backgroundColor: "#FFFFFF",
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#3157C8",
        tabBarInactiveTintColor: "#929CAF",
        tabBarStyle,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name] || "ellipse-outline"} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={UserDashboard} />
      <Tab.Screen name="Clients" component={Clients} />
      <Tab.Screen name="Employees" component={Employee} />
      <Tab.Screen name="Attendance" component={Attendance} />
      <Tab.Screen name="Shifts" component={ShiftManagement} options={{ title: "Shift Management", tabBarLabel: "Shifts" }} />
    </Tab.Navigator>
  );
}
