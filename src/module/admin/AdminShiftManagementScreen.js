import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  setActiveShiftSubTab,
  setSearchQuery,
  setSelectedClient,
  setSelectedSite,
  setSelectedDepartment,
  setSelectedShift,
  setSelectedShiftType,
  setSelectedStatus,
  setSelectedDate,
  resetShiftFilters,
  assignShift,
  unassignShift,
  addShiftPattern,
  editShiftPattern,
  deleteShiftPattern,
} from "../../store/slices/shiftsSlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";
import { useAuth } from "../../hooks/UseAuth";

export default function AdminShiftManagementScreen() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const {
    activeShiftSubTab,
    totalShifts,
    activeShifts,
    employeesAssigned,
    unassignedEmployees,
    patternsSummary,
    patterns,
    searchQuery,
    selectedClient,
    selectedSite,
    selectedDepartment,
    selectedShift,
    selectedShiftType,
    selectedStatus,
    selectedDate,
    roster,
    clientSummary,
  } = useSelector((state) => state.shifts);

  // Modals
  const [isAddPatternModalOpen, setIsAddPatternModalOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRosterEmp, setSelectedRosterEmp] = useState(null);
  const [patternSearchQuery, setPatternSearchQuery] = useState("");
  const [expandedRosterId, setExpandedRosterId] = useState(null);

  const toggleExpandRoster = (id) => {
    setExpandedRosterId((prev) => (prev === id ? null : id));
  };

  // Dropdown Picker Modal State
  const [pickerConfig, setPickerConfig] = useState(null);

  // Dropdown Options
  const clientOptions = [
    "All Clients",
    "RSAG Sealing Solutions Pvt Ltd",
    "Petal Commercial Pvt Ltd",
    "RR Security & Facilities",
  ];

  const siteOptions = [
    "All Sites",
    "Plot No-376, Udyog Kendra -1 Ecotech-III, Greater Noida Gautam Budh Nagar U.P.",
    "A-32A, Block a, sector-62 Noida U.P.",
    "Main Building",
    "Plot No-376,Greater Noida Gautam Budh Nagar U.P.",
    "Corporate HQ",
  ];

  const departmentOptions = [
    "All Departments",
    "Security",
    "Worker",
    "Office Staff",
  ];

  const shiftOptions = [
    "All Shifts",
    "Evening Shift",
    "General Day Shift",
    "Morning Shift",
    "Night Patrol Shift",
    "Rotational 12H Guard",
    "Night Shift",
    "Unassigned",
  ];

  const shiftTypeOptions = ["All Types", "Day", "Night", "Rotational"];
  const statusOptions = ["All Status", "Active", "Inactive"];

  const openPicker = (type, title, options, selectedValue, onSelect) => {
    setPickerConfig({ type, title, options, selectedValue, onSelect });
  };

  // Filter Roster
  const filteredRoster = roster.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.empId.toLowerCase().includes(q) ||
      item.client.toLowerCase().includes(q) ||
      item.site.toLowerCase().includes(q);

    const matchesClient =
      selectedClient === "All Clients" || item.client === selectedClient;

    const matchesSite =
      selectedSite === "All Sites" ||
      item.site.includes(selectedSite) ||
      item.site === selectedSite;

    const matchesDept =
      selectedDepartment === "All Departments" ||
      item.department === selectedDepartment;

    const matchesShift =
      selectedShift === "All Shifts" ||
      (selectedShift === "Unassigned" && item.shift === "Unassigned") ||
      item.shift.toLowerCase().includes(selectedShift.toLowerCase());

    const matchesType =
      selectedShiftType === "All Types" || item.shiftType === selectedShiftType;

    const matchesStatus =
      selectedStatus === "All Status" || item.status === selectedStatus;

    return (
      matchesSearch &&
      matchesClient &&
      matchesSite &&
      matchesDept &&
      matchesShift &&
      matchesType &&
      matchesStatus
    );
  });

  // Filter Shift Patterns
  const filteredPatterns = patterns.filter((pat) => {
    const q = patternSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      pat.name.toLowerCase().includes(q) ||
      pat.type.toLowerCase().includes(q) ||
      pat.startTime.toLowerCase().includes(q) ||
      pat.endTime.toLowerCase().includes(q)
    );
  });

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

      {/* Segmented Sub-Tabs Bar: Shift Provider | Shift Patterns | Calendar View */}
      <View style={styles.tabSegmentsWrap}>
        <View style={styles.tabSegmentsContainer}>
          {[
            { key: "Shift Roster", label: "Shift Provider" },
            { key: "Shift Patterns", label: "Shift Patterns" },
            { key: "Calendar View", label: "Calendar View" },
          ].map((tab) => {
            const isActive = activeShiftSubTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabSegmentBtn,
                  isActive && styles.activeTabSegmentBtn,
                ]}
                onPress={() => dispatch(setActiveShiftSubTab(tab.key))}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabSegmentText,
                    isActive && styles.activeTabSegmentText,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ========================================================= */}
        {/* VIEW 1: SHIFT PATTERNS (MATCHING USER SCREENSHOT EXACTLY) */}
        {/* ========================================================= */}
        {activeShiftSubTab === "Shift Patterns" && (
          <View style={styles.patternsViewWrap}>
            {/* Header with Title and Add Shift Button */}
            <View style={styles.patternsHeaderActionRow}>
              <View>
                <Text style={styles.patternSectionTitle}>Shift Patterns</Text>
                <Text style={styles.patternSectionSub}>
                  Create and manage configured shift timings
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addShiftBtn}
                onPress={() => setIsAddPatternModalOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.addShiftBtnText}>+ Add Shift</Text>
              </TouchableOpacity>
            </View>

            {/* Search Filter for Patterns */}
            <View style={styles.patternSearchRow}>
              <View style={styles.patternSearchInputBox}>
                <Ionicons name="search" size={15} color="#94A3B8" />
                <TextInput
                  style={styles.patternSearchInput}
                  placeholder="Filter shift pattern name or timing..."
                  placeholderTextColor="#94A3B8"
                  value={patternSearchQuery}
                  onChangeText={setPatternSearchQuery}
                />
                {patternSearchQuery ? (
                  <TouchableOpacity onPress={() => setPatternSearchQuery("")}>
                    <Ionicons name="close-circle" size={15} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={styles.patternCountPill}>
                <Text style={styles.patternCountPillText}>
                  {filteredPatterns.length} Configurations
                </Text>
              </View>
            </View>

            {/* Shift Patterns Data Table Matching Screenshot */}
            <View style={styles.tableCard}>
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View style={styles.tableInner}>
                  {/* Table Headers */}
                  <View style={styles.tableHeaderRow}>
                    <View style={[styles.th, { width: 170 }]}>
                      <Text style={styles.thText}>SHIFT NAME</Text>
                    </View>
                    <View style={[styles.th, { width: 110 }]}>
                      <Text style={styles.thText}>SHIFT TYPE</Text>
                    </View>
                    <View style={[styles.th, { width: 115 }]}>
                      <Text style={styles.thText}>START TIME</Text>
                    </View>
                    <View style={[styles.th, { width: 115 }]}>
                      <Text style={styles.thText}>END TIME</Text>
                    </View>
                    <View style={[styles.th, { width: 95 }]}>
                      <Text style={styles.thText}>BREAK</Text>
                    </View>
                    <View style={[styles.th, { width: 120 }]}>
                      <Text style={styles.thText}>GRACE PERIOD</Text>
                    </View>
                    <View
                      style={[
                        styles.th,
                        { width: 100, alignItems: "center", justifyContent: "center" },
                      ]}
                    >
                      <Text style={styles.thText}>STATUS</Text>
                    </View>
                    <View
                      style={[
                        styles.th,
                        { width: 130, alignItems: "center", justifyContent: "center" },
                      ]}
                    >
                      <Text style={styles.thText}>ACTIONS</Text>
                    </View>
                  </View>

                  {/* Table Rows matching screenshot */}
                  {filteredPatterns.map((pat, idx) => {
                    const isEven = idx % 2 === 1;

                    // Type Badge Colors
                    let typeBg = "#EFF6FF";
                    let typeColor = "#2563EB";
                    if (pat.type === "Night") {
                      typeBg = "#F3E8FF";
                      typeColor = "#7C3AED";
                    } else if (pat.type === "Rotational") {
                      typeBg = "#FEF3C7";
                      typeColor = "#D97706";
                    }

                    return (
                      <View
                        key={pat.id}
                        style={[
                          styles.tableRow,
                          isEven && { backgroundColor: "#F8FAFC" },
                        ]}
                      >
                        {/* SHIFT NAME */}
                        <View style={[styles.td, { width: 170 }]}>
                          <Text style={styles.shiftPatternNameText} numberOfLines={1}>
                            {pat.name}
                          </Text>
                        </View>

                        {/* SHIFT TYPE */}
                        <View style={[styles.td, { width: 110 }]}>
                          <View
                            style={[
                              styles.shiftTypePill,
                              { backgroundColor: typeBg },
                            ]}
                          >
                            <Text
                              style={[
                                styles.shiftTypePillText,
                                { color: typeColor },
                              ]}
                            >
                              {pat.type}
                            </Text>
                          </View>
                        </View>

                        {/* START TIME */}
                        <View style={[styles.td, { width: 115 }]}>
                          <Text style={styles.timeValText}>{pat.startTime}</Text>
                        </View>

                        {/* END TIME */}
                        <View style={[styles.td, { width: 115 }]}>
                          <Text style={styles.timeValText}>{pat.endTime}</Text>
                        </View>

                        {/* BREAK */}
                        <View style={[styles.td, { width: 95 }]}>
                          <Text style={styles.cellNormalText}>{pat.breakDuration}</Text>
                        </View>

                        {/* GRACE PERIOD */}
                        <View style={[styles.td, { width: 120 }]}>
                          <Text style={styles.cellNormalText}>{pat.gracePeriod}</Text>
                        </View>

                        {/* STATUS */}
                        <View
                          style={[
                            styles.td,
                            { width: 100, alignItems: "center", justifyContent: "center" },
                          ]}
                        >
                          <View style={styles.activePillBadge}>
                            <Text style={styles.activePillBadgeText}>
                              {pat.status}
                            </Text>
                          </View>
                        </View>

                        {/* ACTIONS: Edit | Delete */}
                        <View
                          style={[
                            styles.td,
                            {
                              width: 130,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                            },
                          ]}
                        >
                          {/* Edit Button */}
                          <TouchableOpacity
                            style={styles.editActionBtn}
                            onPress={() => setEditingPattern(pat)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="pencil" size={13} color="#334155" />
                            <Text style={styles.editActionBtnText}>Edit</Text>
                          </TouchableOpacity>

                          {/* Delete Button */}
                          <TouchableOpacity
                            style={styles.deleteActionBtn}
                            onPress={() => {
                              Alert.alert(
                                "Delete Shift Pattern",
                                `Are you sure you want to delete pattern "${pat.name}"?`,
                                [
                                  { text: "Cancel", style: "cancel" },
                                  {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: () =>
                                      dispatch(deleteShiftPattern(pat.id)),
                                  },
                                ]
                              );
                            }}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="trash-outline" size={14} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}

                  {filteredPatterns.length === 0 && (
                    <View style={styles.emptyTable}>
                      <Ionicons name="time-outline" size={44} color="#CBD5E1" />
                      <Text style={styles.emptyTableTitle}>
                        No shift patterns found
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Quick Summary Pill Row */}
            <View style={styles.summaryFooterCard}>
              <View style={styles.summaryFooterCol}>
                <Text style={styles.summaryFooterLabel}>TOTAL PATTERNS</Text>
                <Text style={styles.summaryFooterVal}>{patterns.length}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryFooterCol}>
                <Text style={styles.summaryFooterLabel}>DAY SHIFTS</Text>
                <Text style={[styles.summaryFooterVal, { color: "#2563EB" }]}>
                  {patterns.filter((p) => p.type === "Day").length}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryFooterCol}>
                <Text style={styles.summaryFooterLabel}>NIGHT SHIFTS</Text>
                <Text style={[styles.summaryFooterVal, { color: "#8B5CF6" }]}>
                  {patterns.filter((p) => p.type === "Night").length}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryFooterCol}>
                <Text style={styles.summaryFooterLabel}>ROTATIONAL</Text>
                <Text style={[styles.summaryFooterVal, { color: "#D97706" }]}>
                  {patterns.filter((p) => p.type === "Rotational").length}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SHIFT ROSTER (MATCHING USER SCREENSHOT 1 & 2)     */}
        {/* ========================================================= */}
        {activeShiftSubTab === "Shift Roster" && (
          <View>
            {/* 4 KPI Stat Cards */}
            <View style={styles.kpiGrid}>
              <View style={styles.kpiCard}>
                <View style={styles.kpiHeader}>
                  <View style={[styles.kpiIconBox, { backgroundColor: "#EFF6FF" }]}>
                    <Ionicons name="layers" size={20} color="#2563EB" />
                  </View>
                  <Text style={styles.kpiLabel}>Total Shifts</Text>
                </View>
                <Text style={styles.kpiValue}>{totalShifts}</Text>
              </View>

              <View style={styles.kpiCard}>
                <View style={styles.kpiHeader}>
                  <View style={[styles.kpiIconBox, { backgroundColor: "#DCFCE7" }]}>
                    <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                  </View>
                  <Text style={styles.kpiLabel}>Active Shifts</Text>
                </View>
                <Text style={styles.kpiValue}>{activeShifts}</Text>
              </View>

              <View style={styles.kpiCard}>
                <View style={styles.kpiHeader}>
                  <View style={[styles.kpiIconBox, { backgroundColor: "#F3E8FF" }]}>
                    <Ionicons name="people" size={20} color="#8B5CF6" />
                  </View>
                  <Text style={styles.kpiLabel}>Employees Assigned</Text>
                </View>
                <Text style={styles.kpiValue}>{employeesAssigned}</Text>
              </View>

              <View style={styles.kpiCard}>
                <View style={styles.kpiHeader}>
                  <View style={[styles.kpiIconBox, { backgroundColor: "#FEF3C7" }]}>
                    <Ionicons name="person-remove" size={20} color="#D97706" />
                  </View>
                  <Text style={styles.kpiLabel}>Unassigned Employees</Text>
                </View>
                <Text style={styles.kpiValue}>{unassignedEmployees}</Text>
              </View>
            </View>

            {/* Shift Patterns Preview */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Shift Patterns</Text>
              <Text style={styles.sectionSubtitle}>
                Configured workforce patterns for active company profile
              </Text>

              <View style={styles.patternsRow}>
                {patternsSummary.map((item) => (
                  <View key={item.type} style={styles.patternBox}>
                    <View style={styles.patternBoxHeader}>
                      <View
                        style={[styles.patternDot, { backgroundColor: item.color }]}
                      />
                      <Text style={styles.patternName}>{item.type}</Text>
                    </View>
                    <Text style={styles.patternCount}>{item.count} shifts</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Shift Roster Section Header */}
            <View style={styles.rosterSectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Shift Roster</Text>
                <Text style={styles.sectionSubtitle}>
                  View and manage employee shift assignments.
                </Text>
              </View>

              <View style={styles.rosterActionButtons}>
                <TouchableOpacity
                  style={styles.exportBtn}
                  onPress={() =>
                    Alert.alert(
                      "Export Roster",
                      "Shift Roster exported to CSV/Excel format successfully."
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons name="download-outline" size={15} color="#0F172A" />
                  <Text style={styles.exportBtnText}>Export Roster</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.assignBtn}
                  onPress={() => setIsAssignModalOpen(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={17} color="#FFFFFF" />
                  <Text style={styles.assignBtnText}>Assign Employee</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Controls Card */}
            <View style={styles.filterCard}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRowScroll}
              >
                <View style={styles.filterFieldBox}>
                  <Text style={styles.filterFieldLabel}>Search</Text>
                  <View style={styles.searchInputWrap}>
                    <Ionicons name="search" size={15} color="#94A3B8" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search employee or employee ID..."
                      placeholderTextColor="#94A3B8"
                      value={searchQuery}
                      onChangeText={(txt) => dispatch(setSearchQuery(txt))}
                    />
                    {searchQuery ? (
                      <TouchableOpacity onPress={() => dispatch(setSearchQuery(""))}>
                        <Ionicons name="close-circle" size={15} color="#94A3B8" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                <View style={styles.filterFieldBox}>
                  <Text style={styles.filterFieldLabel}>Client</Text>
                  <TouchableOpacity
                    style={styles.filterDropdown}
                    onPress={() =>
                      openPicker(
                        "client",
                        "Select Client",
                        clientOptions,
                        selectedClient,
                        (val) => dispatch(setSelectedClient(val))
                      )
                    }
                  >
                    <Text style={styles.filterDropdownText} numberOfLines={1}>
                      {selectedClient}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.filterFieldBox}>
                  <Text style={styles.filterFieldLabel}>Site</Text>
                  <TouchableOpacity
                    style={styles.filterDropdown}
                    onPress={() =>
                      openPicker(
                        "site",
                        "Select Site",
                        siteOptions,
                        selectedSite,
                        (val) => dispatch(setSelectedSite(val))
                      )
                    }
                  >
                    <Text style={styles.filterDropdownText} numberOfLines={1}>
                      {selectedSite}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.filterFieldBox}>
                  <Text style={styles.filterFieldLabel}>Department</Text>
                  <TouchableOpacity
                    style={styles.filterDropdown}
                    onPress={() =>
                      openPicker(
                        "dept",
                        "Select Department",
                        departmentOptions,
                        selectedDepartment,
                        (val) => dispatch(setSelectedDepartment(val))
                      )
                    }
                  >
                    <Text style={styles.filterDropdownText} numberOfLines={1}>
                      {selectedDepartment}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.filterFieldBox}>
                  <Text style={styles.filterFieldLabel}>Shift</Text>
                  <TouchableOpacity
                    style={styles.filterDropdown}
                    onPress={() =>
                      openPicker(
                        "shift",
                        "Select Shift",
                        shiftOptions,
                        selectedShift,
                        (val) => dispatch(setSelectedShift(val))
                      )
                    }
                  >
                    <Text style={styles.filterDropdownText} numberOfLines={1}>
                      {selectedShift}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.filterRowScroll, { marginTop: 10 }]}
              >
                <View style={styles.filterFieldBox}>
                  <Text style={styles.filterFieldLabel}>Shift Type</Text>
                  <TouchableOpacity
                    style={styles.filterDropdown}
                    onPress={() =>
                      openPicker(
                        "shifttype",
                        "Select Shift Type",
                        shiftTypeOptions,
                        selectedShiftType,
                        (val) => dispatch(setSelectedShiftType(val))
                      )
                    }
                  >
                    <Text style={styles.filterDropdownText} numberOfLines={1}>
                      {selectedShiftType}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.filterFieldBox}>
                  <Text style={styles.filterFieldLabel}>Status</Text>
                  <TouchableOpacity
                    style={styles.filterDropdown}
                    onPress={() =>
                      openPicker(
                        "status",
                        "Select Status",
                        statusOptions,
                        selectedStatus,
                        (val) => dispatch(setSelectedStatus(val))
                      )
                    }
                  >
                    <Text style={styles.filterDropdownText}>{selectedStatus}</Text>
                    <Ionicons name="chevron-down" size={14} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.filterFieldBox}>
                  <Text style={styles.filterFieldLabel}>Date</Text>
                  <View style={styles.dateInputWrap}>
                    <TextInput
                      style={styles.dateInput}
                      value={selectedDate}
                      onChangeText={(txt) => dispatch(setSelectedDate(txt))}
                    />
                    <Ionicons name="calendar-outline" size={16} color="#64748B" />
                  </View>
                </View>

                <View style={[styles.filterFieldBox, { justifyContent: "flex-end" }]}>
                  <TouchableOpacity
                    style={styles.resetFilterBtn}
                    onPress={() => dispatch(resetShiftFilters())}
                  >
                    <Text style={styles.resetFilterBtnText}>Reset Filters</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            {/* Shift Roster Mobile Cards List (Expandable on Press, No Horizontal Scroll) */}
            <View style={styles.rosterCardsList}>
              {filteredRoster.map((item) => {
                const isExpanded = expandedRosterId === item.id;
                const isUnassigned = item.shift === "Unassigned";

                // Type badge coloring
                let typeColor = "#2563EB";
                let typeBg = "#EFF6FF";
                if (item.shiftType === "Night") {
                  typeColor = "#7C3AED";
                  typeBg = "#F3E8FF";
                } else if (item.shiftType === "Rotational") {
                  typeColor = "#D97706";
                  typeBg = "#FEF3C7";
                }

                return (
                  <View key={item.id} style={styles.rosterCard}>
                    {/* Header: Click to Expand / Collapse */}
                    <TouchableOpacity
                      style={styles.cardHeaderTouchable}
                      onPress={() => toggleExpandRoster(item.id)}
                      activeOpacity={0.7}
                    >
                      {/* Left: Avatar Circle with initial */}
                      <View
                        style={[
                          styles.rosterAvatarCircle,
                          isUnassigned
                            ? { backgroundColor: "#F1F5F9", borderColor: "#E2E8F0" }
                            : { backgroundColor: typeBg, borderColor: typeBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.rosterAvatarText,
                            isUnassigned ? { color: "#64748B" } : { color: typeColor },
                          ]}
                        >
                          {item.avatar || (item.name ? item.name[0] : "E")}
                        </Text>
                      </View>

                      {/* Middle Info: Name, Emp ID & Department */}
                      <View style={styles.rosterMainInfo}>
                        <Text style={styles.rosterEmpName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View style={styles.rosterBadgeRow}>
                          <View style={styles.empIdPill}>
                            <Text style={styles.empIdPillText}>{item.empId}</Text>
                          </View>
                          <View style={styles.deptPill}>
                            <Text style={styles.deptPillText} numberOfLines={1}>
                              {item.department}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Right Side: Shift Type / Status Badge & Chevron */}
                      <View style={styles.rosterRightCol}>
                        <View
                          style={[
                            styles.shiftBadgePill,
                            isUnassigned
                              ? styles.unassignedPill
                              : { backgroundColor: typeBg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.shiftBadgePillText,
                              isUnassigned
                                ? { color: "#D97706" }
                                : { color: typeColor },
                            ]}
                          >
                            {isUnassigned
                              ? "Unassigned"
                              : item.shiftType
                              ? `${item.shiftType} Shift`
                              : "Assigned"}
                          </Text>
                        </View>
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={18}
                          color="#64748B"
                        />
                      </View>
                    </TouchableOpacity>

                    {/* Expanded Content: Full Shift Details & Action Buttons */}
                    {isExpanded && (
                      <View style={styles.cardExpandedContent}>
                        {/* Details Box */}
                        <View style={styles.detailsBox}>
                          {/* Row 1: Shift Timing & Type */}
                          <View style={styles.detailRow}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.detailLabel}>
                                SHIFT ASSIGNMENT
                              </Text>
                              <View style={styles.detailValWithIcon}>
                                <Ionicons
                                  name="time-outline"
                                  size={13}
                                  color={isUnassigned ? "#D97706" : "#2563EB"}
                                />
                                <Text
                                  style={[
                                    styles.detailValue,
                                    isUnassigned
                                      ? { color: "#D97706", fontWeight: "700" }
                                      : { color: "#2563EB", fontWeight: "700" },
                                  ]}
                                  numberOfLines={2}
                                >
                                  {item.shift}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {/* Row 2: Client & Department */}
                          <View style={styles.detailRow}>
                            <View style={styles.detailItemHalf}>
                              <Text style={styles.detailLabel}>CLIENT</Text>
                              <View style={styles.detailValWithIcon}>
                                <Ionicons
                                  name="business-outline"
                                  size={12}
                                  color="#64748B"
                                />
                                <Text
                                  style={styles.detailValue}
                                  numberOfLines={1}
                                >
                                  {item.client}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.detailItemHalf}>
                              <Text style={styles.detailLabel}>DEPARTMENT</Text>
                              <View style={styles.detailValWithIcon}>
                                <Ionicons
                                  name="grid-outline"
                                  size={12}
                                  color="#64748B"
                                />
                                <Text
                                  style={styles.detailValue}
                                  numberOfLines={1}
                                >
                                  {item.department}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {/* Row 3: Site Location */}
                          <View
                            style={[styles.detailRow, { borderBottomWidth: 0 }]}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={styles.detailLabel}>
                                DEPLOYED SITE
                              </Text>
                              <View style={styles.detailValWithIcon}>
                                <Ionicons
                                  name="location-outline"
                                  size={12}
                                  color="#64748B"
                                />
                                <Text
                                  style={styles.detailValue}
                                  numberOfLines={2}
                                >
                                  {item.site}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        {/* Dedicated Action Buttons Row */}
                        <View style={styles.cardActionsRow}>
                          {/* Assign / Change Shift */}
                          <TouchableOpacity
                            style={[styles.cardActionBtn, styles.assignActionBtn]}
                            onPress={() => {
                              setSelectedRosterEmp(item);
                              setIsAssignModalOpen(true);
                            }}
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
                              {isUnassigned ? "Assign Shift" : "Change Shift"}
                            </Text>
                          </TouchableOpacity>

                          {/* Unassign Shift */}
                          {!isUnassigned && (
                            <TouchableOpacity
                              style={[
                                styles.cardActionBtn,
                                styles.unassignActionBtn,
                              ]}
                              onPress={() => {
                                Alert.alert(
                                  "Unassign Shift",
                                  `Remove shift assignment from ${item.name}?`,
                                  [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                      text: "Unassign",
                                      style: "destructive",
                                      onPress: () =>
                                        dispatch(
                                          unassignShift({ id: item.id })
                                        ),
                                    },
                                  ]
                                );
                              }}
                              activeOpacity={0.7}
                            >
                              <Ionicons
                                name="close-circle-outline"
                                size={13}
                                color="#D97706"
                              />
                              <Text
                                style={[
                                  styles.cardActionBtnText,
                                  { color: "#D97706" },
                                ]}
                              >
                                Unassign
                              </Text>
                            </TouchableOpacity>
                          )}

                          {/* Quick Options Popover */}
                          <TouchableOpacity
                            style={styles.cardActionBtn}
                            onPress={() => setSelectedRosterEmp(item)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="ellipsis-horizontal"
                              size={14}
                              color="#475569"
                            />
                            <Text style={styles.cardActionBtnText}>Options</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}

              {filteredRoster.length === 0 && (
                <View style={styles.emptyTable}>
                  <Ionicons name="people-outline" size={44} color="#CBD5E1" />
                  <Text style={styles.emptyTableTitle}>
                    No employees found matching filter criteria
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyResetBtn}
                    onPress={() => dispatch(resetShiftFilters())}
                  >
                    <Text style={styles.emptyResetBtnText}>Reset Filters</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Unassigned Banner */}
            <View style={styles.unassignedBanner}>
              <View style={styles.unassignedBannerLeft}>
                <View style={styles.unassignedIconWrap}>
                  <Ionicons name="person-remove" size={18} color="#D97706" />
                </View>
                <View>
                  <Text style={styles.unassignedTitle}>
                    Employees Without Shift
                  </Text>
                  <Text style={styles.unassignedSubtitle}>
                    {unassignedEmployees} employees currently have no shift assignment on 19 Oct 2026.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewUnassignedBtn}
                onPress={() => dispatch(setSelectedShift("Unassigned"))}
              >
                <Text style={styles.viewUnassignedBtnText}>View Unassigned</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Client Summary Card */}
            <View style={styles.bottomCardsRow}>
              <View style={styles.bottomCard}>
                <Text style={styles.bottomCardTitle}>Shift Summary by Client</Text>
                <View style={styles.clientSummaryTable}>
                  <View style={styles.clientSummaryHeader}>
                    <Text style={[styles.clientSummaryTh, { flex: 2 }]}>CLIENT</Text>
                    <Text style={[styles.clientSummaryTh, { flex: 1, textAlign: "center" }]}>
                      EMPLOYEES
                    </Text>
                    <Text style={[styles.clientSummaryTh, { flex: 1, textAlign: "right" }]}>
                      ACTIVE SHIFTS
                    </Text>
                  </View>

                  {clientSummary.map((item, idx) => (
                    <View key={idx} style={styles.clientSummaryRow}>
                      <Text style={[styles.clientSummaryTd, { flex: 2, fontWeight: "600" }]}>
                        {item.client}
                      </Text>
                      <Text style={[styles.clientSummaryTd, { flex: 1, textAlign: "center", color: "#64748B" }]}>
                        {item.employees}
                      </Text>
                      <Text style={[styles.clientSummaryTd, { flex: 1, textAlign: "right", color: "#2563EB", fontWeight: "700" }]}>
                        {item.activeShifts}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: CALENDAR VIEW                                     */}
        {/* ========================================================= */}
        {activeShiftSubTab === "Calendar View" && (
          <CalendarFullView />
        )}
      </ScrollView>

      {/* Modal: Add Shift Pattern */}
      {isAddPatternModalOpen && (
        <ShiftPatternFormModal
          mode="add"
          onClose={() => setIsAddPatternModalOpen(false)}
          onSave={(data) => {
            dispatch(addShiftPattern(data));
            setIsAddPatternModalOpen(false);
            Alert.alert("Success", "New shift pattern added successfully!");
          }}
        />
      )}

      {/* Modal: Edit Shift Pattern */}
      {editingPattern && (
        <ShiftPatternFormModal
          mode="edit"
          initialData={editingPattern}
          onClose={() => setEditingPattern(null)}
          onSave={(data) => {
            dispatch(editShiftPattern(data));
            setEditingPattern(null);
            Alert.alert("Updated", "Shift pattern updated successfully!");
          }}
        />
      )}

      {/* Modal: Assign Shift to Employee */}
      {isAssignModalOpen && (
        <AssignShiftModal
          roster={roster}
          patterns={patterns}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={(empId, shiftName, shiftType) => {
            dispatch(assignShift({ employeeId: empId, shiftName, shiftType }));
            setIsAssignModalOpen(false);
            Alert.alert(
              "Assigned",
              `Shift ${shiftName} assigned to employee successfully!`
            );
          }}
        />
      )}

      {/* Modal: Row Quick Actions for Selected Employee */}
      {selectedRosterEmp && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedRosterEmp(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedRosterEmp(null)}
          >
            <View style={styles.actionModalCard}>
              <View style={styles.actionModalHeader}>
                <Text style={styles.actionEmpName}>
                  {selectedRosterEmp.name}
                </Text>
                <Text style={styles.actionEmpId}>
                  {selectedRosterEmp.empId} • {selectedRosterEmp.department}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setSelectedRosterEmp(null);
                  setIsAssignModalOpen(true);
                }}
              >
                <Ionicons name="time-outline" size={18} color="#2563EB" />
                <Text style={styles.actionItemText}>
                  {selectedRosterEmp.shift === "Unassigned"
                    ? "Assign Shift Schedule"
                    : "Change Assigned Shift"}
                </Text>
              </TouchableOpacity>

              {selectedRosterEmp.shift !== "Unassigned" && (
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => {
                    dispatch(unassignShift(selectedRosterEmp.id));
                    setSelectedRosterEmp(null);
                    Alert.alert(
                      "Unassigned",
                      `${selectedRosterEmp.name} has been set to Unassigned.`
                    );
                  }}
                >
                  <Ionicons
                    name="person-remove-outline"
                    size={18}
                    color="#DC2626"
                  />
                  <Text style={[styles.actionItemText, { color: "#DC2626" }]}>
                    Remove Shift (Mark Unassigned)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Generic Dropdown Picker Modal */}
      <Modal
        visible={!!pickerConfig}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPickerConfig(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerConfig(null)}
        >
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{pickerConfig?.title}</Text>
              <TouchableOpacity onPress={() => setPickerConfig(null)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.pickerOptionsList}>
              {pickerConfig?.options.map((option) => {
                const isSelected = pickerConfig?.selectedValue === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.pickerOptionItem,
                      isSelected && styles.selectedPickerOptionItem,
                    ]}
                    onPress={() => {
                      pickerConfig.onSelect(option);
                      setPickerConfig(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        isSelected && styles.selectedPickerOptionText,
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
    </SafeAreaView>
  );
}

// Sub-component: Shift Pattern Form Modal (Add / Edit)
function ShiftPatternFormModal({ mode, initialData, onClose, onSave }) {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "Day");
  const [startTime, setStartTime] = useState(initialData?.startTime || "09:00 AM");
  const [endTime, setEndTime] = useState(initialData?.endTime || "06:00 PM");
  const [breakDuration, setBreakDuration] = useState(
    initialData?.breakDuration || "30 min"
  );
  const [gracePeriod, setGracePeriod] = useState(
    initialData?.gracePeriod || "15 min"
  );
  const [status, setStatus] = useState(initialData?.status || "Active");

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter Shift Name.");
      return;
    }
    onSave({
      ...(initialData || {}),
      name: name.trim(),
      type,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      breakDuration: breakDuration.trim(),
      gracePeriod: gracePeriod.trim(),
      status,
    });
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.formModalCard}>
          <View style={styles.formModalHeader}>
            <Text style={styles.formModalTitle}>
              {mode === "edit" ? "Edit Shift Pattern" : "Add Shift Pattern"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formModalBody}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Shift Name *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Evening Shift"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Shift Type</Text>
              <View style={styles.typeSelectorRow}>
                {["Day", "Night", "Rotational"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeSelectorBtn,
                      type === t && styles.activeTypeSelectorBtn,
                    ]}
                    onPress={() => setType(t)}
                  >
                    <Text
                      style={[
                        styles.typeSelectorText,
                        type === t && styles.activeTypeSelectorText,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formRow2}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Start Time</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>End Time</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            <View style={styles.formRow2}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Break Duration</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={breakDuration}
                  onChangeText={setBreakDuration}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Grace Period</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={gracePeriod}
                  onChangeText={setGracePeriod}
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.typeSelectorRow}>
                {["Active", "Inactive"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.typeSelectorBtn,
                      status === s && { backgroundColor: "#16A34A" },
                    ]}
                    onPress={() => setStatus(s)}
                  >
                    <Text
                      style={[
                        styles.typeSelectorText,
                        status === s && { color: "#FFFFFF", fontWeight: "700" },
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.formModalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>
                {mode === "edit" ? "Save Changes" : "Create Shift Pattern"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Sub-component: Assign Shift Modal
function AssignShiftModal({ roster, patterns, onClose, onAssign }) {
  const [selectedEmpId, setSelectedEmpId] = useState(
    roster.length > 0 ? roster[0].id : ""
  );
  const [selectedShiftName, setSelectedShiftName] = useState(
    patterns.length > 0 ? patterns[0].name : "General Day Shift"
  );
  const [selectedShiftType, setSelectedShiftType] = useState(
    patterns.length > 0 ? patterns[0].type : "Day"
  );

  const handleAssign = () => {
    if (!selectedEmpId || !selectedShiftName) {
      Alert.alert("Validation", "Please select both employee and shift.");
      return;
    }
    onAssign(selectedEmpId, selectedShiftName, selectedShiftType);
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.formModalCard}>
          <View style={styles.formModalHeader}>
            <Text style={styles.formModalTitle}>Assign Shift to Employee</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formModalBody}>
            <Text style={styles.fieldLabel}>Select Employee</Text>
            <ScrollView style={styles.selectionList} nestedScrollEnabled={true}>
              {roster.map((emp) => {
                const isSelected = selectedEmpId === emp.id;
                return (
                  <TouchableOpacity
                    key={emp.id}
                    style={[
                      styles.selectionItem,
                      isSelected && styles.activeSelectionItem,
                    ]}
                    onPress={() => setSelectedEmpId(emp.id)}
                  >
                    <View style={styles.selectionItemLeft}>
                      <View style={styles.miniAvatar}>
                        <Text style={styles.miniAvatarText}>{emp.avatar}</Text>
                      </View>
                      <View>
                        <Text style={styles.selectionItemTitle}>{emp.name}</Text>
                        <Text style={styles.selectionItemSub}>
                          {emp.empId} • {emp.department} • ({emp.shift})
                        </Text>
                      </View>
                    </View>
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

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
              Select Shift Pattern
            </Text>
            <ScrollView style={styles.selectionList} nestedScrollEnabled={true}>
              {patterns.map((sh) => {
                const isSelected = selectedShiftName === sh.name;
                return (
                  <TouchableOpacity
                    key={sh.id}
                    style={[
                      styles.selectionItem,
                      isSelected && styles.activeSelectionItem,
                    ]}
                    onPress={() => {
                      setSelectedShiftName(sh.name);
                      setSelectedShiftType(sh.type);
                    }}
                  >
                    <View>
                      <Text style={styles.selectionItemTitle}>{sh.name}</Text>
                      <Text style={styles.selectionItemSub}>
                        {sh.startTime} - {sh.endTime} • {sh.type} Shift
                      </Text>
                    </View>
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
          </ScrollView>

          <View style={styles.formModalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAssign}>
              <Text style={styles.submitBtnText}>Confirm Assignment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Sub-component: Calendar Full View Tab matching user's phone screenshot
function CalendarFullView() {
  const [selectedDay, setSelectedDay] = useState(16);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Default: October 2026

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const shortMonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const monthName = monthNames[monthIndex];
  const shortMonthName = shortMonthNames[monthIndex];

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
    setSelectedDay(1);
  };

  // Days in month calculation
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Generate 7-column calendar rows
  const calendarSlots = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarSlots.push({ type: "empty", key: `empty-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarSlots.push({ type: "day", day: d, key: `day-${d}` });
  }

  const rows = [];
  let currentRow = [];
  calendarSlots.forEach((slot, index) => {
    currentRow.push(slot);
    if (currentRow.length === 7 || index === calendarSlots.length - 1) {
      while (currentRow.length < 7) {
        currentRow.push({ type: "empty", key: `trailing-${currentRow.length}` });
      }
      rows.push(currentRow);
      currentRow = [];
    }
  });

  // Shift coverage data matching user's screenshot
  const getCoverageData = (day) => {
    const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (isWeekend) {
      return {
        morning: { time: "08:00 AM – 04:00 PM", count: "08 employees" },
        evening: { time: "04:00 PM – 12:00 AM", count: "06 employees" },
        night: { time: "12:00 AM – 08:00 AM", count: "04 employees" },
      };
    }
    // Matching exact screenshot for day 16 / regular weekdays
    return {
      morning: { time: "08:00 AM – 04:00 PM", count: "12 employees" },
      evening: { time: "04:00 PM – 12:00 AM", count: "08 employees" },
      night: { time: "12:00 AM – 08:00 AM", count: "05 employees" },
    };
  };

  const coverage = getCoverageData(selectedDay);

  return (
    <View style={styles.calendarFullWrap}>
      {/* Calendar Card */}
      <View style={styles.calendarCard}>
        {/* Month & Navigation Header */}
        <View style={styles.calendarMonthHeader}>
          <Text style={styles.calendarMonthTitle}>
            {monthName} {year}
          </Text>
          <View style={styles.calNavButtonsRow}>
            <TouchableOpacity
              style={styles.calNavBtn}
              onPress={handlePrevMonth}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={16} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.calNavBtn}
              onPress={handleNextMonth}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={16} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Days of Week Row: S M T W T F S */}
        <View style={styles.calWeekHeaderRow}>
          {["S", "M", "T", "W", "T", "F", "S"].map((initial, i) => (
            <View key={i} style={styles.calWeekHeaderCell}>
              <Text style={styles.calWeekHeaderText}>{initial}</Text>
            </View>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.calGridContainer}>
          {rows.map((row, rIdx) => (
            <View key={rIdx} style={styles.calRow}>
              {row.map((slot) => {
                if (slot.type === "empty") {
                  return <View key={slot.key} style={styles.calEmptyCell} />;
                }

                const isSelected = slot.day === selectedDay;

                return (
                  <TouchableOpacity
                    key={slot.key}
                    style={styles.calDayCell}
                    onPress={() => setSelectedDay(slot.day)}
                    activeOpacity={0.8}
                  >
                    {isSelected ? (
                      <View style={styles.calSelectedDayPill}>
                        <Text style={styles.calSelectedDayText}>{slot.day}</Text>
                        <View style={styles.calSelectedMicroDot} />
                      </View>
                    ) : (
                      <View style={styles.calUnselectedDayBox}>
                        <Text style={styles.calDayText}>{slot.day}</Text>
                        <View style={styles.calMicroDotsRow}>
                          <View style={[styles.calMicroDot, { backgroundColor: "#254EDB" }]} />
                          <View style={[styles.calMicroDot, { backgroundColor: "#7C3AED" }]} />
                          <View style={[styles.calMicroDot, { backgroundColor: "#16A34A" }]} />
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Legend Row matching screenshot */}
        <View style={styles.calLegendRow}>
          <View style={styles.calLegendItem}>
            <View style={[styles.calLegendDot, { backgroundColor: "#254EDB" }]} />
            <Text style={styles.calLegendText}>Morning</Text>
          </View>
          <View style={styles.calLegendItem}>
            <View style={[styles.calLegendDot, { backgroundColor: "#7C3AED" }]} />
            <Text style={styles.calLegendText}>Evening</Text>
          </View>
          <View style={styles.calLegendItem}>
            <View style={[styles.calLegendDot, { backgroundColor: "#16A34A" }]} />
            <Text style={styles.calLegendText}>Night</Text>
          </View>
        </View>
      </View>

      {/* Shift Coverage Section Title */}
      <Text style={styles.coverageSectionTitle}>
        {shortMonthName} {selectedDay} · Shift coverage
      </Text>

      {/* 3 Shift Cards matching screenshot */}
      <View style={styles.shiftCard}>
        <View style={styles.shiftCardLeft}>
          <View style={[styles.shiftAccentBar, { backgroundColor: "#254EDB" }]} />
          <View>
            <Text style={styles.shiftCardTitle}>Morning shift</Text>
            <Text style={styles.shiftCardSubtitle}>{coverage.morning.time}</Text>
          </View>
        </View>
        <Text style={styles.shiftCardCount}>{coverage.morning.count}</Text>
      </View>

      <View style={styles.shiftCard}>
        <View style={styles.shiftCardLeft}>
          <View style={[styles.shiftAccentBar, { backgroundColor: "#7C3AED" }]} />
          <View>
            <Text style={styles.shiftCardTitle}>Evening shift</Text>
            <Text style={styles.shiftCardSubtitle}>{coverage.evening.time}</Text>
          </View>
        </View>
        <Text style={styles.shiftCardCount}>{coverage.evening.count}</Text>
      </View>

      <View style={styles.shiftCard}>
        <View style={styles.shiftCardLeft}>
          <View style={[styles.shiftAccentBar, { backgroundColor: "#16A34A" }]} />
          <View>
            <Text style={styles.shiftCardTitle}>Night shift</Text>
            <Text style={styles.shiftCardSubtitle}>{coverage.night.time}</Text>
          </View>
        </View>
        <Text style={styles.shiftCardCount}>{coverage.night.count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  /* Top User Header Bar matching screenshot */
  userHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 12 : 8,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#254EDB",
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
    fontSize: 12.5,
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

  /* Segmented Pill Tab Bar matching screenshot */
  tabSegmentsWrap: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabSegmentsContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    padding: 3,
  },
  tabSegmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabSegmentBtn: {
    backgroundColor: "#254EDB",
  },
  tabSegmentText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabSegmentText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* Shift Patterns Action Bar */
  patternsHeaderActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  patternSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  patternSectionSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  addShiftBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addShiftBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 36,
  },

  // Shift Patterns View
  patternsViewWrap: {
    paddingTop: 12,
  },
  patternSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  patternSearchInputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    gap: 8,
  },
  patternSearchInput: {
    flex: 1,
    fontSize: 12,
    color: "#0F172A",
    paddingVertical: 0,
  },
  patternCountPill: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  patternCountPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },

  // Data Table (Common for both Views)
  tableCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  tableInner: {
    flexDirection: "column",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  th: {
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  thText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  td: {
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  shiftPatternNameText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  shiftTypePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  shiftTypePillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  timeValText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  cellNormalText: {
    fontSize: 12,
    color: "#475569",
  },
  activePillBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activePillBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  editActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  editActionBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  deleteActionBtn: {
    borderWidth: 1,
    borderColor: "#FEE2E2",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  // Summary Footer Card
  summaryFooterCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryFooterCol: {
    alignItems: "center",
    gap: 2,
  },
  summaryFooterLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.4,
  },
  summaryFooterVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
  },

  // KPI Grid for Roster View
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 10,
  },
  kpiCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  kpiHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    flex: 1,
    textAlign: "right",
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  // Shift Patterns Preview
  sectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 12,
  },
  patternsRow: {
    flexDirection: "row",
    gap: 10,
  },
  patternBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  patternBoxHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  patternName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  patternCount: {
    fontSize: 11,
    color: "#64748B",
  },

  // Roster Section Header
  rosterSectionHeader: {
    marginHorizontal: 16,
    marginTop: 20,
    flexDirection: "column",
    gap: 10,
  },
  rosterActionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  assignBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Filter Card
  filterCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterRowScroll: {
    gap: 12,
    alignItems: "flex-end",
  },
  filterFieldBox: {
    gap: 4,
  },
  filterFieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    width: 250,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#0F172A",
    paddingVertical: 0,
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    minWidth: 130,
    gap: 8,
  },
  filterDropdownText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "500",
  },
  dateInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    width: 140,
    justifyContent: "space-between",
  },
  dateInput: {
    fontSize: 12,
    color: "#0F172A",
    paddingVertical: 0,
    flex: 1,
  },
  resetFilterBtn: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  resetFilterBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },

  // Roster Cards List (Mobile)
  rosterCardsList: {
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
  },
  rosterCard: {
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
  rosterAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rosterAvatarText: {
    fontSize: 12,
    fontWeight: "700",
  },
  rosterMainInfo: {
    flex: 1,
    gap: 3,
  },
  rosterEmpName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  rosterBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  empIdPill: {
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  empIdPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
  },
  deptPill: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  deptPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  rosterRightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  shiftBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  shiftBadgePillText: {
    fontSize: 10.5,
    fontWeight: "700",
  },
  unassignedPill: {
    backgroundColor: "#FEF3C7",
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
  detailsBox: {
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
  assignActionBtn: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  unassignActionBtn: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
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
  emptyTableTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
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

  // Unassigned Banner
  unassignedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  unassignedBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  unassignedIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  unassignedTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  unassignedSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  viewUnassignedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewUnassignedBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },

  // Bottom Client Summary
  bottomCardsRow: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  bottomCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bottomCardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  clientSummaryTable: {
    flexDirection: "column",
  },
  clientSummaryHeader: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  clientSummaryTh: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.4,
  },
  clientSummaryRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    alignItems: "center",
  },
  clientSummaryTd: {
    fontSize: 12,
    color: "#0F172A",
  },

  // Empty Table
  emptyTable: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  emptyTableTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  // Modals Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  formModalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  formModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  formModalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  formModalBody: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  formField: {
    marginBottom: 12,
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: "#0F172A",
  },
  typeSelectorRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeSelectorBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTypeSelectorBtn: {
    backgroundColor: "#2563EB",
  },
  typeSelectorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  activeTypeSelectorText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  formRow2: {
    flexDirection: "row",
    gap: 12,
  },
  formModalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  submitBtn: {
    flex: 1.5,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Selection list inside assign modal
  selectionList: {
    maxHeight: 140,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 6,
    backgroundColor: "#F8FAFC",
  },
  selectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 6,
  },
  activeSelectionItem: {
    backgroundColor: "#EFF6FF",
  },
  selectionItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  miniAvatarText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
  },
  selectionItemTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  selectionItemSub: {
    fontSize: 10,
    color: "#64748B",
  },

  // Action popover modal
  actionModalCard: {
    width: "82%",
    maxWidth: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,
    elevation: 8,
  },
  actionModalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  actionEmpName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  actionEmpId: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  actionItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  // Calendar View Tab matching screenshot
  calendarFullWrap: {
    paddingBottom: 32,
  },
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarMonthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  calendarMonthTitle: {
    fontSize: 16.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  calNavButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  calNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  calWeekHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  calWeekHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  calWeekHeaderText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#94A3B8",
  },
  calGridContainer: {
    gap: 5,
  },
  calRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  calEmptyCell: {
    flex: 1,
    height: 44,
  },
  calDayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
  },
  calUnselectedDayBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 42,
  },
  calDayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  calMicroDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2.5,
    marginTop: 3,
  },
  calMicroDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
  },
  calSelectedDayPill: {
    backgroundColor: "#254EDB",
    width: 34,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  calSelectedDayText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  calSelectedMicroDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "#C7D2FE",
    marginTop: 2,
  },
  calLegendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  calLegendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  calLegendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  calLegendText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },

  /* Coverage Section matching screenshot */
  coverageSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 10,
  },
  shiftCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  shiftCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  shiftAccentBar: {
    width: 3.5,
    height: 34,
    borderRadius: 2,
    marginRight: 12,
  },
  shiftCardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  shiftCardSubtitle: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 3,
  },
  shiftCardCount: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },

  // Dropdown Picker Modal
  pickerCard: {
    width: "85%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    maxHeight: "60%",
    paddingVertical: 12,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  pickerOptionsList: {
    paddingHorizontal: 10,
    paddingTop: 6,
  },
  pickerOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectedPickerOptionItem: {
    backgroundColor: "#EFF6FF",
  },
  pickerOptionText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
    flex: 1,
  },
  selectedPickerOptionText: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
