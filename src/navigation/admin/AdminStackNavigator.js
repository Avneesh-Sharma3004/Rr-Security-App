
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminTabNavigator from "./AdminTabNavigator";

const Stack = createNativeStackNavigator();

export default function AdminStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabNavigator}
      />
    </Stack.Navigator>
  );
}
