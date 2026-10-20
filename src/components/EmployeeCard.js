import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DEFAULT_STATUS_COLORS = {
  Active: {
    backgroundColor: "#E2F8EE",
    textColor: "#087B4B",
    dotColor: "#0AA866",
  },
  Inactive: {
    backgroundColor: "#FFF1DC",
    textColor: "#B96A0A",
    dotColor: "#E78312",
  },
  Pending: {
    backgroundColor: "#FFF4CC",
    textColor: "#946200",
    dotColor: "#EAB308",
  },
  "On Leave": {
    backgroundColor: "#E8F1FF",
    textColor: "#2474F4",
    dotColor: "#2474F4",
  },
};

const EmployeeCard = ({
  name,
  employeeId,
  status = "Active",
  statusColors,
  details = [],
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const hasDetails = Array.isArray(details) && details.length > 0;

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  // Custom status colors override the default colors.
  const badgeColors = {
    backgroundColor:
      statusColors?.backgroundColor ??
      DEFAULT_STATUS_COLORS[status]?.backgroundColor ??
      "#F0F2F5",

    textColor:
      statusColors?.textColor ??
      DEFAULT_STATUS_COLORS[status]?.textColor ??
      "#596579",

    dotColor:
      statusColors?.dotColor ??
      DEFAULT_STATUS_COLORS[status]?.dotColor ??
      "#8290A5",
  };

  return (
    <View style={styles.container}>
      {/* Card Summary */}
      <Pressable
        onPress={() => {
          if (hasDetails) {
            setShowDetails((prev) => !prev);
          }
        }}
        disabled={!hasDetails}
        accessibilityRole={hasDetails ? "button" : undefined}
        accessibilityState={hasDetails ? { expanded: showDetails } : undefined}
        style={({ pressed }) => [
          styles.employeeCard,
          pressed && hasDetails && styles.pressed,
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName} numberOfLines={1}>
            {name}
          </Text>

          <Text style={styles.employeeId}>{employeeId}</Text>
        </View>

        {/* Customizable Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: badgeColors.backgroundColor },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: badgeColors.dotColor },
            ]}
          />

          <Text style={[styles.statusText, { color: badgeColors.textColor }]}>
            {status}
          </Text>
        </View>

        {/* Show arrow only when details exist */}
        {hasDetails && (
          <Ionicons
            name={showDetails ? "chevron-up" : "chevron-down"}
            size={18}
            color="#8290A5"
          />
        )}
      </Pressable>

      {/* Dynamic Label-Value Details */}
      {hasDetails && showDetails && (
        <View style={styles.detailsContainer}>
          {details.map((item, index) => (
            <View key={`${item.label}-${index}`} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{item.label}</Text>

              <Text style={styles.detailValue}>
                {item.value == null || item.value === ""
                  ? "N/A"
                  : String(item.value)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default EmployeeCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8ECF2",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },

  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },

  pressed: {
    opacity: 0.75,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F1FF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2474F4",
  },

  employeeInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
  },

  employeeName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#17211B",
  },

  employeeId: {
    fontSize: 12,
    color: "#8290A5",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  detailsContainer: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#E8ECF2",
    backgroundColor: "#FAFBFD",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF0F5",
  },

  detailLabel: {
    flex: 1,
    fontSize: 13,
    color: "#8290A5",
  },

  detailValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#17211B",
    textAlign: "right",
  },
});
