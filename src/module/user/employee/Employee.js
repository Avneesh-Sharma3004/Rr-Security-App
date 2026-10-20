import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import DashboardCard from "../../../components/DashboardCard";
import { SafeAreaView } from "react-native-safe-area-context";
import UserHeader from "../../../components/UserHeader";
import { Ionicons } from "@expo/vector-icons";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";

const stats = [
  {
    title: "TOTAL EMPLOYEES",
    value: "4",
    detail: "4 Active",
    secondaryDetail: "Workforce",
    icon: "people-outline",
    color: "#2474F4",
    tint: "#E8F1FF",
  },
  {
    title: "TODAY'S ATTENDANCE",
    value: "100% Present",
    detail: "4 / 4",
    icon: "clipboard-outline",
    color: "#0AA866",
    tint: "#E2F8EE",
  },
  {
    title: "PENDING LEAVES",
    value: "0",
    detail: "0 Pending",
    secondaryDetail: "0 on leave today",
    icon: "calendar-clear-outline",
    color: "#E78312",
    tint: "#FFF1DC",
  },
  {
    title: "INVENTORY ITEMS",
    value: "1,248",
    detail: "1,102 Available",
    secondaryDetail: "146 Issued",
    icon: "cube-outline",
    color: "#5545E8",
    tint: "#EFEDFF",
  },
];

const ALL_CLIENTS = "All COMPANIES";
const ALL_PERIODS = "All Periods";
const ALL_STATUSES = "All Statuses";

const CLIENTS = [ALL_CLIENTS];
const PERIODS = [ALL_PERIODS];
const STATUSES = [ALL_STATUSES, "Paid", "Partially Paid", "Pending", "Overdue"];

export default function Employee({ navigation }) {
  const [search, setSearch] = useState("");
  const [client, setClient] = useState(ALL_CLIENTS);
  const [period, setPeriod] = useState(ALL_PERIODS);
  const [status, setStatus] = useState(ALL_STATUSES);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <View style={{ paddingHorizontal: 10 }}>
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <DashboardCard key={item.title} {...item} compact />
          ))}
        </View>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={22} color="#8293B5" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search invoice number, client name, or GSTIN..."
            placeholderTextColor="#8293B5"
            style={styles.searchInput}
            returnKeyType="search"
          />
          {search ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setSearch("")}
            >
              <Ionicons name="close-circle" size={20} color="#8293B5" />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.filters}>
          <BillingFilterDropdown
            label="All Companies"
            value={client}
            options={CLIENTS}
            onSelect={setClient}
            style={styles.filter}
          />
          <BillingFilterDropdown
            label="All Departments"
            value={period}
            options={PERIODS}
            onSelect={setPeriod}
            style={styles.filter}
          />
          <BillingFilterDropdown
            label="All Designations"
            value={status}
            options={STATUSES}
            onSelect={setStatus}
            style={styles.filter}
          />
        </View>

        <View style={{marginTop:10}}>
          <View style={styles.employeeCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AS</Text>
            </View>

            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>Avneesh Sharma</Text>
              <Text style={styles.employeeId}>EMP001</Text>
            </View>

            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>
        </View>
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
  filters: { flexDirection: "row", gap: 8, marginTop: 10 },
  filter: { flex: 1, minWidth: 0, paddingHorizontal: 10 },
  searchBox: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#D7E3F6",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    color: "#14234D",
    fontSize: 14,
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8ECF2",
    borderRadius: 14,
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E8F1FF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2474F4",
  },

  employeeInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
  },

  employeeName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#17211B",
  },

  employeeId: {
    fontSize: 12,
    color: "#8290A5",
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E2F8EE",
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0AA866",
  },

  activeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#087B4B",
  },
});
