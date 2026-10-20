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
  Pressable,
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
    billingStats,
    billingSearchQuery,
    billingClientFilter,
    billingPeriodFilter,
    billingStatusFilter,
  } = useSelector((state) => state.clients);

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [activePicker, setActivePicker] = useState(null); // 'client' | 'period' | 'status'

  // Form State
  const [genClientName, setGenClientName] = useState("");
  const [genGstin, setGenGstin] = useState("");
  const [genPeriod, setGenPeriod] = useState("November 2026");
  const [genGuards, setGenGuards] = useState("12");
  const [genBaseAmount, setGenBaseAmount] = useState("300000");

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
      inv.gstin.toLowerCase().includes(q);

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

  const handleSaveGenerateInvoice = () => {
    if (!genClientName.trim()) {
      Alert.alert("Validation", "Please enter Client Organization name.");
      return;
    }

    const base = parseFloat(genBaseAmount) || 200000;
    const gstVal = Math.round(base * 0.18);
    const gross = base + gstVal;

    dispatch(
      generateInvoice({
        clientName: genClientName.trim(),
        gstin: genGstin.trim() || "07AAXXX0000X1Z1",
        billingPeriod: genPeriod,
        deployedForce: `${genGuards || 10} Guards`,
        baseAmount: `₹${base.toLocaleString("en-IN")}`,
        gst: `₹${gstVal.toLocaleString("en-IN")}`,
        grossTotal: `₹${gross.toLocaleString("en-IN")}`,
        balanceDue: `₹${gross.toLocaleString("en-IN")}`,
      })
    );

    setGenClientName("");
    setGenGstin("");
    setIsGenerateModalOpen(false);
    Alert.alert("Success", "New contract invoice generated successfully!");
  };

  const handlePayInvoice = (inv) => {
    Alert.alert(
      "Confirm Settlement",
      `Mark invoice ${inv.invoiceNo} as Paid and Settled?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Payment",
          onPress: () => {
            dispatch(payInvoice(inv.id));
            Alert.alert("Payment Recorded", `Invoice ${inv.invoiceNo} is now settled.`);
          },
        },
      ]
    );
  };

  const handleDeleteInvoice = (inv) => {
    Alert.alert(
      "Delete Invoice",
      `Are you sure you want to delete invoice ${inv.invoiceNo}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch(deleteInvoice(inv.id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Title & Top Action Buttons */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <Text style={styles.pageTitle}>Client Billing & Invoices</Text>
          <Text style={styles.pageSubtitle}>Billing and invoice module.</Text>
        </View>

        <View style={styles.topActionsRow}>
          {/* Refresh Button */}
          <TouchableOpacity
            style={styles.actionBtnOutline}
            onPress={() => Alert.alert("Refresh", "Invoices register refreshed.")}
            activeOpacity={0.7}
          >
            <Ionicons name="reload-outline" size={15} color="#334155" />
            <Text style={styles.actionBtnOutlineText}>Refresh</Text>
          </TouchableOpacity>

          {/* Export Statement Button */}
          <TouchableOpacity
            style={styles.actionBtnOutline}
            onPress={() =>
              Alert.alert(
                "Export Statement",
                "Contract Billing Statement exported as CSV/PDF."
              )
            }
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={15} color="#334155" />
            <Text style={styles.actionBtnOutlineText}>Export Statement</Text>
          </TouchableOpacity>

          {/* Generate Invoice Button */}
          <TouchableOpacity
            style={styles.generateBtn}
            onPress={() => setIsGenerateModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={17} color="#FFFFFF" />
            <Text style={styles.generateBtnText}>Generate Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4 Stats KPI Cards */}
      <View style={styles.statsRow}>
        {/* TOTAL INVOICED */}
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: "#EFF6FF" }]}>
            <Ionicons name="receipt-outline" size={20} color="#2563EB" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>TOTAL INVOICED (YTD)</Text>
            <Text style={styles.statAmount}>{billingStats.totalInvoiced}</Text>
            <Text style={styles.statSubPositive}>
              {billingStats.totalInvoicedSub}
            </Text>
          </View>
        </View>

        {/* TOTAL COLLECTED / PAID */}
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: "#ECFDF5" }]}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#16A34A" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>TOTAL COLLECTED / PAID</Text>
            <Text style={styles.statAmount}>{billingStats.totalCollected}</Text>
            <Text style={styles.statSubPositive}>
              {billingStats.totalCollectedSub}
            </Text>
          </View>
        </View>

        {/* OUTSTANDING BALANCE */}
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: "#FFFBEB" }]}>
            <Ionicons name="alert-circle-outline" size={20} color="#D97706" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>OUTSTANDING BALANCE</Text>
            <Text style={styles.statAmount}>{billingStats.outstandingBalance}</Text>
            <Text style={styles.statSubNegative}>
              {billingStats.outstandingSub}
            </Text>
          </View>
        </View>

        {/* ACTIVE WORKFORCES */}
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: "#FAF5FF" }]}>
            <Ionicons name="business-outline" size={20} color="#9333EA" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>ACTIVE WORKFORCES</Text>
            <Text style={styles.statAmount}>{billingStats.activeWorkforces}</Text>
            <Text style={styles.statSubNormal}>{billingStats.workforcesSub}</Text>
          </View>
        </View>
      </View>

      {/* Filter Bar with Search and 3 Dropdowns */}
      <View style={styles.filterBarCard}>
        {/* Search */}
        <View style={styles.searchWrap}>
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

        {/* 3 Dropdowns */}
        <View style={styles.dropdownRow}>
          {/* Client Filter */}
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => setActivePicker("client")}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownBtnText} numberOfLines={1}>
              {billingClientFilter}
            </Text>
            <Ionicons name="chevron-down" size={15} color="#64748B" />
          </TouchableOpacity>

          {/* Period Filter */}
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => setActivePicker("period")}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownBtnText} numberOfLines={1}>
              {billingPeriodFilter}
            </Text>
            <Ionicons name="chevron-down" size={15} color="#64748B" />
          </TouchableOpacity>

          {/* Status Filter */}
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => setActivePicker("status")}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownBtnText} numberOfLines={1}>
              {billingStatusFilter}
            </Text>
            <Ionicons name="chevron-down" size={15} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Invoices Table Card */}
      <View style={styles.tableCard}>
        {/* Table Title Bar */}
        <View style={styles.tableTitleBar}>
          <View style={styles.tableTitleLeft}>
            <Ionicons name="receipt-outline" size={18} color="#0F172A" />
            <Text style={styles.tableSectionTitle}>Contract Invoices Register</Text>
            <View style={styles.recordBadge}>
              <Text style={styles.recordBadgeText}>
                {filteredInvoices.length} Records
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => dispatch(resetBillingFilters())}
            style={styles.resetLink}
          >
            <Text style={styles.resetLinkText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Scroll Table */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.tableScrollInner}
        >
          <View style={styles.tableBodyWrap}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, { width: 130 }]}>INVOICE NO</Text>
              <Text style={[styles.th, { width: 250 }]}>CLIENT ORGANIZATION</Text>
              <Text style={[styles.th, { width: 130 }]}>BILLING PERIOD</Text>
              <Text style={[styles.th, { width: 130 }]}>DEPLOYED FORCE</Text>
              <Text style={[styles.th, { width: 120 }]}>BASE AMOUNT</Text>
              <Text style={[styles.th, { width: 110 }]}>GST (18%)</Text>
              <Text style={[styles.th, { width: 120 }]}>GROSS TOTAL</Text>
              <Text style={[styles.th, { width: 120 }]}>BALANCE DUE</Text>
              <Text style={[styles.th, { width: 120 }]}>STATUS</Text>
              <Text style={[styles.th, { width: 160, textAlign: "center" }]}>
                ACTIONS
              </Text>
            </View>

            {/* Table Rows */}
            {filteredInvoices.map((inv) => {
              const isSettled = inv.balanceDue === "Settled";
              const isPaid = inv.status === "Paid";

              return (
                <View key={inv.id} style={styles.tableRow}>
                  {/* INVOICE NO */}
                  <View style={[styles.td, { width: 130 }]}>
                    <View style={styles.invBadge}>
                      <Text style={styles.invBadgeText}>{inv.invoiceNo}</Text>
                    </View>
                  </View>

                  {/* CLIENT ORGANIZATION */}
                  <View style={[styles.td, { width: 250 }]}>
                    <Text style={styles.orgNameText} numberOfLines={1}>
                      {inv.clientName}
                    </Text>
                    <Text style={styles.orgGstinText} numberOfLines={1}>
                      GSTIN: {inv.gstin}
                    </Text>
                  </View>

                  {/* BILLING PERIOD */}
                  <View style={[styles.td, { width: 130 }]}>
                    <Text style={styles.cellNormalText}>{inv.billingPeriod}</Text>
                  </View>

                  {/* DEPLOYED FORCE */}
                  <View style={[styles.td, { width: 130 }]}>
                    <Text style={styles.cellNormalText}>{inv.deployedForce}</Text>
                  </View>

                  {/* BASE AMOUNT */}
                  <View style={[styles.td, { width: 120 }]}>
                    <Text style={styles.cellNormalText}>{inv.baseAmount}</Text>
                  </View>

                  {/* GST */}
                  <View style={[styles.td, { width: 110 }]}>
                    <Text style={styles.cellNormalText}>{inv.gst}</Text>
                  </View>

                  {/* GROSS TOTAL */}
                  <View style={[styles.td, { width: 120 }]}>
                    <Text style={styles.grossTotalText}>{inv.grossTotal}</Text>
                  </View>

                  {/* BALANCE DUE */}
                  <View style={[styles.td, { width: 120 }]}>
                    <Text
                      style={[
                        styles.balanceDueText,
                        {
                          color: isSettled
                            ? "#16A34A"
                            : inv.status === "Overdue"
                            ? "#DC2626"
                            : "#EA580C",
                        },
                      ]}
                    >
                      {inv.balanceDue}
                    </Text>
                  </View>

                  {/* STATUS */}
                  <View style={[styles.td, { width: 120 }]}>
                    <View
                      style={[
                        styles.statusPill,
                        { backgroundColor: inv.statusBg || "#EFF6FF" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          { color: inv.statusColor || "#2563EB" },
                        ]}
                      >
                        {inv.status}
                      </Text>
                    </View>
                  </View>

                  {/* ACTIONS */}
                  <View
                    style={[
                      styles.td,
                      {
                        width: 160,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      },
                    ]}
                  >
                    {/* View Button */}
                    <TouchableOpacity
                      style={styles.actionViewBtn}
                      onPress={() => setViewingInvoice(inv)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={13} color="#2563EB" />
                      <Text style={styles.actionViewText}>View</Text>
                    </TouchableOpacity>

                    {/* Pay Button (if not fully paid) */}
                    {!isPaid && (
                      <TouchableOpacity
                        style={styles.actionPayBtn}
                        onPress={() => handlePayInvoice(inv)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="card-outline" size={13} color="#16A34A" />
                        <Text style={styles.actionPayText}>Pay</Text>
                      </TouchableOpacity>
                    )}

                    {/* Download PDF Icon */}
                    <TouchableOpacity
                      style={styles.actionIconBtn}
                      onPress={() =>
                        Alert.alert(
                          "Download Invoice",
                          `Generating official PDF invoice for ${inv.invoiceNo}...`
                        )
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="download-outline"
                        size={15}
                        color="#475569"
                      />
                    </TouchableOpacity>

                    {/* Delete Icon */}
                    <TouchableOpacity
                      style={styles.actionIconBtn}
                      onPress={() => handleDeleteInvoice(inv)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={15} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {filteredInvoices.length === 0 && (
              <View style={styles.emptyWrap}>
                <Ionicons name="receipt-outline" size={40} color="#CBD5E1" />
                <Text style={styles.emptyText}>No invoices match filters</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Picker Modal for Dropdowns */}
      {activePicker && (
        <Modal
          visible={!!activePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setActivePicker(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setActivePicker(null)}
          >
            <View style={styles.pickerBox}>
              <Text style={styles.pickerTitle}>
                {activePicker === "client"
                  ? "Select Client Filter"
                  : activePicker === "period"
                  ? "Select Billing Period"
                  : "Select Status"}
              </Text>

              {(activePicker === "client"
                ? clientOptions
                : activePicker === "period"
                ? periodOptions
                : statusOptions
              ).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.pickerOptionItem}
                  onPress={() => {
                    if (activePicker === "client") {
                      dispatch(setBillingClientFilter(opt));
                    } else if (activePicker === "period") {
                      dispatch(setBillingPeriodFilter(opt));
                    } else {
                      dispatch(setBillingStatusFilter(opt));
                    }
                    setActivePicker(null);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Generate Invoice Modal */}
      <Modal
        visible={isGenerateModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsGenerateModalOpen(false)}
      >
        <View style={styles.formModalBackdrop}>
          <View style={styles.formCard}>
            <View style={styles.formHeaderRow}>
              <Text style={styles.formHeaderTitle}>Generate Contract Invoice</Text>
              <TouchableOpacity onPress={() => setIsGenerateModalOpen(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll}>
              <Text style={styles.fieldLabel}>Client Organization Name *</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder="e.g. Nexus Corporate Towers"
                value={genClientName}
                onChangeText={setGenClientName}
              />

              <Text style={styles.fieldLabel}>Client GSTIN</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder="e.g. 07AAACN1234D1Z5"
                value={genGstin}
                onChangeText={setGenGstin}
              />

              <Text style={styles.fieldLabel}>Billing Period</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder="e.g. November 2026"
                value={genPeriod}
                onChangeText={setGenPeriod}
              />

              <Text style={styles.fieldLabel}>Deployed Guard Strength</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder="e.g. 14"
                keyboardType="numeric"
                value={genGuards}
                onChangeText={setGenGuards}
              />

              <Text style={styles.fieldLabel}>Base Contract Amount (₹) *</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder="e.g. 350000"
                keyboardType="numeric"
                value={genBaseAmount}
                onChangeText={setGenBaseAmount}
              />

              <View style={styles.calcPreviewBox}>
                <Text style={styles.calcTitle}>INVOICE ESTIMATE (GST 18%)</Text>
                <Text style={styles.calcText}>
                  Base: ₹
                  {(parseFloat(genBaseAmount) || 0).toLocaleString("en-IN")}
                </Text>
                <Text style={styles.calcText}>
                  GST (18%): ₹
                  {Math.round(
                    (parseFloat(genBaseAmount) || 0) * 0.18
                  ).toLocaleString("en-IN")}
                </Text>
                <Text style={styles.calcGross}>
                  Gross Total: ₹
                  {Math.round(
                    (parseFloat(genBaseAmount) || 0) * 1.18
                  ).toLocaleString("en-IN")}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.submitInvoiceBtn}
                onPress={handleSaveGenerateInvoice}
                activeOpacity={0.8}
              >
                <Text style={styles.submitInvoiceBtnText}>
                  Create & Issue Invoice
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* View Invoice Preview Modal */}
      {viewingInvoice && (
        <Modal
          visible={!!viewingInvoice}
          transparent
          animationType="fade"
          onRequestClose={() => setViewingInvoice(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setViewingInvoice(null)}
          >
            <View style={styles.previewCard}>
              <View style={styles.previewHeaderRow}>
                <View>
                  <Text style={styles.previewTitle}>
                    {viewingInvoice.invoiceNo}
                  </Text>
                  <Text style={styles.previewSub}>
                    {viewingInvoice.billingPeriod} • {viewingInvoice.status}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setViewingInvoice(null)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.previewBody}>
                <Text style={styles.previewClientName}>
                  {viewingInvoice.clientName}
                </Text>
                <Text style={styles.previewGstin}>
                  GSTIN: {viewingInvoice.gstin}
                </Text>

                <View style={styles.previewGrid}>
                  <View style={styles.previewCol}>
                    <Text style={styles.previewLabel}>DEPLOYED FORCE</Text>
                    <Text style={styles.previewVal}>
                      {viewingInvoice.deployedForce}
                    </Text>
                  </View>
                  <View style={styles.previewCol}>
                    <Text style={styles.previewLabel}>BASE AMOUNT</Text>
                    <Text style={styles.previewVal}>
                      {viewingInvoice.baseAmount}
                    </Text>
                  </View>
                  <View style={styles.previewCol}>
                    <Text style={styles.previewLabel}>GST (18%)</Text>
                    <Text style={styles.previewVal}>{viewingInvoice.gst}</Text>
                  </View>
                  <View style={styles.previewCol}>
                    <Text style={styles.previewLabel}>GROSS AMOUNT</Text>
                    <Text style={[styles.previewVal, { fontWeight: "800" }]}>
                      {viewingInvoice.grossTotal}
                    </Text>
                  </View>
                  <View style={styles.previewCol}>
                    <Text style={styles.previewLabel}>BALANCE DUE</Text>
                    <Text
                      style={[
                        styles.previewVal,
                        {
                          color:
                            viewingInvoice.balanceDue === "Settled"
                              ? "#16A34A"
                              : "#DC2626",
                          fontWeight: "800",
                        },
                      ]}
                    >
                      {viewingInvoice.balanceDue}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closePreviewBtn}
                onPress={() => setViewingInvoice(null)}
              >
                <Text style={styles.closePreviewBtnText}>Close Preview</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  /* Header Row */
  headerRow: {
    marginBottom: 16,
  },
  headerTextCol: {
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
    marginTop: 2,
  },
  topActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  actionBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  generateBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* 4 Stats Cards */
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    width: "48.5%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.4,
  },
  statAmount: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  statSubPositive: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "600",
    marginTop: 1,
  },
  statSubNegative: {
    fontSize: 10,
    color: "#DC2626",
    fontWeight: "600",
    marginTop: 1,
  },
  statSubNormal: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 1,
  },

  /* Filter Bar */
  filterBarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    marginBottom: 16,
    gap: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#0F172A",
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    minWidth: 105,
    gap: 6,
  },
  dropdownBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },

  /* Invoices Table Card */
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  tableTitleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tableTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tableSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  recordBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  recordBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  resetLink: {
    paddingHorizontal: 6,
  },
  resetLinkText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },

  tableScrollInner: {
    paddingVertical: 2,
  },
  tableBodyWrap: {
    minWidth: 1490,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  th: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  td: {
    justifyContent: "center",
  },
  invBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  invBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  orgNameText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  orgGstinText: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
  },
  cellNormalText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "500",
  },
  grossTotalText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  balanceDueText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },

  /* Action Buttons */
  actionViewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  actionViewText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  actionPayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  actionPayText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  actionIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyWrap: {
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#64748B",
  },

  /* Dropdown Picker Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerBox: {
    width: 270,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  pickerOptionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  pickerOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },

  /* Generate Invoice Modal */
  formModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "88%",
  },
  formHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  formScroll: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 10,
  },
  formTextInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  calcPreviewBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    gap: 4,
  },
  calcTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  calcText: {
    fontSize: 12,
    color: "#475569",
  },
  calcGross: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2563EB",
    marginTop: 4,
  },
  submitInvoiceBtn: {
    backgroundColor: "#2563EB",
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  submitInvoiceBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Preview Card */
  previewCard: {
    width: "88%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  previewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  previewSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  previewBody: {
    marginBottom: 16,
  },
  previewClientName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  previewGstin: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 12,
  },
  previewGrid: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 8,
  },
  previewCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  previewVal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  closePreviewBtn: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closePreviewBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
});
