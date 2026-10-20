
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmployeeTabNavigator from "./EmployeeTabNavigator";
import Hamburger from "../../module/employee/hamburger/Hamburger";
import ApplyLeave from "../../module/employee/leave/ApplyLeave";
import AssetRequisition from "../../module/employee/assets/AssetRequisition";
import Notification from "../../module/employee/notification/Notification";

const Stack = createNativeStackNavigator();

export default function EmployeeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="EmployeeTabs"
        component={EmployeeTabNavigator}
      />
      <Stack.Screen
        name="Menu"
        component={Hamburger}
      />
      <Stack.Screen
        name="ApplyLeave"
        component={ApplyLeave}
      />
      <Stack.Screen
        name="AssetRequisition"
        component={AssetRequisition}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
      />
    </Stack.Navigator>
  );
}
