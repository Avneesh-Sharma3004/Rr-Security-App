import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AttendanceChartCard({
  selectedRange = "Today",
  onSelectRange,
  chartData = {
    labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    values: [100, 100, 95, 98, 92, 100, 90],
    peakPercentage: "90%",
    peakIndex: 6,
  },
}) {
  const ranges = ["Today", "This Week", "This Month"];
  const yLabels = ["100%", "75%", "50%", "25%", "0%"];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Attendance Overview</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.smallIconButton}>
            <Ionicons name="people-outline" size={17} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallIconButton}>
            <Ionicons name="document-text-outline" size={17} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {ranges.map((range) => {
          const isActive = selectedRange === range;
          return (
            <TouchableOpacity
              key={range}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onSelectRange && onSelectRange(range)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, isActive && styles.activeTabText]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Chart Canvas */}
      <View style={styles.chartWrapper}>
        {/* Y Axis Labels */}
        <View style={styles.yAxis}>
          {yLabels.map((yl) => (
            <Text key={yl} style={styles.yLabelText}>
              {yl}
            </Text>
          ))}
        </View>

        {/* Chart Bars with Grid Lines */}
        <View style={styles.chartPlot}>
          {/* Horizontal Grid lines */}
          <View style={styles.gridContainer}>
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
          </View>

          {/* Bars */}
          <View style={styles.barsContainer}>
            {chartData.labels.map((lbl, idx) => {
              const val = chartData.values[idx] || 50;
              const isHighlight = idx === chartData.peakIndex;
              const barHeightPct = `${val}%`;

              return (
                <View key={lbl} style={styles.barColumn}>
                  {/* Tooltip Badge for highlighted bar */}
                  {isHighlight && (
                    <View style={styles.tooltipBadge}>
                      <Text style={styles.tooltipText}>
                        {chartData.peakPercentage || `${val}%`}
                      </Text>
                      <View style={styles.tooltipArrow} />
                    </View>
                  )}

                  {/* Bar */}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: barHeightPct,
                          backgroundColor: "#16A34A",
                        },
                      ]}
                    />
                  </View>

                  {/* X label */}
                  <Text style={styles.xLabelText}>{lbl}</Text>
                </View>
              );
            })}
          </View>
        </View>
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
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 6,
  },
  smallIconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 3,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  chartWrapper: {
    flexDirection: "row",
    height: 180,
    marginTop: 10,
  },
  yAxis: {
    height: 140,
    justifyContent: "space-between",
    paddingRight: 8,
    alignItems: "flex-end",
    width: 40,
  },
  yLabelText: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
  },
  chartPlot: {
    flex: 1,
    height: 180,
    position: "relative",
  },
  gridContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    justifyContent: "space-between",
  },
  gridLine: {
    height: 1,
    backgroundColor: "#F1F5F9",
    width: "100%",
  },
  barsContainer: {
    flexDirection: "row",
    height: 180,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    height: 180,
    justifyContent: "flex-end",
    position: "relative",
  },
  tooltipBadge: {
    position: "absolute",
    top: 0,
    backgroundColor: "#0F172A",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    zIndex: 10,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#0F172A",
  },
  barTrack: {
    height: 140,
    width: 18,
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  xLabelText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 8,
  },
});
