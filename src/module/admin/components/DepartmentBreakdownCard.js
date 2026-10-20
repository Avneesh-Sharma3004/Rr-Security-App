import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DepartmentBreakdownCard({
  departments = [
    { department: "Security Staff", count: 3, percentage: 75, color: "#16A34A" },
    { department: "Facility & Housekeeping", count: 1, percentage: 25, color: "#2563EB" },
  ],
  onViewReport,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Department Wise Employees</Text>
        <TouchableOpacity onPress={onViewReport} activeOpacity={0.7}>
          <Text style={styles.viewReport}>View Report →</Text>
        </TouchableOpacity>
      </View>

      {/* Visual Progress Bar Distribution */}
      <View style={styles.progressTrack}>
        {departments.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.progressSegment,
              {
                width: `${item.percentage}%`,
                backgroundColor: item.color,
                borderTopLeftRadius: idx === 0 ? 6 : 0,
                borderBottomLeftRadius: idx === 0 ? 6 : 0,
                borderTopRightRadius: idx === departments.length - 1 ? 6 : 0,
                borderBottomRightRadius: idx === departments.length - 1 ? 6 : 0,
              },
            ]}
          />
        ))}
      </View>

      {/* Legend & Breakdown */}
      <View style={styles.legendContainer}>
        {departments.map((item, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text style={styles.deptName}>{item.department}</Text>
            </View>
            <View style={styles.legendRight}>
              <Text style={styles.deptCount}>{item.count} Guards</Text>
              <Text style={styles.deptPercent}>({item.percentage}%)</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  viewReport: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  progressTrack: {
    height: 12,
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressSegment: {
    height: "100%",
  },
  legendContainer: {
    gap: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  deptName: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  legendRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deptCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  deptPercent: {
    fontSize: 12,
    color: "#64748B",
  },
});
