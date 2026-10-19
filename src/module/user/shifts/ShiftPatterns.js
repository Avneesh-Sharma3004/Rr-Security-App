import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardCard from "../../../components/DashboardCard";

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
  {
    name: "Day",
    description: "Daytime workforce schedule",
    count: 3,
    color: "#2463EB",
    tint: "#EAF1FF",
    icon: "sunny-outline",
  },
  {
    name: "Night",
    description: "Overnight workforce schedule",
    count: 1,
    color: "#8538F5",
    tint: "#F2EAFF",
    icon: "moon-outline",
  },
  {
    name: "Rotational",
    description: "Rotating team schedule",
    count: 1,
    color: "#E78312",
    tint: "#FFF3E1",
    icon: "repeat-outline",
  },
];

export default function ShiftPatterns() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.summaryGrid}>
        {SUMMARY.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </View>

      <View style={styles.patternSection}>
        <View style={styles.sectionHeading}>
          <View style={styles.headingCopy}>
            <Text style={styles.sectionTitle}>Shift Patterns</Text>
            <Text style={styles.subtitle}>
              Configured workforce patterns for active company profile
            </Text>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>5</Text>
          </View>
        </View>

        <View style={styles.patternList}>
          {PATTERNS.map((pattern) => (
            <View key={pattern.name} style={styles.patternCard}>
              <View style={[styles.patternIcon, { backgroundColor: pattern.tint }]}>
                <Ionicons name={pattern.icon} size={21} color={pattern.color} />
              </View>
              <View style={styles.patternCopy}>
                <Text style={styles.patternName}>{pattern.name}</Text>
                <Text style={styles.patternDescription} numberOfLines={1}>
                  {pattern.description}
                </Text>
              </View>
              <View style={styles.countBlock}>
                <Text style={[styles.count, { color: pattern.color }]}>
                  {pattern.count}
                </Text>
                <Text style={styles.countLabel}>
                  {pattern.count === 1 ? "shift" : "shifts"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Ionicons name="information-circle-outline" size={20} color="#3157C8" />
        </View>
        <Text style={styles.infoText}>
          Shift patterns group schedules by the type of coverage your teams need.
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
  },
  sectionHeading: { flexDirection: "row", alignItems: "center", gap: 8 },
  headingCopy: { flex: 1 },
  sectionTitle: { color: "#1C2940", fontSize: 16, fontWeight: "800" },
  subtitle: { color: "#78859B", fontSize: 11, lineHeight: 16, marginTop: 4 },
  totalBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  totalBadgeText: { color: "#3157C8", fontSize: 12, fontWeight: "800" },
  patternList: { gap: 9, marginTop: 14 },
  patternCard: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F8F8FC",
    borderWidth: 1,
    borderColor: "#ECECF4",
  },
  patternIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  patternCopy: { flex: 1, minWidth: 0 },
  patternName: { color: "#26334A", fontSize: 13, fontWeight: "700" },
  patternDescription: { color: "#77839A", fontSize: 10, marginTop: 4 },
  countBlock: {
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderLeftWidth: 1,
    borderLeftColor: "#E4E7EF",
  },
  count: { fontSize: 17, fontWeight: "800" },
  countLabel: { color: "#77839A", fontSize: 9, marginTop: 1 },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#EEF4FF",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  infoIcon: { width: 24, alignItems: "center" },
  infoText: { flex: 1, color: "#38527F", fontSize: 11, lineHeight: 16 },
});
