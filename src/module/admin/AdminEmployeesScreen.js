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
  setEmployeeSearchQuery,
  setEmployeeDepartmentFilter,
  addEmployee,
  toggleEmployeeStatus,
} from "../../store/slices/employeesSlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";

export default function AdminEmployeesScreen() {
  const dispatch = useDispatch();
  const { employees, searchQuery, selectedDepartment } = useSelector(
    (state) => state.employees
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Security Guard");
  const [department, setDepartment] = useState("Security");
  const [site, setSite] = useState("DLF CyberCity Hub");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");

  const deptFilters = ["All", "Security", "Facility & Housekeeping"];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.site.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDepartment === "All" || emp.department === selectedDepartment;

    return matchesSearch && matchesDept;
  });

  const handleSaveEmployee = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Validation", "Please provide Employee Name and Phone Number.");
      return;
    }

    dispatch(
      addEmployee({
        name: name.trim(),
        role: role.trim() || "Security Guard",
        department: department.trim() || "Security",
        site: site.trim() || "Main Site",
        phone: phone.trim(),
        gender,
        shift: "Day Shift",
        joiningDate: "19 Oct 2026",
      })
    );

    setName("");
    setPhone("");
    setIsAddModalOpen(false);
    Alert.alert("Success", "New employee added to the roster!");
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
            <Text style={styles.title}>Workforce & Employees</Text>
            <Text style={styles.subtitle}>
              {employees.length} Guards & staff members
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="person-add" size={17} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Employee</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          placeholder="Search by name, emp code, site..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={(txt) => dispatch(setEmployeeSearchQuery(txt))}
          style={styles.searchInput}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => dispatch(setEmployeeSearchQuery(""))}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Department Filter Tabs */}
      <View style={styles.tabRow}>
        {deptFilters.map((dept) => {
          const isActive = selectedDepartment === dept;
          return (
            <TouchableOpacity
              key={dept}
              style={[styles.filterTab, isActive && styles.activeFilterTab]}
              onPress={() => dispatch(setEmployeeDepartmentFilter(dept))}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && styles.activeFilterTabText,
                ]}
              >
                {dept}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Employee List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEmployees.map((emp) => {
          const initials = emp.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          const isActive = emp.status === "Active";

          return (
            <View key={emp.id} style={styles.empCard}>
              <View style={styles.cardHeader}>
                {/* Avatar with Initials */}
                <View
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: emp.avatarBg || "#2563EB" },
                  ]}
                >
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>

                {/* Details */}
                <View style={styles.empDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.empName}>{emp.name}</Text>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: isActive ? "#16A34A" : "#EF4444" },
                      ]}
                    />
                  </View>
                  <Text style={styles.empRole}>{emp.role}</Text>
                  <Text style={styles.empCode}>{emp.empCode}</Text>
                </View>

                {/* Gender Badge */}
                <View style={styles.genderBadge}>
                  <Ionicons
                    name={emp.gender === "Female" ? "female" : "male"}
                    size={14}
                    color={emp.gender === "Female" ? "#EC4899" : "#0284C7"}
                  />
                  <Text style={styles.genderText}>{emp.gender}</Text>
                </View>
              </View>

              {/* Assignment Information */}
              <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>DEPLOYED SITE</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {emp.site}
                  </Text>
                </View>

                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>SHIFT</Text>
                  <Text style={styles.infoValue}>{emp.shift}</Text>
                </View>

                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>CONTACT</Text>
                  <Text style={styles.infoValue}>{emp.phone}</Text>
                </View>
              </View>

              {/* Footer Actions */}
              <View style={styles.cardFooter}>
                <View style={styles.deptBadge}>
                  <Text style={styles.deptBadgeText}>{emp.department}</Text>
                </View>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => dispatch(toggleEmployeeStatus(emp.id))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionBtnText}>
                    {isActive ? "Set Inactive" : "Set Active"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {filteredEmployees.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No personnel found</Text>
            <Text style={styles.emptySub}>
              Try adjusting search keyword or add a new team member.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Employee Modal */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Onboard New Employee</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Surender Sharma"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. +91 98123 45678"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <Text style={styles.inputLabel}>Role / Designation</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Security Guard / Field Inspector"
                value={role}
                onChangeText={setRole}
              />

              <Text style={styles.inputLabel}>Site / Deployment Location</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. DLF CyberCity Hub"
                value={site}
                onChangeText={setSite}
              />

              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {["Male", "Female"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderOption,
                      gender === g && styles.activeGenderOption,
                    ]}
                    onPress={() => setGender(g)}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        gender === g && styles.activeGenderOptionText,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveEmployee}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Save Employee</Text>
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
  empCard: {
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
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  empDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  empName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  empRole: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  empCode: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 1,
  },
  genderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  genderText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  deptBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deptBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563EB",
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  actionBtnText: {
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
  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  genderOption: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  activeGenderOption: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  genderOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  activeGenderOptionText: {
    color: "#FFFFFF",
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
