import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardCard({
  title,
  value,
  icon = "calendar-outline",
  color = "#16A34A",
  backgroundColor = "#EAF8EF",
  theme = "light",
  compact = false,
  detail,
  secondaryDetail,
}) {
  const isDark = theme === "dark";

  if (compact) {
    return (
      <View style={[styles.compactCard, { borderColor: `${color}35` }]}>
        <View style={styles.compactTop}>
          <View style={[styles.compactIcon, { backgroundColor }]}>
            <Ionicons name={icon} size={22} color={color} />
          </View>
          <Ionicons name="chevron-forward" size={18} color="#90A0BC" />
        </View>
        <Text style={styles.compactTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.compactValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78}>{value}</Text>
        <View style={styles.compactDetails}>
          {detail ? <Text style={[styles.compactDetail, { color }]} numberOfLines={1}>{detail}</Text> : null}
          {detail && secondaryDetail ? <Text style={styles.detailSeparator}></Text> : null}
          {secondaryDetail ? <Text style={styles.compactSecondary} numberOfLines={1}>{secondaryDetail}</Text> : null}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          borderColor: isDark ? "#374151" : "#E5E7EB",
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isDark ? `${color}25` : backgroundColor },
        ]}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: isDark ? "#D1D5DB" : "#6B7280" }]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.value, { color: isDark ? "#FFFFFF" : "#111827" }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <View style={[styles.accent, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    minHeight: 112,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
  },
  compactCard: {
    width: "48%",
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 0,
    minHeight: 178,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    shadowColor: "#33466D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.055,
    shadowRadius: 9,
    elevation: 2,
  },
  compactTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 9 },
  compactIcon: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  compactTitle: { color: "#657493", fontSize: 10, lineHeight: 14, fontWeight: "700", letterSpacing: 0.45, minHeight: 28 },
  compactValue: { color: "#101B3A", fontSize: 21, lineHeight: 27, fontWeight: "800", marginTop: 1 },
  compactDetails: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 5, marginTop: 2 },
  compactDetail: { fontSize: 11, fontWeight: "700" },
  detailSeparator: { color: "#B1BBCD", fontSize: 11 },
  compactSecondary: { color: "#71809E", fontSize: 11, flexShrink: 1 },
  iconContainer: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  details: { flex: 1, minWidth: 0, gap: 6 },
  title: { fontSize: 12, fontWeight: "500" },
  value: { fontSize: 23, fontWeight: "800" },
  accent: { position: "absolute", left: 0, top: 14, bottom: 14, width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
});



