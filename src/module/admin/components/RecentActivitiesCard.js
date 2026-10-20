import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RecentActivitiesCard({
  activities = [],
  onViewAll,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recent Activities</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {activities.map((item, idx) => (
          <View
            key={item.id || idx}
            style={[
              styles.activityItem,
              idx === activities.length - 1 && styles.lastItem,
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name={item.icon || "person-outline"}
                size={16}
                color="#2563EB"
              />
            </View>

            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>

            {item.tag ? (
              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: item.tagBg || "#EFF6FF" },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: item.tagColor || "#2563EB" },
                  ]}
                >
                  {item.tag}
                </Text>
              </View>
            ) : null}
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
  activityItem: {
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
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "600",
    lineHeight: 17,
  },
  itemTime: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
