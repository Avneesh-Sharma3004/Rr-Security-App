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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  setClientSearchQuery,
  setClientStatusFilter,
  addClient,
  toggleClientStatus,
} from "../../store/slices/clientsSlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";

export default function AdminClientsScreen() {
  const dispatch = useDispatch();
  const { clients, searchQuery, selectedStatus } = useSelector(
    (state) => state.clients
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientCategory, setNewClientCategory] = useState("");
  const [newClientLocation, setNewClientLocation] = useState("");
  const [newClientContact, setNewClientContact] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientGuards, setNewClientGuards] = useState("4");

  const filterTabs = ["All", "Active", "Pending Review"];

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || client.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSaveClient = () => {
    if (!newClientName.trim() || !newClientLocation.trim()) {
      Alert.alert("Validation", "Please provide Client Name and Location.");
      return;
    }

    dispatch(
      addClient({
        name: newClientName.trim(),
        category: newClientCategory.trim() || "Commercial & Corporate",
        location: newClientLocation.trim(),
        contactPerson: newClientContact.trim() || "Operations Officer",
        phone: newClientPhone.trim() || "+91 98000 00000",
        guardsDeployed: parseInt(newClientGuards, 10) || 4,
        contractUntil: "31 Dec 2028",
        monthlyBilling: "₹ 1,50,000",
      })
    );

    setNewClientName("");
    setNewClientCategory("");
    setNewClientLocation("");
    setNewClientContact("");
    setNewClientPhone("");
    setNewClientGuards("4");
    setIsAddModalOpen(false);

    Alert.alert("Success", "New client site registered successfully!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            style={styles.drawerIconBtn}
            onPress={() => dispatch(toggleDrawer())}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={23} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Client Sites & Contracts</Text>
            <Text style={styles.subtitle}>
              {clients.length} Active client partnerships
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Client</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          placeholder="Search by client name, location, contact..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={(txt) => dispatch(setClientSearchQuery(txt))}
          style={styles.searchInput}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => dispatch(setClientSearchQuery(""))}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {filterTabs.map((tab) => {
          const isActive = selectedStatus === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, isActive && styles.activeFilterTab]}
              onPress={() => dispatch(setClientStatusFilter(tab))}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && styles.activeFilterTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Client List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredClients.map((client) => {
          const isActive = client.status === "Active";
          return (
            <View key={client.id} style={styles.clientCard}>
              {/* Card Top */}
              <View style={styles.cardHeader}>
                <View style={styles.clientInfoLeft}>
                  <View style={styles.clientIcon}>
                    <Ionicons name="business" size={20} color="#2563EB" />
                  </View>
                  <View style={styles.clientTitleContainer}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientCategory}>{client.category}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: isActive ? "#ECFDF5" : "#FFF7ED" },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isActive ? "#16A34A" : "#EA580C" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: isActive ? "#047857" : "#C2410C" },
                    ]}
                  >
                    {client.status}
                  </Text>
                </View>
              </View>

              {/* Location info */}
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={15} color="#64748B" />
                <Text style={styles.detailText}>{client.location}</Text>
              </View>

              {/* Contact info */}
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={15} color="#64748B" />
                <Text style={styles.detailText}>
                  {client.contactPerson} ({client.phone})
                </Text>
              </View>

              {/* Stats Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.footerStat}>
                  <Text style={styles.footerStatLabel}>GUARDS DEPLOYED</Text>
                  <Text style={styles.footerStatValue}>
                    {client.guardsDeployed} Personnel
                  </Text>
                </View>

                <View style={styles.footerStat}>
                  <Text style={styles.footerStatLabel}>MONTHLY BILLING</Text>
                  <Text style={styles.footerStatValue}>
                    {client.monthlyBilling}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.toggleBtn}
                  onPress={() => dispatch(toggleClientStatus(client.id))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.toggleBtnText}>
                    {isActive ? "Deactivate" : "Activate"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {filteredClients.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No client sites found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your search or add a new client.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Client Modal */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Client Site</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Client / Enterprise Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. DLF Horizon Towers"
                value={newClientName}
                onChangeText={setNewClientName}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Corporate IT Park"
                value={newClientCategory}
                onChangeText={setNewClientCategory}
              />

              <Text style={styles.inputLabel}>Location / Address *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Sector 43, Gurugram"
                value={newClientLocation}
                onChangeText={setNewClientLocation}
              />

              <Text style={styles.inputLabel}>Contact Person</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Mr. Sanjay Kapoor"
                value={newClientContact}
                onChangeText={setNewClientContact}
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. +91 98100 12345"
                keyboardType="phone-pad"
                value={newClientPhone}
                onChangeText={setNewClientPhone}
              />

              <Text style={styles.inputLabel}>Required Guards</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 6"
                keyboardType="numeric"
                value={newClientGuards}
                onChangeText={setNewClientGuards}
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveClient}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Save Client Site</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  drawerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#0F172A",
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },
  activeFilterTab: {
    backgroundColor: "#2563EB",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  activeFilterTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  clientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  clientInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  clientIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  clientTitleContainer: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  clientCategory: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 12,
    color: "#475569",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerStat: {
    gap: 2,
  },
  footerStatLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  footerStatValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  emptySub: {
    fontSize: 12,
    color: "#64748B",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalBody: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
