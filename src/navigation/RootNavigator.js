import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { navigationRef, isReadyRef } from "./navigationServices";

import AuthNavigator from "./AuthNavigator";

import AdminNavigator from "./admin/AdminNavigator";
import EmployeeNavigator from "./employee/EmployeeNavigator";
import UserNavigator from "./user/UserNavigator";
import ClientNavigator from "./client/ClientNavigator";

import { useAuth } from "../hooks/UseAuth";

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  let content;

  if (!user) {
    content = <AuthNavigator />;
  } else {
    switch (user.role) {
      case "ADMIN":
        content = <AdminNavigator />;
        break;

      case "CLIENT":
        content = <ClientNavigator />;
        break;

      case "EMPLOYEE":
        content = <EmployeeNavigator />;
        break;

      case "USER":
        content = <UserNavigator />;
        break;

      default:
        content = <AuthNavigator />;
    }
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      onStateChange={() => {
        // Navigation state tracking can be added here.
      }}
    >
      {content}
    </NavigationContainer>
  );
}
