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
import { useNavigation } from "@react-navigation/native";
import {
  setActivePayrollSubTab,
  setSearchQuery,
  setSelectedStatus,
  setSelectedCycle,
  addPayGroup,
  editPayGroup,
  togglePayGroupStatus,
  deletePayGroup,
  addPaySchedule,
  editPaySchedule,
  togglePayScheduleStatus,
  deletePaySchedule,
  addPayCycle,
  editPayCycle,
  togglePayCycleStatus,
  deletePayCycle,
  addPayDayRule,
  editPayDayRule,
  togglePayDayRuleStatus,
  deletePayDayRule,
  setDefaultCalculationMethod,
  resetFilters,
} from "../../store/slices/payrollSlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";
import { useAuth } from "../../hooks/UseAuth";

export default function AdminPayrollSetupScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useAuth();

  const {
    activePayrollSubTab,
    searchQuery,
    selectedStatus,
    selectedCycle,
    kpiSummary,
    payGroups,
    paySchedules,
    payCycles,
    payDays,
    calculationMethods,
  } = useSelector((state) => state.payroll);

  // Expanded card state for Pay Groups
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [pickerConfig, setPickerConfig] = useState(null);

  // Schedules Modal State
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Cycles Modal State
  const [isAddCycleModalOpen, setIsAddCycleModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState(null);

  // Pay Days Modal State
  const [isAddPayDayModalOpen, setIsAddPayDayModalOpen] = useState(false);
  const [editingPayDay, setEditingPayDay] = useState(null);

  // Toggle card expansion
  const toggleExpand = (id) => {
    setExpandedGroupId((prev) => (prev === id ? null : id));
  };

  // Filter pay groups
  const filteredPayGroups = payGroups.filter((group) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      group.name.toLowerCase().includes(q) ||
      group.code.toLowerCase().includes(q) ||
      group.description.toLowerCase().includes(q) ||
      group.paySchedule.toLowerCase().includes(q);

    const matchesStatus =
      selectedStatus === "All Status" || group.status === selectedStatus;

    const matchesCycle =
      selectedCycle === "All Cycles" ||
      (selectedCycle === "Monthly" &&
        group.payCycle.toLowerCase().includes("monthly")) ||
      (selectedCycle === "Weekly" &&
        group.payCycle.toLowerCase().includes("weekly"));

    return matchesQuery && matchesStatus && matchesCycle;
  });

  const handleRefresh = () => {
    Alert.alert("Refreshed", "Payroll configuration data updated successfully.");
  };

  const handleSalaryComponents = () => {
    Alert.alert(
      "Salary Components",
      "Navigating to Salary Components & Statutory Rule master."
    );
  };

  const handleDeleteGroup = (group) => {
    Alert.alert(
      "Delete Pay Group",
      `Are you sure you want to delete ${group.name} (${group.code})?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deletePayGroup(group.id));
            Alert.alert("Deleted", `${group.name} has been removed.`);
          },
        },
      ]
    );
  };

  const handleToggleGroupStatus = (group) => {
    const nextStatus = group.status === "Active" ? "Inactive" : "Active";
    Alert.alert(
      "Change Status",
      `Mark ${group.name} as ${nextStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Mark ${nextStatus}`,
          onPress: () => {
            dispatch(togglePayGroupStatus(group.id));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top Navigation & User Header */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                dispatch(toggleDrawer());
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.userAvatarCircle}>
            <Text style={styles.userAvatarInitial}>
              {(user?.name ? user.name[0] : "N").toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.userNameText}>{user?.name || "Normal User"}</Text>
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

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title & Admin Badge */}
        <View style={styles.pageTitleCard}>
          <View style={styles.titleBadgeRow}>
            <Text style={styles.pageTitle}>Payroll Setup</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN CONFIGURATION</Text>
            </View>
          </View>
          <Text style={styles.pageSubtitle}>
            Configure payroll schedules, pay cycles, salary calculation rules and pay groups.
          </Text>

          {/* Action Buttons: Refresh & Salary Components */}
          <View style={styles.headerActionsRow}>
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={handleRefresh}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={15} color="#334155" />
              <Text style={styles.refreshBtnText}>Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.componentsBtn}
              onPress={handleSalaryComponents}
              activeOpacity={0.7}
            >
              <Text style={styles.componentsBtnText}>Salary Components</Text>
              <Ionicons name="open-outline" size={14} color="#334155" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 4 Summary KPI Cards in 2x2 Mobile Grid */}
        <View style={styles.kpiGrid}>
          {/* Row 1 */}
          <View style={styles.kpiRow}>
            {/* KPI 1: Configured Pay Groups */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiTopRow}>
                <Text style={styles.kpiLabel}>CONFIGURED PAY GROUPS</Text>
                <View style={[styles.kpiIconWrap, { backgroundColor: "#EFF6FF" }]}>
                  <Ionicons name="wallet-outline" size={17} color="#2563EB" />
                </View>
              </View>
              <View style={styles.kpiValueRow}>
                <Text style={styles.kpiValue}>{kpiSummary.configuredPayGroups}</Text>
                <Text style={styles.kpiSubText}>
                  ({kpiSummary.activePayGroups} Active)
                </Text>
              </View>
            </View>

            {/* KPI 2: Active Pay Schedules */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiTopRow}>
                <Text style={styles.kpiLabel}>ACTIVE PAY SCHEDULES</Text>
                <View style={[styles.kpiIconWrap, { backgroundColor: "#F0FDF4" }]}>
                  <Ionicons name="calendar-outline" size={17} color="#16A34A" />
                </View>
              </View>
              <View style={styles.kpiValueRow}>
                <Text style={styles.kpiValue}>{kpiSummary.activePaySchedules}</Text>
                <Text style={styles.kpiSubText}>Schedules</Text>
              </View>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.kpiRow}>
            {/* KPI 3: Configured Pay Cycles */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiTopRow}>
                <Text style={styles.kpiLabel}>CONFIGURED PAY CYCLES</Text>
                <View style={[styles.kpiIconWrap, { backgroundColor: "#FAF5FF" }]}>
                  <Ionicons name="time-outline" size={17} color="#9333EA" />
                </View>
              </View>
              <View style={styles.kpiValueRow}>
                <Text style={styles.kpiValue}>{kpiSummary.configuredPayCycles}</Text>
                <Text style={styles.kpiSubText}>Cycles Active</Text>
              </View>
            </View>

            {/* KPI 4: Salary Calculation */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiTopRow}>
                <Text style={styles.kpiLabel}>SALARY CALCULATION</Text>
                <View style={[styles.kpiIconWrap, { backgroundColor: "#FFF7ED" }]}>
                  <Ionicons name="calculator-outline" size={17} color="#EA580C" />
                </View>
              </View>
              <View style={styles.kpiValueCol}>
                <Text style={[styles.kpiValue, { fontSize: 13 }]} numberOfLines={1}>
                  {kpiSummary.salaryCalculationMethod}
                </Text>
                <Text style={styles.kpiSubText}>
                  {kpiSummary.salaryCalculationDefault}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sub-Tabs Segmented Bar */}
        <View style={styles.subTabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subTabsScroll}
          >
            {[
              "Pay Groups",
              "Pay Schedules",
              "Pay Cycles",
              "Pay Days",
              "Calculation Methods",
            ].map((tab) => {
              const isActive = activePayrollSubTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.subTabPill,
                    isActive && styles.activeSubTabPill,
                  ]}
                  onPress={() => dispatch(setActivePayrollSubTab(tab))}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.subTabPillText,
                      isActive && styles.activeSubTabPillText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ========================================================= */}
        {/* TAB 1: PAY GROUPS                                         */}
        {/* ========================================================= */}
        {activePayrollSubTab === "Pay Groups" && (
          <View>
            {/* Search, Filters & Add Pay Group Bar */}
            <View style={styles.filterCard}>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={17} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search pay group name or code..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={(text) => dispatch(setSearchQuery(text))}
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => dispatch(setSearchQuery(""))}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Filter Pills & Add Button */}
              <View style={styles.filterActionsRow}>
                {/* Status Filter */}
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() =>
                    setPickerConfig({
                      title: "Filter by Status",
                      options: ["All Status", "Active", "Inactive"],
                      onSelect: (val) => dispatch(setSelectedStatus(val)),
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownBtnText}>{selectedStatus}</Text>
                  <Ionicons name="chevron-down" size={14} color="#64748B" />
                </TouchableOpacity>

                {/* Cycles Filter */}
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() =>
                    setPickerConfig({
                      title: "Filter by Pay Cycle",
                      options: ["All Cycles", "Monthly", "Weekly"],
                      onSelect: (val) => dispatch(setSelectedCycle(val)),
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownBtnText}>{selectedCycle}</Text>
                  <Ionicons name="chevron-down" size={14} color="#64748B" />
                </TouchableOpacity>

                {/* Reset Filters */}
                {(searchQuery ||
                  selectedStatus !== "All Status" ||
                  selectedCycle !== "All Cycles") && (
                  <TouchableOpacity
                    style={styles.resetFilterBtn}
                    onPress={() => dispatch(resetFilters())}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="reload" size={14} color="#DC2626" />
                  </TouchableOpacity>
                )}

                {/* Add Pay Group Button */}
                <TouchableOpacity
                  style={styles.addPayGroupBtn}
                  onPress={() => setIsAddModalOpen(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                  <Text style={styles.addPayGroupBtnText}>+ Add Pay Group</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Section Header: List Count */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.listHeaderTitle}>
                Pay Groups ({filteredPayGroups.length})
              </Text>
              <Text style={styles.listHeaderSub}>
                Tap card to expand details & actions
              </Text>
            </View>

            {/* Pay Groups Mobile Cards List */}
            {filteredPayGroups.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="folder-open-outline" size={44} color="#94A3B8" />
                <Text style={styles.emptyCardTitle}>No Pay Groups Found</Text>
                <Text style={styles.emptyCardSubtitle}>
                  Try adjusting your search query or status filter.
                </Text>
                <TouchableOpacity
                  style={styles.emptyResetBtn}
                  onPress={() => dispatch(resetFilters())}
                >
                  <Text style={styles.emptyResetBtnText}>Reset All Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredPayGroups.map((group) => {
                const isExpanded = expandedGroupId === group.id;

                return (
                  <View key={group.id} style={styles.payGroupCard}>
                    <TouchableOpacity
                      style={styles.cardHeaderTouchable}
                      onPress={() => toggleExpand(group.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardTopRow}>
                        <View style={styles.cardTitleWrap}>
                          <Text style={styles.groupName}>{group.name}</Text>
                          <View style={styles.groupCodeBadge}>
                            <Text style={styles.groupCodeText}>{group.code}</Text>
                          </View>
                        </View>

                        <View style={styles.cardRightBadgeWrap}>
                          <View
                            style={[
                              styles.statusBadge,
                              group.status === "Active"
                                ? styles.statusActiveBadge
                                : styles.statusInactiveBadge,
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeText,
                                group.status === "Active"
                                ? styles.statusActiveText
                                : styles.statusInactiveText,
                              ]}
                            >
                              {group.status}
                            </Text>
                          </View>

                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#64748B"
                          />
                        </View>
                      </View>

                      <Text style={styles.groupDescription} numberOfLines={isExpanded ? undefined : 2}>
                        {group.description}
                      </Text>

                      <View style={styles.metaHighlightsRow}>
                        <View style={styles.metaHighlightPill}>
                          <Ionicons name="calendar-outline" size={12} color="#475569" />
                          <Text style={styles.metaHighlightText}>
                            {group.paySchedule}
                          </Text>
                        </View>

                        <View style={[styles.metaHighlightPill, { backgroundColor: "#EFF6FF" }]}>
                          <Ionicons name="repeat-outline" size={12} color="#2563EB" />
                          <Text style={[styles.metaHighlightText, { color: "#2563EB" }]}>
                            {group.payCycle.includes("Weekly") ? "Weekly" : "Monthly"} Cycle
                          </Text>
                        </View>

                        <View style={[styles.metaHighlightPill, { backgroundColor: "#F0FDF4" }]}>
                          <Ionicons name="layers-outline" size={12} color="#16A34A" />
                          <Text style={[styles.metaHighlightText, { color: "#16A34A", fontWeight: "700" }]}>
                            {group.componentsCount} Components
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.expandedDetailsWrap}>
                        <View style={styles.detailsGridBox}>
                          <View style={styles.detailRow}>
                            <View style={styles.detailCol}>
                              <Text style={styles.detailLabel}>PAY SCHEDULE</Text>
                              <Text style={styles.detailValueBold}>
                                {group.paySchedule}
                              </Text>
                            </View>
                            <View style={styles.detailCol}>
                              <Text style={styles.detailLabel}>PAY DAY</Text>
                              <Text style={styles.detailValue}>
                                {group.payDay}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.detailRow}>
                            <View style={styles.detailCol}>
                              <Text style={styles.detailLabel}>PAY CYCLE</Text>
                              <Text style={styles.detailValueBlue}>
                                {group.payCycle}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.detailRow}>
                            <View style={styles.detailCol}>
                              <Text style={styles.detailLabel}>CALCULATION METHOD</Text>
                              <View style={styles.methodBadge}>
                                <Text style={styles.methodBadgeText}>
                                  {group.calculationMethod}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.detailCol}>
                              <Text style={styles.detailLabel}>ASSIGNED WORKFORCE</Text>
                              <Text style={styles.detailValueGreen}>
                                {group.assignedEmployees} Employees
                              </Text>
                            </View>
                          </View>

                          <View style={styles.componentsSection}>
                            <Text style={styles.componentsTitle}>
                              Configured Salary Components ({group.componentsList.length}):
                            </Text>
                            <View style={styles.componentChipsWrap}>
                              {group.componentsList.map((comp, idx) => (
                                <View key={idx} style={styles.compChip}>
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={12}
                                    color="#16A34A"
                                  />
                                  <Text style={styles.compChipText}>{comp}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        </View>

                        <View style={styles.cardActionsRow}>
                          <TouchableOpacity
                            style={[styles.actionBtn, styles.actionBtnView]}
                            onPress={() => setViewingGroup(group)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="eye-outline" size={14} color="#2563EB" />
                            <Text style={styles.actionBtnViewText}>Details</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionBtn, styles.actionBtnEdit]}
                            onPress={() => setEditingGroup(group)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="create-outline" size={14} color="#0F172A" />
                            <Text style={styles.actionBtnEditText}>Edit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionBtn, styles.actionBtnToggle]}
                            onPress={() => handleToggleGroupStatus(group)}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name={
                                group.status === "Active"
                                  ? "pause-outline"
                                  : "play-outline"
                              }
                              size={14}
                              color={group.status === "Active" ? "#D97706" : "#16A34A"}
                            />
                            <Text
                              style={[
                                styles.actionBtnToggleText,
                                {
                                  color:
                                    group.status === "Active" ? "#D97706" : "#16A34A",
                                },
                              ]}
                            >
                              {group.status === "Active" ? "Deactivate" : "Activate"}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionBtn, styles.actionBtnDelete]}
                            onPress={() => handleDeleteGroup(group)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="trash-outline" size={14} color="#DC2626" />
                            <Text style={styles.actionBtnDeleteText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PAY SCHEDULES (SCREENSHOT 1)                       */}
        {/* ========================================================= */}
        {activePayrollSubTab === "Pay Schedules" && (
          <View style={styles.tabSectionWrap}>
            {/* Header with Title and Add Button matching screenshot 1 */}
            <View style={styles.sectionHeaderCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Pay Schedules</Text>
                <Text style={styles.sectionSubtitle}>
                  Configured payroll timeline frequencies (Monthly, Weekly, Bi-Weekly)
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addSchedulePrimaryBtn}
                onPress={() => setIsAddScheduleModalOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={17} color="#FFFFFF" />
                <Text style={styles.addSchedulePrimaryBtnText}>+ Add Pay Schedule</Text>
              </TouchableOpacity>
            </View>

            {/* List of Pay Schedules Cards */}
            <View style={styles.cardsListWrap}>
              {paySchedules.map((schedule) => (
                <View key={schedule.id} style={styles.itemCard}>
                  <View style={styles.itemCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{schedule.name}</Text>
                      <Text style={styles.itemDesc}>{schedule.description}</Text>
                    </View>

                    <View style={styles.itemRightGroup}>
                      <View
                        style={[
                          styles.statusBadge,
                          schedule.status === "Active"
                            ? styles.statusActiveBadge
                            : styles.statusInactiveBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            schedule.status === "Active"
                              ? styles.statusActiveText
                              : styles.statusInactiveText,
                          ]}
                        >
                          {schedule.status}
                        </Text>
                      </View>

                      {/* Action Icons matching screenshot */}
                      <View style={styles.actionsIconRow}>
                        <TouchableOpacity
                          style={styles.iconCircleBtn}
                          onPress={() => setEditingSchedule(schedule)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="pencil-outline" size={16} color="#475569" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconCircleBtn}
                          onPress={() => {
                            dispatch(togglePayScheduleStatus(schedule.id));
                            Alert.alert("Status Updated", `${schedule.name} status changed.`);
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={
                              schedule.status === "Active"
                                ? "radio-button-on-outline"
                                : "radio-button-off-outline"
                            }
                            size={16}
                            color={schedule.status === "Active" ? "#DC2626" : "#16A34A"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PAY CYCLES (SCREENSHOT 2)                          */}
        {/* ========================================================= */}
        {activePayrollSubTab === "Pay Cycles" && (
          <View style={styles.tabSectionWrap}>
            {/* Header with Title and Add Button matching screenshot 2 */}
            <View style={styles.sectionHeaderCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Pay Cycles</Text>
                <Text style={styles.sectionSubtitle}>
                  Attendance cutoff bounds and verification periods for salary computations
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addSchedulePrimaryBtn}
                onPress={() => setIsAddCycleModalOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={17} color="#FFFFFF" />
                <Text style={styles.addSchedulePrimaryBtnText}>+ Add Pay Cycle</Text>
              </TouchableOpacity>
            </View>

            {/* List of Pay Cycles Cards */}
            <View style={styles.cardsListWrap}>
              {payCycles.map((cycle) => (
                <View key={cycle.id} style={styles.itemCard}>
                  <View style={styles.itemCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{cycle.name}</Text>
                      <View style={styles.cycleBadgeRow}>
                        <View style={styles.frequencyBadge}>
                          <Text style={styles.frequencyBadgeText}>{cycle.frequency}</Text>
                        </View>
                        <View style={styles.cutoffBadge}>
                          <Ionicons name="timer-outline" size={12} color="#64748B" />
                          <Text style={styles.cutoffBadgeText}>{cycle.cutoffBounds}</Text>
                        </View>
                      </View>
                      <Text style={styles.itemDesc}>{cycle.description}</Text>
                    </View>

                    <View style={styles.itemRightGroup}>
                      <View
                        style={[
                          styles.statusBadge,
                          cycle.status === "Active"
                            ? styles.statusActiveBadge
                            : styles.statusInactiveBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            cycle.status === "Active"
                              ? styles.statusActiveText
                              : styles.statusInactiveText,
                          ]}
                        >
                          {cycle.status}
                        </Text>
                      </View>

                      {/* Action Icons */}
                      <View style={styles.actionsIconRow}>
                        <TouchableOpacity
                          style={styles.iconCircleBtn}
                          onPress={() => setEditingCycle(cycle)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="pencil-outline" size={16} color="#475569" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconCircleBtn}
                          onPress={() => {
                            dispatch(togglePayCycleStatus(cycle.id));
                            Alert.alert("Status Updated", `${cycle.name} status changed.`);
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={
                              cycle.status === "Active"
                                ? "radio-button-on-outline"
                                : "radio-button-off-outline"
                            }
                            size={16}
                            color={cycle.status === "Active" ? "#DC2626" : "#16A34A"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PAY DAY RULES (SCREENSHOT 3)                       */}
        {/* ========================================================= */}
        {activePayrollSubTab === "Pay Days" && (
          <View style={styles.tabSectionWrap}>
            {/* Header with Title and Add Button matching screenshot 3 */}
            <View style={styles.sectionHeaderCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Pay Day Rules</Text>
                <Text style={styles.sectionSubtitle}>
                  Configured disbursement timing rules (Fixed Day, Last Working Day, Last Calendar Day)
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addSchedulePrimaryBtn}
                onPress={() => setIsAddPayDayModalOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={17} color="#FFFFFF" />
                <Text style={styles.addSchedulePrimaryBtnText}>+ Add Pay Day Rule</Text>
              </TouchableOpacity>
            </View>

            {/* List of Pay Day Cards */}
            <View style={styles.cardsListWrap}>
              {payDays.map((rule) => (
                <View key={rule.id} style={styles.itemCard}>
                  <View style={styles.itemCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{rule.ruleName}</Text>
                      <View style={styles.cycleBadgeRow}>
                        <View style={styles.frequencyBadge}>
                          <Text style={styles.frequencyBadgeText}>{rule.payDayType}</Text>
                        </View>
                        <View style={styles.disburseTimingBadge}>
                          <Ionicons name="calendar" size={12} color="#059669" />
                          <Text style={styles.disburseTimingText}>{rule.disbursementTiming}</Text>
                        </View>
                      </View>
                      <Text style={styles.itemDesc}>{rule.description}</Text>
                    </View>

                    <View style={styles.itemRightGroup}>
                      <View
                        style={[
                          styles.statusBadge,
                          rule.status === "Active"
                            ? styles.statusActiveBadge
                            : styles.statusInactiveBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            rule.status === "Active"
                              ? styles.statusActiveText
                              : styles.statusInactiveText,
                          ]}
                        >
                          {rule.status}
                        </Text>
                      </View>

                      {/* Action Icons */}
                      <View style={styles.actionsIconRow}>
                        <TouchableOpacity
                          style={styles.iconCircleBtn}
                          onPress={() => setEditingPayDay(rule)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="pencil-outline" size={16} color="#475569" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconCircleBtn}
                          onPress={() => {
                            dispatch(togglePayDayRuleStatus(rule.id));
                            Alert.alert("Status Updated", `${rule.ruleName} status changed.`);
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={
                              rule.status === "Active"
                                ? "radio-button-on-outline"
                                : "radio-button-off-outline"
                            }
                            size={16}
                            color={rule.status === "Active" ? "#DC2626" : "#16A34A"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CALCULATION METHODS (SCREENSHOT 4)                 */}
        {/* ========================================================= */}
        {activePayrollSubTab === "Calculation Methods" && (
          <View style={styles.tabSectionWrap}>
            {/* Header matching screenshot 4 */}
            <View style={styles.sectionHeaderCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Salary Calculation Methods</Text>
                <Text style={styles.sectionSubtitle}>
                  Configures daily rate derivation formulas used across pay groups
                </Text>
              </View>
            </View>

            {/* List of Calculation Method Cards matching screenshot 4 */}
            <View style={styles.cardsListWrap}>
              {calculationMethods.map((method) => {
                const isSystemDefault = !!method.isDefault;

                return (
                  <View
                    key={method.id}
                    style={[
                      styles.calcMethodCard,
                      isSystemDefault && styles.calcMethodCardDefault,
                    ]}
                  >
                    {/* Header Row: Code Tag + Default status / Set as Default button */}
                    <View style={styles.calcCardHeaderRow}>
                      <View style={styles.calcTagPill}>
                        <Text style={styles.calcTagText}>{method.tag}</Text>
                      </View>

                      {isSystemDefault ? (
                        <View style={styles.systemDefaultBadge}>
                          <Ionicons name="sparkles" size={13} color="#2563EB" />
                          <Text style={styles.systemDefaultText}>System Default</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.setAsDefaultBtn}
                          onPress={() => {
                            dispatch(setDefaultCalculationMethod(method.id));
                            Alert.alert(
                              "Default Updated",
                              `${method.name} is now the system default calculation method.`
                            );
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.setAsDefaultBtnText}>Set as Default</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Method Title */}
                    <Text style={styles.calcMethodTitle}>{method.name}</Text>

                    {/* Formula Box matching screenshot code container */}
                    <View style={styles.formulaBox}>
                      <Text style={styles.formulaHeaderLabel}>CALCULATION FORMULA:</Text>
                      <Text style={styles.formulaCodeText}>{method.formula}</Text>
                    </View>

                    {/* Description */}
                    <Text style={styles.calcMethodDesc}>{method.description}</Text>

                    {/* Footer Row: Active Pill + Configuration Ready */}
                    <View style={styles.calcCardFooter}>
                      <View style={[styles.statusBadge, styles.statusActiveBadge]}>
                        <Text style={[styles.statusBadgeText, styles.statusActiveText]}>
                          {method.status}
                        </Text>
                      </View>
                      <Text style={styles.configReadyText}>Configuration Ready</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* MODAL: ADD PAY GROUP */}
      {isAddModalOpen && (
        <PayGroupFormModal
          mode="add"
          onClose={() => setIsAddModalOpen(false)}
          onSave={(data) => {
            dispatch(addPayGroup(data));
            setIsAddModalOpen(false);
            Alert.alert("Success", "New pay group added successfully!");
          }}
        />
      )}

      {/* MODAL: EDIT PAY GROUP */}
      {editingGroup && (
        <PayGroupFormModal
          mode="edit"
          initialData={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSave={(data) => {
            dispatch(editPayGroup(data));
            setEditingGroup(null);
            Alert.alert("Updated", "Pay group updated successfully!");
          }}
        />
      )}

      {/* MODAL: VIEW DETAILS */}
      {viewingGroup && (
        <PayGroupDetailsModal
          group={viewingGroup}
          onClose={() => setViewingGroup(null)}
        />
      )}

      {/* MODAL: ADD / EDIT PAY SCHEDULE */}
      {(isAddScheduleModalOpen || editingSchedule) && (
        <PayScheduleModal
          mode={editingSchedule ? "edit" : "add"}
          initialData={editingSchedule}
          onClose={() => {
            setIsAddScheduleModalOpen(false);
            setEditingSchedule(null);
          }}
          onSave={(data) => {
            if (editingSchedule) {
              dispatch(editPaySchedule({ id: editingSchedule.id, ...data }));
              Alert.alert("Updated", "Pay schedule updated successfully!");
            } else {
              dispatch(addPaySchedule(data));
              Alert.alert("Success", "New pay schedule created!");
            }
            setIsAddScheduleModalOpen(false);
            setEditingSchedule(null);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT PAY CYCLE */}
      {(isAddCycleModalOpen || editingCycle) && (
        <PayCycleModal
          mode={editingCycle ? "edit" : "add"}
          initialData={editingCycle}
          onClose={() => {
            setIsAddCycleModalOpen(false);
            setEditingCycle(null);
          }}
          onSave={(data) => {
            if (editingCycle) {
              dispatch(editPayCycle({ id: editingCycle.id, ...data }));
              Alert.alert("Updated", "Pay cycle updated successfully!");
            } else {
              dispatch(addPayCycle(data));
              Alert.alert("Success", "New pay cycle created!");
            }
            setIsAddCycleModalOpen(false);
            setEditingCycle(null);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT PAY DAY RULE */}
      {(isAddPayDayModalOpen || editingPayDay) && (
        <PayDayRuleModal
          mode={editingPayDay ? "edit" : "add"}
          initialData={editingPayDay}
          onClose={() => {
            setIsAddPayDayModalOpen(false);
            setEditingPayDay(null);
          }}
          onSave={(data) => {
            if (editingPayDay) {
              dispatch(editPayDayRule({ id: editingPayDay.id, ...data }));
              Alert.alert("Updated", "Pay day rule updated successfully!");
            } else {
              dispatch(addPayDayRule(data));
              Alert.alert("Success", "New pay day rule created!");
            }
            setIsAddPayDayModalOpen(false);
            setEditingPayDay(null);
          }}
        />
      )}

      {/* GENERIC PICKER MODAL */}
      <Modal
        visible={!!pickerConfig}
        transparent
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

            <ScrollView style={{ maxHeight: 280 }}>
              {pickerConfig?.options.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.pickerOption}
                  onPress={() => {
                    pickerConfig.onSelect(opt);
                    setPickerConfig(null);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Pay Schedule Modal
// -------------------------------------------------------------
function PayScheduleModal({ mode, initialData, onClose, onSave }) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter schedule name.");
      return;
    }
    onSave({ name: name.trim(), description: description.trim() });
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.formModalCard}>
          <View style={styles.formModalHeader}>
            <Text style={styles.formModalTitle}>
              {mode === "edit" ? "Edit Pay Schedule" : "Add Pay Schedule"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 16 }}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Schedule Name *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Monthly Payroll"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.fieldInput, { height: 60, textAlignVertical: "top" }]}
                placeholder="Brief description of the schedule timeline..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={styles.formActionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {mode === "edit" ? "Update Schedule" : "Save Schedule"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Pay Cycle Modal
// -------------------------------------------------------------
function PayCycleModal({ mode, initialData, onClose, onSave }) {
  const [name, setName] = useState(initialData?.name || "");
  const [frequency, setFrequency] = useState(initialData?.frequency || "Monthly");
  const [cutoffBounds, setCutoffBounds] = useState(initialData?.cutoffBounds || "Day 1 to 31");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter cycle name.");
      return;
    }
    onSave({
      name: name.trim(),
      frequency,
      cutoffBounds: cutoffBounds.trim(),
      description: description.trim(),
    });
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.formModalCard}>
          <View style={styles.formModalHeader}>
            <Text style={styles.formModalTitle}>
              {mode === "edit" ? "Edit Pay Cycle" : "Add Pay Cycle"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 16 }}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Cycle Name *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Standard Monthly (1st to End of Month)"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Frequency</Text>
              <View style={styles.radioRow}>
                {["Monthly", "Weekly", "Bi-Weekly"].map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.radioPill, frequency === f && styles.activeRadioPill]}
                    onPress={() => setFrequency(f)}
                  >
                    <Text
                      style={[
                        styles.radioPillText,
                        frequency === f && styles.activeRadioPillText,
                      ]}
                    >
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Cutoff Bounds</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Day 1 to 31"
                placeholderTextColor="#94A3B8"
                value={cutoffBounds}
                onChangeText={setCutoffBounds}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.fieldInput, { height: 60, textAlignVertical: "top" }]}
                placeholder="Details of cutoff rules and verification window..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={styles.formActionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {mode === "edit" ? "Update Cycle" : "Save Cycle"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Pay Day Rule Modal
// -------------------------------------------------------------
function PayDayRuleModal({ mode, initialData, onClose, onSave }) {
  const [ruleName, setRuleName] = useState(initialData?.ruleName || "");
  const [payDayType, setPayDayType] = useState(initialData?.payDayType || "Fixed Day");
  const [disbursementTiming, setDisbursementTiming] = useState(
    initialData?.disbursementTiming || "7th of Month"
  );
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSave = () => {
    if (!ruleName.trim()) {
      Alert.alert("Validation", "Please enter rule name.");
      return;
    }
    onSave({
      ruleName: ruleName.trim(),
      payDayType,
      disbursementTiming: disbursementTiming.trim(),
      description: description.trim(),
    });
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.formModalCard}>
          <View style={styles.formModalHeader}>
            <Text style={styles.formModalTitle}>
              {mode === "edit" ? "Edit Pay Day Rule" : "Add Pay Day Rule"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 16 }}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Rule Name *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. 7th of Every Month"
                placeholderTextColor="#94A3B8"
                value={ruleName}
                onChangeText={setRuleName}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Pay Day Type</Text>
              <View style={styles.radioRow}>
                {["Fixed Day", "Last Working Day", "Last Calendar Day"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.radioPill, payDayType === t && styles.activeRadioPill]}
                    onPress={() => setPayDayType(t)}
                  >
                    <Text
                      style={[
                        styles.radioPillText,
                        payDayType === t && styles.activeRadioPillText,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Disbursement Timing</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. 7th of Month"
                placeholderTextColor="#94A3B8"
                value={disbursementTiming}
                onChangeText={setDisbursementTiming}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.fieldInput, { height: 60, textAlignVertical: "top" }]}
                placeholder="Disbursement timing and holiday adjustment policy..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={styles.formActionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {mode === "edit" ? "Update Rule" : "Save Rule"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Pay Group Form Modal (Add / Edit)
// -------------------------------------------------------------
function PayGroupFormModal({ mode, initialData, onClose, onSave }) {
  const [name, setName] = useState(initialData?.name || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [paySchedule, setPaySchedule] = useState(
    initialData?.paySchedule || "Monthly Payroll"
  );
  const [payCycle, setPayCycle] = useState(
    initialData?.payCycle || "Standard Monthly (1st to End of Month)"
  );
  const [payDay, setPayDay] = useState(
    initialData?.payDay || "7th of Every Month"
  );
  const [calculationMethod, setCalculationMethod] = useState(
    initialData?.calculationMethod || "Calendar Days Basis"
  );

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter pay group name.");
      return;
    }
    onSave({
      ...(initialData || {}),
      name: name.trim(),
      code:
        code.trim() ||
        `PG-${name
          .trim()
          .slice(0, 3)
          .toUpperCase()}-0${Math.floor(Math.random() * 9 + 1)}`,
      description:
        description.trim() || "Configured salary group structure.",
      paySchedule,
      payCycle,
      payDay,
      calculationMethod,
    });
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.formModalCard}>
          <View style={styles.formModalHeader}>
            <Text style={styles.formModalTitle}>
              {mode === "add" ? "Create New Pay Group" : "Edit Pay Group"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Pay Group Name *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Monthly Security Guard Staff"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Code (Identifier)</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. PG-SEC-01"
                placeholderTextColor="#94A3B8"
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.fieldInput, { height: 60, textAlignVertical: "top" }]}
                placeholder="Brief description of workforce eligible for this pay group..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Pay Schedule</Text>
              <View style={styles.radioRow}>
                {["Monthly Payroll", "Weekly Payroll"].map((sched) => (
                  <TouchableOpacity
                    key={sched}
                    style={[
                      styles.radioPill,
                      paySchedule === sched && styles.activeRadioPill,
                    ]}
                    onPress={() => setPaySchedule(sched)}
                  >
                    <Text
                      style={[
                        styles.radioPillText,
                        paySchedule === sched && styles.activeRadioPillText,
                      ]}
                    >
                      {sched}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Pay Cycle</Text>
              <View style={styles.radioRow}>
                {[
                  "Standard Monthly (1st to End of Month)",
                  "Standard Weekly (Monday to Sunday)",
                ].map((cycle) => (
                  <TouchableOpacity
                    key={cycle}
                    style={[
                      styles.radioPillFull,
                      payCycle === cycle && styles.activeRadioPill,
                    ]}
                    onPress={() => setPayCycle(cycle)}
                  >
                    <Text
                      style={[
                        styles.radioPillText,
                        payCycle === cycle && styles.activeRadioPillText,
                      ]}
                    >
                      {cycle}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Pay Day</Text>
              <View style={styles.radioRow}>
                {[
                  "7th of Every Month",
                  "10th of Every Month",
                  "Last Working Day",
                ].map((pDay) => (
                  <TouchableOpacity
                    key={pDay}
                    style={[
                      styles.radioPill,
                      payDay === pDay && styles.activeRadioPill,
                    ]}
                    onPress={() => setPayDay(pDay)}
                  >
                    <Text
                      style={[
                        styles.radioPillText,
                        payDay === pDay && styles.activeRadioPillText,
                      ]}
                    >
                      {pDay}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Calculation Method</Text>
              <View style={styles.radioRow}>
                {[
                  "Calendar Days Basis",
                  "Working Days Basis (26 Days)",
                ].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.radioPillFull,
                      calculationMethod === method && styles.activeRadioPill,
                    ]}
                    onPress={() => setCalculationMethod(method)}
                  >
                    <Text
                      style={[
                        styles.radioPillText,
                        calculationMethod === method && styles.activeRadioPillText,
                      ]}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formActionsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>
                  {mode === "add" ? "Save Pay Group" : "Update Pay Group"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: Pay Group Details Modal
// -------------------------------------------------------------
function PayGroupDetailsModal({ group, onClose }) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.detailsModalCard}>
          <View style={styles.detailsModalHeader}>
            <View>
              <Text style={styles.detailsModalTitle}>{group.name}</Text>
              <Text style={styles.detailsModalCode}>Code: {group.code}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 16 }}>
            <Text style={styles.detailsSubtitle}>DESCRIPTION</Text>
            <Text style={styles.detailsDescText}>{group.description}</Text>

            <View style={styles.detailsRowBox}>
              <View style={styles.detailBoxItem}>
                <Text style={styles.detailBoxLabel}>Pay Schedule</Text>
                <Text style={styles.detailBoxVal}>{group.paySchedule}</Text>
              </View>
              <View style={styles.detailBoxItem}>
                <Text style={styles.detailBoxLabel}>Pay Day</Text>
                <Text style={styles.detailBoxVal}>{group.payDay}</Text>
              </View>
            </View>

            <View style={styles.detailsRowBox}>
              <View style={styles.detailBoxItem}>
                <Text style={styles.detailBoxLabel}>Calculation Method</Text>
                <Text style={styles.detailBoxVal}>{group.calculationMethod}</Text>
              </View>
              <View style={styles.detailBoxItem}>
                <Text style={styles.detailBoxLabel}>Status</Text>
                <Text style={[styles.detailBoxVal, { color: "#16A34A" }]}>
                  {group.status}
                </Text>
              </View>
            </View>

            <Text style={[styles.detailsSubtitle, { marginTop: 16 }]}>
              SALARY COMPONENTS ({group.componentsList.length})
            </Text>
            <View style={styles.modalCompWrap}>
              {group.componentsList.map((c, i) => (
                <View key={i} style={styles.modalCompItem}>
                  <Ionicons name="shield-checkmark" size={13} color="#2563EB" />
                  <Text style={styles.modalCompText}>{c}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseDoneBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// -------------------------------------------------------------
// STYLESHEET
// -------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
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
  topHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#254EDB",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarInitial: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  userNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  userRoleText: {
    fontSize: 11.5,
    color: "#64748B",
  },
  drawerHamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 36,
  },

  /* Page Title Card */
  pageTitleCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  titleBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  adminBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4F46E5",
    letterSpacing: 0.4,
  },
  pageSubtitle: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    marginTop: 2,
    marginBottom: 12,
  },
  headerActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  componentsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  componentsBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },

  /* KPI Grid: Guaranteed 2x2 Layout */
  kpiGrid: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 2,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    justifyContent: "space-between",
  },
  kpiTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.3,
    flex: 1,
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  kpiValueCol: {
    gap: 2,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  kpiSubText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },

  /* Sub-Tabs Scroll */
  subTabsContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginTop: 8,
  },
  subTabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  subTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },
  activeSubTabPill: {
    backgroundColor: "#254EDB",
  },
  subTabPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  activeSubTabPillText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* Tab Section Wrapper */
  tabSectionWrap: {
    marginTop: 8,
  },
  sectionHeaderCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  sectionSubtitle: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  addSchedulePrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addSchedulePrimaryBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Generic Cards List */
  cardsListWrap: {
    marginHorizontal: 16,
    gap: 8,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  itemCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  itemTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 11.5,
    color: "#64748B",
    lineHeight: 16,
    marginTop: 4,
  },
  itemRightGroup: {
    alignItems: "flex-end",
    gap: 8,
  },
  actionsIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Cycles specific */
  cycleBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    marginVertical: 3,
  },
  frequencyBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  frequencyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  cutoffBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cutoffBadgeText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600",
  },
  disburseTimingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  disburseTimingText: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "600",
  },

  /* Calculation Methods Cards (Screenshot 4) */
  calcMethodCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  calcMethodCardDefault: {
    borderColor: "#2563EB",
    backgroundColor: "#FAFCFF",
  },
  calcCardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calcTagPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  calcTagText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 0.4,
  },
  systemDefaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  systemDefaultText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  setAsDefaultBtn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  setAsDefaultBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  calcMethodTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  formulaBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    marginBottom: 10,
  },
  formulaHeaderLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  formulaCodeText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#0F172A",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 17,
  },
  calcMethodDesc: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    marginBottom: 12,
  },
  calcCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
  },
  configReadyText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },

  /* Search & Filter Bar (Pay Groups) */
  filterCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#0F172A",
  },
  filterActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  dropdownBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  resetFilterBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addPayGroupBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: "auto",
  },
  addPayGroupBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* List Header */
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  listHeaderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  listHeaderSub: {
    fontSize: 11,
    color: "#94A3B8",
  },

  /* Pay Group Mobile Card */
  payGroupCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderTouchable: {
    padding: 14,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 6,
  },
  cardTitleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  groupName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  groupCodeBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupCodeText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 0.3,
  },
  cardRightBadgeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActiveBadge: {
    backgroundColor: "#ECFDF5",
  },
  statusInactiveBadge: {
    backgroundColor: "#F1F5F9",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusActiveText: {
    color: "#059669",
  },
  statusInactiveText: {
    color: "#64748B",
  },
  groupDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    marginBottom: 10,
  },
  metaHighlightsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  metaHighlightPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaHighlightText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600",
  },

  /* Expanded Details & Accordion */
  expandedDetailsWrap: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    padding: 12,
    backgroundColor: "#FAFAFA",
  },
  detailsGridBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    paddingBottom: 6,
  },
  detailCol: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  detailValueBold: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  detailValueBlue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  detailValueGreen: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },
  methodBadge: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  methodBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7C3AED",
  },
  componentsSection: {
    marginTop: 4,
  },
  componentsTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },
  componentChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  compChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  compChipText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#166534",
  },

  /* Card Actions Row */
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnView: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  actionBtnViewText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  actionBtnEdit: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  actionBtnEditText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  actionBtnToggle: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  actionBtnToggleText: {
    fontSize: 11,
    fontWeight: "700",
  },
  actionBtnDelete: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  actionBtnDeleteText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#DC2626",
  },

  /* Empty State */
  emptyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  emptyCardSubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  emptyResetBtn: {
    marginTop: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  emptyResetBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  pickerCard: {
    width: "85%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  pickerOptionText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
  },

  /* Form Modal */
  formModalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    maxHeight: "85%",
    overflow: "hidden",
  },
  formModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  formModalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalCloseBtn: {
    padding: 4,
  },
  formScroll: {
    padding: 16,
  },
  formField: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 5,
  },
  fieldInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#0F172A",
  },
  radioRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  radioPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "transparent",
  },
  radioPillFull: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: 4,
  },
  activeRadioPill: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  radioPillText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#475569",
  },
  activeRadioPillText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  formActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  saveBtn: {
    flex: 2,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Details Modal */
  detailsModalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    maxHeight: "80%",
    overflow: "hidden",
  },
  detailsModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailsModalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  detailsModalCode: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "700",
    marginTop: 2,
  },
  detailsSubtitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailsDescText: {
    fontSize: 12.5,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 12,
  },
  detailsRowBox: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  detailBoxItem: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  detailBoxLabel: {
    fontSize: 9.5,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 2,
  },
  detailBoxVal: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalCompWrap: {
    gap: 6,
    marginTop: 6,
    marginBottom: 16,
  },
  modalCompItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalCompText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  modalCloseDoneBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 14,
  },
  modalCloseDoneBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
