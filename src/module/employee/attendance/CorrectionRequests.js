import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardCard from "../../../components/DashboardCard";
import CustomButton from "../../../components/Button";

const REQUESTS = [
  {
    id: "CR-103",
    date: "18 Oct 2026",
    original: "In: Missing\nOut: Missing",
    requested: "In: 09:00 AM\nOut: 06:00 PM",
    reason: "Forgot to punch out",
    submitted: "18 Oct 2026",
    status: "Approved",
    remarks: "Approved by administrator",
  },
  {
    id: "CR-102",
    date: "17 Oct 2026",
    original: "In: Missing\nOut: Missing",
    requested: "In: 10:00 AM\nOut: 07:00 PM",
    reason: "Forgot to punch in",
    submitted: "17 Oct 2026",
    status: "Rejected",
    remarks: "No supporting details",
  },
  {
    id: "CR-101",
    date: "16 Oct 2026",
    original: "In: Missing\nOut: Missing",
    requested: "In: 09:00 AM\nOut: 06:00 PM",
    reason: "Forgot to punch in",
    submitted: "16 Oct 2026",
    status: "Approved",
    remarks: "Approved by administrator",
  },
];

const FILTERS = ["All", "Pending", "Approved", "Rejected"];
const SUMMARY = [
  {
    title: "TOTAL REQUESTS",
    value: "3",
    icon: "document-text-outline",
    color: "#2875F5",
    backgroundColor: "#EEF4FF",
  },
  {
    title: "PENDING ADMIN REVIEW",
    value: "0",
    icon: "time-outline",
    color: "#E78312",
    backgroundColor: "#FFF5E5",
  },
  {
    title: "APPROVED",
    value: "2",
    icon: "checkmark-circle-outline",
    color: "#0AA866",
    backgroundColor: "#E7F8EF",
  },
  {
    title: "REJECTED",
    value: "1",
    icon: "close-circle-outline",
    color: "#E34B57",
    backgroundColor: "#FFF0F1",
  },
];

const STATUS_TONES = {
  Approved: {
    color: "#07834E",
    background: "#E7F8EF",
    icon: "checkmark-circle",
  },
  Rejected: { color: "#D83E4A", background: "#FFF0F1", icon: "close-circle" },
  Pending: { color: "#B46A00", background: "#FFF5E5", icon: "time" },
};

function RequestCard({ request }) {
  const tone = STATUS_TONES[request.status];
  return (
    <View style={styles.requestCard}>
      <View style={styles.requestTop}>
        <View style={styles.dateWrap}>
          <View style={styles.calendarIcon}>
            <Ionicons name="calendar-outline" size={17} color="#2875F5" />
          </View>
          <View>
            <Text style={styles.dateLabel}>TARGET DATE</Text>
            <Text style={styles.dateText}>{request.date}</Text>
          </View>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: tone.background }]}
        >
          <Ionicons name={tone.icon} size={14} color={tone.color} />
          <Text style={[styles.statusText, { color: tone.color }]}>
            {request.status}
          </Text>
        </View>
      </View>

      <View style={styles.punchRow}>
        <View style={styles.punchColumn}>
          <Text style={styles.fieldLabel}>ORIGINAL PUNCH</Text>
          <Text style={styles.originalPunch}>{request.original}</Text>
        </View>
        <View style={styles.punchColumn}>
          <Text style={styles.fieldLabel}>REQUESTED PUNCH</Text>
          <View style={styles.requestedPunch}>
            <Text style={styles.requestedText}>
              {request.requested.replace("\n", "  ·  ")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.fieldLabel}>CATEGORY / REASON</Text>
          <Text style={styles.detailText}>{request.reason}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.fieldLabel}>SUBMITTED</Text>
          <Text style={styles.detailText}>{request.submitted}</Text>
        </View>
      </View>

      <View style={styles.remarksRow}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={15}
          color="#8190A8"
        />
        <Text style={styles.remarksText} numberOfLines={2}>
          {request.remarks}
        </Text>
      </View>
    </View>
  );
}

export default function CorrectionRequests() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filteredRequests = useMemo(
    () =>
      activeFilter === "All"
        ? REQUESTS
        : REQUESTS.filter((item) => item.status === activeFilter),
    [activeFilter],
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.summaryGrid}>
        {SUMMARY.map((item) => (
          <View key={item.title} style={styles.summaryCardWrap}>
            <DashboardCard {...item} />
          </View>
        ))}
      </View>

      <View style={styles.pageHeading}>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>My Attendance Correction Requests</Text>
          <Text style={styles.subtitle}>
            Track the status of your submitted punch adjustment requests.
          </Text>
        </View>
        <View style={styles.headingActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setActiveFilter("All")}
            style={styles.refreshButton}
          >
            <Ionicons name="refresh-outline" size={16} color="#52627D" />
            <Text style={styles.refreshText}>Refresh</Text>
          </Pressable>
          <CustomButton
            title="New Request"
            onPress={() =>
              Alert.alert(
                "New correction request",
                "The request form is not available yet.",
              )
            }
            width="auto"
            leftIcon="add"
            height={40}
            borderRadius={11}
            color="#2875F5"
            fontSize={11}
            style={styles.newRequestButton}
          />
        </View>
      </View>

      <View style={styles.filterBar}>
        {FILTERS.map((filter) => {
          const selected = activeFilter === filter;
          const count =
            filter === "All"
              ? REQUESTS.length
              : REQUESTS.filter((item) => item.status === filter).length;
          return (
            <Pressable
              key={filter}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterTab, selected && styles.selectedFilterTab]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.selectedFilterText,
                ]}
              >
                {filter}
              </Text>
              <Text
                style={[
                  styles.filterCount,
                  selected && styles.selectedFilterText,
                ]}
              >
                {count}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.requestList}>
        {filteredRequests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="document-text-outline"
                size={25}
                color="#8290A8"
              />
            </View>
            <Text style={styles.emptyTitle}>
              No {activeFilter.toLowerCase()} requests
            </Text>
            <Text style={styles.emptyText}>
              Your attendance correction requests will appear here.
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF" },
  content: { marginTop: 10 },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 9,
    marginBottom: 14,
  },
  summaryCardWrap: { width: "48.5%" },
  pageHeading: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EAF3",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  headingCopy: { marginBottom: 12 },
  title: { color: "#17213B", fontSize: 17, lineHeight: 22, fontWeight: "800" },
  subtitle: { color: "#7785A2", fontSize: 11, lineHeight: 16, marginTop: 4 },
  headingActions: { flexDirection: "row", gap: 8 },
  refreshButton: {
    height: 40,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DCE4F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  refreshText: { color: "#52627D", fontSize: 11, fontWeight: "600" },
  newRequestButton: { flex: 1 },
  filterBar: {
    flexDirection: "row",
    padding: 4,
    backgroundColor: "#E9EEF7",
    borderRadius: 12,
    marginBottom: 12,
  },
  filterTab: {
    flex: 1,
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 9,
    paddingHorizontal: 4,
  },
  selectedFilterTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#263A62",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  filterText: { color: "#65738D", fontSize: 10, fontWeight: "600" },
  filterCount: { color: "#8591A6", fontSize: 9 },
  requestList: { gap: 10 },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EAF3",
    borderRadius: 14,
    padding: 13,
  },
  requestTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  dateWrap: { flexDirection: "row", alignItems: "center", gap: 9 },
  calendarIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#EEF4FF",
  },
  dateLabel: {
    color: "#8290A8",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dateText: { color: "#24324C", fontSize: 12, fontWeight: "700", marginTop: 3 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusText: { fontSize: 10, fontWeight: "700" },
  punchRow: { flexDirection: "row", gap: 8, marginBottom: 11 },
  punchColumn: { flex: 1, minWidth: 0 },
  fieldLabel: {
    color: "#8290A8",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.35,
    marginBottom: 5,
  },
  originalPunch: { color: "#66748D", fontSize: 10, lineHeight: 15 },
  requestedPunch: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF4FF",
    borderWidth: 1,
    borderColor: "#D6E5FF",
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  requestedText: { color: "#2463C8", fontSize: 9, fontWeight: "600" },
  detailsRow: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEF1F6",
    paddingTop: 10,
  },
  detailItem: { flex: 1, minWidth: 0 },
  detailText: { color: "#42516D", fontSize: 10, lineHeight: 15 },
  remarksRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 10,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: "#EEF1F6",
  },
  remarksText: { flex: 1, color: "#71809A", fontSize: 10, lineHeight: 15 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EAF3",
    borderRadius: 14,
    padding: 28,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F9",
    marginBottom: 9,
  },
  emptyTitle: { color: "#26334A", fontSize: 13, fontWeight: "700" },
  emptyText: {
    color: "#7A869B",
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
  },
});
