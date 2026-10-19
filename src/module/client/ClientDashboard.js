import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/UseAuth";
import CustomButton from "../../components/Button";

export default function ClientDashboard() {
  const { logout } = useAuth();

  return (
    <SafeAreaView>
      <View>
        <Text>ClientDashboard</Text>
        <CustomButton title="Logout" color="red" onPress={() => logout()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
