import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DashboardCard from "../../../components/DashboardCard";
import EmployeeCard from "../../../components/EmployeeCard";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";
import UserHeader from "../../../components/UserHeader";

// No client workforce has been assigned yet. Connect this array to the client API when available.
const employees = [];
const ALL_DEPARTMENTS = "All departments";
const ALL_SITES = "All assigned sites";
const ALL_STATUSES = "All statuses";
const departments = [
  ALL_DEPARTMENTS,
  "Security",
  "Operations",
  "Administration",
];
const sites = [ALL_SITES, "Site Alpha", "Site Beta", "Site Gamma"];
const statuses = [ALL_STATUSES, "Active", "On Leave", "Inactive"];

export default function Employee({ navigation }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(ALL_DEPARTMENTS);
  const [site, setSite] = useState(ALL_SITES);
  const [status, setStatus] = useState(ALL_STATUSES);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return employees.filter((employee) => {
      const searchable = [
        employee.employeeId,
        employee.name,
        employee.designation,
        employee.department,
        employee.site,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (department === ALL_DEPARTMENTS ||
          employee.department === department) &&
        (site === ALL_SITES || employee.site === site) &&
        (status === ALL_STATUSES || employee.status === status)
      );
    });
  }, [search, department, site, status]);

  const summary = [
    {
      title: "TOTAL ASSIGNED WORKFORCE",
      value: String(employees.length),
      icon: "people-outline",
      color: "#2875F5",
      tint: "#EAF2FF",
    },
    {
      title: "ACTIVE ON DUTY",
      value: String(
        employees.filter((employee) => employee.status === "Active").length,
      ),
      icon: "person-outline",
      color: "#0AA866",
      tint: "#E6F8EF",
    },
    {
      title: "ON APPROVED LEAVE",
      value: String(
        employees.filter((employee) => employee.status === "On Leave").length,
      ),
      icon: "calendar-clear-outline",
      color: "#9B45E8",
      tint: "#F5EAFE",
    },
    {
      title: "INACTIVE / RELIEVED",
      value: String(
        employees.filter((employee) => employee.status === "Inactive").length,
      ),
      icon: "person-remove-outline",
      color: "#E55050",
      tint: "#FFF0F0",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >


        <View style={styles.summaryGrid}>
          {summary.map((item) => (
            <View key={item.title} style={styles.summaryCell}>
              <DashboardCard
                title={item.title}
                value={item.value}
                icon={item.icon}
                color={item.color}
                backgroundColor={item.tint}
              />
            </View>
          ))}
        </View>

        <View style={styles.filtersCard}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={19} color="#8793A8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search name, code, designation or site"
              placeholderTextColor="#929DB0"
              style={styles.searchInput}
              returnKeyType="search"
              accessibilityLabel="Search employees"
            />
            {search ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={() => setSearch("")}
              >
                <Ionicons name="close-circle" size={19} color="#8793A8" />
              </Pressable>
            ) : null}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <BillingFilterDropdown
              label="Department"
              value={department}
              options={departments}
              onSelect={setDepartment}
              style={styles.filter}
            />
            <BillingFilterDropdown
              label="Assigned site"
              value={site}
              options={sites}
              onSelect={setSite}
              style={styles.filter}
            />
            <BillingFilterDropdown
              label="Status"
              value={status}
              options={statuses}
              onSelect={setStatus}
              style={styles.filter}
            />
          </ScrollView>
        </View>

        <View style={styles.listHeading}>
          <View>
            <Text style={styles.listTitle}>Assigned employees</Text>
            <Text style={styles.listSubtitle}>
              {filteredEmployees.length} employees
            </Text>
          </View>
          <View style={styles.countPill}>
            <Ionicons name="people-outline" size={15} color="#3979EF" />
            <Text style={styles.countText}>{filteredEmployees.length}</Text>
          </View>
        </View>

        <View style={styles.employeeList}>
          {filteredEmployees.length ? (
            filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.employeeId}
                name={employee.name}
                employeeId={employee.employeeId}
                status={employee.status}
                details={[
                  { label: "Designation", value: employee.designation },
                  { label: "Department", value: employee.department },
                  { label: "Site / location", value: employee.site },
                  { label: "Shift", value: employee.shift },
                ]}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="people-outline" size={24} color="#71809E" />
              </View>
              <Text style={styles.emptyTitle}>
                {employees.length === 0
                  ? "No employees assigned yet"
                  : "No employees found"}
              </Text>
              <Text style={styles.emptyText}>
                {employees.length === 0
                  ? "Assigned security personnel and staff will appear here."
                  : "Try changing your search or filters."}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.note}>
          Employee records will appear here once assigned.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  content: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 30 },
  pageHeading: { marginBottom: 14 },
  pageTitle: {
    color: "#111B38",
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "800",
  },
  pageSubtitle: {
    color: "#7785A2",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  summaryCell: { width: "47%" },
  filtersCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 14,
    padding: 11,
    marginBottom: 18,
    elevation: 1,
    shadowColor: "#263A62",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  searchBox: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: "#24324B",
    fontSize: 14,
    paddingVertical: 9,
  },
  filterRow: { flexDirection: "row", gap: 8, paddingTop: 9 },
  filter: { width: 155, minWidth: 0, paddingHorizontal: 9, minHeight: 42 },
  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  listTitle: {
    color: "#17213B",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  listSubtitle: {
    color: "#7785A2",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  countPill: {
    minWidth: 42,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EAF2FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 9,
  },
  countText: { color: "#3979EF", fontSize: 13, fontWeight: "800" },
  employeeList: { gap: 10 },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E6F0",
    borderRadius: 14,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyTitle: {
    color: "#1A2542",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    color: "#7D8AA6",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    textAlign: "center",
  },
  note: { color: "#8A96AA", fontSize: 11, textAlign: "center", marginTop: 16 },
});
