import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  setAttendanceFilter,
  recordCheckIn,
  recordCheckOut,
} from "../../store/slices/attendanceSlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";

export default function AdminAttendanceScreen() {
  const dispatch = useDispatch();
  const { stats, records, todayDate, selectedStatusFilter } = useSelector(
    (state) => state.attendance
  );

  const filterTabs = ["All", "Present", "Absent", "On Leave"];

  const filteredRecords = records.filter((rec) => {
    if (selectedStatusFilter === "All") return true;
    return rec.status.toLowerCase() === selectedStatusFilter.toLowerCase();
  });

  const handleManualCheckOut = (record) => {
    dispatch(recordCheckOut({ employeeId: record.employeeId }));
    Alert.alert(
      "Check-out Recorded",
      `Check-out time recorded for ${record.employeeName}.`
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            style={styles.drawerIconBtn}
            onPress={() => dispatch(toggleDrawer())}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={23} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Attendance & Biometrics</Text>
            <Text style={styles.subtitle}>{todayDate} • Live Roster</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.syncBtn}
          onPress={() =>
            Alert.alert(
              "Biometric Sync",
              "Biometric devices at all 4 sites are online and synchronized."
            )
          }
          activeOpacity={0.8}
        >
          <Ionicons name="sync" size={16} color="#FFFFFF" />
          <Text style={styles.syncBtnText}>Sync Logs</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>TOTAL GUARDS</Text>
          <Text style={styles.summaryValue}>{stats.total}</Text>
        </View>
        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>PRESENT TODAY</Text>
          <Text style={[styles.summaryValue, { color: "#16A34A" }]}>
            {stats.present}
          </Text>
        </View>
        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>ATTENDANCE RATE</Text>
          <Text style={[styles.summaryValue, { color: "#2563EB" }]}>
            {stats.presentPercentage}
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {filterTabs.map((tab) => {
          const isActive = selectedStatusFilter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, isActive && styles.activeFilterTab]}
              onPress={() => dispatch(setAttendanceFilter(tab))}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && styles.activeFilterTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Attendance Records List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRecords.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Top row */}
            <View style={styles.cardHeader}>
              <View style={styles.guardInfo}>
                <Text style={styles.guardName}>{item.employeeName}</Text>
                <Text style={styles.guardRole}>
                  {item.role} • {item.empCode}
                </Text>
              </View>

              <View style={styles.presentBadge}>
                <View style={styles.presentDot} />
                <Text style={styles.presentText}>{item.status}</Text>
              </View>
            </View>

            {/* Site location */}
            <View style={styles.siteRow}>
              <Ionicons name="location-outline" size={15} color="#64748B" />
              <Text style={styles.siteText}>{item.site}</Text>
            </View>

            {/* Shift info */}
            <View style={styles.siteRow}>
              <Ionicons name="time-outline" size={15} color="#64748B" />
              <Text style={styles.siteText}>{item.shift}</Text>
            </View>

            {/* Time logs box */}
            <View style={styles.timeLogsBox}>
              <View style={styles.timeLogCol}>
                <Text style={styles.timeLogLabel}>CHECK IN</Text>
                <Text style={styles.timeLogVal}>{item.checkInTime}</Text>
              </View>

              <View style={styles.timeLogCol}>
                <Text style={styles.timeLogLabel}>CHECK OUT</Text>
                <Text style={styles.timeLogVal}>{item.checkOutTime}</Text>
              </View>

              <View style={styles.timeLogCol}>
                <Text style={styles.timeLogLabel}>ON DUTY</Text>
                <Text style={[styles.timeLogVal, { color: "#2563EB" }]}>
                  {item.workHours}
                </Text>
              </View>
            </View>

            {/* Footer verification info */}
            <View style={styles.cardFooter}>
              <View style={styles.verificationRow}>
                <Ionicons
                  name="finger-print"
                  size={16}
                  color="#16A34A"
                />
                <Text style={styles.verificationText}>
                  Biometric {item.biometricStatus}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkOutBtn}
                onPress={() => handleManualCheckOut(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.checkOutBtnText}>Mark Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredRecords.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="checkbox-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No records in this category</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  drawerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  syncBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#16A34A",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  syncBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
    gap: 2,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E2E8F0",
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },
  activeFilterTab: {
    backgroundColor: "#2563EB",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  activeFilterTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  guardInfo: {
    flex: 1,
  },
  guardName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  guardRole: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  presentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  presentDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#16A34A",
  },
  presentText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#166534",
  },
  siteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  siteText: {
    fontSize: 12,
    color: "#475569",
  },
  timeLogsBox: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    justifyContent: "space-between",
  },
  timeLogCol: {
    alignItems: "center",
    flex: 1,
    gap: 2,
  },
  timeLogLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  timeLogVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verificationText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },
  checkOutBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  checkOutBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
});
