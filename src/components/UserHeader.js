import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "./Header";
import { useAuth } from "../hooks/UseAuth";

const ROLE_LABELS = {
  ADMIN: "Administrator",
  CLIENT: "Client",
  EMPLOYEE: "Employee",
  USER: "User",
};

export default function UserHeader({ navigation }) {
  const { user } = useAuth();
  const name = user?.name?.trim() || "Avneesh Sharma";
  const designation = user?.designation || ROLE_LABELS[user?.role] || "Software Developer";
  const initial = name.charAt(0).toUpperCase();

  return (
    <CustomHeader height={40} color="#FFFFFF">
      <View style={styles.row}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.copy}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <Text style={styles.designation} numberOfLines={1}>{designation}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          hitSlop={10}
          onPress={() => navigation?.navigate("Menu")}
          style={styles.menuButton}
        >
          <Ionicons name="menu-outline" size={29} color="#17211B" />
        </Pressable>
      </View>
    </CustomHeader>
  );
}

const styles = StyleSheet.create({
  row: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: -40 },
  identity: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, minWidth: 0 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#4980F5", borderWidth: 1, borderColor: "#4980F5", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 23, fontWeight: "700", color: "#FFFFFF" },
  copy: { flex: 1, minWidth: 0, justifyContent: "center" },
  name: { fontSize: 17, fontWeight: "700", color: "#17211B" },
  designation: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  menuButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
});
