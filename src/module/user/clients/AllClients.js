import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DashboardCard from "../../../components/DashboardCard";

export default function AllClients() {
  const stats = [
    {
      title: "Total Clients",
      value: "0",
      // detail: "4 Active",
      // secondaryDetail: "Workforce",
      icon: "people-outline",
      color: "#2474F4",
      tint: "#E8F1FF",
    },
    {
      title: "Active Client",
      value: "0% Present",
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
      value: "0",
      // detail: "1,102 Available",
      // secondaryDetail: "146 Issued",
      icon: "cube-outline",
      color: "#5545E8",
      tint: "#EFEDFF",
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
        {stats.map((item) => (
          <DashboardCard key={item.title} {...item} compact />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 21,
    marginTop: 10,
  },
});
