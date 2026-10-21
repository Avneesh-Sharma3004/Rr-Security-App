import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import DailyAttendance from "./DailyAttendance";
import CorractionRequest from "./CorractionRequest";
import CustomTabs from "../../../components/CustomTab";
import UserHeader from "../../../components/UserHeader";

const TABS = [
  {
    key: "DailyAttendance",
    title: "Daily Attendance",
    component: DailyAttendance,
  },
  {
    key: "CorrectionRequest",
    title: "Correction Request",
    component: CorractionRequest,
  },

  // Add more tabs here whenever required.
];

export default function Attendance({navigation}) {
  const employee = {
    name: "Avneesh Sharma",
    designation: "Software Developer",
  };

  const handleTabChange = (key, tab) => {
    console.log("Selected tab:", key);
  };

  const initial = employee.name.trim().charAt(0).toUpperCase();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
        <UserHeader navigation={navigation} />
      <View style={{ flex: 1, minHeight: 0, paddingHorizontal: 10 }}>
        <CustomTabs
          tabs={TABS}
          initialTabKey="DailyAttendance"
          onChange={handleTabChange}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: -40,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#4980f5",
    borderWidth: 1,
    borderColor: "#4980f5",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 23,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  employeeInfo: {
    flex: 1,
    justifyContent: "center",
  },

  employeeName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#17211B",
  },

  designation: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
});
