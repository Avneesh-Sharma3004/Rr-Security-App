
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserTabNavigator from "./UserTabNavigator";

const Stack = createNativeStackNavigator();

export default function UserStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="UserTabs"
        component={UserTabNavigator}
      />
    </Stack.Navigator>
  );
}
