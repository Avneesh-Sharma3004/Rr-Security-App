import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DashboardCard from "../../../components/DashboardCard";
import UserHeader from "../../../components/UserHeader";

const stats = [
  {
    title: "TOTAL EMPLOYEES",
    value: "0",
    detail: "Active roster",
    icon: "people-outline",
    color: "#2875F5",
    tint: "#EAF2FF",
  },
  {
    title: "ACTIVE EMPLOYEES",
    value: "0",
    detail: "100% active",
    icon: "person-add-outline",
    color: "#0AA866",
    tint: "#E6F8EF",
  },
  {
    title: "TODAY'S ATTENDANCE",
    value: "100%",
    detail: "0 present",
    icon: "clipboard-outline",
    color: "#09A98C",
    tint: "#E4F8F4",
  },
  {
    title: "ON LEAVE",
    value: "0",
    detail: "Approved today",
    icon: "calendar-clear-outline",
    color: "#9B45E8",
    tint: "#F5EAFE",
  },
  {
    title: "CURRENT BILLING",
    value: "₹0",
    detail: "This month",
    icon: "receipt-outline",
    color: "#4D5CF5",
    tint: "#ECEEFF",
  },
];

const attendance = [
  { day: "Mon", value: 100, color: "#3478F6" },
  { day: "Tue", value: 100, color: "#8754F5" },
  { day: "Wed", value: 100, color: "#F59E0B" },
  { day: "Thu", value: 100, color: "#10B981" },
  { day: "Fri", value: 100, color: "#6366F1" },
  { day: "Sat", value: 100, color: "#06B6D4" },
  { day: "Sun", value: 100, color: "#F43F5E" },
];

function SectionHeader({ title, subtitle, action }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {action ? (
        <View style={styles.action}>
          <Text style={styles.actionText}>{action}</Text>
          <Ionicons name="arrow-forward" size={15} color="#246BFE" />
        </View>
      ) : null}
    </View>
  );
}

function SectionCard({ children, style }) {
  return <View style={[styles.sectionCard, style]}>{children}</View>;
}

function AttendanceOverview() {
  return (
    <SectionCard>
      <SectionHeader
        title="Attendance Overview"
        subtitle="Real-time attendance and weekly trend"
        action="View"
      />
      <View style={styles.chart}>
        {attendance.map((item) => (
          <View key={item.day} style={styles.chartColumn}>
            <Text style={styles.chartPercent}>{item.value}%</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  { height: `${item.value}%`, backgroundColor: item.color },
                ]}
              />
            </View>
            <Text style={styles.chartDay}>{item.day}</Text>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

function BillingCard() {
  return (
    <SectionCard>
      <SectionHeader
        title="Billing & Invoices"
        subtitle="Current billing period and payment status"
        action="View"
      />
      <View style={styles.billingSummary}>
        {[
          ["Current month billing", "₹0"],
          ["Paid amount", "₹0"],
          ["Pending amount", "₹0"],
          ["Last invoice", "—"],
        ].map(([label, value]) => (
          <View style={styles.billingRow} key={label}>
            <Text style={styles.billingLabel}>{label}</Text>
            <Text style={styles.billingValue}>{value}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.subheading}>Recent invoices</Text>
      <View style={styles.invoiceRow}>
        <View style={styles.invoiceCopy}>
          <Text style={styles.invoiceNumber}>No invoices yet</Text>
          <Text style={styles.invoiceMeta}>
            Your latest invoices will appear here
          </Text>
        </View>
        <Ionicons name="document-text-outline" size={20} color="#7B89A6" />
      </View>
    </SectionCard>
  );
}

function WorkforceCard() {
  return (
    <SectionCard>
      <SectionHeader
        title="Recent Workforce Deployment"
        subtitle="Security personnel and staff assigned to your sites"
        action="View"
      />
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons name="people-outline" size={21} color="#3979EF" />
        </View>
        <Text style={styles.emptyTitle}>No employees assigned yet</Text>
        <Text style={styles.emptyCopy}>
          Your workforce deployment will appear here.
        </Text>
      </View>
    </SectionCard>
  );
}

function NotificationsCard() {
  return (
    <SectionCard>
      <SectionHeader
        title="Recent Notifications"
        subtitle="Updates and notices for your account"
        action="View all"
      />
      <View style={styles.notification}>
        <View style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={18} color="#F06442" />
        </View>
        <View style={styles.notificationCopy}>
          <Text style={styles.notificationTitle}>Hi Everyone</Text>
          <Text style={styles.notificationText}>Hope you are all good.</Text>
          <Text style={styles.notificationDate}>9 Oct 2026</Text>
        </View>
        <View style={styles.unreadDot} />
      </View>
    </SectionCard>
  );
}

export default function ClientDashboard({ navigation }) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <View key={item.title} style={{ width: cardWidth }}>
              <DashboardCard
                title={item.title}
                value={item.value}
                detail={item.detail}
                icon={item.icon}
                color={item.color}
                backgroundColor={item.tint}
              />
            </View>
          ))}
        </View>
        <AttendanceOverview />
        <BillingCard />
        <WorkforceCard />
        <NotificationsCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  content: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 30 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E1E6F0",
    padding: 14,
    marginBottom: 14,
    shadowColor: "#263A62",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 14,
  },
  sectionCopy: { flex: 1, minWidth: 0 },
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
  action: { flexDirection: "row", alignItems: "center", gap: 3, paddingTop: 2 },
  actionText: { color: "#246BFE", fontSize: 12, fontWeight: "700" },
  chart: {
    height: 153,
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
    fontWeight: "700",
  },
  barTrack: {
    width: "66%",
    height: 100,
    backgroundColor: "#F0F5FF",
    borderRadius: 5,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: { width: "100%", borderRadius: 5 },
  chartDay: { color: "#7A88A5", fontSize: 11, lineHeight: 16, marginTop: 6 },
  billingSummary: {
    backgroundColor: "#F5F7FC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  billingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 32,
  },
  billingLabel: { color: "#596987", fontSize: 13 },
  billingValue: { color: "#17213B", fontSize: 14, fontWeight: "800" },
  subheading: {
    color: "#17213B",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 8,
  },
  invoiceRow: {
    borderWidth: 1,
    borderColor: "#E7ECF4",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  invoiceCopy: { flex: 1 },
  invoiceNumber: {
    color: "#17213B",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  invoiceMeta: { color: "#7D8AA6", fontSize: 12, lineHeight: 17, marginTop: 2 },
  emptyState: {
    borderWidth: 1,
    borderColor: "#E7ECF4",
    borderRadius: 11,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: "#FCFDFF",
  },
  emptyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },
  emptyTitle: {
    color: "#1A2542",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyCopy: {
    color: "#7D8AA6",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 3,
  },
  notification: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E7ECF4",
    borderRadius: 10,
    backgroundColor: "#F8F9FD",
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF0E9",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationCopy: { flex: 1, minWidth: 0 },
  notificationTitle: {
    color: "#17213B",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
  },
  notificationText: {
    color: "#63728F",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  notificationDate: {
    color: "#8995AC",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#3478F6",
    marginTop: 5,
  },
});
