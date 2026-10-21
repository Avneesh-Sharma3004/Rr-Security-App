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
  setEmployeeSearchQuery,
  setStatusTab,
  setCompanyFilter,
  setDepartmentFilter,
  setDesignationFilter,
  setStatusFilter,
  resetEmployeeFilters,
  addEmployee,
  editEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
} from "../../store/slices/employeesSlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";

export default function AdminEmployeesScreen() {
  const dispatch = useDispatch();
  const {
    employees,
    searchQuery,
    statusTab,
    companyFilter,
    departmentFilter,
    designationFilter,
    statusFilter,
  } = useSelector((state) => state.employees);

  // Modals & Popovers
  const [activeMenuEmployee, setActiveMenuEmployee] = useState(null);
  const [profileModalEmp, setProfileModalEmp] = useState(null);
  const [credentialsModalEmp, setCredentialsModalEmp] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activePicker, setActivePicker] = useState(null); // 'company' | 'department' | 'designation' | 'status'
  const [expandedEmpId, setExpandedEmpId] = useState(null);

  const toggleExpandEmp = (id) => {
    setExpandedEmpId((prev) => (prev === id ? null : id));
  };

  // Add / Edit Form State
  const [editingEmpId, setEditingEmpId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formClient, setFormClient] = useState("RR Security & Facilities");
  const [formDepartment, setFormDepartment] = useState("Security");
  const [formDesignation, setFormDesignation] = useState("Security Guard");
  const [formContact, setFormContact] = useState("");
  const [formSalary, setFormSalary] = useState("18500");

  // KPI Calculations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter((e) => e.status === "Inactive").length;
  const uniqueCompanies = new Set(employees.map((e) => e.client)).size;

  // Filter Dropdown Options
  const companyOptions = [
    "All Companies",
    "RR Security & Facilities",
    "Petal Commercial Pvt Ltd",
    "RSAG Sealing Solutions Pvt Ltd",
  ];

  const departmentOptions = [
    "All Departments",
    "Security",
    "Worker",
    "Office Staff",
  ];

  const designationOptions = [
    "All Designations",
    "Security Guard",
    "Security Supervisor",
    "Helper",
    "Office Asst",
  ];

  const statusOptions = ["All Status", "Active", "Inactive"];

  // Filtering Logic
  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      emp.name.toLowerCase().includes(q) ||
      emp.empId.toLowerCase().includes(q) ||
      emp.contact.toLowerCase().includes(q) ||
      emp.client.toLowerCase().includes(q);

    // Filter Tab (All / Active / Inactive)
    const matchesTab =
      statusTab === "All" || emp.status.toLowerCase() === statusTab.toLowerCase();

    // Dropdown Filters
    const matchesCompany =
      companyFilter === "All Companies" || emp.client === companyFilter;

    const matchesDept =
      departmentFilter === "All Departments" || emp.department === departmentFilter;

    const matchesDesignation =
      designationFilter === "All Designations" || emp.designation === designationFilter;

    const matchesStatus =
      statusFilter === "All Status" || emp.status === statusFilter;

    return (
      matchesSearch &&
      matchesTab &&
      matchesCompany &&
      matchesDept &&
      matchesDesignation &&
      matchesStatus
    );
  });

  const handleOpenAddModal = (empToEdit = null) => {
    if (empToEdit) {
      setEditingEmpId(empToEdit.id);
      setFormName(empToEdit.name);
      setFormClient(empToEdit.client);
      setFormDepartment(empToEdit.department);
      setFormDesignation(empToEdit.designation);
      setFormContact(empToEdit.contact);
      setFormSalary(empToEdit.salary ? empToEdit.salary.replace(/[^0-9]/g, "") : "18500");
    } else {
      setEditingEmpId(null);
      setFormName("");
      setFormClient("RR Security & Facilities");
      setFormDepartment("Security");
      setFormDesignation("Security Guard");
      setFormContact("");
      setFormSalary("18500");
    }
    setIsAddModalOpen(true);
  };

  const handleSaveEmployee = () => {
    if (!formName.trim() || !formContact.trim()) {
      Alert.alert("Validation", "Please enter Employee Name and Contact Number.");
      return;
    }

    if (editingEmpId) {
      dispatch(
        editEmployee({
          id: editingEmpId,
          name: formName.trim(),
          client: formClient,
          department: formDepartment,
          designation: formDesignation,
          contact: formContact.trim(),
          salary: `₹${parseInt(formSalary, 10).toLocaleString("en-IN")}`,
        })
      );
      Alert.alert("Success", "Employee details updated successfully!");
    } else {
      dispatch(
        addEmployee({
          name: formName.trim(),
          client: formClient,
          department: formDepartment,
          designation: formDesignation,
          contact: formContact.trim(),
          salary: `₹${parseInt(formSalary, 10).toLocaleString("en-IN")}`,
        })
      );
      Alert.alert("Success", "New employee added to the workforce!");
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteEmployee = (emp) => {
    Alert.alert(
      "Delete Employee",
      `Are you sure you want to delete ${emp.name} (${emp.empId})?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteEmployee(emp.id));
            setActiveMenuEmployee(null);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row with Title, Subtitle, Import & + Add Employee Buttons */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeftCol}>
            <View style={styles.titleRow}>
              {/* Drawer Menu Button */}
              <TouchableOpacity
                style={styles.drawerIconBtn}
                onPress={() => dispatch(toggleDrawer())}
                activeOpacity={0.7}
              >
                <Ionicons name="menu" size={23} color="#0F172A" />
              </TouchableOpacity>

              <Text style={styles.pageTitle}>Employees</Text>
            </View>

            <Text style={styles.pageSubtitle}>
              Manage employees across your client companies for RR Security & Facilities.
            </Text>
          </View>

          {/* Action Buttons Top Right */}
          <View style={styles.topActionsRow}>
            {/* Import Button */}
            <TouchableOpacity
              style={styles.importBtn}
              onPress={() =>
                Alert.alert("Import Workforce", "CSV / Excel upload dialog opened.")
              }
              activeOpacity={0.7}
            >
              <Ionicons name="cloud-upload-outline" size={16} color="#334155" />
              <Text style={styles.importBtnText}>Import</Text>
            </TouchableOpacity>

            {/* + Add Employee Button */}
            <TouchableOpacity
              style={styles.addEmployeeBtn}
              onPress={() => handleOpenAddModal(null)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={17} color="#FFFFFF" />
              <Text style={styles.addEmployeeBtnText}>Add Employee</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4 Stats KPI Cards Row */}
        <View style={styles.statsRow}>
          {/* Total Employees */}
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="people" size={20} color="#2563EB" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total Employees</Text>
              <Text style={styles.statValue}>{totalEmployees}</Text>
            </View>
          </View>

          {/* Active Employees */}
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="person" size={20} color="#16A34A" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Active Employees</Text>
              <Text style={styles.statValue}>{activeEmployees}</Text>
            </View>
          </View>

          {/* Inactive Employees */}
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="person-remove" size={20} color="#DC2626" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Inactive Employees</Text>
              <Text style={styles.statValue}>{inactiveEmployees}</Text>
            </View>
          </View>

          {/* Companies Covered */}
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#FAF5FF" }]}>
              <Ionicons name="business" size={20} color="#9333EA" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Companies Covered</Text>
              <Text style={styles.statValue}>{uniqueCompanies}</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Status Filter Tabs (All, Active, Inactive) */}
        <View style={styles.enhancedTabsContainer}>
          {[
            {
              key: "All",
              label: "All Employees",
              count: totalEmployees,
              dotColor: "#2563EB",
              badgeBg: "#EFF6FF",
              badgeColor: "#2563EB",
            },
            {
              key: "Active",
              label: "Active",
              count: activeEmployees,
              dotColor: "#16A34A",
              badgeBg: "#DCFCE7",
              badgeColor: "#16A34A",
            },
            {
              key: "Inactive",
              label: "Inactive",
              count: inactiveEmployees,
              dotColor: "#DC2626",
              badgeBg: "#FEE2E2",
              badgeColor: "#DC2626",
            },
          ].map((tab) => {
            const isActive = statusTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.enhancedTabBtn,
                  isActive && styles.activeEnhancedTabBtn,
                ]}
                onPress={() => dispatch(setStatusTab(tab.key))}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.tabStatusDot,
                    { backgroundColor: tab.dotColor },
                  ]}
                />
                <Text
                  style={[
                    styles.enhancedTabBtnText,
                    isActive && styles.activeEnhancedTabBtnText,
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.enhancedCountBadge,
                    isActive
                      ? { backgroundColor: tab.badgeBg }
                      : { backgroundColor: "#E2E8F0" },
                  ]}
                >
                  <Text
                    style={[
                      styles.enhancedCountText,
                      isActive
                        ? { color: tab.badgeColor, fontWeight: "700" }
                        : { color: "#64748B" },
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search & Filter Dropdowns Card */}
        <View style={styles.filterCard}>
          {/* Search Box */}
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={17} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employee, contact..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={(txt) => dispatch(setEmployeeSearchQuery(txt))}
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => dispatch(setEmployeeSearchQuery(""))}
              >
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* 4 Dropdown Filters + Reset */}
          <View style={styles.dropdownsGrid}>
            {/* All Companies */}
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setActivePicker("company")}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownBtnText} numberOfLines={1}>
                {companyFilter}
              </Text>
              <Ionicons name="chevron-down" size={15} color="#64748B" />
            </TouchableOpacity>

            {/* All Departments */}
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setActivePicker("department")}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownBtnText} numberOfLines={1}>
                {departmentFilter}
              </Text>
              <Ionicons name="chevron-down" size={15} color="#64748B" />
            </TouchableOpacity>

            {/* All Designations */}
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setActivePicker("designation")}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownBtnText} numberOfLines={1}>
                {designationFilter}
              </Text>
              <Ionicons name="chevron-down" size={15} color="#64748B" />
            </TouchableOpacity>

            {/* All Status */}
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setActivePicker("status")}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownBtnText} numberOfLines={1}>
                {statusFilter}
              </Text>
              <Ionicons name="chevron-down" size={15} color="#64748B" />
            </TouchableOpacity>

            {/* Reset Filters */}
            <TouchableOpacity
              style={styles.resetFiltersBtn}
              onPress={() => dispatch(resetEmployeeFilters())}
              activeOpacity={0.7}
            >
              <Ionicons name="reload" size={14} color="#475569" />
              <Text style={styles.resetFiltersBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Employee Cards List (Mobile-Optimized, Expandable on Press, No Horizontal Scroll) */}
        <View style={styles.empCardsList}>
          {filteredEmployees.map((emp) => {
            const isExpanded = expandedEmpId === emp.id;
            const isActive = emp.status === "Active";
            const initials = emp.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <View key={emp.id} style={styles.empCard}>
                {/* Header: Click to Expand / Collapse */}
                <TouchableOpacity
                  style={styles.empCardHeaderTouchable}
                  onPress={() => toggleExpandEmp(emp.id)}
                  activeOpacity={0.7}
                >
                  {/* Left: Avatar with initials */}
                  <View
                    style={[
                      styles.avatarCircle,
                      emp.department === "Security"
                        ? { backgroundColor: "#EFF6FF", borderColor: "#DBEAFE" }
                        : emp.department === "Worker"
                        ? { backgroundColor: "#FAF5FF", borderColor: "#F3E8FF" }
                        : { backgroundColor: "#F0FDF4", borderColor: "#DCFCE7" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        emp.department === "Security"
                          ? { color: "#2563EB" }
                          : emp.department === "Worker"
                          ? { color: "#9333EA" }
                          : { color: "#16A34A" },
                      ]}
                    >
                      {initials}
                    </Text>
                  </View>

                  {/* Middle Info: Name, Emp ID & Designation */}
                  <View style={styles.empMainInfo}>
                    <Text style={styles.empCardName} numberOfLines={1}>
                      {emp.name}
                    </Text>
                    <View style={styles.empBadgeRow}>
                      <View style={styles.empIdPill}>
                        <Text style={styles.empIdPillText}>{emp.empId}</Text>
                      </View>
                      <View style={styles.designationPill}>
                        <Text
                          style={styles.designationPillText}
                          numberOfLines={1}
                        >
                          {emp.designation}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right Side: Status Badge & Chevron */}
                  <View style={styles.empRightCol}>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: isActive ? "#DCFCE7" : "#FEE2E2",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          { color: isActive ? "#16A34A" : "#DC2626" },
                        ]}
                      >
                        {emp.status}
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
                  <View style={styles.empCardExpandedContent}>
                    {/* Details Box */}
                    <View style={styles.empDetailsBox}>
                      {/* Row 1: Client & Department */}
                      <View style={styles.detailRow}>
                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>DEPLOYED CLIENT</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="business-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={1}>
                              {emp.client}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>DEPARTMENT</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="briefcase-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={1}>
                              {emp.department}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Row 2: Contact & Monthly Salary */}
                      <View style={styles.detailRow}>
                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>CONTACT</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="call-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue} numberOfLines={1}>
                              {emp.contact}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.detailItemHalf}>
                          <Text style={styles.detailLabel}>MONTHLY SALARY</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="cash-outline"
                              size={12}
                              color="#16A34A"
                            />
                            <Text
                              style={[
                                styles.detailValue,
                                { color: "#16A34A", fontWeight: "700" },
                              ]}
                            >
                              {emp.salary || "₹18,500"}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Row 3: Joining Date */}
                      <View
                        style={[styles.detailRow, { borderBottomWidth: 0 }]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.detailLabel}>JOINING DATE</Text>
                          <View style={styles.detailValWithIcon}>
                            <Ionicons
                              name="calendar-outline"
                              size={12}
                              color="#64748B"
                            />
                            <Text style={styles.detailValue}>
                              {emp.joiningDate || "15 Sep 2026"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Dedicated Action Buttons Row */}
                    <View style={styles.cardActionsRow}>
                      {/* View Profile */}
                      <TouchableOpacity
                        style={styles.cardActionBtn}
                        onPress={() => setProfileModalEmp(emp)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="person-outline"
                          size={13}
                          color="#334155"
                        />
                        <Text style={styles.cardActionBtnText}>Profile</Text>
                      </TouchableOpacity>

                      {/* Edit */}
                      <TouchableOpacity
                        style={[styles.cardActionBtn, styles.editActionBtn]}
                        onPress={() => handleOpenAddModal(emp)}
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
                        onPress={() => setCredentialsModalEmp(emp)}
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

                      {/* Toggle Status (Disable / Enable) */}
                      <TouchableOpacity
                        style={[
                          styles.cardActionBtn,
                          isActive
                            ? styles.deactivateActionBtn
                            : styles.activateActionBtn,
                        ]}
                        onPress={() => dispatch(toggleEmployeeStatus(emp.id))}
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
                        onPress={() => handleDeleteEmployee(emp)}
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

          {filteredEmployees.length === 0 && (
            <View style={styles.emptyTable}>
              <Ionicons name="people-outline" size={40} color="#CBD5E1" />
              <Text style={styles.emptyTableText}>
                No employees found matching filter criteria.
              </Text>
              <TouchableOpacity
                style={styles.emptyResetBtn}
                onPress={() => dispatch(resetEmployeeFilters())}
              >
                <Text style={styles.emptyResetBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Popover Menu (Matching Screenshot) */}
      {activeMenuEmployee && (
        <Modal
          visible={!!activeMenuEmployee}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveMenuEmployee(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setActiveMenuEmployee(null)}
          >
            <Pressable
              style={styles.actionMenuCard}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.menuHeader}>
                <Text style={styles.menuEmpName} numberOfLines={1}>
                  {activeMenuEmployee.name}
                </Text>
                <Text style={styles.menuEmpSub}>
                  {activeMenuEmployee.empId} • {activeMenuEmployee.designation}
                </Text>
              </View>

              {/* View Profile */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  const emp = activeMenuEmployee;
                  setActiveMenuEmployee(null);
                  setProfileModalEmp(emp);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="eye-outline" size={17} color="#475569" />
                <Text style={styles.menuItemText}>View Profile</Text>
              </TouchableOpacity>

              {/* Edit Employee */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  const emp = activeMenuEmployee;
                  setActiveMenuEmployee(null);
                  handleOpenAddModal(emp);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil-outline" size={17} color="#475569" />
                <Text style={styles.menuItemText}>Edit Employee</Text>
              </TouchableOpacity>

              {/* Credentials */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  const emp = activeMenuEmployee;
                  setActiveMenuEmployee(null);
                  setCredentialsModalEmp(emp);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="key-outline" size={17} color="#475569" />
                <Text style={styles.menuItemText}>Credentials</Text>
              </TouchableOpacity>

              {/* Transfer Company/Site */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  Alert.alert(
                    "Transfer Company / Site",
                    `Initiate deployment transfer for ${activeMenuEmployee.name} to another client site.`
                  );
                  setActiveMenuEmployee(null);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="swap-horizontal-outline" size={17} color="#475569" />
                <Text style={styles.menuItemText}>Transfer Company/Site</Text>
              </TouchableOpacity>

              {/* Payslip */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  Alert.alert(
                    "Salary Payslip",
                    `Opening October 2026 Salary Slip for ${activeMenuEmployee.name}.`
                  );
                  setActiveMenuEmployee(null);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={17} color="#475569" />
                <Text style={styles.menuItemText}>Payslip</Text>
              </TouchableOpacity>

              {/* Download Profile */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  Alert.alert(
                    "Download Profile",
                    `Downloading full employee service dossier for ${activeMenuEmployee.name}.`
                  );
                  setActiveMenuEmployee(null);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={17} color="#475569" />
                <Text style={styles.menuItemText}>Download Profile</Text>
              </TouchableOpacity>

              {/* Delete Employee */}
              <TouchableOpacity
                style={[styles.menuItem, styles.deleteMenuItem]}
                onPress={() => handleDeleteEmployee(activeMenuEmployee)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={17} color="#DC2626" />
                <Text style={styles.deleteMenuText}>Delete Employee</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* Filter Dropdown Picker Modal */}
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
                {activePicker === "company"
                  ? "Select Company"
                  : activePicker === "department"
                  ? "Select Department"
                  : activePicker === "designation"
                  ? "Select Designation"
                  : "Select Status"}
              </Text>

              {(activePicker === "company"
                ? companyOptions
                : activePicker === "department"
                ? departmentOptions
                : activePicker === "designation"
                ? designationOptions
                : statusOptions
              ).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.pickerOptionItem}
                  onPress={() => {
                    if (activePicker === "company") {
                      dispatch(setCompanyFilter(opt));
                    } else if (activePicker === "department") {
                      dispatch(setDepartmentFilter(opt));
                    } else if (activePicker === "designation") {
                      dispatch(setDesignationFilter(opt));
                    } else {
                      dispatch(setStatusFilter(opt));
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

      {/* Profile Modal */}
      {profileModalEmp && (
        <Modal
          visible={!!profileModalEmp}
          transparent
          animationType="fade"
          onRequestClose={() => setProfileModalEmp(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setProfileModalEmp(null)}
          >
            <View style={styles.profileCard}>
              <View style={styles.profileHeaderRow}>
                <Text style={styles.profileHeaderTitle}>Employee Dossier</Text>
                <TouchableOpacity onPress={() => setProfileModalEmp(null)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.profileEmpName}>{profileModalEmp.name}</Text>
              <Text style={styles.profileEmpSub}>
                {profileModalEmp.empId} • {profileModalEmp.status}
              </Text>

              <View style={styles.profileGrid}>
                <View style={styles.profileGridRow}>
                  <Text style={styles.profileGridLabel}>CLIENT SITE</Text>
                  <Text style={styles.profileGridVal}>{profileModalEmp.client}</Text>
                </View>
                <View style={styles.profileGridRow}>
                  <Text style={styles.profileGridLabel}>DEPARTMENT</Text>
                  <Text style={styles.profileGridVal}>
                    {profileModalEmp.department}
                  </Text>
                </View>
                <View style={styles.profileGridRow}>
                  <Text style={styles.profileGridLabel}>DESIGNATION</Text>
                  <Text style={styles.profileGridVal}>
                    {profileModalEmp.designation}
                  </Text>
                </View>
                <View style={styles.profileGridRow}>
                  <Text style={styles.profileGridLabel}>CONTACT</Text>
                  <Text style={styles.profileGridVal}>{profileModalEmp.contact}</Text>
                </View>
                <View style={styles.profileGridRow}>
                  <Text style={styles.profileGridLabel}>MONTHLY WAGE</Text>
                  <Text style={[styles.profileGridVal, { color: "#2563EB" }]}>
                    {profileModalEmp.salary}
                  </Text>
                </View>
                <View style={styles.profileGridRow}>
                  <Text style={styles.profileGridLabel}>JOINING DATE</Text>
                  <Text style={styles.profileGridVal}>
                    {profileModalEmp.joiningDate}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setProfileModalEmp(null)}
              >
                <Text style={styles.closeModalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Credentials Modal */}
      {credentialsModalEmp && (
        <Modal
          visible={!!credentialsModalEmp}
          transparent
          animationType="fade"
          onRequestClose={() => setCredentialsModalEmp(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setCredentialsModalEmp(null)}
          >
            <View style={styles.profileCard}>
              <View style={styles.profileHeaderRow}>
                <Text style={styles.profileHeaderTitle}>Employee Credentials</Text>
                <TouchableOpacity onPress={() => setCredentialsModalEmp(null)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.profileEmpName}>{credentialsModalEmp.name}</Text>

              <View style={styles.credBox}>
                <Text style={styles.credLabel}>EMPLOYEE PORTAL ID</Text>
                <Text style={styles.credVal}>
                  {credentialsModalEmp.empId.toLowerCase()}@rrsecurity.com
                </Text>

                <Text style={[styles.credLabel, { marginTop: 12 }]}>
                  DEFAULT BIOMETRIC PIN
                </Text>
                <Text style={styles.credVal}>123456</Text>

                <Text style={[styles.credLabel, { marginTop: 12 }]}>
                  MOBILE LOGIN NUMBER
                </Text>
                <Text style={styles.credVal}>{credentialsModalEmp.contact}</Text>
              </View>

              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setCredentialsModalEmp(null)}
              >
                <Text style={styles.closeModalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Add / Edit Employee Modal */}
      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.formModalBackdrop}>
          <View style={styles.formCard}>
            <View style={styles.formHeaderRow}>
              <Text style={styles.formHeaderTitle}>
                {editingEmpId ? "Edit Employee" : "Onboard Employee"}
              </Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll}>
              <Text style={styles.fieldLabel}>Employee Full Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Aman Sharma"
                value={formName}
                onChangeText={setFormName}
              />

              <Text style={styles.fieldLabel}>Client / Deployment Company *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. RR Security & Facilities"
                value={formClient}
                onChangeText={setFormClient}
              />

              <Text style={styles.fieldLabel}>Department</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Security / Worker / Office Staff"
                value={formDepartment}
                onChangeText={setFormDepartment}
              />

              <Text style={styles.fieldLabel}>Designation</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Security Guard / Supervisor / Helper"
                value={formDesignation}
                onChangeText={setFormDesignation}
              />

              <Text style={styles.fieldLabel}>Contact Phone Number *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 8767654329"
                keyboardType="phone-pad"
                value={formContact}
                onChangeText={setFormContact}
              />

              <Text style={styles.fieldLabel}>Monthly Salary (₹)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 18500"
                keyboardType="numeric"
                value={formSalary}
                onChangeText={setFormSalary}
              />

              <TouchableOpacity
                style={styles.saveEmpBtn}
                onPress={handleSaveEmployee}
                activeOpacity={0.8}
              >
                <Text style={styles.saveEmpBtnText}>
                  {editingEmpId ? "Update Employee" : "Save Employee"}
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

  /* Header Row */
  headerRow: {
    marginBottom: 16,
  },
  headerLeftCol: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    lineHeight: 18,
  },
  topActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  importBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
  },
  importBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  addEmployeeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addEmployeeBtnText: {
    fontSize: 13,
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

  /* Enhanced Status Filter Tabs (Modern Segmented Pill Design) */
  enhancedTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  enhancedTabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 8,
    gap: 6,
  },
  activeEnhancedTabBtn: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  enhancedTabBtnText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#64748B",
  },
  activeEnhancedTabBtnText: {
    color: "#0F172A",
    fontWeight: "700",
  },
  enhancedCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  enhancedCountText: {
    fontSize: 10.5,
    fontWeight: "700",
  },

  /* Filter Card */
  filterCard: {
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
  dropdownsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
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
    minWidth: 120,
    gap: 6,
  },
  dropdownBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  resetFiltersBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  resetFiltersBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  /* Employee Cards List (Mobile) */
  empCardsList: {
    gap: 8,
    marginBottom: 20,
  },
  empCard: {
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
  empCardHeaderTouchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
  },
  empMainInfo: {
    flex: 1,
    gap: 3,
  },
  empCardName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  empBadgeRow: {
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
  designationPill: {
    backgroundColor: "#EFF6FF",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  designationPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2563EB",
  },
  empRightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: "700",
  },

  /* Expanded Content */
  empCardExpandedContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FAFAFA",
  },
  empDetailsBox: {
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

  /* Action Menu Popover */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionMenuCard: {
    width: 235,
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
  menuEmpName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  menuEmpSub: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
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

  /* Picker Modal */
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

  /* Profile Card Modal */
  profileCard: {
    width: "88%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  profileHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  profileEmpName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  profileEmpSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 12,
  },
  profileGrid: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },
  profileGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileGridLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  profileGridVal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
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

  /* Credential Box */
  credBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  credLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  credVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },

  /* Form Modal */
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
  saveEmpBtn: {
    backgroundColor: "#2563EB",
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  saveEmpBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
