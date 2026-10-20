import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DashboardCard from "../../../components/DashboardCard";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";
import UserHeader from "../../../components/UserHeader";

const invoices = [
  {
    id: "INV-2026-1001",
    period: "October 2026",
    issueDate: "01 Oct 2026",
    dueDate: "15 Oct 2026",
    guards: 8,
    amount: 148000,
    paid: 148000,
    status: "Paid",
  },
  {
    id: "INV-2026-1002",
    period: "October 2026",
    issueDate: "08 Oct 2026",
    dueDate: "22 Oct 2026",
    guards: 5,
    amount: 92500,
    paid: 50000,
    status: "Partially Paid",
  },
  {
    id: "INV-2026-0901",
    period: "September 2026",
    issueDate: "01 Sep 2026",
    dueDate: "15 Sep 2026",
    guards: 12,
    amount: 216000,
    paid: 216000,
    status: "Paid",
  },
  {
    id: "INV-2026-0801",
    period: "August 2026",
    issueDate: "01 Aug 2026",
    dueDate: "15 Aug 2026",
    guards: 10,
    amount: 180000,
    paid: 0,
    status: "Overdue",
  },
];

const ALL_PERIODS = "All periods";
const ALL_STATUSES = "All statuses";
const periods = [
  ALL_PERIODS,
  ...new Set(invoices.map((invoice) => invoice.period)),
];
const statuses = [ALL_STATUSES, "Paid", "Partially Paid", "Pending", "Overdue"];
const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;

const STATUS_TONES = {
  Paid: { color: "#07834F", background: "#E6F8EF", border: "#B9EBD1" },
  "Partially Paid": {
    color: "#246BCE",
    background: "#EAF2FF",
    border: "#C7DFFF",
  },
  Pending: { color: "#B96A0A", background: "#FFF4DF", border: "#FFDB9D" },
  Overdue: { color: "#C94148", background: "#FFF0F0", border: "#F5C6C8" },
};

function InvoiceCard({ invoice }) {
  const tone = STATUS_TONES[invoice.status];
  const balance = invoice.amount - invoice.paid;

  return (
    <View style={styles.invoiceCard}>
      <View style={styles.invoiceHeading}>
        <View style={styles.invoiceIcon}>
          <Ionicons name="document-text-outline" size={21} color="#2875F5" />
        </View>
        <View style={styles.invoiceIdentity}>
          <Text style={styles.invoiceId}>{invoice.id}</Text>
          <Text style={styles.invoicePeriod}>{invoice.period} billing</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: tone.background, borderColor: tone.border },
          ]}
        >
          <Text style={[styles.statusText, { color: tone.color }]}>
            {invoice.status}
          </Text>
        </View>
      </View>

      <View style={styles.invoiceMetaGrid}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>ISSUED</Text>
          <Text style={styles.metaValue}>{invoice.issueDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>DUE DATE</Text>
          <Text style={styles.metaValue}>{invoice.dueDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>GUARDS</Text>
          <Text style={styles.metaValue}>{invoice.guards} deployed</Text>
        </View>
      </View>

      <View style={styles.invoiceFooter}>
        <View style={styles.amountGroup}>
          <Text style={styles.metaLabel}>GROSS AMOUNT</Text>
          <Text style={styles.invoiceAmount}>{money(invoice.amount)}</Text>
          <Text style={styles.balanceText}>
            {balance === 0 ? "Fully paid" : `${money(balance)} balance due`}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View invoice ${invoice.id}`}
          onPress={() =>
            Alert.alert(
              invoice.id,
              `${invoice.period}\n${invoice.guards} guards · ${money(invoice.amount)}\nStatus: ${invoice.status}`,
            )
          }
          style={({ pressed }) => [
            styles.viewButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.viewButtonText}>View</Text>
          <Ionicons name="chevron-forward" size={16} color="#2875F5" />
        </Pressable>
      </View>
    </View>
  );
}

export default function Billing({ navigation }) {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState(ALL_PERIODS);
  const [status, setStatus] = useState(ALL_STATUSES);

  const summary = useMemo(() => {
    const current = invoices
      .filter((invoice) => invoice.period === "October 2026")
      .reduce((total, invoice) => total + invoice.amount, 0);
    const paid = invoices.reduce((total, invoice) => total + invoice.paid, 0);
    const invoiced = invoices.reduce(
      (total, invoice) => total + invoice.amount,
      0,
    );
    return [
      {
        title: "CURRENT PERIOD BILLING",
        value: money(current),
        icon: "receipt-outline",
        color: "#2875F5",
        tint: "#EAF2FF",
      },
      {
        title: "PAID AMOUNT",
        value: money(paid),
        icon: "checkmark-circle-outline",
        color: "#0AA866",
        tint: "#E6F8EF",
      },
      {
        title: "PENDING BALANCE",
        value: money(invoiced - paid),
        icon: "alert-circle-outline",
        color: "#E55050",
        tint: "#FFF0F0",
      },
      {
        title: "TOTAL INVOICED (YTD)",
        value: money(invoiced),
        icon: "cash-outline",
        color: "#9B45E8",
        tint: "#F5EAFE",
      },
    ];
  }, []);

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return invoices.filter(
      (invoice) =>
        (!query || invoice.id.toLowerCase().includes(query)) &&
        (period === ALL_PERIODS || invoice.period === period) &&
        (status === ALL_STATUSES || invoice.status === status),
    );
  }, [search, period, status]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >


        <View style={styles.summaryGrid}>
          {summary.map((item) => (
            <View key={item.title} style={styles.summaryCell}>
              <DashboardCard
                title={item.title}
                value={item.value}
                icon={item.icon}
                color={item.color}
                backgroundColor={item.tint}
              />
            </View>
          ))}
        </View>

        <View style={styles.filtersCard}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={19} color="#8793A8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search invoice number"
              placeholderTextColor="#929DB0"
              style={styles.searchInput}
              returnKeyType="search"
              accessibilityLabel="Search invoice number"
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
          <View style={styles.filterRow}>
            <BillingFilterDropdown
              label="Billing period"
              value={period}
              options={periods}
              onSelect={setPeriod}
              style={styles.filter}
            />
            <BillingFilterDropdown
              label="Payment status"
              value={status}
              options={statuses}
              onSelect={setStatus}
              style={styles.filter}
            />
          </View>
        </View>

        <View style={styles.listHeading}>
          <View>
            <Text style={styles.listTitle}>Your invoices</Text>
            <Text style={styles.listSubtitle}>
              Billing statements for your assigned services
            </Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{filteredInvoices.length}</Text>
          </View>
        </View>

        <View style={styles.invoiceList}>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={25}
                  color="#71809E"
                />
              </View>
              <Text style={styles.emptyTitle}>No invoices found</Text>
              <Text style={styles.emptyText}>
                Try another invoice number or change the filters.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
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
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  summaryCell: { width: "47%" },
  filtersCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 14,
    padding: 11,
    marginBottom: 18,
    elevation: 1,
    shadowColor: "#263A62",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  searchBox: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: "#24324B",
    fontSize: 14,
    paddingVertical: 9,
  },
  filterRow: { flexDirection: "row", gap: 8, marginTop: 9 },
  filter: { flex: 1, minWidth: 0, paddingHorizontal: 9, minHeight: 42 },
  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  listTitle: {
    color: "#17213B",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  listSubtitle: {
    color: "#7785A2",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  countPill: {
    minWidth: 36,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  countText: { color: "#3979EF", fontSize: 13, fontWeight: "800" },
  invoiceList: { gap: 10 },
  invoiceCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 14,
    padding: 13,
    shadowColor: "#263A62",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  invoiceHeading: { flexDirection: "row", alignItems: "center", gap: 10 },
  invoiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  invoiceIdentity: { flex: 1, minWidth: 0 },
  invoiceId: {
    color: "#17213B",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  invoicePeriod: {
    color: "#7785A2",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  invoiceMetaGrid: {
    flexDirection: "row",
    gap: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EDF0F5",
    marginTop: 12,
    paddingVertical: 10,
  },
  metaItem: { flex: 1, minWidth: 0 },
  metaLabel: {
    color: "#7E8AA2",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  metaValue: {
    color: "#3C4A64",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 3,
  },
  invoiceFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  amountGroup: { flex: 1 },
  invoiceAmount: {
    color: "#17213B",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    marginTop: 2,
  },
  balanceText: { color: "#71809E", fontSize: 12, lineHeight: 17, marginTop: 1 },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderWidth: 1,
    borderColor: "#D7E5FF",
    backgroundColor: "#F4F8FF",
    borderRadius: 9,
    minHeight: 38,
    paddingHorizontal: 11,
  },
  viewButtonText: { color: "#2875F5", fontSize: 13, fontWeight: "700" },
  pressed: { opacity: 0.7 },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 14,
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 26,
  },
  emptyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
    marginTop: 17,
  },
});
