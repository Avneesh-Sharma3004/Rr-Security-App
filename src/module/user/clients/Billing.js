import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardCard from "../../../components/DashboardCard";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";

const INITIAL_INVOICES = [
  {
    id: "INV-2026-1001",
    client: "Nexus Corporate Towers",
    period: "October 2026",
    guards: 12,
    amount: 365800,
    due: 0,
    status: "Paid",
  },
  {
    id: "INV-2026-1002",
    client: "Alpha Logistics Hub",
    period: "October 2026",
    guards: 16,
    amount: 470820,
    due: 220820,
    status: "Partially Paid",
  },
  {
    id: "INV-2026-1003",
    client: "Apex Healthcare & Multi-Specialty",
    period: "October 2026",
    guards: 10,
    amount: 316240,
    due: null,
    status: "Pending",
  },
  {
    id: "INV-2026-1004",
    client: "Metro Smart City Infrastructure",
    period: "September 2026",
    guards: 8,
    amount: 205000,
    due: 205000,
    status: "Overdue",
  },
  {
    id: "INV-2026-0902",
    client: "Horizon Industrial Estate",
    period: "September 2026",
    guards: 14,
    amount: 362000,
    due: 0,
    status: "Paid",
  },
];
const ALL_CLIENTS = "All Clients (5)";
const ALL_PERIODS = "All Periods";
const ALL_STATUSES = "All Statuses";
const CLIENTS = [
  ALL_CLIENTS,
  ...INITIAL_INVOICES.map((invoice) => invoice.client),
];
const PERIODS = [
  ALL_PERIODS,
  ...new Set(INITIAL_INVOICES.map((invoice) => invoice.period)),
];
const STATUSES = [ALL_STATUSES, "Paid", "Partially Paid", "Pending", "Overdue"];
const money = (amount) => `\u20B9${amount.toLocaleString("en-IN")}`;
const TONES = {
  Paid: { color: "#00A96B", background: "#E7FBF1", border: "#83E9B9" },
  "Partially Paid": {
    color: "#0878FF",
    background: "#EAF3FF",
    border: "#B8D7FF",
  },
  Pending: { color: "#E68A00", background: "#FFF6E4", border: "#FFDB8B" },
  Overdue: { color: "#F02D37", background: "#FFF0F1", border: "#FFC4C8" },
};

export default function Billing() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [search, setSearch] = useState("");
  const [client, setClient] = useState(ALL_CLIENTS);
  const [period, setPeriod] = useState(ALL_PERIODS);
  const [status, setStatus] = useState(ALL_STATUSES);

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const searchable = `${invoice.id} ${invoice.client}`.toLowerCase();
      return (
        (!query || searchable.includes(query)) &&
        (client === ALL_CLIENTS || invoice.client === client) &&
        (period === ALL_PERIODS || invoice.period === period) &&
        (status === ALL_STATUSES || invoice.status === status)
      );
    });
  }, [invoices, search, client, period, status]);

  const viewInvoice = (invoice) =>
    Alert.alert(
      invoice.id,
      `${invoice.client}\n${invoice.period} · ${money(invoice.amount)} · ${invoice.status}`,
    );
  const downloadInvoice = (invoice) =>
    Alert.alert("Download invoice", `${invoice.id} is ready to download.`);
  const removeInvoice = (invoice) =>
    Alert.alert("Delete invoice?", invoice.id, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setInvoices((items) =>
            items.filter((item) => item.id !== invoice.id),
          ),
      },
    ]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F7FD" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Billing &amp; Invoices</Text>
        <Text style={styles.subtitle}>Billing and invoice module.</Text>
        <View style={styles.summaryGrid}>
          <DashboardCard
            compact
            title="TOTAL INVOICED (YTD)"
            value="\u20B918,21,920"
            icon="receipt-outline"
            color="#0878FF"
            backgroundColor="#E8F2FF"
            detail="+14.2%"
            secondaryDetail="across 5 billing cycles"
          />
          <DashboardCard
            compact
            title="TOTAL COLLECTED / PAID"
            value="\u20B910,42,960"
            icon="checkmark-circle-outline"
            color="#00B878"
            backgroundColor="#E4FBF0"
            detail="57%"
            secondaryDetail="realization rate"
          />
          <DashboardCard
            compact
            title="OUTSTANDING BALANCE"
            value="\u20B97,78,960"
            icon="alert-circle-outline"
            color="#F09000"
            backgroundColor="#FFF4DE"
            detail="1 Overdue Invoices"
          />
          <DashboardCard
            compact
            title="ACTIVE WORKFORCES"
            value="60 Guards"
            icon="business-outline"
            color="#8B27E8"
            backgroundColor="#F3E9FF"
            secondaryDetail="Deployed at 5 client sites"
          />
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
            label="Client"
            value={client}
            options={CLIENTS}
            onSelect={setClient}
            style={styles.filter}
          />
          <BillingFilterDropdown
            label="Period"
            value={period}
            options={PERIODS}
            onSelect={setPeriod}
            style={styles.filter}
          />
          <BillingFilterDropdown
            label="Status"
            value={status}
            options={STATUSES}
            onSelect={setStatus}
            style={styles.filter}
          />
        </View>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Invoices</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{filteredInvoices.length}</Text>
          </View>
        </View>
        <View style={styles.invoiceList}>
          {filteredInvoices.map((invoice) => {
            const tone = TONES[invoice.status];
            return (
              <View key={invoice.id} style={styles.invoiceCard}>
                <View style={styles.invoiceTop}>
                  <View style={styles.invoiceIdentity}>
                    <Text style={styles.invoiceId}>{invoice.id}</Text>
                    <View style={styles.clientRow}>
                      <View style={styles.clientIcon}>
                        <Ionicons
                          name="business-outline"
                          size={23}
                          color="#0878FF"
                        />
                      </View>
                      <View style={styles.clientInfo}>
                        <Text style={styles.clientName} numberOfLines={1}>
                          {invoice.client}
                        </Text>
                        <View style={styles.metadata}>
                          <Ionicons
                            name="calendar-outline"
                            size={15}
                            color="#7889A9"
                          />
                          <Text style={styles.metadataText}>
                            {invoice.period}
                          </Text>
                          <Text style={styles.metadataDot}>{"\u00B7"}</Text>
                          <Ionicons
                            name="people-outline"
                            size={15}
                            color="#7889A9"
                          />
                          <Text style={styles.metadataText}>
                            {invoice.guards} Guards
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: tone.background,
                        borderColor: tone.border,
                      },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: tone.color }]}>
                      {invoice.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.invoiceBottom}>
                  <View style={styles.amountBlock}>
                    <Text style={styles.eyebrow}>INVOICE AMOUNT</Text>
                    <Text style={styles.amount}>{money(invoice.amount)}</Text>
                  </View>
                  <View style={styles.dueBlock}>
                    <Text style={styles.eyebrow}>BALANCE DUE</Text>
                    <Text
                      style={[
                        styles.dueAmount,
                        invoice.due > 0 && styles.unpaidAmount,
                      ]}
                    >
                      {invoice.due === null
                        ? "\u2014"
                        : invoice.due === 0
                          ? "Settled"
                          : money(invoice.due)}
                    </Text>
                  </View>
                  <View style={styles.actions}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`View ${invoice.id}`}
                      onPress={() => viewInvoice(invoice)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="eye-outline" size={19} color="#0878FF" />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Download ${invoice.id}`}
                      onPress={() => downloadInvoice(invoice)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="download-outline"
                        size={19}
                        color="#0878FF"
                      />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${invoice.id}`}
                      onPress={() => removeInvoice(invoice)}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#E34B57"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
          {filteredInvoices.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text-outline"
                size={28}
                color="#8293B5"
              />
              <Text style={styles.emptyText}>
                No invoices match your filters.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F7FD" },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 30 },
  title: { color: "#101B3A", fontSize: 28, lineHeight: 34, fontWeight: "800" },
  subtitle: { color: "#7485A6", fontSize: 15, marginTop: 3, marginBottom: 15 },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 16,
  },
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
  filters: { flexDirection: "row", gap: 8, marginTop: 10 },
  filter: { flex: 1, minWidth: 0, paddingHorizontal: 10 },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: { color: "#14234D", fontSize: 23, fontWeight: "800" },
  countPill: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: "#E2EDFC",
    alignItems: "center",
    justifyContent: "center",
  },
  countText: { color: "#264A87", fontSize: 14, fontWeight: "700" },
  invoiceList: { gap: 12 },
  invoiceCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E5F6",
    borderRadius: 14,
    padding: 13,
    shadowColor: "#344B73",
    shadowOpacity: 0.04,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  invoiceTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  invoiceIdentity: { flex: 1, minWidth: 0 },
  invoiceId: {
    alignSelf: "flex-start",
    overflow: "hidden",
    color: "#0878FF",
    backgroundColor: "#EAF3FF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 5,
  },
  clientRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  clientIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EAF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  clientInfo: { flex: 1, minWidth: 0, gap: 5 },
  clientName: { color: "#14234D", fontSize: 15, fontWeight: "700" },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  metadataText: { color: "#7485A6", fontSize: 12 },
  metadataDot: { color: "#8293B5", marginHorizontal: 2 },
  statusPill: {
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 1,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  invoiceBottom: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E7EDF7",
    marginTop: 11,
    paddingTop: 10,
    gap: 9,
  },
  amountBlock: { flex: 1, minWidth: 0 },
  dueBlock: {
    flex: 1,
    minWidth: 0,
    borderLeftWidth: 1,
    borderLeftColor: "#DDE7F5",
    paddingLeft: 10,
  },
  eyebrow: {
    color: "#7889A9",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.35,
    marginBottom: 3,
  },
  amount: { color: "#101B3A", fontSize: 16, fontWeight: "800" },
  dueAmount: { color: "#00A96B", fontSize: 14, fontWeight: "700" },
  unpaidAmount: { color: "#F02D37" },
  actions: { flexDirection: "row", gap: 4 },
  actionButton: {
    width: 32,
    height: 36,
    borderWidth: 1,
    borderColor: "#D8E5F8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: { color: "#7485A6", fontSize: 14 },
});
