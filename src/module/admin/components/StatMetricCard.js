import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatMetricCard({
  title,
  value,
  changeText,
  icon = "people-outline",
  iconColor = "#16A34A",
  iconBg = "#DCFCE7",
  isPositive = true,
}) {
  return (
    <View style={styles.card}>
      {/* Icon with soft circular background */}
      <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      {/* Title & Value */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.value}>{value}</Text>

        {/* Change badge */}
        <View style={styles.badgeRow}>
          {isPositive ? (
            <Ionicons name="arrow-up" size={12} color="#16A34A" />
          ) : (
            <Ionicons name="arrow-down" size={12} color="#DC2626" />
          )}
          <Text
            style={[
              styles.changeText,
              { color: isPositive ? "#16A34A" : "#DC2626" },
            ]}
          >
            {changeText}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minWidth: 135,
    flexDirection: "column",
    justifyContent: "space-between",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginRight: 10,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  content: {
    gap: 3,
  },
  title: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
