import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../hooks/UseAuth";
import { toggleDrawer } from "../../../store/slices/dashboardSlice";

export default function AdminHeader({
  searchQuery = "",
  onSearchChange,
  onOpenNotifications,
  onOpenSettings,
}) {
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentDateTime(now.toLocaleString("en-IN", options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar: Brand, Live Date, and User Profile */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          {/* Drawer Hamburger Icon Button */}
          <TouchableOpacity
            style={styles.drawerButton}
            onPress={() => dispatch(toggleDrawer())}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={23} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark" size={19} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.brandTitle}>RR Security & Facilities</Text>
            <Text style={styles.brandSubtitle}>HRMS ADMIN</Text>
          </View>
        </View>

        {/* User profile & actions */}
        <View style={styles.actionRow}>
          {/* Notification with Badge */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenNotifications}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={21} color="#475569" />
            <View style={styles.badgeDot} />
          </TouchableOpacity>

          {/* Logout / Switch User */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={logout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={21} color="#EF4444" />
          </TouchableOpacity>

          {/* Profile Card */}
          <View style={styles.profileBadge}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RR</Text>
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName} numberOfLines={1}>
                {user?.name || "RR Admin"}
              </Text>
              <Text style={styles.profileRole}>Administrator</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Date & Time ribbon */}
      <View style={styles.clockRibbon}>
        <Ionicons name="time-outline" size={14} color="#64748B" />
        <Text style={styles.clockText}>{currentDateTime || "19 Oct 2026, 01:27:07 pm"}</Text>
      </View>

      {/* Global Search Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#94A3B8"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search employees, clients, shifts..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={onSearchChange}
          style={styles.searchInput}
        />
        {searchQuery ? (
          <Pressable onPress={() => onSearchChange?.("")}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  drawerButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badgeDot: {
    position: "absolute",
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileTextContainer: {
    maxWidth: 95,
  },
  profileName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
  },
  profileRole: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "500",
  },
  clockRibbon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    marginBottom: 10,
  },
  clockText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
  },
});
