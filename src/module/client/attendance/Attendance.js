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
import UserHeader from "../../../components/UserHeader";

const employees = [
  {
    name: "Amit Sharma",
    employeeId: "EMP-1042",
    fatherName: "Rajesh Sharma",
    designation: "Security Guard",
    department: "Security",
    site: "Site Alpha",
    status: "Present",
    present: 25,
    weekOff: 4,
    holidays: 1,
    cl: 1,
    sl: 0,
    el: 0,
  },
  {
    name: "Priya Verma",
    employeeId: "EMP-1078",
    fatherName: "Suresh Verma",
    designation: "Security Supervisor",
    department: "Security",
    site: "Site Beta",
    status: "Present",
    present: 24,
    weekOff: 4,
    holidays: 1,
    cl: 0,
    sl: 1,
    el: 0,
  },
  {
    name: "Mohammed Imran",
    employeeId: "EMP-1105",
    fatherName: "Mohammed Salim",
    designation: "Field Officer",
    department: "Operations",
    site: "Site Alpha",
    status: "Absent",
    present: 22,
    weekOff: 4,
    holidays: 1,
    cl: 0,
    sl: 0,
    el: 0,
  },
  {
    name: "Neha Singh",
    employeeId: "EMP-1121",
    fatherName: "Vijay Singh",
    designation: "Security Guard",
    department: "Security",
    site: "Site Gamma",
    status: "On Leave",
    present: 21,
    weekOff: 4,
    holidays: 1,
    cl: 1,
    sl: 1,
    el: 0,
  },
];

const stats = [
  {
    title: "PRESENT ON MUSTER",
    value: "2",
    icon: "person-outline",
    color: "#0AA866",
    tint: "#E6F8EF",
  },
  {
    title: "ABSENT",
    value: "1",
    icon: "alert-circle-outline",
    color: "#E55050",
    tint: "#FFF0F0",
  },
  {
    title: "ON LEAVE",
    value: "1",
    icon: "calendar-clear-outline",
    color: "#9B45E8",
    tint: "#F5EAFE",
  },
  {
    title: "ATTENDANCE RATE",
    value: "67%",
    icon: "trending-up-outline",
    color: "#2875F5",
    tint: "#EAF2FF",
  },
];

const sites = ["All sites", "Site Alpha", "Site Beta", "Site Gamma"];
const departments = ["All departments", "Security", "Operations"];
const statuses = ["All statuses", "Present", "Absent", "On Leave"];

const STATUS_COLORS = {
  Present: {
    backgroundColor: "#E2F8EE",
    textColor: "#087B4B",
    dotColor: "#0AA866",
  },
  Absent: {
    backgroundColor: "#FFF0F0",
    textColor: "#C23F3F",
    dotColor: "#E55050",
  },
  "On Leave": {
    backgroundColor: "#F5EAFE",
    textColor: "#8535CA",
    dotColor: "#9B45E8",
  },
};

function FilterButton({ label, value, options, onSelect }) {
  const selectedIndex = options.indexOf(value);
  const nextValue = options[(selectedIndex + 1) % options.length];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}. Tap to change.`}
      onPress={() => onSelect(nextValue)}
      style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}
    >
      <Text style={styles.filterText} numberOfLines={1}>
        {value}
      </Text>
      <Ionicons name="chevron-down" size={15} color="#66748E" />
    </Pressable>
  );
}

function AttendanceEmployeeCard({ employee }) {
  const details = [
    { label: "Father's name", value: employee.fatherName },
    { label: "Designation", value: employee.designation },
    { label: "Department", value: employee.department },
    { label: "Assigned site", value: employee.site },
    { label: "Present days", value: `${employee.present} days` },
    {
      label: "Week offs / holidays",
      value: `${employee.weekOff} / ${employee.holidays}`,
    },
    {
      label: "Leave taken (CL / SL / EL)",
      value: `${employee.cl} / ${employee.sl} / ${employee.el}`,
    },
  ];

  return (
    <EmployeeCard
      name={employee.name}
      employeeId={employee.employeeId}
      status={employee.status}
      statusColors={STATUS_COLORS[employee.status]}
      details={details}
    />
  );
}

export default function Attendance({ navigation }) {
  const [view, setView] = useState("Monthly Muster");
  const [monthOffset, setMonthOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [site, setSite] = useState(sites[0]);
  const [department, setDepartment] = useState(departments[0]);
  const [status, setStatus] = useState(statuses[0]);

  const selectedMonth = useMemo(() => {
    const date = new Date(2026, 9 + monthOffset, 1);
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }, [monthOffset]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        [employee.name, employee.employeeId, employee.fatherName].some(
          (field) => field.toLowerCase().includes(query),
        );
      const matchesSite = site === "All sites" || employee.site === site;
      const matchesDepartment =
        department === "All departments" || employee.department === department;
      const matchesStatus =
        status === "All statuses" || employee.status === status;
      return matchesSearch && matchesSite && matchesDepartment && matchesStatus;
    });
  }, [search, site, department, status]);

  const dailyStats = [
    { ...stats[0], title: "PRESENT TODAY", value: "2" },
    { ...stats[1], value: "1" },
    { ...stats[2], value: "1" },
    { ...stats[3], value: "67%" },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.statsGrid}>
          {(view === "Monthly Muster" ? stats : dailyStats).map((item) => (
            <View key={item.title} style={styles.statCell}>
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

        <View style={styles.filterCard}>
          <View style={styles.segmentedControl}>
            {["Monthly Muster", "Daily Record"].map((item) => (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected: view === item }}
                onPress={() => setView(item)}
                style={[styles.segment, view === item && styles.activeSegment]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    view === item && styles.activeSegmentText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          {view === "Monthly Muster" ? (
            <View style={styles.monthSelector}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={() => setMonthOffset((offset) => offset - 1)}
                style={styles.monthArrow}
              >
                <Ionicons name="chevron-back" size={18} color="#64748B" />
              </Pressable>
              <Ionicons name="calendar-outline" size={17} color="#64748B" />
              <Text style={styles.monthText}>{selectedMonth}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next month"
                onPress={() => setMonthOffset((offset) => offset + 1)}
                style={styles.monthArrow}
              >
                <Ionicons name="chevron-forward" size={18} color="#64748B" />
              </Pressable>
            </View>
          ) : null}

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={19} color="#8A96AA" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search employee, code or father name"
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
                <Ionicons name="close-circle" size={19} color="#8A96AA" />
              </Pressable>
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            <FilterButton
              label="Site"
              value={site}
              options={sites}
              onSelect={setSite}
            />
            <FilterButton
              label="Department"
              value={department}
              options={departments}
              onSelect={setDepartment}
            />
            <FilterButton
              label="Status"
              value={status}
              options={statuses}
              onSelect={setStatus}
            />
          </ScrollView>
        </View>

        <View style={styles.listHeading}>
          <View>
            <Text style={styles.listTitle}>Employee records</Text>
            <Text style={styles.listSubtitle}>
              {filteredEmployees.length} employees ·{" "}
              {view === "Monthly Muster" ? selectedMonth : "Today"}
            </Text>
          </View>
          <View style={styles.recordCount}>
            <Ionicons name="people-outline" size={15} color="#3979EF" />
            <Text style={styles.recordCountText}>
              {filteredEmployees.length}
            </Text>
          </View>
        </View>

        <View style={styles.employeeList}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <AttendanceEmployeeCard
                key={employee.employeeId}
                employee={employee}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="search-outline" size={23} color="#71809E" />
              </View>
              <Text style={styles.emptyTitle}>No employees found</Text>
              <Text style={styles.emptyText}>
                Try changing your search or filters.
              </Text>
            </View>
          )}
        </View>


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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  statCell: { width: "47%" },
  filterCard: {
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
  segmentedControl: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#F2F4F9",
    borderRadius: 9,
    padding: 3,
    marginBottom: 10,
  },
  segment: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 7,
  },
  activeSegment: {
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D5E5FF",
  },
  segmentText: { color: "#586782", fontSize: 13, fontWeight: "600" },
  activeSegmentText: { color: "#246BFE", fontWeight: "700" },
  monthSelector: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E4E8F0",
    borderRadius: 9,
    marginBottom: 10,
    backgroundColor: "#FAFBFD",
  },
  monthArrow: {
    minWidth: 38,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  monthText: {
    color: "#263550",
    fontSize: 14,
    fontWeight: "700",
    minWidth: 112,
    textAlign: "center",
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
    fontSize: 13,
    paddingVertical: 9,
  },
  filtersRow: { flexDirection: "row", gap: 8, paddingTop: 10 },
  filterButton: {
    minHeight: 38,
    maxWidth: 190,
    borderWidth: 1,
    borderColor: "#E0E5EF",
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#F8F9FC",
  },
  filterText: {
    color: "#33415C",
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1,
  },
  pressed: { opacity: 0.72 },
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
  recordCount: {
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
  recordCountText: { color: "#3979EF", fontSize: 13, fontWeight: "800" },
  employeeList: { gap: 10 },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 26,
  },
  emptyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F1F4FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyTitle: {
    color: "#1A2542",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
  },
  emptyText: {
    color: "#7D8AA6",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
    textAlign: "center",
  },
  sampleNote: {
    color: "#8A96AA",
    fontSize: 11,
    textAlign: "center",
    marginTop: 17,
  },
});
