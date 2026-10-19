import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AlertsRemindersCard({
  alerts = [],
  onViewAll,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Alerts & Reminders</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {alerts.map((item, idx) => (
          <View
            key={item.id || idx}
            style={[
              styles.alertItem,
              idx === alerts.length - 1 && styles.lastItem,
            ]}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: item.isUrgent ? "#EFF6FF" : "#F8FAFC" },
              ]}
            >
              <Ionicons
                name={item.icon || "shield-checkmark-outline"}
                size={18}
                color={item.isUrgent ? "#2563EB" : "#64748B"}
              />
            </View>

            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: item.isUrgent ? "#FEF2F2" : "#F1F5F9",
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: item.isUrgent ? "#DC2626" : "#475569" },
                ]}
              >
                {item.dueBadge}
              </Text>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  viewAll: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  listContainer: {
    gap: 12,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 10,
  },
  lastItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "600",
  },
  itemDate: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
