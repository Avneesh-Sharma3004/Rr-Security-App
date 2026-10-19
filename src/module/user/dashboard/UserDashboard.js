import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/UseAuth";
import DashboardCard from "../../../components/DashboardCard";

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

const attendance = [
  { day: "Sun", value: 92 },
  { day: "Mon", value: 94 },
  { day: "Tue", value: 96 },
  { day: "Wed", value: 98 },
  { day: "Thu", value: 92 },
  { day: "Fri", value: 94 },
  { day: "Sat", value: 96 },
];

const activities = [
  { text: "Employee attendance marked for Site Alpha", time: "10 min ago" },
  { text: "Leave request approved for Amit Sharma", time: "35 min ago" },
  { text: "Overtime claim submitted for 18 employees", time: "1 hour ago" },
  { text: "New announcement posted to security teams", time: "2 hours ago" },
];

function SectionHeader({ title, subtitle, trailing }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeadingCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {trailing}
    </View>
  );
}

function SectionCard({ children, style }) {
  return <View style={[styles.sectionCard, style]}>{children}</View>;
}

function AttendanceChart() {
  return (
    <SectionCard>
      <SectionHeader
        title="Attendance Overview"
        subtitle="Weekly muster attendance trends"
        trailing={<Text style={styles.averageBadge}>This Week: 93.5% Avg</Text>}
      />
      <View style={styles.chart}>
        {attendance.map((item) => (
          <View key={item.day} style={styles.chartColumn}>
            <Text style={styles.chartPercent}>{item.value}%</Text>
            <View style={styles.barTrack}>
              <View style={[styles.bar, { height: `${item.value}%` }]} />
            </View>
            <Text style={styles.chartDay}>{item.day}</Text>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

function RecentActivities() {
  return (
    <SectionCard>
      <SectionHeader
        title="Recent Activities"
        subtitle="Operational action logs"
        trailing={<Ionicons name="time-outline" size={20} color="#8492AE" />}
      />
      <View style={styles.activityList}>
        {activities.map((activity, index) => (
          <View
            key={activity.text}
            style={[styles.activityRow, index > 0 && styles.activityBorder]}
          >
            <View style={styles.activityIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={17}
                color="#2875F5"
              />
            </View>
            <View style={styles.activityCopy}>
              <Text style={styles.activityText}>{activity.text}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

function RecentLeaveRequests({ compact }) {
  return (
    <SectionCard>
      <SectionHeader
        title="Recent Leave Requests"
        subtitle="Requests requiring verification"
      />
      {compact ? (
        <View style={styles.mobileLeave}>
          <View style={styles.mobileLeaveTop}>
            <View>
              <Text style={styles.mobileEmployee}>Rahul Kumar</Text>
              <Text style={styles.mobileLeaveType}>Casual Leave</Text>
            </View>
            <Text style={styles.pendingBadge}>Pending</Text>
          </View>
          <View style={styles.mobileLeaveBottom}>
            <Text style={styles.mobileMeta}>
              Duration <Text style={styles.mobileMetaValue}>2 days</Text>
            </Text>
            <Text style={styles.mobileMeta}>
              Dates <Text style={styles.mobileMetaValue}>28-29 Aug</Text>
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeading, styles.employeeColumn]}>
              EMPLOYEE
            </Text>
            <Text style={[styles.tableHeading, styles.leaveColumn]}>
              LEAVE TYPE
            </Text>
            <Text style={[styles.tableHeading, styles.durationColumn]}>
              DURATION
            </Text>
            <Text style={[styles.tableHeading, styles.dateColumn]}>DATES</Text>
            <Text style={[styles.tableHeading, styles.statusHeaderColumn]}>
              STATUS
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[styles.tableText, styles.employeeColumn]}
              numberOfLines={1}
            >
              Rahul Kumar
            </Text>
            <Text
              style={[styles.tableText, styles.leaveColumn]}
              numberOfLines={1}
            >
              Casual Leave
            </Text>
            <Text style={[styles.tableText, styles.durationColumn]}>
              2 days
            </Text>
            <Text style={[styles.tableText, styles.dateColumn]}>28-29 Aug</Text>
            <View style={styles.statusColumn}>
              <Text style={styles.pendingBadge}>Pending</Text>
            </View>
          </View>
        </View>
      )}
    </SectionCard>
  );
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Pawan";
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const compact = width < 380;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTop}>
          <Ionicons name="menu-outline" size={26} color="#111A35" />
          <View style={styles.dateCard}>
            <Ionicons name="calendar-outline" size={20} color="#2875F5" />
            <View>
              <Text style={styles.dateText}>{date}</Text>
              <Text style={styles.todayText}>TODAY</Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.greetingRow}>
          <Text
            style={styles.greeting}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            Welcome back, {firstName} <Text style={styles.wave}>{"\u{1F44B}"}</Text>
          </Text>
          <View style={styles.managerBadge}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color="#2875F5"
            />
            <Text style={styles.managerText}>Manager</Text>
          </View>
        </View> */}
        

        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <DashboardCard key={item.title} {...item} compact />
          ))}
        </View>

        <AttendanceChart />
        <RecentActivities />
        <RecentLeaveRequests compact={compact} />
        {/* <Pressable accessibilityRole="button" accessibilityLabel="Log out" style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={16} color="#71809E" />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F6FB" },
  content: { paddingHorizontal: 17, paddingTop: 9, paddingBottom: 30 },
  headerTop: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  dateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E8EDF6",
    paddingHorizontal: 11,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    shadowColor: "#263A62",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
  },
  dateText: { color: "#17213B", fontSize: 12, fontWeight: "700" },
  todayText: {
    color: "#7B89A6",
    fontSize: 10,
    marginTop: 2,
    fontWeight: "600",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 2,
    marginBottom:10
  },
  greeting: {
    flexShrink: 1,
    color: "#101A39",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  wave: { fontSize: 21 },
  managerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D7E6FF",
  },
  managerText: { color: "#2875F5", fontSize: 11, fontWeight: "700" },
  intro: {
    color: "#71809E",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 18,
    maxWidth: 390,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 21,
    marginTop:10
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E5EAF3",
    padding: 14,
    marginBottom: 15,
    shadowColor: "#30446B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.055,
    shadowRadius: 9,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  sectionHeadingCopy: { flex: 1, minWidth: 0 },
  sectionTitle: {
    color: "#111B38",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#7785A2",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  averageBadge: {
    color: "#07995B",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
    backgroundColor: "#E9F9F1",
    borderWidth: 1,
    borderColor: "#B9EFD4",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  chart: {
    height: 137,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
    paddingTop: 5,
  },
  chartColumn: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  chartPercent: {
    color: "#657493",
    fontSize: 10,
    lineHeight: 15,
    marginBottom: 5,
  },
  barTrack: {
    width: "70%",
    height: 85,
    backgroundColor: "#F0F5FF",
    borderRadius: 5,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: { width: "100%", backgroundColor: "#3478F6", borderRadius: 5 },
  chartDay: { color: "#7A88A5", fontSize: 10, lineHeight: 15, marginTop: 6 },
  activityList: { marginTop: -2 },
  activityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    paddingVertical: 9,
  },
  activityBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E7ECF4",
  },
  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  activityCopy: { flex: 1, minWidth: 0, paddingTop: 1 },
  activityText: { color: "#1A2542", fontSize: 13, lineHeight: 18 },
  activityTime: { color: "#7D8AA6", fontSize: 11, marginTop: 3 },
  table: { overflow: "hidden", borderRadius: 7 },
  tableHeader: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    backgroundColor: "#F4F7FB",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E3E8F1",
  },
  tableRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5EAF2",
  },
  tableHeading: {
    color: "#697997",
    fontSize: 8,
    lineHeight: 11,
    fontWeight: "700",
  },
  tableText: { color: "#455573", fontSize: 9, lineHeight: 13 },
  employeeColumn: { flex: 1.15, minWidth: 0 },
  leaveColumn: { flex: 1.2, minWidth: 0 },
  durationColumn: { flex: 0.8, minWidth: 0 },
  dateColumn: { flex: 0.95, minWidth: 0 },
  statusHeaderColumn: { flex: 0.9, minWidth: 0 },
  statusColumn: { flex: 0.9, minWidth: 0, alignItems: "flex-start" },
  pendingBadge: {
    color: "#D97800",
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "700",
    paddingHorizontal: 7,
    paddingVertical: 4,
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD58A",
    backgroundColor: "#FFF7E8",
  },
  mobileLeave: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#E7ECF4",
    borderRadius: 13,
    backgroundColor: "#FCFDFF",
  },
  mobileLeaveTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  mobileEmployee: { color: "#182442", fontSize: 13, fontWeight: "700" },
  mobileLeaveType: { color: "#73819C", fontSize: 11, marginTop: 3 },
  mobileLeaveBottom: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
    paddingTop: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6EBF3",
  },
  logoutButton: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 4 },
  logoutText: { color: "#71809E", fontSize: 12, fontWeight: "600" },
  mobileMeta: { color: "#7A88A3", fontSize: 10 },
  mobileMetaValue: { color: "#43516E", fontWeight: "700" },
});



