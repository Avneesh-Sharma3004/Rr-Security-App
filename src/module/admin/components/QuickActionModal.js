import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function QuickActionModal({
  visible,
  onClose,
  onActionSelect,
}) {
  const actions = [
    {
      id: "add_employee",
      title: "Add New Employee / Guard",
      subtitle: "Onboard new security personnel",
      icon: "person-add",
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      id: "add_client",
      title: "Add New Client / Site",
      subtitle: "Register contract location",
      icon: "business",
      color: "#16A34A",
      bg: "#ECFDF5",
    },
    {
      id: "create_shift",
      title: "Create Shift Schedule",
      subtitle: "Assign guard rosters & timings",
      icon: "time",
      color: "#D97706",
      bg: "#FFFBEB",
    },
    {
      id: "attendance_override",
      title: "Mark Attendance Override",
      subtitle: "Manual check-in verification",
      icon: "checkmark-circle",
      color: "#9333EA",
      bg: "#FAF5FF",
    },
    {
      id: "generate_payroll",
      title: "Run Payroll Calculation",
      subtitle: "Process monthly wages & deductions",
      icon: "cash",
      color: "#0284C7",
      bg: "#F0F9FF",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHandle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Quick Actions</Text>
              <Text style={styles.subtitle}>Select an operation to perform</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.actionsList}>
            {actions.map((act) => (
              <TouchableOpacity
                key={act.id}
                style={styles.actionItem}
                onPress={() => {
                  onClose();
                  onActionSelect && onActionSelect(act.id);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: act.bg }]}>
                  <Ionicons name={act.icon} size={22} color={act.color} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>{act.title}</Text>
                  <Text style={styles.actionSubtitle}>{act.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    backgroundColor: "#CBD5E1",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  actionsList: {
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  actionSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
});
