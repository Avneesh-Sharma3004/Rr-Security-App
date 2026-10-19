import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  setShiftFilter,
  addShift,
  toggleShiftStatus,
} from "../../store/slices/shiftsSlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";

export default function AdminShiftManagementScreen() {
  const dispatch = useDispatch();
  const { shifts, selectedStatus } = useSelector((state) => state.shifts);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [shiftTiming, setShiftTiming] = useState("");
  const [assignedGuards, setAssignedGuards] = useState("10");
  const [supervisor, setSupervisor] = useState("");

  const filterTabs = ["All", "In Progress", "Upcoming", "Scheduled"];

  const filteredShifts = shifts.filter((sh) => {
    if (selectedStatus === "All") return true;
    return sh.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  const handleSaveShift = () => {
    if (!shiftName.trim() || !shiftTiming.trim()) {
      Alert.alert("Validation", "Please enter Shift Name and Shift Timing.");
      return;
    }

    dispatch(
      addShift({
        name: shiftName.trim(),
        code: `SH-0${shifts.length + 1}`,
        timing: shiftTiming.trim(),
        totalHours: "8 Hours",
        assignedGuards: parseInt(assignedGuards, 10) || 8,
        supervisors: [supervisor.trim() || "Duty Supervisor"],
        sitesCount: 3,
        description: "Scheduled deployment shift for security personnel.",
      })
    );

    setShiftName("");
    setShiftTiming("");
    setSupervisor("");
    setIsAddModalOpen(false);
    Alert.alert("Success", "New shift schedule created!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            style={styles.drawerIconBtn}
            onPress={() => dispatch(toggleDrawer())}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={23} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Shift Management & Rosters</Text>
            <Text style={styles.subtitle}>
              {shifts.length} Active shift configurations
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={17} color="#FFFFFF" />
          <Text style={styles.addBtnText}>New Shift</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {filterTabs.map((tab) => {
          const isActive = selectedStatus === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, isActive && styles.activeFilterTab]}
              onPress={() => dispatch(setShiftFilter(tab))}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && styles.activeFilterTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Shifts List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredShifts.map((sh) => {
          const isInProgress = sh.status === "In Progress";
          const isUpcoming = sh.status === "Upcoming";

          let statusBg = "#F1F5F9";
          let statusText = "#475569";
          if (isInProgress) {
            statusBg = "#DCFCE7";
            statusText = "#166534";
          } else if (isUpcoming) {
            statusBg = "#FEF3C7";
            statusText = "#92400E";
          }

          return (
            <View key={sh.id} style={styles.card}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.shiftTitleContainer}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: sh.bgLight || "#EFF6FF" },
                    ]}
                  >
                    <Ionicons
                      name="time"
                      size={20}
                      color={sh.color || "#2563EB"}
                    />
                  </View>
                  <View>
                    <Text style={styles.shiftName}>{sh.name}</Text>
                    <Text style={styles.shiftCode}>{sh.code}</Text>
                  </View>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                  <Text style={[styles.statusBadgeText, { color: statusText }]}>
                    {sh.status}
                  </Text>
                </View>
              </View>

              {/* Timing */}
              <View style={styles.timingBox}>
                <Ionicons name="alarm-outline" size={16} color="#2563EB" />
                <Text style={styles.timingText}>{sh.timing}</Text>
                <Text style={styles.durationBadge}>({sh.totalHours})</Text>
              </View>

              <Text style={styles.descText}>{sh.description}</Text>

              {/* Guard Assignment Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>GUARDS DEPLOYED</Text>
                  <Text style={styles.statValue}>
                    {sh.assignedGuards} Personnel
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>DEPLOYED SITES</Text>
                  <Text style={styles.statValue}>{sh.sitesCount} Locations</Text>
                </View>
              </View>

              {/* Supervisors & Toggle */}
              <View style={styles.cardFooter}>
                <View style={styles.supervisorRow}>
                  <Ionicons name="shield-outline" size={15} color="#64748B" />
                  <Text style={styles.supervisorText}>
                    Supervised by: {sh.supervisors?.join(", ")}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.toggleBtn}
                  onPress={() => dispatch(toggleShiftStatus(sh.id))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.toggleBtnText}>
                    {isInProgress ? "End Shift" : "Start Shift"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {filteredShifts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No shifts in this filter</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Shift Modal */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Shift</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Shift Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Night Patrol Alpha"
                value={shiftName}
                onChangeText={setShiftName}
              />

              <Text style={styles.inputLabel}>Shift Timing (Start - End) *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 11:00 PM - 07:00 AM"
                value={shiftTiming}
                onChangeText={setShiftTiming}
              />

              <Text style={styles.inputLabel}>Assigned Guards Count</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 12"
                keyboardType="numeric"
                value={assignedGuards}
                onChangeText={setAssignedGuards}
              />

              <Text style={styles.inputLabel}>Shift Supervisor</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Rajesh Singh"
                value={supervisor}
                onChangeText={setSupervisor}
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveShift}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Save Shift Schedule</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  drawerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },
  activeFilterTab: {
    backgroundColor: "#2563EB",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  activeFilterTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  shiftTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shiftName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  shiftCode: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  timingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  timingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E40AF",
  },
  durationBadge: {
    fontSize: 11,
    color: "#3B82F6",
  },
  descText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 17,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  supervisorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  supervisorText: {
    fontSize: 11,
    color: "#64748B",
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalBody: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
