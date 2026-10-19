import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import UserHeader from "../../../components/UserHeader";
import CustomTabs from "../../../components/CustomTab";
import AttendanceRegister from "./AttendanceRegister";
import CorrectionRequests from "./CorrectionRequests";

const TABS = [
  {
    key: "Register",
    title: "Attendance Register",
    component: AttendanceRegister,
  },
  {
    key: "Request",
    title: "Correction Request",
    component: CorrectionRequests,
  },

  // Add more tabs here whenever required.
];

export default function MyAttendance({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <CustomTabs tabs={TABS} initialTabKey="Register" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
