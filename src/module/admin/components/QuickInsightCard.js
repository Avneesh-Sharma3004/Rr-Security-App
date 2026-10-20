import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function QuickInsightCard({
  title,
  subtitle,
  value,
  actionText = "View Details →",
  icon = "cash-outline",
  color = "#2563EB",
  bgColor = "#EFF6FF",
  onPressAction,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onPressAction}
        activeOpacity={0.7}
      >
        <Text style={[styles.actionText, { color }]}>{actionText}</Text>
      </TouchableOpacity>
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
    flex: 1,
    minWidth: "47%",
    marginBottom: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginVertical: 4,
  },
  actionBtn: {
    marginTop: 6,
    alignSelf: "flex-start",
  },
  actionText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
