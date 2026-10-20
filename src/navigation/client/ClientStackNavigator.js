
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientTabNavigator from "./ClientTabNavigator";
import Hamburger from "../../module/client/hamburger/Hamburger";

const Stack = createNativeStackNavigator();

export default function ClientStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ClientTabs"
        component={ClientTabNavigator}
      />
      <Stack.Screen
        name="Menu"
        component={Hamburger}
      />
    </Stack.Navigator>
  );
}
