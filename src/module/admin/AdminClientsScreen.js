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
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  setClientSearchQuery,
  setClientStatusFilter,
  resetFilters,
  addClient,
  editClient,
  toggleClientStatus,
  deleteClient,
  setActiveSubTab,
} from "../../store/slices/clientsSlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";
import { useAuth } from "../../hooks/UseAuth";
import ClientBillingView from "./components/ClientBillingView";

export default function AdminClientsScreen() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { clients, searchQuery, selectedStatus, activeSubTab } = useSelector(
    (state) => state.clients
  );

  // Modals & Popovers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatusPickerOpen, setIsStatusPickerOpen] = useState(false);
  const [activeMenuClient, setActiveMenuClient] = useState(null); // client object for action popover
  const [detailsModalClient, setDetailsModalClient] = useState(null);
  const [credentialsModalClient, setCredentialsModalClient] = useState(null);
  const [expandedClientId, setExpandedClientId] = useState(null);

  const toggleExpandClient = (id) => {
    setExpandedClientId((prev) => (prev === id ? null : id));
  };

  // Add / Edit Form State
  const [editingClientId, setEditingClientId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formGstin, setFormGstin] = useState("");
  const [formContactPerson, setFormContactPerson] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formContractStart, setFormContractStart] = useState("01 Nov 2026");
  const [formContractEnd, setFormContractEnd] = useState("31 Oct 2027");
  const [formEmployees, setFormEmployees] = useState("1");

  // KPI Calculations
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "Active").length;
  const inactiveClients = clients.filter((c) => c.status === "Inactive").length;
  const totalEmployees = clients.reduce(
    (sum, c) => sum + (parseInt(c.employees, 10) || 0),
    0
  );

  // Filtering
  const filteredClients = clients.filter((c) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.gstin.toLowerCase().includes(query) ||
      c.contactPerson.toLowerCase().includes(query) ||
      c.clientId.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query);

    const matchesStatus =
      selectedStatus === "All Status" || c.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleOpenAddModal = (clientToEdit = null) => {
    if (clientToEdit) {
      setEditingClientId(clientToEdit.id);
      setFormName(clientToEdit.name);
      setFormAddress(clientToEdit.address);
      setFormGstin(clientToEdit.gstin);
      setFormContactPerson(clientToEdit.contactPerson);
      setFormPhone(clientToEdit.phone);
      setFormContractStart(clientToEdit.contractStart);
      setFormContractEnd(clientToEdit.contractEnd);
      setFormEmployees(String(clientToEdit.employees || 0));
    } else {
      setEditingClientId(null);
      setFormName("");
      setFormAddress("");
      setFormGstin("");
      setFormContactPerson("");
      setFormPhone("");
      setFormContractStart("01 Nov 2026");
      setFormContractEnd("31 Oct 2027");
      setFormEmployees("1");
    }
    setIsAddModalOpen(true);
  };

  const handleSaveClient = () => {
    if (!formName.trim() || !formContactPerson.trim()) {
      Alert.alert("Validation Error", "Please provide Client Name and Contact Person.");
      return;
    }

    if (editingClientId) {
      dispatch(
        editClient({
          id: editingClientId,
          name: formName.trim(),
          address: formAddress.trim() || "Address not specified",
          gstin: formGstin.trim() || "N/A",
          contactPerson: formContactPerson.trim(),
          phone: formPhone.trim() || "N/A",
          contractStart: formContractStart.trim(),
          contractEnd: formContractEnd.trim(),
          employees: parseInt(formEmployees, 10) || 0,
        })
      );
      Alert.alert("Success", "Client details updated successfully!");
    } else {
      dispatch(
        addClient({
          name: formName.trim(),
          address: formAddress.trim() || "Address not specified",
          gstin: formGstin.trim() || "07AAXXX0000X1Z1",
          contactPerson: formContactPerson.trim(),
          phone: formPhone.trim() || "+91 98000 00000",
          contractStart: formContractStart.trim(),
          contractEnd: formContractEnd.trim(),
          employees: parseInt(formEmployees, 10) || 1,
        })
      );
      Alert.alert("Success", "New client registered successfully!");
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteClient = (client) => {
    Alert.alert(
      "Delete Client",
      `Are you sure you want to remove "${client.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteClient(client.id));
            setActiveMenuClient(null);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top User Header Bar matching user's phone screenshot */}
      <View style={styles.userHeaderBar}>
        <View style={styles.userInfoRow}>
          <View style={styles.userAvatarCircle}>
            <Text style={styles.userAvatarInitial}>
              {(user?.name ? user.name[0] : "N").toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.userNameText}>
              {user?.name || "Normal User"}
            </Text>
            <Text style={styles.userRoleText}>
              {user?.role === "ADMIN" ? "Admin" : "User"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.drawerHamburgerBtn}
          onPress={() => dispatch(toggleDrawer())}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Segment Tab Switcher matching exact phone UI: [ All Clients ]  [ Billing ] */}
      <View style={styles.pillTabBarWrap}>
        <View style={styles.pillTabBar}>
          <TouchableOpacity
            style={[
              styles.pillTabBtn,
              activeSubTab !== "Billing" && styles.activePillTabBtn,
            ]}
            onPress={() => dispatch(setActiveSubTab("All Clients"))}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.pillTabText,
                activeSubTab !== "Billing" && styles.activePillTabText,
              ]}
            >
              All Clients
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pillTabBtn,
              activeSubTab === "Billing" && styles.activePillTabBtn,
            ]}
            onPress={() => dispatch(setActiveSubTab("Billing"))}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.pillTabText,
                activeSubTab === "Billing" && styles.activePillTabText,
              ]}
            >
              Billing
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSubTab === "Billing" ? (
          <ClientBillingView />
        ) : (
          <>
            {/* Top Header Row with Title, Badge, Description, and + Add Client Button */}
            <View style={styles.topSection}>
              <View style={styles.headerLeft}>
                <View style={styles.titleRow}>
                  {/* Drawer Menu Button */}
                  <TouchableOpacity
                    style={styles.drawerIconBtn}
                    onPress={() => dispatch(toggleDrawer())}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="menu" size={23} color="#0F172A" />
                  </TouchableOpacity>

                  <Text style={styles.pageTitle}>Clients</Text>

                  {/* Organization Badge */}
                  <View style={styles.orgBadge}>
                    <Text style={styles.orgBadgeText}>
                      RR Security & Facilities (RRS8392014SEC)
                    </Text>
                  </View>
                </View>

            <Text style={styles.pageSubtitle}>
              Manage client companies and workforce assigned to{" "}
              <Text style={styles.boldText}>RR Security & Facilities</Text>.
            </Text>
          </View>

          {/* + Add Client Button */}
          <TouchableOpacity
            style={styles.addClientBtn}
            onPress={() => handleOpenAddModal(null)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addClientBtnText}>Add Client</Text>
          </TouchableOpacity>
        </View>

        {/* 4 Stats KPI Summary Cards */}
        <View style={styles.statsRow}>
          {/* Total Clients */}
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="business" size={20} color="#2563EB" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total Clients</Text>
              <Text style={styles.statValue}>{totalClients}</Text>
            </View>
          </View>

          {/* Active Clients */}
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="business" size={20} color="#16A34A" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Active Clients</Text>
              <Text style={styles.statValue}>{activeClients}</Text>
            </View>
          </View>

          {/* Inactive Clients */}
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="business" size={20} color="#DC2626" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Inactive Clients</Text>
              <Text style={styles.statValue}>{inactiveClients}</Text>
            </View>
          </View>

          {/* Total Employees */}
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#FAF5FF" }]}>
              <Ionicons name="people" size={20} color="#9333EA" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total Employees</Text>
              <Text style={styles.statValue}>{totalEmployees}</Text>
            </View>
          </View>
        </View>

        {/* Search, Status Dropdown Filter, and Reset Filters */}
        <View style={styles.filterSectionCard}>
          {/* Search Box */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search client, GSTIN or contact person..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={(txt) => dispatch(setClientSearchQuery(txt))}
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => dispatch(setClientSearchQuery(""))}
              >
                <Ionicons name="close-circle" size={17} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Filter Dropdown & Reset */}
          <View style={styles.filterControlsRow}>
            {/* Status Dropdown Button */}
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setIsStatusPickerOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownBtnText}>{selectedStatus}</Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>

            {/* Reset Filters Button */}
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => dispatch(resetFilters())}
              activeOpacity={0.7}
            >
              <Ionicons name="reload" size={14} color="#475569" />
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Client Cards List (Mobile-Optimized, Expandable on Press, No Horizontal Scroll) */}
        <View style={styles.clientCardsList}>
          {filteredClients.map((client) => {
            const isExpanded = expandedClientId === client.id;
            const isActive = client.status === "Active";

            return (
              <View key={client.id} style={styles.clientCard}>
                {/* Clickable Header: Name, ID, Status, and Chevron Indicator */}
                <TouchableOpacity
                  style={styles.cardHeaderTouchable}
                  onPress={() => toggleExpandClient(client.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.initialBox}>
                    <Text style={styles.initialText}>{client.initial}</Text>
                  </View>

                  <View style={styles.clientMainInfo}>
                    <Text style={styles.clientCardName} numberOfLines={1}>
                      {client.name}
                    </Text>
                    <View style={styles.clientIdPill}>
                      <Text style={styles.clientIdPillText}>
                        {client.clientId}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardRightCol}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isActive ? "#DCFCE7" : "#FEE2E2",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: isActive ? "#16A34A" : "#DC2626" },
                        ]}
                      >
                        {client.status}
                      </Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#64748B"
                    />
                  </View>
                </TouchableOpacity>

                {/* When Pressed / Expanded: Details & Action Buttons */}
                {isExpanded && (
                  <View style={styles.cardExpandedContent}>
                    {/* Details Box */}
                    <View style={styles.cardDetailsBox}>
                      {/* Row 1: Contact Person & Phone */}
                      <View style={styles.detailRow}>
                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>CONTACT PERSON</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="person-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={1}>
                              {client.contactPerson}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>PHONE</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="call-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={1}>
                              {client.phone}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Row 2: GSTIN & Workforce */}
                      <View style={styles.detailRow}>
                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>GSTIN</Text>
                          <Text style={styles.detailValue} numberOfLines={1}>
                            {client.gstin}
                          </Text>
                        </View>

                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>WORKFORCE</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="people-outline"
                              size={12}
                              color="#2563EB"
                            />
                            <Text
                              style={[
                                styles.detailValue,
                                { color: "#2563EB", fontWeight: "700" },
                              ]}
                            >
                              {client.employees}{" "}
                              {client.employees === 1
                                ? "Employee"
                                : "Employees"}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Row 3: Contract Period */}
                      <View style={styles.detailRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.detailLabel}>CONTRACT PERIOD</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="calendar-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue}>
                              {client.contractStart} → {client.contractEnd}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Row 4: Address */}
                      <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.detailLabel}>ADDRESS</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="location-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={2}>
                              {client.address}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Dedicated Action Buttons Row */}
                    <View style={styles.cardActionsRow}>
                      {/* View Details */}
                      <TouchableOpacity
                        style={styles.cardActionBtn}
                        onPress={() => setDetailsModalClient(client)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="eye-outline" size={13} color="#334155" />
                        <Text style={styles.cardActionBtnText}>View</Text>
                      </TouchableOpacity>

                      {/* Edit */}
                      <TouchableOpacity
                        style={[styles.cardActionBtn, styles.editActionBtn]}
                        onPress={() => handleOpenAddModal(client)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="pencil-outline"
                          size={13}
                          color="#2563EB"
                        />
                        <Text
                          style={[
                            styles.cardActionBtnText,
                            { color: "#2563EB" },
                          ]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>

                      {/* Credentials */}
                      <TouchableOpacity
                        style={[styles.cardActionBtn, styles.credActionBtn]}
                        onPress={() => setCredentialsModalClient(client)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="key-outline"
                          size={13}
                          color="#0D9488"
                        />
                        <Text
                          style={[
                            styles.cardActionBtnText,
                            { color: "#0D9488" },
                          ]}
                        >
                          Access
                        </Text>
                      </TouchableOpacity>

                      {/* Activate / Deactivate Toggle */}
                      <TouchableOpacity
                        style={[
                          styles.cardActionBtn,
                          isActive
                            ? styles.deactivateActionBtn
                            : styles.activateActionBtn,
                        ]}
                        onPress={() => dispatch(toggleClientStatus(client.id))}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="power-outline"
                          size={13}
                          color={isActive ? "#D97706" : "#16A34A"}
                        />
                        <Text
                          style={[
                            styles.cardActionBtnText,
                            { color: isActive ? "#D97706" : "#16A34A" },
                          ]}
                        >
                          {isActive ? "Disable" : "Enable"}
                        </Text>
                      </TouchableOpacity>

                      {/* Delete */}
                      <TouchableOpacity
                        style={[styles.cardActionBtn, styles.deleteActionBtn]}
                        onPress={() => handleDeleteClient(client)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={13}
                          color="#DC2626"
                        />
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
                )}
              </View>
            );
          })}

          {filteredClients.length === 0 && (
            <View style={styles.emptyTable}>
              <Ionicons name="business-outline" size={40} color="#CBD5E1" />
              <Text style={styles.emptyTableText}>No clients match criteria</Text>
              <TouchableOpacity
                style={styles.emptyResetBtn}
                onPress={() => dispatch(resetFilters())}
              >
                <Text style={styles.emptyResetBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        </>
        )}
      </ScrollView>

      {/* Action Popover Menu (Matching Screenshot) */}
      {activeMenuClient && (
        <Modal
          visible={!!activeMenuClient}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveMenuClient(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setActiveMenuClient(null)}
          >
            <Pressable
              style={styles.actionMenuCard}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.menuHeader}>
                <Text style={styles.menuClientTitle} numberOfLines={1}>
                  {activeMenuClient.name}
                </Text>
                <Text style={styles.menuClientId}>
                  {activeMenuClient.clientId}
                </Text>
              </View>

              {/* View Details */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  const client = activeMenuClient;
                  setActiveMenuClient(null);
                  setDetailsModalClient(client);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="eye-outline" size={18} color="#475569" />
                <Text style={styles.menuItemText}>View Details</Text>
              </TouchableOpacity>

              {/* Credentials */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  const client = activeMenuClient;
                  setActiveMenuClient(null);
                  setCredentialsModalClient(client);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="key-outline" size={18} color="#475569" />
                <Text style={styles.menuItemText}>Credentials</Text>
              </TouchableOpacity>

              {/* Edit Client */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  const client = activeMenuClient;
                  setActiveMenuClient(null);
                  handleOpenAddModal(client);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil-outline" size={18} color="#475569" />
                <Text style={styles.menuItemText}>Edit Client</Text>
              </TouchableOpacity>

              {/* Deactivate / Activate */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  dispatch(toggleClientStatus(activeMenuClient.id));
                  setActiveMenuClient(null);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="power-outline" size={18} color="#475569" />
                <Text style={styles.menuItemText}>
                  {activeMenuClient.status === "Active"
                    ? "Deactivate"
                    : "Activate"}
                </Text>
              </TouchableOpacity>

              {/* Delete Client */}
              <TouchableOpacity
                style={[styles.menuItem, styles.deleteMenuItem]}
                onPress={() => handleDeleteClient(activeMenuClient)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
                <Text style={styles.deleteMenuText}>Delete Client</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* Status Picker Modal */}
      <Modal
        visible={isStatusPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsStatusPickerOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsStatusPickerOpen(false)}
        >
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Filter by Status</Text>
            {["All Status", "Active", "Inactive"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.pickerOption,
                  selectedStatus === status && styles.activePickerOption,
                ]}
                onPress={() => {
                  dispatch(setClientStatusFilter(status));
                  setIsStatusPickerOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    selectedStatus === status && styles.activePickerOptionText,
                  ]}
                >
                  {status}
                </Text>
                {selectedStatus === status && (
                  <Ionicons name="checkmark" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Client Credentials Modal */}
      {credentialsModalClient && (
        <Modal
          visible={!!credentialsModalClient}
          transparent
          animationType="fade"
          onRequestClose={() => setCredentialsModalClient(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setCredentialsModalClient(null)}
          >
            <View style={styles.credentialsCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalHeaderTitle}>Client Credentials</Text>
                <TouchableOpacity onPress={() => setCredentialsModalClient(null)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.credClientName}>
                {credentialsModalClient.name}
              </Text>

              <View style={styles.credBox}>
                <Text style={styles.credLabel}>PORTAL USERNAME / ID</Text>
                <Text style={styles.credValue}>
                  {credentialsModalClient.clientId.toLowerCase()}@rrsecurity.com
                </Text>

                <Text style={[styles.credLabel, { marginTop: 12 }]}>
                  DEFAULT ACCESS PIN
                </Text>
                <Text style={styles.credValue}>8392-SEC</Text>

                <Text style={[styles.credLabel, { marginTop: 12 }]}>
                  REGISTERED PHONE
                </Text>
                <Text style={styles.credValue}>
                  {credentialsModalClient.phone}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setCredentialsModalClient(null)}
              >
                <Text style={styles.closeModalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Client Details Modal */}
      {detailsModalClient && (
        <Modal
          visible={!!detailsModalClient}
          transparent
          animationType="fade"
          onRequestClose={() => setDetailsModalClient(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setDetailsModalClient(null)}
          >
            <View style={styles.detailsModalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalHeaderTitle}>Client Overview</Text>
                <TouchableOpacity onPress={() => setDetailsModalClient(null)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.detailsModalContent}>
                <Text style={styles.detailsClientName}>
                  {detailsModalClient.name}
                </Text>
                <Text style={styles.detailsClientSub}>
                  {detailsModalClient.clientId} • {detailsModalClient.status}
                </Text>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailsCol}>
                    <Text style={styles.detailsColLabel}>GSTIN</Text>
                    <Text style={styles.detailsColVal}>
                      {detailsModalClient.gstin}
                    </Text>
                  </View>

                  <View style={styles.detailsCol}>
                    <Text style={styles.detailsColLabel}>CONTACT PERSON</Text>
                    <Text style={styles.detailsColVal}>
                      {detailsModalClient.contactPerson}
                    </Text>
                  </View>

                  <View style={styles.detailsCol}>
                    <Text style={styles.detailsColLabel}>PHONE NUMBER</Text>
                    <Text style={styles.detailsColVal}>
                      {detailsModalClient.phone}
                    </Text>
                  </View>

                  <View style={styles.detailsCol}>
                    <Text style={styles.detailsColLabel}>GUARDS DEPLOYED</Text>
                    <Text style={[styles.detailsColVal, { color: "#2563EB" }]}>
                      {detailsModalClient.employees} Personnel
                    </Text>
                  </View>

                  <View style={styles.detailsCol}>
                    <Text style={styles.detailsColLabel}>CONTRACT PERIOD</Text>
                    <Text style={styles.detailsColVal}>
                      {detailsModalClient.contractStart} to{" "}
                      {detailsModalClient.contractEnd}
                    </Text>
                  </View>

                  <View style={styles.detailsCol}>
                    <Text style={styles.detailsColLabel}>ADDRESS / LOCATION</Text>
                    <Text style={styles.detailsColVal}>
                      {detailsModalClient.address}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setDetailsModalClient(null)}
              >
                <Text style={styles.closeModalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Add / Edit Client Modal */}
      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.formModalBackdrop}>
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingClientId ? "Edit Client Site" : "Add New Client"}
              </Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formBody}>
              <Text style={styles.fieldLabel}>Client / Enterprise Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Petal Commercial Pvt Ltd"
                value={formName}
                onChangeText={setFormName}
              />

              <Text style={styles.fieldLabel}>Complete Address *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. A-32A, Block a, sector-62 Noida U.P."
                value={formAddress}
                onChangeText={setFormAddress}
              />

              <Text style={styles.fieldLabel}>GSTIN *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 07AAICP6612N1Z0"
                value={formGstin}
                onChangeText={setFormGstin}
              />

              <Text style={styles.fieldLabel}>Contact Person *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. ASHU / Ravish Rana"
                value={formContactPerson}
                onChangeText={setFormContactPerson}
              />

              <Text style={styles.fieldLabel}>Phone Number *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 8802515674"
                keyboardType="phone-pad"
                value={formPhone}
                onChangeText={setFormPhone}
              />

              <View style={styles.dateRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.fieldLabel}>Contract Start</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="15 Jun 2027"
                    value={formContractStart}
                    onChangeText={setFormContractStart}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Contract End</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="14 Jun 2027"
                    value={formContractEnd}
                    onChangeText={setFormContractEnd}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Assigned Employees Count</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 1"
                keyboardType="numeric"
                value={formEmployees}
                onChangeText={setFormEmployees}
              />

              <TouchableOpacity
                style={styles.saveClientBtn}
                onPress={handleSaveClient}
                activeOpacity={0.8}
              >
                <Text style={styles.saveClientBtnText}>
                  {editingClientId ? "Update Client" : "Save Client"}
                </Text>
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
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  /* Top Header */
  topSection: {
    marginBottom: 16,
  },
  headerLeft: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  drawerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  orgBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orgBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  pageSubtitle: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },
  boldText: {
    fontWeight: "700",
    color: "#1E293B",
  },
  addClientBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
    alignSelf: "flex-start",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addClientBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Stats KPI Cards */
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
  statIconWrap: {
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
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },

  /* Search & Filters Card */
  filterSectionCard: {
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
  searchBox: {
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
  filterControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    minWidth: 125,
  },
  dropdownBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  /* Client Cards List (Mobile) */
  clientCardsList: {
    gap: 8,
    marginBottom: 20,
  },
  clientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderTouchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  initialBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  clientMainInfo: {
    flex: 1,
    gap: 3,
  },
  clientCardName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  clientIdPill: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  clientIdPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
  },
  cardRightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: "700",
  },

  /* Expanded Content */
  cardExpandedContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FAFAFA",
  },
  cardDetailsBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  detailItemHalf: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 8.5,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
  detailValWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailValue: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#1E293B",
  },

  /* Action Buttons Row */
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  cardActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    paddingVertical: 5,
  },
  editActionBtn: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  credActionBtn: {
    backgroundColor: "#F0FDFA",
    borderColor: "#99F6E4",
  },
  activateActionBtn: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  deactivateActionBtn: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  deleteActionBtn: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  cardActionBtnText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#334155",
  },
  emptyTable: {
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTableText: {
    fontSize: 13,
    color: "#64748B",
  },
  emptyResetBtn: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  emptyResetBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563EB",
  },

  /* Action Popover Menu */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionMenuCard: {
    width: 230,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 4,
  },
  menuClientTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  menuClientId: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  deleteMenuItem: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 4,
  },
  deleteMenuText: {
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "700",
  },

  /* Status Picker */
  pickerCard: {
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activePickerOption: {
    backgroundColor: "#EFF6FF",
  },
  pickerOptionText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  activePickerOptionText: {
    color: "#2563EB",
    fontWeight: "700",
  },

  /* Credentials & Details Modals */
  credentialsCard: {
    width: "88%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  credClientName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 12,
  },
  credBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    marginBottom: 16,
  },
  credLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  credValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  closeModalBtn: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeModalBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },

  detailsModalCard: {
    width: "90%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: "85%",
  },
  detailsModalContent: {
    marginBottom: 16,
  },
  detailsClientName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  detailsClientSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 14,
  },
  detailsGrid: {
    gap: 12,
  },
  detailsCol: {
    gap: 2,
  },
  detailsColLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  detailsColVal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },

  /* Add / Edit Form Modal */
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
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  formBody: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 10,
  },
  formInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  dateRow: {
    flexDirection: "row",
  },
  saveClientBtn: {
    backgroundColor: "#2563EB",
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  saveClientBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Segmented Tab Switcher */
  segmentTabBar: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  segmentTabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  activeSegmentTabBtn: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  activeSegmentTabText: {
    color: "#2563EB",
    fontWeight: "700",
  },

  /* Top User Header Bar */
  userHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarInitial: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  userNameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  userRoleText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  drawerHamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Segmented Pill Tab Bar */
  pillTabBarWrap: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  pillTabBar: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 3,
  },
  pillTabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activePillTabBtn: {
    backgroundColor: "#3B82F6",
  },
  pillTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  activePillTabText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
