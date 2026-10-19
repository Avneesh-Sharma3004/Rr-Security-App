
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AttendanceCard = ({
  date = "19 October 2026",
  shift = "General Shift",
  status = "Not Marked",
  hours = "—",
  checkInTime = "—",
  checkInStatus = "Scheduled",
  checkOutTime = "—",
  checkOutStatus = "Active",
  onCheckIn,
  onCheckOut,
  style,
}) => {
  const isMarked = status.toLowerCase() === "present";

  return (
    <View style={[styles.card, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateSection}>
          <Text style={styles.eyebrow}>
            TODAY'S ATTENDANCE
          </Text>

          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.shiftBadge}>
          <Ionicons
            name="time-outline"
            size={15}
            color="#64748B"
          />
          <Text style={styles.shiftText}>{shift}</Text>
        </View>
      </View>

      {/* Attendance status and hours */}
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusBadge,
            isMarked && styles.presentBadge,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isMarked && styles.presentDot,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isMarked && styles.presentText,
            ]}
          >
            {status}
          </Text>
        </View>

        <View style={styles.hoursBadge}>
          <Ionicons
            name="time-outline"
            size={15}
            color="#2563EB"
          />
          <Text style={styles.hoursText}>
            Hours: {hours}
          </Text>
        </View>
      </View>

      {/* Check In */}
      <Pressable
        onPress={onCheckIn}
        disabled={!onCheckIn}
        style={({ pressed }) => [
          styles.actionRow,
          styles.checkInRow,
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.iconBox, styles.checkInIconBox]}>
          <Ionicons
            name="log-in-outline"
            size={23}
            color="#16A34A"
          />
        </View>

        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>CHECK IN</Text>
          <Text style={styles.actionTime}>{checkInTime}</Text>
        </View>

        <View style={[styles.actionBadge, styles.checkInBadge]}>
          <Text style={styles.checkInBadgeText}>
            {checkInStatus}
          </Text>
        </View>
      </Pressable>

      {/* Check Out */}
      <Pressable
        onPress={onCheckOut}
        disabled={!onCheckOut}
        style={({ pressed }) => [
          styles.actionRow,
          styles.checkOutRow,
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.iconBox, styles.checkOutIconBox]}>
          <Ionicons
            name="log-out-outline"
            size={23}
            color="#2563EB"
          />
        </View>

        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>CHECK OUT</Text>
          <Text style={styles.actionTime}>{checkOutTime}</Text>
        </View>

        <View style={[styles.actionBadge, styles.checkOutBadge]}>
          <Text style={styles.checkOutBadgeText}>
            {checkOutStatus}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    gap: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },

  dateSection: {
    flex: 1,
    gap: 5,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#64748B",
  },

  date: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  shiftBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  shiftText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#047857",
  },

  presentBadge: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC",
  },

  presentDot: {
    backgroundColor: "#15803D",
  },

  presentText: {
    color: "#166534",
  },

  hoursBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  hoursText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 76,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },

  checkInRow: {
    backgroundColor: "#F6FEF9",
    borderColor: "#A7F3D0",
  },

  checkOutRow: {
    backgroundColor: "#F6F9FF",
    borderColor: "#BFDBFE",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  checkInIconBox: {
    backgroundColor: "#DCFCE7",
  },

  checkOutIconBox: {
    backgroundColor: "#DBEAFE",
  },

  actionInfo: {
    flex: 1,
    gap: 4,
  },

  actionTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#64748B",
  },

  actionTime: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  actionBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  checkInBadge: {
    backgroundColor: "#DCFCE7",
  },

  checkOutBadge: {
    backgroundColor: "#DBEAFE",
  },

  checkInBadgeText: {
    color: "#047857",
    fontSize: 10,
    fontWeight: "700",
  },

  checkOutBadgeText: {
    color: "#1D4ED8",
    fontSize: 10,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },
});

export default AttendanceCard;
