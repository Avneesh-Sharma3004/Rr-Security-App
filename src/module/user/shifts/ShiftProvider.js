import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardCard from "../../../components/DashboardCard";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";
import CustomButton from "../../../components/Button";

const FILTER_DEFAULTS = {
  client: "All Clients",
  site: "All Sites",
  department: "All Departments",
  shift: "All Shifts",
  type: "All Types",
  status: "All Status",
};

const FILTER_OPTIONS = {
  client: ["All Clients"],
  site: ["All Sites"],
  department: ["All Departments"],
  shift: ["All Shifts", "Morning shift", "Evening shift", "Night shift"],
  type: ["All Types", "Day", "Night", "Rotational"],
  status: ["All Status", "Assigned", "Unassigned"],
};

const SUMMARY = [
  {
    title: "Total Shifts",
    value: "5",
    icon: "layers",
    color: "#2463EB",
    backgroundColor: "#EAF1FF",
  },
  {
    title: "Active Shifts",
    value: "5",
    icon: "checkmark-circle",
    color: "#0AA866",
    backgroundColor: "#E8F8EF",
  },
  {
    title: "Employees Assigned",
    value: "0",
    icon: "people",
    color: "#8538F5",
    backgroundColor: "#F2EAFF",
  },
  {
    title: "Unassigned Employees",
    value: "0",
    icon: "person-remove",
    color: "#E78312",
    backgroundColor: "#FFF3E1",
  },
];

const PATTERNS = [
  { name: "Day", count: "3 shifts", color: "#2463EB" },
  { name: "Night", count: "1 shift", color: "#8538F5" },
  { name: "Rotational", count: "1 shift", color: "#E78312" },
];

function FilterField({ label, value, options, onSelect, style }) {
  return (
    <View style={[styles.filterField, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <BillingFilterDropdown
        label={label}
        value={value}
        options={options}
        onSelect={onSelect}
        style={styles.dropdown}
      />
    </View>
  );
}

export default function ShiftProvider() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  const [date] = useState(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
  });

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setSearch("");
    setFilters(FILTER_DEFAULTS);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.summaryGrid}>
        {SUMMARY.map((item) => (
          <DashboardCard key={item.title} {...item} compact={false} />
        ))}
      </View>

      <View style={styles.patternSection}>
        <Text style={styles.sectionTitle}>Shift Patterns</Text>
        <Text style={styles.sectionDescription}>
          Configured workforce patterns for active company profile
        </Text>
        <View style={styles.patternList}>
          {PATTERNS.map((pattern) => (
            <View key={pattern.name} style={styles.patternCard}>
              <View
                style={[styles.patternDot, { backgroundColor: pattern.color }]}
              />
              <View style={styles.patternCopy}>
                <Text style={styles.patternName}>{pattern.name}</Text>
                <Text style={styles.patternCount}>{pattern.count}</Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color="#8A96AB" />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.rosterHeading}>
        <Text style={styles.sectionTitle}>Shift Roster</Text>
        <Text style={styles.sectionDescription}>
          View and manage employee shift assignments.
        </Text>
      </View>

      <View style={styles.filtersCard}>
        <View style={styles.searchField}>
          <Text style={styles.fieldLabel}>Search</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#8793A8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Employee name or ID"
              placeholderTextColor="#9AA5B8"
              style={styles.searchInput}
              returnKeyType="search"
            />
            {search ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={() => setSearch("")}
              >
                <Ionicons name="close-circle" size={18} color="#8793A8" />
              </Pressable>
            ) : null}
          </View>
        </View>
        <View style={styles.filterGrid}>
          <FilterField
            label="Client"
            value={filters.client}
            options={FILTER_OPTIONS.client}
            onSelect={(value) => updateFilter("client", value)}
          />
          <FilterField
            label="Site"
            value={filters.site}
            options={FILTER_OPTIONS.site}
            onSelect={(value) => updateFilter("site", value)}
          />
          <FilterField
            label="Department"
            value={filters.department}
            options={FILTER_OPTIONS.department}
            onSelect={(value) => updateFilter("department", value)}
          />
          <FilterField
            label="Shift"
            value={filters.shift}
            options={FILTER_OPTIONS.shift}
            onSelect={(value) => updateFilter("shift", value)}
          />
          <FilterField
            label="Shift Type"
            value={filters.type}
            options={FILTER_OPTIONS.type}
            onSelect={(value) => updateFilter("type", value)}
          />
          <FilterField
            label="Status"
            value={filters.status}
            options={FILTER_OPTIONS.status}
            onSelect={(value) => updateFilter("status", value)}
          />
          <View style={styles.dateField}>
            <Text style={styles.fieldLabel}>Date</Text>
            <View style={styles.dateValue}>
              <Text style={styles.dateText}>{date}</Text>
              <Ionicons name="calendar-outline" size={17} color="#74829A" />
            </View>
          </View>
          <View style={styles.resetWrap}>
            <Text style={styles.fieldLabel}>&nbsp;</Text>
            <CustomButton
              title="Reset filters"
              onPress={resetFilters}
              variant="outline"
              height={44}
              borderRadius={11}
              borderColor="#DCE4F0"
              textColor="#33415B"
              fontSize={12}
              leftIcon="refresh-outline"
              iconColor="#52627D"
              style={styles.resetButton}
            />
          </View>
        </View>
      </View>

      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Ionicons name="search-outline" size={27} color="#69758C" />
        </View>
        <Text style={styles.emptyTitle}>No shift assignments found</Text>
        <Text style={styles.emptyDescription}>
          Try changing your filters or date, or assign an employee to a shift.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 12, paddingBottom: 26 },
  summaryGrid: {
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 14,
  },
  patternSection: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  sectionTitle: { color: "#1C2940", fontSize: 16, fontWeight: "800" },
  sectionDescription: {
    color: "#78859B",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  patternList: { gap: 8, marginTop: 11 },
  patternCard: {
    minHeight: 53,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F8F8FC",
    borderWidth: 1,
    borderColor: "#ECECF4",
  },
  patternDot: { width: 9, height: 9, borderRadius: 5 },
  patternCopy: { flex: 1 },
  patternName: { color: "#26334A", fontSize: 12, fontWeight: "700" },
  patternCount: { color: "#77839A", fontSize: 10, marginTop: 3 },
  rosterHeading: { marginBottom: 12 },
  filtersCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 14,
    padding: 13,
    marginBottom: 13,
  },
  fieldLabel: {
    color: "#26334A",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
  },
  searchField: { marginBottom: 12 },
  searchBox: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: "#DCE4F0",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: "#26334A",
    fontSize: 12,
    paddingVertical: 8,
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  filterField: { width: "48.5%", minWidth: 0 },
  dropdown: {
    minHeight: 44,
    paddingHorizontal: 10,
    borderRadius: 11,
    borderColor: "#DCE4F0",
  },
  dateField: { width: "48.5%" },
  dateValue: {
    minHeight: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#DCE4F0",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },
  dateText: { color: "#4F5E78", fontSize: 12 },
  resetWrap: { width: "48.5%" },
  resetButton: { marginBottom: 0 },
  emptyCard: {
    minHeight: 205,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 14,
    borderStyle: "dashed",
    paddingHorizontal: 25,
    paddingVertical: 24,
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4FA",
    marginBottom: 10,
  },
  emptyTitle: {
    color: "#26334A",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyDescription: {
    maxWidth: 270,
    color: "#7A869B",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 5,
  },
});
