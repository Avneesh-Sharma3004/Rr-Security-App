import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  setBillingSearchQuery,
  setBillingClientFilter,
  setBillingPeriodFilter,
  setBillingStatusFilter,
  resetBillingFilters,
  generateInvoice,
  payInvoice,
  deleteInvoice,
} from "../../../store/slices/clientsSlice";

export default function ClientBillingView() {
  const dispatch = useDispatch();
  const {
    invoices,
    billingSearchQuery,
    billingClientFilter,
    billingPeriodFilter,
    billingStatusFilter,
  } = useSelector((state) => state.clients);

  // Modals
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activePicker, setActivePicker] = useState(null); // 'client' | 'period' | 'status'

  // Form State for Generate Invoice
  const [genClientName, setGenClientName] = useState("");
  const [genGstin, setGenGstin] = useState("");
  const [genPeriod, setGenPeriod] = useState("October 2026");
  const [genGuards, setGenGuards] = useState("12 Guards");
  const [genGrossTotal, setGenGrossTotal] = useState("₹3,50,000");

  const clientOptions = [
    "All Clients (5)",
    "Nexus Corporate Towers",
    "Alpha Logistics Hub",
    "Apex Healthcare & Multi-Specialty",
    "Metro Smart City Infrastructure",
    "Petal Commercial Pvt Ltd",
  ];

  const periodOptions = [
    "All Periods",
    "October 2026",
    "September 2026",
    "August 2026",
  ];

  const statusOptions = [
    "All Statuses",
    "Paid",
    "Partially Paid",
    "Pending",
    "Overdue",
  ];

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const q = billingSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      inv.invoiceNo.toLowerCase().includes(q) ||
      inv.clientName.toLowerCase().includes(q) ||
      (inv.gstin && inv.gstin.toLowerCase().includes(q));

    const matchesClient =
      billingClientFilter === "All Clients (5)" ||
      inv.clientName === billingClientFilter;

    const matchesPeriod =
      billingPeriodFilter === "All Periods" ||
      inv.billingPeriod === billingPeriodFilter;

    const matchesStatus =
      billingStatusFilter === "All Statuses" ||
      inv.status.toLowerCase() === billingStatusFilter.toLowerCase();

    return matchesSearch && matchesClient && matchesPeriod && matchesStatus;
  });

  const handleDeleteInvoice = (inv) => {
    Alert.alert(
      "Delete Invoice",
      `Are you sure you want to delete invoice ${inv.invoiceNo} for ${inv.clientName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteInvoice(inv.id));
            Alert.alert("Deleted", "Invoice record removed.");
          },
        },
      ]
    );
  };

  const handleDownloadInvoice = (inv) => {
    Alert.alert(
      "Download Invoice",
      `Invoice ${inv.invoiceNo} downloaded successfully as PDF.`
    );
  };

  const handleCreateInvoice = () => {
    if (!genClientName.trim()) {
      Alert.alert("Validation", "Please select or enter client name.");
      return;
    }
    dispatch(
      generateInvoice({
        clientName: genClientName.trim(),
        gstin: genGstin.trim() || "07AAACN1234D1Z5",
        billingPeriod: genPeriod,
        deployedForce: genGuards,
        baseAmount: genGrossTotal,
        gst: "₹0",
        grossTotal: genGrossTotal,
      })
    );
    setIsGenerateModalOpen(false);
    setGenClientName("");
    Alert.alert("Invoice Generated", "New invoice has been created.");
  };

  return (
    <View style={styles.container}>
      {/* 1. Search Bar matching user screenshot */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={17} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search invoice number, client name, or GSTIN..."
          placeholderTextColor="#94A3B8"
          value={billingSearchQuery}
          onChangeText={(txt) => dispatch(setBillingSearchQuery(txt))}
        />
        {billingSearchQuery ? (
          <TouchableOpacity
            onPress={() => dispatch(setBillingSearchQuery(""))}
          >
            <Ionicons name="close-circle" size={16} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* 2. Three Dropdown Filter Pills matching user screenshot */}
      <View style={styles.dropdownsRow}>
        {/* Client Dropdown Pill */}
        <TouchableOpacity
          style={styles.dropdownPill}
          onPress={() => setActivePicker("client")}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownPillText} numberOfLines={1}>
            {billingClientFilter}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </TouchableOpacity>

        {/* Period Dropdown Pill */}
        <TouchableOpacity
          style={styles.dropdownPill}
          onPress={() => setActivePicker("period")}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownPillText} numberOfLines={1}>
            {billingPeriodFilter}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </TouchableOpacity>

        {/* Status Dropdown Pill */}
        <TouchableOpacity
          style={styles.dropdownPill}
          onPress={() => setActivePicker("status")}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownPillText} numberOfLines={1}>
            {billingStatusFilter}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* 3. Section Header: Invoices [ count ] */}
      <View style={styles.invoicesHeaderRow}>
        <Text style={styles.invoicesTitle}>Invoices</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{filteredInvoices.length}</Text>
        </View>
      </View>

      {/* 4. Invoice Cards List matching exact cards in screenshot */}
      <View style={styles.cardsList}>
        {filteredInvoices.map((inv) => {
          // Status Pill Styling
          let statusBg = "#DCFCE7";
          let statusColor = "#16A34A";
          if (inv.status === "Partially Paid") {
            statusBg = "#EFF6FF";
            statusColor = "#2563EB";
          } else if (inv.status === "Pending") {
            statusBg = "#FEF3C7";
            statusColor = "#D97706";
          } else if (inv.status === "Overdue") {
            statusBg = "#FEE2E2";
            statusColor = "#DC2626";
          }

          // Balance Due Styling
          const isSettled = inv.balanceDue === "Settled";
          const isDash = inv.balanceDue === "—" || !inv.balanceDue;

          return (
            <View key={inv.id} style={styles.invoiceCard}>
              {/* Card Top Row: Invoice Number Pill (Left) & Status Badge (Right) */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.invoicePill}>
                  <Text style={styles.invoicePillText}>{inv.invoiceNo}</Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                  <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                    {inv.status}
                  </Text>
                </View>
              </View>

              {/* Client Info Row */}
              <View style={styles.clientInfoRow}>
                <View style={styles.buildingIconBox}>
                  <Ionicons name="business-outline" size={16} color="#2563EB" />
                </View>

                <View style={styles.clientNameWrap}>
                  <Text style={styles.clientName} numberOfLines={1}>
                    {inv.clientName}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color="#64748B"
                    />
                    <Text style={styles.metaText}>{inv.billingPeriod}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Ionicons name="people-outline" size={12} color="#64748B" />
                    <Text style={styles.metaText}>{inv.deployedForce}</Text>
                  </View>
                </View>
              </View>

              {/* Card Amounts Row */}
              <View style={styles.amountsRow}>
                {/* INVOICE AMOUNT */}
                <View style={styles.amountCol}>
                  <Text style={styles.amountLabel}>INVOICE AMOUNT</Text>
                  <Text style={styles.amountVal}>{inv.grossTotal}</Text>
                </View>

                {/* BALANCE DUE */}
                <View style={styles.amountCol}>
                  <Text style={styles.amountLabel}>BALANCE DUE</Text>
                  <Text
                    style={[
                      styles.balanceVal,
                      isSettled
                        ? { color: "#16A34A" }
                        : isDash
                        ? { color: "#64748B" }
                        : { color: "#DC2626" },
                    ]}
                  >
                    {inv.balanceDue || "—"}
                  </Text>
                </View>
              </View>

              {/* Dedicated Card Bottom Actions Row (View, Download, Delete) */}
              <View style={styles.cardBottomActionsRow}>
                {/* View Details Button */}
                <TouchableOpacity
                  style={styles.cardActionBtn}
                  onPress={() => setViewingInvoice(inv)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="eye-outline" size={13} color="#334155" />
                  <Text style={styles.cardActionBtnText}>View</Text>
                </TouchableOpacity>

                {/* Download Invoice Button */}
                <TouchableOpacity
                  style={[styles.cardActionBtn, styles.downloadActionBtn]}
                  onPress={() => handleDownloadInvoice(inv)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="download-outline"
                    size={13}
                    color="#2563EB"
                  />
                  <Text
                    style={[
                      styles.cardActionBtnText,
                      { color: "#2563EB" },
                    ]}
                  >
                    Download
                  </Text>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  style={[styles.cardActionBtn, styles.deleteActionBtn]}
                  onPress={() => handleDeleteInvoice(inv)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={13} color="#DC2626" />
                  <Text
                    style={[
                      styles.cardActionBtnText,
                      { color: "#DC2626" },
                    ]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {filteredInvoices.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={44} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No matching invoices found</Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => dispatch(resetBillingFilters())}
            >
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* View Invoice Details Modal */}
      {viewingInvoice && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setViewingInvoice(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.detailModalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>
                    {viewingInvoice.invoiceNo}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {viewingInvoice.clientName}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setViewingInvoice(null)}>
                  <Ionicons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Client Organization</Text>
                  <Text style={styles.detailValue}>
                    {viewingInvoice.clientName}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>GSTIN</Text>
                  <Text style={styles.detailValue}>
                    {viewingInvoice.gstin || "07AAACN1234D1Z5"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Billing Period</Text>
                  <Text style={styles.detailValue}>
                    {viewingInvoice.billingPeriod}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Deployed Force</Text>
                  <Text style={styles.detailValue}>
                    {viewingInvoice.deployedForce}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Base Amount</Text>
                  <Text style={styles.detailValue}>
                    {viewingInvoice.baseAmount || viewingInvoice.grossTotal}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>GST (18%)</Text>
                  <Text style={styles.detailValue}>
                    {viewingInvoice.gst || "₹0"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Gross Total</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: "#2563EB", fontWeight: "800" },
                    ]}
                  >
                    {viewingInvoice.grossTotal}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Balance Due</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      viewingInvoice.balanceDue === "Settled"
                        ? { color: "#16A34A", fontWeight: "800" }
                        : { color: "#DC2626", fontWeight: "800" },
                    ]}
                  >
                    {viewingInvoice.balanceDue}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Payment Status</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { fontWeight: "700", color: "#16A34A" },
                    ]}
                  >
                    {viewingInvoice.status}
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.primaryModalBtn}
                  onPress={() => setViewingInvoice(null)}
                >
                  <Text style={styles.primaryModalBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Dropdown Options Selection Modal */}
      <Modal
        visible={!!activePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setActivePicker(null)}
        >
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                {activePicker === "client"
                  ? "Select Client"
                  : activePicker === "period"
                  ? "Select Billing Period"
                  : "Select Invoice Status"}
              </Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.pickerList}>
              {(activePicker === "client"
                ? clientOptions
                : activePicker === "period"
                ? periodOptions
                : statusOptions
              ).map((option) => {
                const isSelected =
                  (activePicker === "client" &&
                    billingClientFilter === option) ||
                  (activePicker === "period" &&
                    billingPeriodFilter === option) ||
                  (activePicker === "status" &&
                    billingStatusFilter === option);

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.pickerItem,
                      isSelected && styles.activePickerItem,
                    ]}
                    onPress={() => {
                      if (activePicker === "client") {
                        dispatch(setBillingClientFilter(option));
                      } else if (activePicker === "period") {
                        dispatch(setBillingPeriodFilter(option));
                      } else {
                        dispatch(setBillingStatusFilter(option));
                      }
                      setActivePicker(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        isSelected && styles.activePickerItemText,
                      ]}
                      numberOfLines={1}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#2563EB"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 20,
  },

  // 1. Search Bar
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#0F172A",
    paddingVertical: 0,
  },

  // 2. Dropdown Filter Pills
  dropdownsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  dropdownPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    height: 36,
  },
  dropdownPillText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#475569",
    flex: 1,
    marginRight: 4,
  },

  // 3. Section Header (Invoices [ count ])
  invoicesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    marginBottom: 8,
  },
  invoicesTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  countBadge: {
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },

  // 4. Invoice Cards (Compact Padding)
  cardsList: {
    gap: 7,
  },
  invoiceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 7,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },

  // Card Header (Invoice ID pill & Status pill)
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  invoicePill: {
    backgroundColor: "#EFF6FF",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  invoicePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: "700",
  },

  // Client Info (Compact)
  clientInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  buildingIconBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  clientNameWrap: {
    flex: 1,
  },
  clientName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 10.5,
    color: "#64748B",
    fontWeight: "500",
  },
  metaDot: {
    fontSize: 10,
    color: "#94A3B8",
    marginHorizontal: 1,
  },

  // Card Amounts Row (Compact)
  amountsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  amountCol: {
    gap: 1,
  },
  amountLabel: {
    fontSize: 8.5,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
  amountVal: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  balanceVal: {
    fontSize: 12.5,
    fontWeight: "800",
  },

  // Dedicated Bottom Actions Row (Compact)
  cardBottomActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  cardActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    paddingVertical: 4.5,
  },
  downloadActionBtn: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  deleteActionBtn: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  cardActionBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },

  // Empty state
  emptyContainer: {
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  resetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  detailModalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  detailValue: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "600",
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  primaryModalBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryModalBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Picker Modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  pickerCard: {
    width: "85%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    maxHeight: "55%",
    paddingVertical: 12,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  pickerList: {
    paddingHorizontal: 10,
    paddingTop: 6,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  activePickerItem: {
    backgroundColor: "#EFF6FF",
  },
  pickerItemText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
    flex: 1,
  },
  activePickerItemText: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
