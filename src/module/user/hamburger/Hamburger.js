import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/UseAuth";

const ROLE_LABELS = {
  ADMIN: "Administrator",
  CLIENT: "Client",
  EMPLOYEE: "Employee",
  USER: "User",
};

export default function Hamburger({ navigation }) {
  const { user } = useAuth();
  const name = user?.name?.trim() || "Avneesh Sharma";
  const designation = user?.designation || ROLE_LABELS[user?.role] || "Software Developer";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Menu</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          hitSlop={10}
          onPress={() => navigation?.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={25} color="#34415A" />
        </Pressable>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.designation} numberOfLines={1}>{designation}</Text>
        </View>
      </View>

      <View style={styles.divider} />
      {/* Existing menu options can remain below this profile section. */}
      <View style={styles.optionsArea} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 18 },
  topBar: { minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#17213B", fontSize: 20, fontWeight: "800" },
  closeButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#F2F5FA" },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 15 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#4980F5", borderWidth: 1, borderColor: "#4980F5", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFFFFF", fontSize: 23, fontWeight: "700" },
  profileCopy: { flex: 1, minWidth: 0 },
  name: { color: "#17211B", fontSize: 17, fontWeight: "700" },
  designation: { color: "#6B7280", fontSize: 13, marginTop: 4 },
  divider: { height: 1, backgroundColor: "#E9EDF4" },
  optionsArea: { flex: 1 },
});
