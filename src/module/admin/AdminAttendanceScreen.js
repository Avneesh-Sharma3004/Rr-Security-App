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
  setSearchQuery,
  setTimeframe,
  prevMonth,
  nextMonth,
  setSelectedMonth,
  setSelectedClient,
  setSelectedSite,
  setSelectedDepartment,
  setSelectedStatus,
  resetFilters,
  editAttendanceRecord,
  deleteAttendanceRecord,
  addAttendanceRecord,
} from "../../store/slices/attendanceSlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";

export default function AdminAttendanceScreen() {
  const dispatch = useDispatch();

  const {
    searchQuery,
    timeframe,
    selectedMonth,
    displayDate,
    selectedClient,
    selectedSite,
    selectedDepartment,
    selectedStatus,
    records,
  } = useSelector((state) => state.attendance);

  // Popover & Modal States
  const [activeMenuRecord, setActiveMenuRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState(null);

  const toggleExpandRecord = (id) => {
    setExpandedRecordId((prev) => (prev === id ? null : id));
  };

  // Dropdown Picker Modal State
  const [pickerConfig, setPickerConfig] = useState(null);

  // Dropdown Options
  const timeframeOptions = [
    "Current Month",
    "Previous Month",
    "Last 3 Months",
    "Financial Year 2026-27",
  ];

  const clientOptions = [
    "All Clients",
    "RSAG Sealing Solutions Pvt Ltd",
    "Petal Commercial Pvt Ltd",
    "RR Security & Facilities",
  ];

  const siteOptions = [
    "All Sites",
    "Plant 1 - Manesar",
    "Warehouse Unit 2",
    "DLF CyberCity Hub",
    "Corporate HQ",
  ];

  const departmentOptions = [
    "All Departments",
    "Office Staff",
    "Worker",
    "Security",
  ];

  const statusOptions = ["All Statuses", "Present", "Absent"];

  // Open Dropdown Modal
  const openPicker = (type, title, options, selectedValue, onSelect) => {
    setPickerConfig({ type, title, options, selectedValue, onSelect });
  };

  // Filter Records
  const filteredRecords = records.filter((rec) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      rec.name.toLowerCase().includes(q) ||
      rec.empId.toLowerCase().includes(q) ||
      rec.fatherName.toLowerCase().includes(q) ||
      rec.client.toLowerCase().includes(q);

    const matchesClient =
      selectedClient === "All Clients" || rec.client === selectedClient;

    const matchesSite =
      selectedSite === "All Sites" || rec.site === selectedSite;

    const matchesDept =
      selectedDepartment === "All Departments" ||
      rec.department === selectedDepartment;

    const matchesStatus =
      selectedStatus === "All Statuses" ||
      (selectedStatus === "Present" && rec.present > 0) ||
      (selectedStatus === "Absent" && rec.present === 0);

    return (
      matchesSearch &&
      matchesClient &&
      matchesSite &&
      matchesDept &&
      matchesStatus
    );
  });

  // Calculate Summary Stats
  const totalEmployees = records.length;
  const presentCount = records.filter((r) => r.present > 0).length;
  const absentCount = records.filter((r) => r.present === 0).length;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top Header Bar */}
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
            <Text style={styles.headerTitle}>Daily Attendance</Text>
            <Text style={styles.headerSubtitle}>
              Workforce • Monthly Attendance Register
            </Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.addRecordBtn}
            onPress={() => setIsAddModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={17} color="#FFFFFF" />
            <Text style={styles.addRecordBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* KPI Mini Summary Cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>TOTAL RECORDS</Text>
            <Text style={styles.kpiValue}>{totalEmployees}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>PRESENT</Text>
            <Text style={[styles.kpiValue, { color: "#16A34A" }]}>
              {presentCount}
            </Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>ABSENT</Text>
            <Text style={[styles.kpiValue, { color: "#DC2626" }]}>
              {absentCount}
            </Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>WORKING DAYS</Text>
            <Text style={[styles.kpiValue, { color: "#2563EB" }]}>1 Days</Text>
          </View>
        </View>

        {/* Top Control Bar Matching Screenshot Row 1 */}
        <View style={styles.filtersContainer}>
          {/* Row 1: Search + Month Controls + Client */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow1}
          >
            {/* Search Input */}
            <View style={styles.searchWrap}>
              <Ionicons name="search" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search employee name or ID..."
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

            {/* Timeframe Dropdown (e.g. Current Month) */}
            <TouchableOpacity
              style={styles.pillDropdown}
              onPress={() =>
                openPicker(
                  "timeframe",
                  "Select Timeframe",
                  timeframeOptions,
                  timeframe,
                  (val) => dispatch(setTimeframe(val))
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={15} color="#2563EB" />
              <Text style={styles.pillDropdownTextPrimary}>{timeframe}</Text>
              <Ionicons name="chevron-down" size={13} color="#2563EB" />
            </TouchableOpacity>

            {/* Month Stepper: < Oct 2026 > */}
            <View style={styles.monthStepper}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => dispatch(prevMonth())}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={15} color="#475569" />
              </TouchableOpacity>
              <Text style={styles.stepperLabel}>{selectedMonth}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => dispatch(nextMonth())}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={15} color="#475569" />
              </TouchableOpacity>
            </View>

            {/* October 2026 with Calendar Icon */}
            <TouchableOpacity
              style={styles.dateDisplayPill}
              onPress={() =>
                Alert.alert("Calendar View", `Viewing roster for ${displayDate}`)
              }
              activeOpacity={0.7}
            >
              <Text style={styles.dateDisplayText}>{displayDate}</Text>
              <Ionicons name="calendar" size={14} color="#64748B" />
            </TouchableOpacity>

            {/* All Clients Dropdown */}
            <TouchableOpacity
              style={styles.pillDropdown}
              onPress={() =>
                openPicker(
                  "client",
                  "Filter by Client",
                  clientOptions,
                  selectedClient,
                  (val) => dispatch(setSelectedClient(val))
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons name="business-outline" size={15} color="#64748B" />
              <Text style={styles.pillDropdownText}>{selectedClient}</Text>
              <Ionicons name="chevron-down" size={13} color="#64748B" />
            </TouchableOpacity>
          </ScrollView>

          {/* Row 2: All Sites + All Departments + All Statuses + Reset */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow2}
          >
            {/* Sites Dropdown */}
            <TouchableOpacity
              style={styles.pillDropdown}
              onPress={() =>
                openPicker(
                  "site",
                  "Filter by Site",
                  siteOptions,
                  selectedSite,
                  (val) => dispatch(setSelectedSite(val))
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={15} color="#64748B" />
              <Text style={styles.pillDropdownText}>{selectedSite}</Text>
              <Ionicons name="chevron-down" size={13} color="#64748B" />
            </TouchableOpacity>

            {/* Departments Dropdown */}
            <TouchableOpacity
              style={styles.pillDropdown}
              onPress={() =>
                openPicker(
                  "department",
                  "Filter by Department",
                  departmentOptions,
                  selectedDepartment,
                  (val) => dispatch(setSelectedDepartment(val))
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons name="grid-outline" size={15} color="#64748B" />
              <Text style={styles.pillDropdownText}>{selectedDepartment}</Text>
              <Ionicons name="chevron-down" size={13} color="#64748B" />
            </TouchableOpacity>

            {/* Statuses Dropdown */}
            <TouchableOpacity
              style={styles.pillDropdown}
              onPress={() =>
                openPicker(
                  "status",
                  "Filter by Status",
                  statusOptions,
                  selectedStatus,
                  (val) => dispatch(setSelectedStatus(val))
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={15}
                color="#64748B"
              />
              <Text style={styles.pillDropdownText}>{selectedStatus}</Text>
              <Ionicons name="chevron-down" size={13} color="#64748B" />
            </TouchableOpacity>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => dispatch(resetFilters())}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={15} color="#64748B" />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Attendance Cards List (Mobile-Optimized, Expandable on Press, No Horizontal Scroll) */}
        <View style={styles.attendanceCardsList}>
          {filteredRecords.map((item) => {
            const isExpanded = expandedRecordId === item.id;
            const isPresent = item.present > 0;

            return (
              <View key={item.id} style={styles.attendanceCard}>
                {/* Header: Click to Expand / Collapse */}
                <TouchableOpacity
                  style={styles.cardHeaderTouchable}
                  onPress={() => toggleExpandRecord(item.id)}
                  activeOpacity={0.7}
                >
                  {/* Left: Avatar Badge */}
                  <View
                    style={[
                      styles.avatarBadge,
                      { backgroundColor: item.avatarColor || "#7C3AED" },
                    ]}
                  >
                    <Text style={styles.avatarLetter}>
                      {item.avatarLetter ||
                        (item.name ? item.name[0].toUpperCase() : "R")}
                    </Text>
                  </View>

                  {/* Middle Info: Name, Emp ID & Client */}
                  <View style={styles.cardMainInfo}>
                    <Text style={styles.empCardName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.cardBadgeRow}>
                      <View style={styles.empIdPill}>
                        <Text style={styles.empIdPillText}>{item.empId}</Text>
                      </View>
                      <View style={styles.clientMiniPill}>
                        <Text style={styles.clientMiniPillText} numberOfLines={1}>
                          {item.client}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right Side: Status Badge & Chevron */}
                  <View style={styles.cardRightCol}>
                    <View
                      style={[
                        styles.statusBadgePill,
                        isPresent ? styles.presentBadgePill : styles.absentBadgePill,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isPresent ? { color: "#16A34A" } : { color: "#DC2626" },
                        ]}
                      >
                        {isPresent ? `${item.present}d Present` : "Absent"}
                      </Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#64748B"
                    />
                  </View>
                </TouchableOpacity>

                {/* Expanded Details & Actions */}
                {isExpanded && (
                  <View style={styles.cardExpandedContent}>
                    {/* Details Box */}
                    <View style={styles.detailsBox}>
                      {/* Row 1: Father Name & Month/Year */}
                      <View style={styles.detailRow}>
                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>FATHER NAME</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="person-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={1}>
                              {item.fatherName || "—"}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>MONTH / YEAR</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="calendar-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={1}>
                              {item.monthYear}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Row 2: Client Organization & Site */}
                      <View style={styles.detailRow}>
                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>CLIENT / COMPANY</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="business-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={1}>
                              {item.client}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>ASSIGNED SITE</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="location-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={1}>
                              {item.site || "Plant 1 - Manesar"}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Row 3: Attendance Breakdown Grid */}
                      <View style={styles.attendanceSummaryGrid}>
                        {/* Present */}
                        <View
                          style={[
                            styles.gridMetricBox,
                            { backgroundColor: "#F0FDF4" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.gridMetricLabel,
                              { color: "#16A34A" },
                            ]}
                          >
                            PRESENT
                          </Text>
                          <Text
                            style={[
                              styles.gridMetricValue,
                              { color: "#16A34A" },
                            ]}
                          >
                            {item.present}
                          </Text>
                        </View>

                        {/* Working Days */}
                        <View
                          style={[
                            styles.gridMetricBox,
                            { backgroundColor: "#EFF6FF" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.gridMetricLabel,
                              { color: "#2563EB" },
                            ]}
                          >
                            WORK DAYS
                          </Text>
                          <Text
                            style={[
                              styles.gridMetricValue,
                              { color: "#2563EB" },
                            ]}
                          >
                            {item.workingDays}
                          </Text>
                        </View>

                        {/* Week Off */}
                        <View
                          style={[
                            styles.gridMetricBox,
                            { backgroundColor: "#F8FAFC" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.gridMetricLabel,
                              { color: "#475569" },
                            ]}
                          >
                            WEEK OFF
                          </Text>
                          <Text
                            style={[
                              styles.gridMetricValue,
                              { color: "#334155" },
                            ]}
                          >
                            {item.weekOff}
                          </Text>
                        </View>

                        {/* Holidays */}
                        <View
                          style={[
                            styles.gridMetricBox,
                            { backgroundColor: "#FFFBEB" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.gridMetricLabel,
                              { color: "#D97706" },
                            ]}
                          >
                            HOLIDAY
                          </Text>
                          <Text
                            style={[
                              styles.gridMetricValue,
                              { color: "#D97706" },
                            ]}
                          >
                            {item.holidays}
                          </Text>
                        </View>
                      </View>

                      {/* Row 4: Leaves Breakdown (CL, SL, EL, LWP) */}
                      <View
                        style={[
                          styles.detailRow,
                          { borderBottomWidth: 0, paddingTop: 4 },
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.detailLabel}>
                            LEAVES BREAKDOWN
                          </Text>
                          <View style={styles.leavesPillRow}>
                            <View style={styles.leaveMiniPill}>
                              <Text style={styles.leaveMiniPillText}>
                                CL:{" "}
                                <Text style={styles.boldLeaveVal}>
                                  {item.cl}
                                </Text>
                              </Text>
                            </View>
                            <View style={styles.leaveMiniPill}>
                              <Text style={styles.leaveMiniPillText}>
                                SL:{" "}
                                <Text style={styles.boldLeaveVal}>
                                  {item.sl}
                                </Text>
                              </Text>
                            </View>
                            <View style={styles.leaveMiniPill}>
                              <Text style={styles.leaveMiniPillText}>
                                EL:{" "}
                                <Text style={styles.boldLeaveVal}>
                                  {item.el}
                                </Text>
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.leaveMiniPill,
                                { backgroundColor: "#FEF2F2" },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.leaveMiniPillText,
                                  { color: "#DC2626" },
                                ]}
                              >
                                LWP:{" "}
                                <Text
                                  style={[
                                    styles.boldLeaveVal,
                                    { color: "#DC2626" },
                                  ]}
                                >
                                  {item.lwp}
                                </Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Dedicated Action Buttons Row */}
                    <View style={styles.cardActionsRow}>
                      {/* View Details Modal */}
                      <TouchableOpacity
                        style={styles.cardActionBtn}
                        onPress={() => setViewingRecord(item)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="eye-outline"
                          size={13}
                          color="#334155"
                        />
                        <Text style={styles.cardActionBtnText}>View</Text>
                      </TouchableOpacity>

                      {/* Edit Record */}
                      <TouchableOpacity
                        style={[styles.cardActionBtn, styles.editActionBtn]}
                        onPress={() => setEditingRecord(item)}
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

                      {/* Quick Toggle Present/Absent */}
                      <TouchableOpacity
                        style={[
                          styles.cardActionBtn,
                          isPresent
                            ? styles.absentActionBtn
                            : styles.presentActionBtn,
                        ]}
                        onPress={() => {
                          dispatch(
                            editAttendanceRecord({
                              id: item.id,
                              present: isPresent ? 0 : 1,
                              workingDays: isPresent ? 0 : 1,
                            })
                          );
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={
                            isPresent
                              ? "close-circle-outline"
                              : "checkmark-circle-outline"
                          }
                          size={13}
                          color={isPresent ? "#D97706" : "#16A34A"}
                        />
                        <Text
                          style={[
                            styles.cardActionBtnText,
                            { color: isPresent ? "#D97706" : "#16A34A" },
                          ]}
                        >
                          {isPresent ? "Mark Absent" : "Mark Present"}
                        </Text>
                      </TouchableOpacity>

                      {/* Delete Record */}
                      <TouchableOpacity
                        style={[styles.cardActionBtn, styles.deleteActionBtn]}
                        onPress={() => {
                          Alert.alert(
                            "Delete Record",
                            `Are you sure you want to delete attendance record for ${item.name} (${item.empId})?`,
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Delete",
                                style: "destructive",
                                onPress: () =>
                                  dispatch(deleteAttendanceRecord(item.id)),
                              },
                            ]
                          );
                        }}
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

          {filteredRecords.length === 0 && (
            <View style={styles.emptyTable}>
              <Ionicons name="calendar-outline" size={44} color="#CBD5E1" />
              <Text style={styles.emptyTableTitle}>
                No attendance records found
              </Text>
              <Text style={styles.emptyTableSubtitle}>
                Try adjusting your search criteria or resetting filters.
              </Text>
              <TouchableOpacity
                style={styles.emptyResetBtn}
                onPress={() => dispatch(resetFilters())}
              >
                <Text style={styles.emptyResetBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Menu Popover (matching screenshot's popover menu) */}
      <Modal
        visible={!!activeMenuRecord}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveMenuRecord(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveMenuRecord(null)}
        >
          <View style={styles.popoverCard}>
            <View style={styles.popoverHeader}>
              <Text style={styles.popoverEmpName} numberOfLines={1}>
                {activeMenuRecord?.name}
              </Text>
              <Text style={styles.popoverEmpId}>
                {activeMenuRecord?.empId} • {activeMenuRecord?.monthYear}
              </Text>
            </View>

            {/* View Details */}
            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => {
                const rec = activeMenuRecord;
                setActiveMenuRecord(null);
                setViewingRecord(rec);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="eye-outline" size={18} color="#475569" />
              <Text style={styles.popoverItemText}>View Details</Text>
            </TouchableOpacity>

            {/* Edit Attendance */}
            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => {
                const rec = activeMenuRecord;
                setActiveMenuRecord(null);
                setEditingRecord(rec);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={18} color="#475569" />
              <Text style={styles.popoverItemText}>Edit Attendance</Text>
            </TouchableOpacity>

            {/* Delete Attendance */}
            <TouchableOpacity
              style={[styles.popoverItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                const rec = activeMenuRecord;
                setActiveMenuRecord(null);
                Alert.alert(
                  "Delete Attendance Record",
                  `Are you sure you want to delete attendance record for ${rec.name} (${rec.empId})?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        dispatch(deleteAttendanceRecord(rec.id));
                        Alert.alert("Deleted", "Record removed successfully.");
                      },
                    },
                  ]
                );
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
              <Text style={[styles.popoverItemText, { color: "#DC2626" }]}>
                Delete Attendance
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* View Details Modal */}
      <Modal
        visible={!!viewingRecord}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setViewingRecord(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.detailModalCard}>
            <View style={styles.detailModalHeader}>
              <View style={styles.detailModalHeaderLeft}>
                <View
                  style={[
                    styles.avatarBadge,
                    {
                      backgroundColor:
                        viewingRecord?.avatarColor || "#7C3AED",
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                    },
                  ]}
                >
                  <Text style={[styles.avatarLetter, { fontSize: 16 }]}>
                    {viewingRecord?.avatarLetter || "R"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.detailModalTitle}>
                    {viewingRecord?.name}
                  </Text>
                  <Text style={styles.detailModalSubtitle}>
                    {viewingRecord?.empId} • {viewingRecord?.department}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setViewingRecord(null)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailModalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionHeading}>
                  EMPLOYMENT & SITE DETAILS
                </Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Father's Name</Text>
                  <Text style={styles.detailVal}>
                    {viewingRecord?.fatherName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Client / Company</Text>
                  <Text style={[styles.detailVal, { fontWeight: "700" }]}>
                    {viewingRecord?.client}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Site Location</Text>
                  <Text style={styles.detailVal}>{viewingRecord?.site}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Month / Year</Text>
                  <Text style={styles.detailVal}>
                    {viewingRecord?.monthYear}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionHeading}>
                  ATTENDANCE & LEAVE REGISTER
                </Text>
                <View style={styles.statGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>PRESENT</Text>
                    <Text style={[styles.statBoxVal, { color: "#16A34A" }]}>
                      {viewingRecord?.present}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>WEEK OFF</Text>
                    <Text style={[styles.statBoxVal, { color: "#2563EB" }]}>
                      {viewingRecord?.weekOff}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>HOLIDAYS</Text>
                    <Text style={[styles.statBoxVal, { color: "#D97706" }]}>
                      {viewingRecord?.holidays}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>WORKING DAYS</Text>
                    <Text style={[styles.statBoxVal, { color: "#166534" }]}>
                      {viewingRecord?.workingDays} Days
                    </Text>
                  </View>
                </View>

                <View style={[styles.statGrid, { marginTop: 10 }]}>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>CASUAL LEAVE (CL)</Text>
                    <Text style={[styles.statBoxVal, { color: "#9333EA" }]}>
                      {viewingRecord?.cl}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>SICK LEAVE (SL)</Text>
                    <Text style={[styles.statBoxVal, { color: "#0284C7" }]}>
                      {viewingRecord?.sl}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>EARNED LEAVE (EL)</Text>
                    <Text style={[styles.statBoxVal, { color: "#0D9488" }]}>
                      {viewingRecord?.el}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>LWP</Text>
                    <Text style={[styles.statBoxVal, { color: "#DC2626" }]}>
                      {viewingRecord?.lwp}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.detailModalFooter}>
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => setViewingRecord(null)}
              >
                <Text style={styles.modalPrimaryBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Attendance Record Modal */}
      {editingRecord && (
        <EditAttendanceModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={(updated) => {
            dispatch(editAttendanceRecord(updated));
            setEditingRecord(null);
            Alert.alert("Updated", "Attendance record updated successfully.");
          }}
        />
      )}

      {/* Add Attendance Record Modal */}
      {isAddModalOpen && (
        <AddAttendanceModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(newRec) => {
            dispatch(addAttendanceRecord(newRec));
            setIsAddModalOpen(false);
            Alert.alert("Created", "Attendance entry logged successfully.");
          }}
        />
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

// Sub-component: Edit Modal
function EditAttendanceModal({ record, onClose, onSave }) {
  const [present, setPresent] = useState(String(record.present || 0));
  const [weekOff, setWeekOff] = useState(String(record.weekOff || 0));
  const [holidays, setHolidays] = useState(String(record.holidays || 0));
  const [cl, setCl] = useState(String(record.cl || 0));
  const [sl, setSl] = useState(String(record.sl || 0));
  const [el, setEl] = useState(String(record.el || 0));
  const [lwp, setLwp] = useState(String(record.lwp || 0));
  const [workingDays, setWorkingDays] = useState(
    String(record.workingDays || 1)
  );

  const handleSave = () => {
    onSave({
      ...record,
      present: Number(present) || 0,
      weekOff: Number(weekOff) || 0,
      holidays: Number(holidays) || 0,
      cl: Number(cl) || 0,
      sl: Number(sl) || 0,
      el: Number(el) || 0,
      lwp: Number(lwp) || 0,
      workingDays: Number(workingDays) || 1,
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
            <Text style={styles.formModalTitle}>Edit Attendance</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.formSubTitle}>
            {record.name} ({record.empId}) • {record.monthYear}
          </Text>

          <ScrollView style={styles.formModalBody}>
            <View style={styles.formRow2}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Present Days</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={present}
                  onChangeText={setPresent}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Week Off</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={weekOff}
                  onChangeText={setWeekOff}
                />
              </View>
            </View>

            <View style={styles.formRow2}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Holidays</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={holidays}
                  onChangeText={setHolidays}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Working Days</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={workingDays}
                  onChangeText={setWorkingDays}
                />
              </View>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 10 }]}>
              Leaves (CL, SL, EL, LWP)
            </Text>
            <View style={styles.formRow4}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabelSmall}>CL</Text>
                <TextInput
                  style={styles.fieldInputSmall}
                  keyboardType="numeric"
                  value={cl}
                  onChangeText={setCl}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabelSmall}>SL</Text>
                <TextInput
                  style={styles.fieldInputSmall}
                  keyboardType="numeric"
                  value={sl}
                  onChangeText={setSl}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabelSmall}>EL</Text>
                <TextInput
                  style={styles.fieldInputSmall}
                  keyboardType="numeric"
                  value={el}
                  onChangeText={setEl}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabelSmall}>LWP</Text>
                <TextInput
                  style={styles.fieldInputSmall}
                  keyboardType="numeric"
                  value={lwp}
                  onChangeText={setLwp}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.formModalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
              <Text style={styles.submitBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Sub-component: Add Attendance Modal
function AddAttendanceModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [empId, setEmpId] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [client, setClient] = useState("RSAG Sealing Solutions Pvt Ltd");
  const [present, setPresent] = useState("1");
  const [workingDays, setWorkingDays] = useState("1");

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter the employee's name.");
      return;
    }

    onAdd({
      name: name.trim(),
      empId: empId.trim() || `RR-00${Math.floor(Math.random() * 80 + 10)}`,
      fatherName: fatherName.trim() || "—",
      client,
      present: Number(present) || 1,
      workingDays: Number(workingDays) || 1,
      weekOff: 0,
      holidays: 0,
      cl: 0,
      sl: 0,
      el: 0,
      lwp: 0,
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
            <Text style={styles.formModalTitle}>Add Daily Attendance</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formModalBody}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Employee Name *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Ramesh Chandra"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formRow2}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Employee ID</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="e.g. RR-007"
                  placeholderTextColor="#94A3B8"
                  value={empId}
                  onChangeText={setEmpId}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Father's Name</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="e.g. Mohan Chandra"
                  placeholderTextColor="#94A3B8"
                  value={fatherName}
                  onChangeText={setFatherName}
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Client / Company</Text>
              <TextInput
                style={styles.fieldInput}
                value={client}
                onChangeText={setClient}
              />
            </View>

            <View style={styles.formRow2}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Present (1/0)</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={present}
                  onChangeText={setPresent}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Working Days</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={workingDays}
                  onChangeText={setWorkingDays}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.formModalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
              <Text style={styles.submitBtnText}>Add Attendance</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    gap: 12,
    flex: 1,
  },
  drawerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addRecordBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addRecordBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  kpiRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },

  // Filters Bar Matching Screenshot
  filtersContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  filterRow1: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 10,
  },
  filterRow2: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 10,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    width: 240,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#0F172A",
    paddingVertical: 0,
  },
  pillDropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  pillDropdownTextPrimary: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  pillDropdownText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#334155",
  },
  monthStepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 4,
    gap: 4,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  stepperLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    paddingHorizontal: 4,
  },
  dateDisplayPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  dateDisplayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#334155",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  // Attendance Cards List (Mobile)
  attendanceCardsList: {
    gap: 8,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  attendanceCard: {
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
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cardMainInfo: {
    flex: 1,
    gap: 3,
  },
  empCardName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardBadgeRow: {
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
  clientMiniPill: {
    flexShrink: 1,
    backgroundColor: "#EFF6FF",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  clientMiniPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2563EB",
  },
  cardRightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  presentBadgePill: {
    backgroundColor: "#DCFCE7",
  },
  absentBadgePill: {
    backgroundColor: "#FEE2E2",
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

  /* Summary Grid */
  attendanceSummaryGrid: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  gridMetricBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  gridMetricLabel: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  gridMetricValue: {
    fontSize: 13,
    fontWeight: "800",
  },

  /* Leaves Pills Row */
  leavesPillRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  leaveMiniPill: {
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  leaveMiniPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
  },
  boldLeaveVal: {
    fontWeight: "800",
    color: "#0F172A",
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
  presentActionBtn: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  absentActionBtn: {
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
  emptyTableTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  emptyTableSubtitle: {
    fontSize: 11.5,
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

  // Popover Menu Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  popoverCard: {
    width: "82%",
    maxWidth: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  popoverHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  popoverEmpName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  popoverEmpId: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  popoverItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  // View Details Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  detailModalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "82%",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  detailModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  detailModalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailModalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  detailModalSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  detailModalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailKey: {
    fontSize: 13,
    color: "#64748B",
  },
  detailVal: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  statGrid: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  statBoxLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
    textAlign: "center",
  },
  statBoxVal: {
    fontSize: 15,
    fontWeight: "800",
  },
  detailModalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  modalPrimaryBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalPrimaryBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Form Modal Styles (Add / Edit)
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
    paddingBottom: 8,
  },
  formModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  formSubTitle: {
    fontSize: 12,
    color: "#64748B",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  formModalBody: {
    paddingHorizontal: 20,
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
  fieldLabelSmall: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
    textAlign: "center",
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
  fieldInputSmall: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  formRow2: {
    flexDirection: "row",
    gap: 12,
  },
  formRow4: {
    flexDirection: "row",
    gap: 8,
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
  },
  selectedPickerOptionText: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
