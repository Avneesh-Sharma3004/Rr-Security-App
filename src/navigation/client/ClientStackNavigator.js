
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientTabNavigator from "./ClientTabNavigator";

const Stack = createNativeStackNavigator();

export default function ClientStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ClientTabs"
        component={ClientTabNavigator}
      />
    </Stack.Navigator>
  );
}
