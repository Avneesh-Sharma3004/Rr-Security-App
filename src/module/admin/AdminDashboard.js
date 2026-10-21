import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import AdminHeader from "./components/AdminHeader";
import StatMetricCard from "./components/StatMetricCard";
import AttendanceChartCard from "./components/AttendanceChartCard";
import QuickInsightCard from "./components/QuickInsightCard";
import DepartmentBreakdownCard from "./components/DepartmentBreakdownCard";
import RecentActivitiesCard from "./components/RecentActivitiesCard";
import AlertsRemindersCard from "./components/AlertsRemindersCard";
import QuickActionModal from "./components/QuickActionModal";

import {
  setSearchQuery,
  setTimeRange,
  setQuickActionModalOpen,
  refreshDashboard,
} from "../../store/slices/dashboardSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    searchQuery,
    selectedTimeRange,
    isQuickActionModalOpen,
    stats,
    attendanceChart,
    quickInsights,
    departmentDistribution,
    recentActivities,
    alertsAndReminders,
  } = useSelector((state) => state.dashboard);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(refreshDashboard());
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const navigateToTab = (tabName, params) => {
    try {
      navigation.navigate(tabName, params);
    } catch {
      navigation.navigate("AdminTabs", {
        screen: tabName,
        params,
      });
    }
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case "add_employee":
        navigateToTab("Employees");
        break;
      case "add_client":
        navigateToTab("Clients");
        break;
      case "create_shift":
        navigateToTab("Shift Management");
        break;
      case "attendance_override":
        navigateToTab("Attendance");
        break;
      case "generate_payroll":
        Alert.alert(
          "Payroll Generated",
          "October 2026 payroll generated successfully for 4 employees."
        );
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Admin Top Header with Brand, Search & Live Clock */}
      <AdminHeader
        searchQuery={searchQuery}
        onSearchChange={(text) => dispatch(setSearchQuery(text))}
        onOpenNotifications={() =>
          Alert.alert(
            "Notifications",
            "1. Provident Fund ECR Filing due in 1 day.\n2. Biometric attendance sync complete."
          )
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Title Banner & Action Buttons */}
        <View style={styles.titleSection}>
          <View style={styles.titleTextContainer}>
            <Text style={styles.pageTitle}>Dashboard</Text>
            <Text style={styles.pageSubtitle}>
              Welcome back, Admin 👋 Here's what's happening at{" "}
              <Text style={styles.boldText}>RR Security & Facilities</Text> today.
            </Text>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.actionsBar}>
            {/* Refresh Icon Button */}
            <TouchableOpacity
              style={styles.iconActionBtn}
              onPress={onRefresh}
              activeOpacity={0.7}
            >
              <Ionicons name="reload-outline" size={17} color="#475569" />
            </TouchableOpacity>

            {/* Today Filter Button */}
            <TouchableOpacity
              style={styles.dateFilterBtn}
              onPress={() =>
                Alert.alert("Date Range", "Currently displaying live data for Today.")
              }
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={15} color="#475569" />
              <Text style={styles.dateFilterText}>Today</Text>
            </TouchableOpacity>

            {/* Quick Action Primary Button */}
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => dispatch(setQuickActionModalOpen(true))}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={17} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Quick Action</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5 KPI Metric Cards (Horizontally Scrollable) */}
        <View style={styles.metricsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.metricsScroll}
          >
            <StatMetricCard
              title="Total Employees"
              value={stats.totalEmployees.value}
              changeText={stats.totalEmployees.change}
              icon="people"
              iconColor="#16A34A"
              iconBg="#DCFCE7"
              isPositive={stats.totalEmployees.positive}
            />

            <StatMetricCard
              title="Active Employees"
              value={stats.activeEmployees.value}
              changeText={stats.activeEmployees.change}
              icon="person"
              iconColor="#9333EA"
              iconBg="#FAF5FF"
              isPositive={stats.activeEmployees.positive}
            />

            <StatMetricCard
              title="Male Employees"
              value={stats.maleEmployees.value}
              changeText={stats.maleEmployees.change}
              icon="male"
              iconColor="#0284C7"
              iconBg="#F0F9FF"
              isPositive={stats.maleEmployees.positive}
            />

            <StatMetricCard
              title="Female Employees"
              value={stats.femaleEmployees.value}
              changeText={stats.femaleEmployees.change}
              icon="female"
              iconColor="#EC4899"
              iconBg="#FDF2F8"
              isPositive={stats.femaleEmployees.positive}
            />

            <StatMetricCard
              title="New Joinee"
              value={stats.newJoinees.value}
              changeText={stats.newJoinees.change}
              icon="person-add"
              iconColor="#EA580C"
              iconBg="#FFF7ED"
              isPositive={stats.newJoinees.positive}
            />
          </ScrollView>
        </View>

        {/* Attendance Overview Chart Card */}
        <AttendanceChartCard
          selectedRange={selectedTimeRange}
          onSelectRange={(range) => dispatch(setTimeRange(range))}
          chartData={attendanceChart[selectedTimeRange]}
        />

        {/* Quick Insights Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
        </View>

        <View style={styles.quickInsightsGrid}>
          <QuickInsightCard
            title={quickInsights.monthlyPayroll.title}
            subtitle={quickInsights.monthlyPayroll.subtitle}
            value={quickInsights.monthlyPayroll.value}
            actionText={quickInsights.monthlyPayroll.actionText}
            icon={quickInsights.monthlyPayroll.icon}
            color={quickInsights.monthlyPayroll.color}
            bgColor={quickInsights.monthlyPayroll.bgColor}
            onPressAction={() => navigation.navigate("PayrollSetup")}
          />

          <QuickInsightCard
            title={quickInsights.attendanceToday.title}
            subtitle={quickInsights.attendanceToday.subtitle}
            value={quickInsights.attendanceToday.value}
            actionText={quickInsights.attendanceToday.actionText}
            icon={quickInsights.attendanceToday.icon}
            color={quickInsights.attendanceToday.color}
            bgColor={quickInsights.attendanceToday.bgColor}
            onPressAction={() => navigateToTab("Attendance")}
          />

          <QuickInsightCard
            title={quickInsights.onLeaveToday.title}
            subtitle={quickInsights.onLeaveToday.subtitle}
            value={quickInsights.onLeaveToday.value}
            actionText={quickInsights.onLeaveToday.actionText}
            icon={quickInsights.onLeaveToday.icon}
            color={quickInsights.onLeaveToday.color}
            bgColor={quickInsights.onLeaveToday.bgColor}
            onPressAction={() =>
              Alert.alert("Leave Status", "No employees on leave today.")
            }
          />

          <QuickInsightCard
            title={quickInsights.leaveRequests.title}
            subtitle={quickInsights.leaveRequests.subtitle}
            value={quickInsights.leaveRequests.value}
            actionText={quickInsights.leaveRequests.actionText}
            icon={quickInsights.leaveRequests.icon}
            color={quickInsights.leaveRequests.color}
            bgColor={quickInsights.leaveRequests.bgColor}
            onPressAction={() =>
              Alert.alert("Leave Requests", "0 pending leave requests.")
            }
          />

          <QuickInsightCard
            title={quickInsights.pendingClaims.title}
            subtitle={quickInsights.pendingClaims.subtitle}
            value={quickInsights.pendingClaims.value}
            actionText={quickInsights.pendingClaims.actionText}
            icon={quickInsights.pendingClaims.icon}
            color={quickInsights.pendingClaims.color}
            bgColor={quickInsights.pendingClaims.bgColor}
            onPressAction={() =>
              Alert.alert(
                "Pending Claims",
                "2 claims pending:\n1. Uniform allowance claim (Rajesh Singh)\n2. Night patrol travel reimbursement (Krishan Kumar)"
              )
            }
          />

          <QuickInsightCard
            title={quickInsights.upcomingBirthdays.title}
            subtitle={quickInsights.upcomingBirthdays.subtitle}
            value={quickInsights.upcomingBirthdays.value}
            actionText={quickInsights.upcomingBirthdays.actionText}
            icon={quickInsights.upcomingBirthdays.icon}
            color={quickInsights.upcomingBirthdays.color}
            bgColor={quickInsights.upcomingBirthdays.bgColor}
            onPressAction={() =>
              Alert.alert("Birthdays", "No birthdays scheduled for this week.")
            }
          />
        </View>

        {/* Department Distribution Card */}
        <DepartmentBreakdownCard
          departments={departmentDistribution}
          onViewReport={() => navigateToTab("Employees")}
        />

        {/* Recent Activities Card */}
        <RecentActivitiesCard
          activities={recentActivities}
          onViewAll={() =>
            Alert.alert("Activity Log", "All 4 recent activities displayed.")
          }
        />

        {/* Alerts & Reminders Card */}
        <AlertsRemindersCard
          alerts={alertsAndReminders}
          onViewAll={() =>
            Alert.alert(
              "Compliance & Reminders",
              "1. Provident Fund ECR (Due Oct 15)\n2. ESIC Return (Due Oct 21)\n3. Site Inspection (Due Oct 25)"
            )
          }
        />
      </ScrollView>

      {/* Quick Action Modal */}
      <QuickActionModal
        visible={isQuickActionModalOpen}
        onClose={() => dispatch(setQuickActionModalOpen(false))}
        onActionSelect={handleQuickAction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  titleSection: {
    marginBottom: 16,
  },
  titleTextContainer: {
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: "700",
    color: "#1E293B",
  },
  actionsBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  dateFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  dateFilterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  quickActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  metricsSection: {
    marginBottom: 14,
  },
  metricsScroll: {
    paddingVertical: 4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  quickInsightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});