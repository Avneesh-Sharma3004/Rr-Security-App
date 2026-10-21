import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import EmployeeCard from "../../../components/EmployeeCard";
import UserHeader from "../../../components/UserHeader";

const REPORTS = [
  {
    id: "attendance",
    title: "Monthly Attendance Muster Roll",
    icon: "calendar-outline",
    color: "#3478F6",
    tint: "#EAF2FF",
    cadence: "Monthly",
    subtitle: "Attendance and shift records",
    records: [
      {
        id: "EMP-1042",
        headline: "Amit Sharma",
        subline: "Site Alpha · General Shift",
        status: "Present",
        details: [
          ["Date", "20 Oct 2026"],
          ["Check in", "08:02 AM"],
          ["Check out", "05:04 PM"],
          ["Total hours", "9h 02m"],
        ],
      },
      {
        id: "EMP-1078",
        headline: "Priya Verma",
        subline: "Site Beta · Day Shift",
        status: "Present",
        details: [
          ["Date", "20 Oct 2026"],
          ["Check in", "07:51 AM"],
          ["Check out", "04:06 PM"],
          ["Total hours", "8h 15m"],
        ],
      },
      {
        id: "EMP-1105",
        headline: "Mohammed Imran",
        subline: "Site Alpha · Night Shift",
        status: "Late",
        details: [
          ["Date", "20 Oct 2026"],
          ["Check in", "10:18 PM"],
          ["Check out", "06:12 AM"],
          ["Total hours", "7h 54m"],
        ],
      },
    ],
  },
  {
    id: "deployment",
    title: "Assigned Personnel Deployment Roster",
    icon: "people-outline",
    color: "#0AA7B5",
    tint: "#E6FAFB",
    cadence: "Live",
    subtitle: "Personnel assigned to your sites",
    records: [
      {
        id: "EMP-1042",
        name: "Amit Sharma",
        status: "Active",
        details: [
          { label: "Designation", value: "Security Guard" },
          { label: "Department", value: "Security" },
          { label: "Assigned site", value: "Site Alpha" },
          { label: "Shift", value: "General · 08:00 AM–05:00 PM" },
          { label: "Police verification", value: "Verified" },
        ],
      },
      {
        id: "EMP-1078",
        name: "Priya Verma",
        status: "Active",
        details: [
          { label: "Designation", value: "Security Supervisor" },
          { label: "Department", value: "Security" },
          { label: "Assigned site", value: "Site Beta" },
          { label: "Shift", value: "Day · 07:00 AM–04:00 PM" },
          { label: "Police verification", value: "Verified" },
        ],
      },
      {
        id: "EMP-1105",
        name: "Mohammed Imran",
        status: "Active",
        details: [
          { label: "Designation", value: "Field Officer" },
          { label: "Department", value: "Operations" },
          { label: "Assigned site", value: "Site Alpha" },
          { label: "Shift", value: "Night · 10:00 PM–06:00 AM" },
          { label: "Police verification", value: "In review" },
        ],
      },
      {
        id: "EMP-1121",
        name: "Neha Singh",
        status: "On Leave",
        details: [
          { label: "Designation", value: "Security Guard" },
          { label: "Department", value: "Security" },
          { label: "Assigned site", value: "Site Gamma" },
          { label: "Shift", value: "Day · 08:00 AM–05:00 PM" },
          { label: "Police verification", value: "Verified" },
        ],
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Invoice Statement",
    icon: "receipt-outline",
    color: "#E88A12",
    tint: "#FFF5E5",
    cadence: "Monthly",
    subtitle: "Billing periods and payment status",
    records: [
      {
        id: "INV-2026-1001",
        headline: "October 2026",
        subline: "8 personnel",
        status: "Paid",
        details: [
          ["Gross amount", "₹1,48,000"],
          ["Paid amount", "₹1,48,000"],
          ["Pending amount", "₹0"],
          ["Due date", "15 Oct 2026"],
        ],
      },
      {
        id: "INV-2026-1002",
        headline: "October 2026",
        subline: "5 personnel",
        status: "Partially Paid",
        details: [
          ["Gross amount", "₹92,500"],
          ["Paid amount", "₹50,000"],
          ["Pending amount", "₹42,500"],
          ["Due date", "22 Oct 2026"],
        ],
      },
      {
        id: "INV-2026-0901",
        headline: "September 2026",
        subline: "12 personnel",
        status: "Paid",
        details: [
          ["Gross amount", "₹2,16,000"],
          ["Paid amount", "₹2,16,000"],
          ["Pending amount", "₹0"],
          ["Due date", "15 Sep 2026"],
        ],
      },
    ],
  },
  {
    id: "wages",
    title: "Deployment Wage Summary",
    icon: "cash-outline",
    color: "#5B5DEB",
    tint: "#EEEEFF",
    cadence: "Monthly",
    subtitle: "Estimated wages for deployed personnel",
    records: [
      {
        id: "EMP-1042",
        headline: "Amit Sharma",
        subline: "Security Guard · Site Alpha",
        status: "Active",
        details: [
          ["Estimated monthly gross", "₹22,500"],
          ["Statutory compliance", "PF & ESI covered"],
          ["Deployment status", "Active"],
        ],
      },
      {
        id: "EMP-1078",
        headline: "Priya Verma",
        subline: "Security Supervisor · Site Beta",
        status: "Active",
        details: [
          ["Estimated monthly gross", "₹31,000"],
          ["Statutory compliance", "PF & ESI covered"],
          ["Deployment status", "Active"],
        ],
      },
      {
        id: "EMP-1105",
        headline: "Mohammed Imran",
        subline: "Field Officer · Site Alpha",
        status: "Active",
        details: [
          ["Estimated monthly gross", "₹28,000"],
          ["Statutory compliance", "PF covered · ESI review"],
          ["Deployment status", "Active"],
        ],
      },
      {
        id: "EMP-1121",
        headline: "Neha Singh",
        subline: "Security Guard · Site Gamma",
        status: "On Leave",
        details: [
          ["Estimated monthly gross", "₹22,500"],
          ["Statutory compliance", "PF & ESI covered"],
          ["Deployment status", "On approved leave"],
        ],
      },
    ],
  },
];

const STATUS_TONES = {
  Present: { color: "#087B4B", background: "#E6F8EF" },
  Late: { color: "#B96A0A", background: "#FFF4DF" },
  Paid: { color: "#087B4B", background: "#E6F8EF" },
  "Partially Paid": { color: "#246BCE", background: "#EAF2FF" },
  Pending: { color: "#B96A0A", background: "#FFF4DF" },
  Active: { color: "#087B4B", background: "#E6F8EF" },
  "On Leave": { color: "#8535CA", background: "#F5EAFE" },
};

function RecordCard({ record }) {
  const tone = STATUS_TONES[record.status] || {
    color: "#586782",
    background: "#F1F4F8",
  };
  return (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.recordCopy}>
          <Text style={styles.recordId}>{record.id}</Text>
          <Text style={styles.recordHeadline}>{record.headline}</Text>
          <Text style={styles.recordSubline}>{record.subline}</Text>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: tone.background }]}
        >
          <Text style={[styles.statusText, { color: tone.color }]}>
            {record.status}
          </Text>
        </View>
      </View>
      <View style={styles.detailGrid}>
        {record.details.map(([label, value]) => (
          <View key={label} style={styles.detailItem}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function Reports({ navigation }) {
  const [selectedId, setSelectedId] = useState(REPORTS[0].id);
  const [search, setSearch] = useState("");
  const selectedReport =
    REPORTS.find((report) => report.id === selectedId) || REPORTS[0];

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return selectedReport.records;
    return selectedReport.records.filter((record) =>
      JSON.stringify(record).toLowerCase().includes(query),
    );
  }, [search, selectedReport]);

  const selectReport = (reportId) => {
    setSelectedId(reportId);
    setSearch("");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reportGrid}>
          {REPORTS.map((report) => {
            const active = report.id === selectedId;
            return (
              <Pressable
                key={report.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => selectReport(report.id)}
                style={({ pressed }) => [
                  styles.reportOption,
                  active && styles.activeReportOption,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.optionTop}>
                  <View
                    style={[
                      styles.optionIcon,
                      { backgroundColor: report.tint },
                    ]}
                  >
                    <Ionicons
                      name={report.icon}
                      size={19}
                      color={report.color}
                    />
                  </View>
                  {active ? (
                    <View style={styles.activePreview}>
                      <View style={styles.activeDot} />
                      <Text style={styles.activePreviewText}>Selected</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.optionTitle} numberOfLines={2}>
                  {report.title}
                </Text>
                <View style={styles.optionBottom}>
                  <Text style={styles.optionCount}>
                    {report.records.length} records
                  </Text>
                  <Text style={styles.optionCadence}>{report.cadence}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeadingCopy}>
            <Text style={styles.sectionTitle}>{selectedReport.title}</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedReport.subtitle}
            </Text>
          </View>
          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: selectedReport.tint },
            ]}
          >
            <Ionicons
              name={selectedReport.icon}
              size={19}
              color={selectedReport.color}
            />
          </View>
        </View>

        {selectedReport.id === "wages" ? (
          <View style={styles.readOnlyNote}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color="#3157C8"
            />
            <Text style={styles.readOnlyText}>
              <Text style={styles.readOnlyStrong}>Read-only client view. </Text>
              Wage figures are estimates; payroll and statutory setup are
              managed by the service provider.
            </Text>
          </View>
        ) : null}

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color="#8793A8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search report records"
            placeholderTextColor="#929DB0"
            style={styles.searchInput}
            returnKeyType="search"
            accessibilityLabel={`Search ${selectedReport.title}`}
          />
          {search ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setSearch("")}
            >
              <Ionicons name="close-circle" size={19} color="#8793A8" />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.resultsHeading}>
          <Text style={styles.resultsTitle}>Report records</Text>
          <View style={styles.resultsCount}>
            <Text style={styles.resultsCountText}>
              {filteredRecords.length}
            </Text>
          </View>
        </View>

        <View style={styles.recordList}>
          {filteredRecords.length ? (
            selectedReport.id === "deployment" ? (
              selectedReport.records
                .filter((record) =>
                  filteredRecords.some((filtered) => filtered.id === record.id),
                )
                .map((record) => (
                  <EmployeeCard
                    key={record.id}
                    name={record.name}
                    employeeId={record.id}
                    status={record.status}
                    details={record.details}
                  />
                ))
            ) : (
              filteredRecords.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))
            )
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="search-outline" size={22} color="#7785A2" />
              </View>
              <Text style={styles.emptyTitle}>No matching report records</Text>
              <Text style={styles.emptyText}>
                Try a different name, site, invoice number or status.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  content: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 30 },
  pageHeading: { marginBottom: 14 },
  pageTitle: {
    color: "#111B38",
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "800",
  },
  pageSubtitle: {
    color: "#7785A2",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  reportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 17,
  },
  reportOption: {
    width: "47%",
    minHeight: 143,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E0E5EF",
    padding: 12,
    justifyContent: "space-between",
    shadowColor: "#263A62",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  activeReportOption: {
    borderWidth: 1.5,
    borderColor: "#3478F6",
    backgroundColor: "#FBFCFF",
    shadowColor: "#3478F6",
    shadowOpacity: 0.1,
  },
  pressed: { opacity: 0.76 },
  optionTop: {
    minHeight: 31,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  optionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#EAF2FF",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3478F6",
  },
  activePreviewText: { color: "#246BCE", fontSize: 9, fontWeight: "700" },
  optionTitle: {
    color: "#17213B",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 9,
    minHeight: 36,
  },
  optionBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEF1F6",
    paddingTop: 8,
    marginTop: 8,
    gap: 4,
  },
  optionCount: { color: "#42516B", fontSize: 11, fontWeight: "700" },
  optionCadence: { color: "#7D8AA6", fontSize: 11 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#E1E6F0",
    padding: 13,
  },
  sectionHeadingCopy: { flex: 1, minWidth: 0 },
  sectionTitle: {
    color: "#17213B",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#7785A2",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  readOnlyNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#EEF4FF",
    borderWidth: 1,
    borderColor: "#D6E4FF",
    padding: 11,
  },
  readOnlyText: { flex: 1, color: "#536A9A", fontSize: 12, lineHeight: 18 },
  readOnlyStrong: { color: "#3157C8", fontWeight: "800" },
  searchBox: {
    minHeight: 46,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    gap: 8,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: "#24324B",
    fontSize: 14,
    paddingVertical: 9,
  },
  resultsHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 10,
  },
  resultsTitle: { color: "#17213B", fontSize: 16, fontWeight: "800" },
  resultsCount: {
    minWidth: 27,
    height: 25,
    paddingHorizontal: 7,
    borderRadius: 13,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  resultsCountText: { color: "#3478F6", fontSize: 12, fontWeight: "800" },
  recordList: { gap: 10 },
  recordCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 13,
    padding: 13,
    shadowColor: "#263A62",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  recordCopy: { flex: 1, minWidth: 0 },
  recordId: {
    color: "#3478F6",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
  },
  recordHeadline: {
    color: "#17213B",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    marginTop: 3,
  },
  recordSubline: {
    color: "#7785A2",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  statusBadge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 5 },
  statusText: { fontSize: 11, fontWeight: "700" },
  detailGrid: {
    borderTopWidth: 1,
    borderTopColor: "#EDF0F5",
    marginTop: 11,
    paddingTop: 9,
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  detailLabel: { flex: 1, color: "#7B88A1", fontSize: 12, lineHeight: 17 },
  detailValue: {
    flex: 1,
    color: "#35435D",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    textAlign: "right",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 13,
    alignItems: "center",
    padding: 25,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F4FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },
  emptyTitle: {
    color: "#1A2542",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    color: "#7D8AA6",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
    textAlign: "center",
  },
  sampleNote: {
    color: "#8A96AA",
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
  },
});
