import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import UserHeader from "../../../components/UserHeader";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";
import CustomButton from "../../../components/Button";

const SALARY_SLIPS = [
  {
    id: "SAL-2026-10",
    month: "October 2026",
    gross: 17861,
    deductions: 2646,
    net: 15215,
    status: "Processed",
    processedDate: "18 Oct 2026",
  },
  {
    id: "SAL-2026-09",
    month: "September 2026",
    gross: 17841,
    deductions: 1987,
    net: 15854,
    status: "Processed",
    processedDate: "19 Sep 2026",
  },
];

const SUMMARY = [
  {
    title: "LATEST NET SALARY",
    value: "₹15,215",
    month: "October 2026",
    icon: "card-outline",
    color: "#2875F5",
    tint: "#EEF4FF",
  },
  {
    title: "GROSS SALARY",
    value: "₹17,861",
    month: "October 2026",
    icon: "trending-up-outline",
    color: "#0AA866",
    tint: "#E7F8EF",
  },
  {
    title: "DEDUCTIONS",
    value: "₹2,646",
    month: "October 2026",
    icon: "trending-down-outline",
    color: "#E34B57",
    tint: "#FFF0F1",
  },
  {
    title: "STATUS",
    value: "Processed",
    month: "October 2026",
    icon: "cash-outline",
    color: "#B77908",
    tint: "#FFF6DD",
  },
];

const MONTHS = ["All Months", ...SALARY_SLIPS.map((slip) => slip.month)];
const STATUSES = ["All Statuses", "Processed", "Pending"];
const money = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

function SummaryCard({ item }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTop}>
        <View style={[styles.summaryIcon, { backgroundColor: item.tint }]}>
          <Ionicons name={item.icon} size={16} color={item.color} />
        </View>
        <Text style={styles.summaryLabel} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
      <Text
        style={[
          styles.summaryValue,
          {
            color:
              item.title === "DEDUCTIONS"
                ? item.color
                : item.title === "STATUS"
                  ? "#07834E"
                  : item.title === "LATEST NET SALARY"
                    ? "#2875F5"
                    : "#17213B",
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {item.value}
      </Text>
      <Text style={styles.summaryMonth}>{item.month}</Text>
    </View>
  );
}

function SlipCard({ slip }) {
  return (
    <View style={styles.slipCard}>
      <View style={styles.slipHeader}>
        <View style={styles.slipHeadingCopy}>
          <Text style={styles.slipMonth}>{slip.month}</Text>
          <Text style={styles.slipId}>Salary slip · {slip.id}</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{slip.status}</Text>
        </View>
      </View>

      <View style={styles.amountRow}>
        <View style={styles.amountCell}>
          <Text style={styles.amountLabel}>GROSS SALARY</Text>
          <Text style={styles.grossAmount}>{money(slip.gross)}</Text>
        </View>
        <View style={styles.amountCell}>
          <Text style={styles.amountLabel}>DEDUCTIONS</Text>
          <Text style={styles.deductionAmount}>−{money(slip.deductions)}</Text>
        </View>
        <View style={[styles.amountCell, styles.netCell]}>
          <Text style={styles.amountLabel}>NET SALARY</Text>
          <Text style={styles.netAmount}>{money(slip.net)}</Text>
        </View>
      </View>

      <View style={styles.slipFooter}>
        <View style={styles.processedDate}>
          <Ionicons name="calendar-outline" size={14} color="#7B89A2" />
          <Text style={styles.processedText}>
            Processed {slip.processedDate}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${slip.month} salary slip`}
            onPress={() =>
              Alert.alert(slip.month, `Net salary: ${money(slip.net)}`)
            }
            style={styles.actionButton}
          >
            <Ionicons name="eye-outline" size={17} color="#2875F5" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Download ${slip.month} salary slip`}
            onPress={() =>
              Alert.alert(
                "Download salary slip",
                "PDF download is not connected yet.",
              )
            }
            style={styles.actionButton}
          >
            <Ionicons name="download-outline" size={17} color="#5F6F8C" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Print ${slip.month} salary slip`}
            onPress={() =>
              Alert.alert("Print salary slip", "Printing is not connected yet.")
            }
            style={styles.actionButton}
          >
            <Ionicons name="print-outline" size={17} color="#5F6F8C" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function SalarySlip({ navigation }) {
  const [month, setMonth] = useState("All Months");
  const [status, setStatus] = useState("All Statuses");
  const [appliedFilters, setAppliedFilters] = useState({
    month: "All Months",
    status: "All Statuses",
  });

  const filteredSlips = useMemo(
    () =>
      SALARY_SLIPS.filter(
        (slip) =>
          (appliedFilters.month === "All Months" ||
            slip.month === appliedFilters.month) &&
          (appliedFilters.status === "All Statuses" ||
            slip.status === appliedFilters.status),
      ),
    [appliedFilters],
  );

  const applyFilters = () => setAppliedFilters({ month, status });
  const resetFilters = () => {
    setMonth("All Months");
    setStatus("All Statuses");
    setAppliedFilters({ month: "All Months", status: "All Statuses" });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryGrid}>
          {SUMMARY.map((item) => (
            <SummaryCard key={item.title} item={item} />
          ))}
        </View>

        <View style={styles.historyHeading}>
          <View style={styles.headingIcon}>
            <Ionicons name="receipt-outline" size={17} color="#2875F5" />
          </View>
          <View style={styles.headingCopy}>
            <Text style={styles.headingTitle}>Salary Slip History</Text>
            <Text style={styles.headingSubtitle}>
              View your previous salary slips.
            </Text>
          </View>
        </View>

        <View style={styles.filtersCard}>
          <View style={styles.filterField}>
            <Text style={styles.filterLabel}>Month</Text>
            <BillingFilterDropdown
              label="Month"
              value={month}
              options={MONTHS}
              onSelect={setMonth}
              style={styles.dropdown}
            />
          </View>
          <View style={styles.filterField}>
            <Text style={styles.filterLabel}>Status</Text>
            <BillingFilterDropdown
              label="Status"
              value={status}
              options={STATUSES}
              onSelect={setStatus}
              style={styles.dropdown}
            />
          </View>
          <View style={styles.filterActions}>
            <CustomButton
              title="Apply"
              onPress={applyFilters}
              width="auto"
              height={42}
              borderRadius={10}
              color="#2875F5"
              fontSize={11}
              style={styles.applyButton}
            />
            <CustomButton
              title="Reset"
              onPress={resetFilters}
              width="auto"
              height={42}
              variant="outline"
              borderRadius={10}
              borderColor="#DCE4F0"
              textColor="#52627D"
              fontSize={11}
              style={styles.resetButton}
            />
          </View>
        </View>

        <View style={styles.listHeading}>
          <Text style={styles.listTitle}>Previous salary slips</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filteredSlips.length}</Text>
          </View>
        </View>
        <View style={styles.slipList}>
          {filteredSlips.map((slip) => (
            <SlipCard key={slip.id} slip={slip} />
          ))}
          {filteredSlips.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={24} color="#8290A8" />
              </View>
              <Text style={styles.emptyTitle}>No salary slips found</Text>
              <Text style={styles.emptyText}>
                Try changing the month or status filter.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFF" },
  screen: { flex: 1, backgroundColor: "#FFF" },
  content: { padding: 10, paddingBottom: 28 },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 9,
    marginBottom: 16,
  },
  summaryCard: {
    width: "48.5%",
    minHeight: 105,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 13,
    padding: 11,
  },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 7 },
  summaryIcon: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  summaryLabel: {
    flex: 1,
    color: "#7785A2",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.35,
  },
  summaryValue: { fontSize: 18, fontWeight: "800", marginTop: 7 },
  summaryMonth: { color: "#8793A8", fontSize: 9, marginTop: 3 },
  historyHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 10,
  },
  headingIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#EAF2FF",
  },
  headingCopy: { flex: 1, minWidth: 0 },
  headingTitle: { color: "#18243A", fontSize: 15, fontWeight: "800" },
  headingSubtitle: { color: "#7A869B", fontSize: 10, marginTop: 3 },
  filtersCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 13,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  filterField: { gap: 5 },
  filterLabel: {
    color: "#6E7B94",
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  dropdown: {
    minHeight: 42,
    paddingHorizontal: 11,
    borderRadius: 10,
    borderColor: "#DCE4F0",
  },
  filterActions: { flexDirection: "row", gap: 8 },
  applyButton: { flex: 1 },
  resetButton: { flex: 1 },
  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 9,
  },
  listTitle: { color: "#1C2940", fontSize: 14, fontWeight: "800" },
  countBadge: {
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#EAF2FF",
  },
  countText: { color: "#2875F5", fontSize: 10, fontWeight: "800" },
  slipList: { gap: 10 },
  slipCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 14,
    padding: 12,
  },
  slipHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  slipHeadingCopy: { flex: 1, minWidth: 0 },
  slipMonth: { color: "#1E2C47", fontSize: 13, fontWeight: "800" },
  slipId: { color: "#8793A8", fontSize: 9, marginTop: 3 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#E7F8EF",
    borderWidth: 1,
    borderColor: "#B9EBD0",
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#0AA866",
  },
  statusText: { color: "#07834E", fontSize: 9, fontWeight: "700" },
  amountRow: {
    flexDirection: "row",
    marginTop: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEF1F6",
  },
  amountCell: { flex: 1, minWidth: 0 },
  netCell: { alignItems: "flex-end" },
  amountLabel: {
    color: "#8290A8",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  grossAmount: { color: "#26334A", fontSize: 11, fontWeight: "700" },
  deductionAmount: { color: "#D83E4A", fontSize: 11, fontWeight: "700" },
  netAmount: { color: "#2875F5", fontSize: 11, fontWeight: "800" },
  slipFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 10,
  },
  processedDate: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  processedText: { color: "#71809A", fontSize: 9 },
  actions: { flexDirection: "row", gap: 6 },
  actionButton: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DCE4F0",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 26,
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  emptyIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: "#F1F4F9",
    marginBottom: 9,
  },
  emptyTitle: { color: "#26334A", fontSize: 12, fontWeight: "700" },
  emptyText: { color: "#7A869B", fontSize: 10, marginTop: 4 },
});
