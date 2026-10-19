import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardCard from "../../../components/DashboardCard";
import CustomHeader from "../../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import AllClients from "./AllClients";
import Billing from "./Billing";
import CustomTabs from "../../../components/CustomTab";

const stats = [
  {
    title: "Total Clients",
    value: "4",
    // detail: "4 Active",
    // secondaryDetail: "Workforce",
    icon: "people-outline",
    color: "#2474F4",
    tint: "#E8F1FF",
  },
  {
    title: "Active Client",
    value: "100% Present",
    // detail: "4 / 4",
    icon: "clipboard-outline",
    color: "#0AA866",
    tint: "#E2F8EE",
  },
  {
    title: "Inactive Clients",
    value: "0",
    // detail: "0 Pending",
    // secondaryDetail: "0 on leave today",
    icon: "calendar-clear-outline",
    color: "#E78312",
    tint: "#FFF1DC",
  },
  {
    title: "Total Employees",
    value: "1,248",
    // detail: "1,102 Available",
    // secondaryDetail: "146 Issued",
    icon: "cube-outline",
    color: "#5545E8",
    tint: "#EFEDFF",
  },
];

const TABS = [
  {
    key: "Allclients",
    title: "All Clients",
    component: AllClients,
  },
  {
    key: "Billing",
    title: "Billing",
    component: Billing,
  },

  // Add more tabs here whenever required.
];

export default function Clients() {
  const theme = "light"; // "dark" bhi kar sakte ho

  // Example employee details
  const employee = {
    name: "Avneesh Sharma",
    designation: "Software Developer",
  };

  const initial = employee.name.trim().charAt(0).toUpperCase();
  const handleTabChange = (key, tab) => {
    console.log("Selected tab:", key);
  };

  return (
  <SafeAreaView
    style={{ flex: 1, backgroundColor: "#fff" }}
    edges={["top"]}
  >
    {/* Header */}
    <CustomHeader height={40} color="#FFFFFF">
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName} numberOfLines={1}>
              {employee.name}
            </Text>
            <Text style={styles.designation} numberOfLines={1}>
              {employee.designation}
            </Text>
          </View>
        </View>

        <Ionicons name="notifications-outline" size={30}  style={{marginTop:-40}}/>
      </View>
    </CustomHeader>

    {/* Tabs ko available height do */}
    <View style={{ flex: 1, minHeight: 0,paddingHorizontal:10 }}>
      <CustomTabs
        tabs={TABS}
        initialTabKey="Allclients"
        onChange={handleTabChange}
      />
    </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 21,
    marginTop: 10,
  },
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

  content: {
    paddingHorizontal: 10,
    flex: 1,
  },
});
