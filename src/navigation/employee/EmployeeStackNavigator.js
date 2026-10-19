
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmployeeTabNavigator from "./EmployeeTabNavigator";

const Stack = createNativeStackNavigator();

export default function EmployeeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="EmployeeTabs"
        component={EmployeeTabNavigator}
      />
    </Stack.Navigator>
  );
}
