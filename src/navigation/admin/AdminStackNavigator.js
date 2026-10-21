
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminTabNavigator from "./AdminTabNavigator";
import AdminPayrollSetupScreen from "../../module/admin/AdminPayrollSetupScreen";
import AdminStatutorySetupScreen from "../../module/admin/AdminStatutorySetupScreen";

const Stack = createNativeStackNavigator();

export default function AdminStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabNavigator}
      />
      <Stack.Screen
        name="PayrollSetup"
        component={AdminPayrollSetupScreen}
      />
      <Stack.Screen
        name="StatutorySetup"
        component={AdminStatutorySetupScreen}
      />
    </Stack.Navigator>
  );
}
