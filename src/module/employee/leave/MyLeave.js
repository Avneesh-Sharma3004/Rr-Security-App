import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import UserHeader from "../../../components/UserHeader";
import DashboardCard from "../../../components/DashboardCard";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";
import CustomButton from "../../../components/Button";
import navigationServices from "../../../navigation/navigationServices";

const BALANCES = [
  {
    title: "AVAILABLE LEAVE",
    value: "35 d",
    detail: "Paid balance quota",
    icon: "calendar-outline",
    color: "#2875F5",
    tint: "#EAF2FF",
  },
  {
    title: "USED LEAVE",
    value: "1 d",
    detail: "Taken this cycle",
    icon: "checkmark-circle-outline",
    color: "#883CF5",
    tint: "#F3EAFF",
  },
  {
    title: "PENDING APPROVAL",
    value: "0 d",
    detail: "Awaiting reviews",
    icon: "time-outline",
    color: "#E78312",
    tint: "#FFF4DF",
  },
  {
    title: "APPROVED LEAVE",
    value: "1 d",
    detail: "Sanctioned & synced",
    icon: "calendar-clear-outline",
    color: "#0AA866",
    tint: "#E5F8EE",
  },
  {
    title: "REJECTED / SENT BACK",
    value: "0",
    detail: "Requires attention",
    icon: "close-circle-outline",
    color: "#E34B57",
    tint: "#FFF0F1",
  },
  {
    title: "LWP (UNPAID)",
    value: "1 d",
    detail: "Salary deduction applied",
    icon: "person-circle-outline",
    color: "#883CF5",
    tint: "#F3EAFF",
  },
];

const APPLICATIONS = [
  {
    id: "LV-2026-2730",
    type: "LWP",
    title: "Leave Without Pay",
    status: "Approved",
    payment: "Unpaid",
    start: "16 Oct 2026",
    end: "16 Oct 2026",
    duration: "Full Day",
    days: "1 d",
    submitted: "09 Oct 2026",
    stage: "Fully Processed",
    year: "2026",
  },
];

const STATUS_TONES = {
  Approved: {
    color: "#07834E",
    tint: "#E7F8EF",
    icon: "checkmark-circle-outline",
  },
  Pending: { color: "#B46A00", tint: "#FFF4DF", icon: "time-outline" },
  Rejected: { color: "#D83E4A", tint: "#FFF0F1", icon: "close-circle-outline" },
};

function SectionTitle({ icon, title, subtitle }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color="#2875F5" />
      </View>
      <View style={styles.sectionHeadingCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={19} color="#71809A" />
    </View>
  );
}

function ApplicationDetail({ icon, label, value, tone }) {
  return (
    <View style={styles.detailCell}>
      <View style={[styles.detailIcon, tone && { backgroundColor: tone.tint }]}>
        <Ionicons name={icon} size={16} color={tone?.color || "#2875F5"} />
      </View>
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function MyLeave({ navigation }) {
  const [leaveType, setLeaveType] = useState("All Types");
  const [approvalStatus, setApprovalStatus] = useState("All Statuses");
  const [year, setYear] = useState("2026");

  const filteredApplications = useMemo(
    () =>
      APPLICATIONS.filter((application) => {
        const matchesType =
          leaveType === "All Types" || application.type === leaveType;
        const matchesStatus =
          approvalStatus === "All Statuses" ||
          application.status === approvalStatus;
        return matchesType && matchesStatus && application.year === year;
      }),
    [leaveType, approvalStatus, year],
  );

  const resetFilters = () => {
    setLeaveType("All Types");
    setApprovalStatus("All Statuses");
    setYear("2026");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.overviewRow}>
          <View style={styles.overviewCopy}>
            <Text style={styles.pageTitle}>Leave Overview</Text>
            <Text style={styles.pageSubtitle}>
              Your balance and application status
            </Text>
          </View>
          <CustomButton
            title="Apply Leave"
            onPress={() => navigationServices.navigate("ApplyLeave")}
            leftIcon="add"
            width={132}
            height={42}
            borderRadius={12}
            color="#2875F5"
            fontSize={12}
            style={styles.applyButton}
          />
        </View>

        <View style={styles.sectionCard}>
          <SectionTitle
            icon="shield-checkmark-outline"
            title="Leave Balances & Policy Quota"
          />
          <View style={styles.balanceGrid}>
            {BALANCES.map((item) => (
              <DashboardCard
                key={item.title}
                compact
                title={item.title}
                value={item.value}
                detail={item.detail}
                icon={item.icon}
                color={item.color}
                backgroundColor={item.tint}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <SectionTitle
            icon="document-text-outline"
            title="My Leave Application History"
            subtitle="Track the progress of your submitted leave applications through approval stages."
          />

          <View style={styles.filtersGrid}>
            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Leave Type</Text>
              <BillingFilterDropdown
                label="Leave Type"
                value={leaveType}
                options={[
                  "All Types",
                  "Annual Leave",
                  "Sick Leave",
                  "Casual Leave",
                  "LWP",
                ]}
                onSelect={setLeaveType}
                style={styles.dropdown}
              />
            </View>
            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Approval Status</Text>
              <BillingFilterDropdown
                label="Approval Status"
                value={approvalStatus}
                options={["All Statuses", "Pending", "Approved", "Rejected"]}
                onSelect={setApprovalStatus}
                style={styles.dropdown}
              />
            </View>
            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Year</Text>
              <BillingFilterDropdown
                label="Year"
                value={year}
                options={["2026", "2025", "2024"]}
                onSelect={setYear}
                style={styles.dropdown}
              />
            </View>
            <View style={[styles.filterField, styles.resetField]}>
              <Text style={styles.filterLabel}>&nbsp;</Text>
              <CustomButton
                title="Reset Filters"
                onPress={resetFilters}
                variant="outline"
                leftIcon="funnel-outline"
                iconColor="#2875F5"
                textColor="#34415A"
                fontSize={11}
                height={44}
                borderRadius={11}
                borderColor="#DCE4F0"
                style={styles.resetButton}
              />
            </View>
          </View>

          <View style={styles.applicationList}>
            {filteredApplications.map((application) => {
              const tone = STATUS_TONES[application.status];
              return (
                <View key={application.id} style={styles.applicationCard}>
                  <View style={styles.applicationHeader}>
                    <View style={styles.applicationIdentity}>
                      <View style={styles.typePill}>
                        <Text style={styles.typeText}>{application.type}</Text>
                      </View>
                      <View style={styles.applicationTitleCopy}>
                        <Text style={styles.applicationTitle}>
                          {application.title}
                        </Text>
                        <Text style={styles.applicationId}>
                          Leave ID: {application.id}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.unpaidBadge}>
                      <Text style={styles.unpaidText}>
                        {application.payment}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.applicationDetails}>
                    <ApplicationDetail
                      icon="calendar-outline"
                      label="Duration"
                      value={`${application.start} – ${application.end}\n${application.duration}`}
                    />
                    <ApplicationDetail
                      icon="time-outline"
                      label="Days"
                      value={application.days}
                    />
                    <ApplicationDetail
                      icon="layers-outline"
                      label="Paid / Unpaid"
                      value={application.payment}
                    />
                    <ApplicationDetail
                      icon="calendar-clear-outline"
                      label="Submitted Date"
                      value={application.submitted}
                    />
                    <ApplicationDetail
                      icon="git-network-outline"
                      label="Approval Stage"
                      value={application.stage}
                    />
                    <ApplicationDetail
                      icon={tone.icon}
                      label="Status"
                      value={application.status}
                      tone={tone}
                    />
                  </View>
                </View>
              );
            })}
            {filteredApplications.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={23}
                    color="#8290A8"
                  />
                </View>
                <Text style={styles.emptyTitle}>
                  No leave applications found
                </Text>
                <Text style={styles.emptySubtitle}>
                  Change the filters to see other applications.
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  screen: { flex: 1, backgroundColor: "#FFF" },
  content: { paddingHorizontal: 10, paddingBottom: 28 },
  overviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  overviewCopy: { flex: 1, minWidth: 0 },
  pageTitle: { color: "#17213B", fontSize: 18, fontWeight: "800" },
  pageSubtitle: { color: "#7785A2", fontSize: 11, marginTop: 3 },
  applyButton: { flexShrink: 0 },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAF4",
    borderRadius: 16,
    padding: 13,
    marginBottom: 12,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeadingCopy: { flex: 1, minWidth: 0 },
  sectionTitle: {
    color: "#172746",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#7785A2",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
  balanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 9,
  },
  filtersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginTop: 3,
    marginBottom: 14,
  },
  filterField: { width: "48.5%", minWidth: 0 },
  filterLabel: {
    color: "#78859B",
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 5,
  },
  dropdown: {
    minHeight: 44,
    paddingHorizontal: 10,
    borderRadius: 11,
    borderColor: "#DCE4F0",
  },
  resetField: { justifyContent: "flex-end" },
  resetButton: { marginBottom: 0 },
  applicationList: { gap: 10 },
  applicationCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DCE8FA",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  applicationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 7,
    padding: 11,
    backgroundColor: "#F4F8FF",
  },
  applicationIdentity: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: "#E7DDFF",
  },
  typeText: { color: "#7041C7", fontSize: 9, fontWeight: "800" },
  applicationTitleCopy: { flex: 1, minWidth: 0 },
  applicationTitle: {
    color: "#1B2C4D",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  applicationId: { color: "#7785A2", fontSize: 9, marginTop: 4 },
  unpaidBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#FFF1D2",
  },
  unpaidText: { color: "#B66A00", fontSize: 9, fontWeight: "700" },
  applicationDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  detailCell: {
    width: "50%",
    minHeight: 67,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F6",
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF4FF",
  },
  detailCopy: { flex: 1, minWidth: 0 },
  detailLabel: { color: "#7A89A5", fontSize: 9 },
  detailValue: {
    color: "#233452",
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "600",
    marginTop: 3,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5EAF3",
    borderRadius: 13,
    backgroundColor: "#FBFCFE",
  },
  emptyIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },
  emptyTitle: { color: "#26334A", fontSize: 12, fontWeight: "700" },
  emptySubtitle: {
    color: "#7A869B",
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
  },
});
