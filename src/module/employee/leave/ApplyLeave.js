import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import UserHeader from "../../../components/UserHeader";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";
import CustomButton from "../../../components/Button";
import { useAuth } from "../../../hooks/UseAuth";

const LEAVE_TYPES = [
  { label: "SL — Sick / Medical Leave", balance: 8 },
  { label: "AL — Annual Leave", balance: 35 },
  { label: "CL — Casual Leave", balance: 12 },
  { label: "LWP — Leave Without Pay", balance: 0 },
];

const DURATION_TYPES = ["Full Day", "Half Day", "Short Leave", "Multiple Days"];

function formatDate(date) {
  return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
}

function FormLabel({ children, required = false }) {
  return (
    <Text style={styles.label}>
      {children}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  );
}

export default function ApplyLeave({ navigation }) {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0].label);
  const [duration, setDuration] = useState("Full Day");
  const [startDate, setStartDate] = useState(() => formatDate(new Date()));
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  });
  const [reason, setReason] = useState("");
  const [handover, setHandover] = useState("");

  const selectedLeave =
    LEAVE_TYPES.find((item) => item.label === leaveType) || LEAVE_TYPES[0];
  const requestedDays = useMemo(() => {
    if (duration === "Half Day") return 0.5;
    if (duration === "Short Leave") return 0.25;
    if (duration === "Multiple Days") return 2;
    return 1;
  }, [duration]);
  const remainingBalance = Math.max(0, selectedLeave.balance - requestedDays);
  const employeeName = user?.name?.trim() || "Avneesh Sharma";
  const employeeId = user?.employeeCode || "EMP001";
  const leaveOptions = LEAVE_TYPES.map((item) => item.label);

  const submitRequest = () => {
    if (!reason.trim()) {
      Alert.alert("Reason required", "Please enter a reason for your leave.");
      return;
    }
    Alert.alert(
      "Submit leave request",
      "Leave request submission is not connected yet.",
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <UserHeader navigation={navigation} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.employeeCard}>
          <View style={styles.employeeIdentity}>
            <View style={styles.employeeAvatar}>
              <Ionicons name="person" size={18} color="#2875F5" />
            </View>
            <View style={styles.employeeCopy}>
              <Text style={styles.employeeName} numberOfLines={1}>
                {employeeName}
              </Text>
              <Text style={styles.employeeId}>{employeeId}</Text>
            </View>
          </View>
          <View style={styles.employeeRole}>
            <Text style={styles.roleText} numberOfLines={1}>
              Security Guard · Security
            </Text>
            <View style={styles.siteRow}>
              <Ionicons name="location-outline" size={13} color="#2875F5" />
              <Text style={styles.siteText} numberOfLines={1}>
                ABC Security Services — Delhi Site A
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formSectionHeading}>
            <View style={styles.sectionIcon}>
              <Ionicons name="create-outline" size={18} color="#2875F5" />
            </View>
            <View style={styles.headingCopy}>
              <Text style={styles.sectionTitle}>Leave details</Text>
              <Text style={styles.sectionSubtitle}>
                Enter the information for your leave request.
              </Text>
            </View>
          </View>

          <View style={styles.field}>
            <FormLabel required>Select Leave Type</FormLabel>
            <BillingFilterDropdown
              label="Leave Type"
              value={leaveType}
              options={leaveOptions}
              onSelect={setLeaveType}
              style={styles.dropdown}
            />
            <Text style={styles.helperText}>
              {selectedLeave.balance} days available for this leave type
            </Text>
          </View>

          <View style={styles.field}>
            <FormLabel required>Leave Duration Type</FormLabel>
            <View style={styles.durationGrid}>
              {DURATION_TYPES.map((item) => {
                const selected = duration === item;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => setDuration(item)}
                    style={[
                      styles.durationOption,
                      selected && styles.selectedDuration,
                    ]}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        selected && styles.selectedDurationText,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.dateRow}>
            <View style={[styles.field, styles.dateField]}>
              <FormLabel required>
                {duration === "Multiple Days" ? "Start Date" : "Leave Date"}
              </FormLabel>
              <View style={styles.inputWithIcon}>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="DD-MM-YYYY"
                  placeholderTextColor="#95A0B2"
                  style={styles.dateInput}
                  keyboardType="numbers-and-punctuation"
                  accessibilityLabel="Leave date"
                />
                <Ionicons name="calendar-outline" size={17} color="#74829A" />
              </View>
            </View>
            {duration === "Multiple Days" ? (
              <View style={[styles.field, styles.dateField]}>
                <FormLabel required>End Date</FormLabel>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholder="DD-MM-YYYY"
                    placeholderTextColor="#95A0B2"
                    style={styles.dateInput}
                    keyboardType="numbers-and-punctuation"
                    accessibilityLabel="Leave end date"
                  />
                  <Ionicons name="calendar-outline" size={17} color="#74829A" />
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.balanceBar}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
              <Text style={styles.balanceValue}>
                {selectedLeave.balance} Days
              </Text>
            </View>
            <Text style={styles.balanceOperator}>−</Text>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>REQUESTED</Text>
              <Text style={[styles.balanceValue, styles.requestedValue]}>
                {requestedDays} {requestedDays === 1 ? "Day" : "Days"}
              </Text>
            </View>
            <Text style={styles.balanceOperator}>=</Text>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>BALANCE AFTER</Text>
              <Text style={styles.balanceValue}>{remainingBalance} Days</Text>
            </View>
          </View>

          <View style={styles.field}>
            <FormLabel required>Reason for Leave</FormLabel>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="State reason for absence..."
              placeholderTextColor="#95A0B2"
              style={[styles.textArea, styles.reasonArea]}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          <View style={styles.field}>
            <FormLabel>
              Supporting Document (e.g. Medical Certificate / Proof)
            </FormLabel>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                Alert.alert(
                  "Attach document",
                  "Document upload is not connected yet.",
                )
              }
              style={styles.uploadButton}
            >
              <Ionicons name="cloud-upload-outline" size={18} color="#2875F5" />
              <Text style={styles.uploadText} numberOfLines={1}>
                Tap to attach a supporting document
              </Text>
            </Pressable>
          </View>

          <View style={[styles.field, styles.lastField]}>
            <FormLabel>Handover / Shift Remarks (Optional)</FormLabel>
            <TextInput
              value={handover}
              onChangeText={setHandover}
              placeholder="e.g. Reliever informed for gate post duty"
              placeholderTextColor="#95A0B2"
              style={styles.textInput}
              maxLength={200}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title="Cancel"
          onPress={() => navigation?.goBack()}
          variant="outline"
          width="auto"
          height={44}
          borderRadius={11}
          borderColor="#DCE4F0"
          textColor="#34415A"
          fontSize={12}
          style={styles.cancelButton}
        />
        <CustomButton
          title="Submit Request"
          onPress={submitRequest}
          leftIcon="checkmark"
          width="auto"
          height={44}
          borderRadius={11}
          color="#2875F5"
          fontSize={12}
          style={styles.submitButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  screenHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E7ECF4",
  },
  headingCopy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: "#7A879D",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  title: { color: "#17213B", fontSize: 17, fontWeight: "800", marginTop: 2 },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F3F5F9",
  },
  scroll: { flex: 1 },
  content: { padding: 12, paddingBottom: 20 },
  employeeCard: {
    backgroundColor: "#F7F9FE",
    borderWidth: 1,
    borderColor: "#E1E8F5",
    borderRadius: 13,
    padding: 12,
    marginBottom: 11,
    gap: 10,
  },
  employeeIdentity: { flexDirection: "row", alignItems: "center", gap: 9 },
  employeeAvatar: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5EFFF",
  },
  employeeCopy: { flex: 1, flexDirection: "row", alignItems: "center", gap: 7 },
  employeeName: { color: "#21304B", fontSize: 11, fontWeight: "700" },
  employeeId: { color: "#8692A8", fontSize: 9 },
  employeeRole: { gap: 5 },
  roleText: { color: "#66758F", fontSize: 9, textAlign: "right" },
  siteRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  siteText: { flex: 1, color: "#2875F5", fontSize: 10, fontWeight: "600" },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 15,
    padding: 13,
  },
  formSectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 15,
  },
  sectionIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#EAF2FF",
  },
  sectionTitle: { color: "#1D2B46", fontSize: 14, fontWeight: "800" },
  sectionSubtitle: { color: "#7A879D", fontSize: 10, marginTop: 3 },
  field: { marginBottom: 14 },
  lastField: { marginBottom: 0 },
  label: { color: "#4B5871", fontSize: 10, fontWeight: "700", marginBottom: 6 },
  required: { color: "#E34B57" },
  dropdown: {
    minHeight: 45,
    paddingHorizontal: 11,
    borderRadius: 10,
    borderColor: "#CCD8EA",
  },
  helperText: { color: "#8190A8", fontSize: 9, marginTop: 5 },
  durationGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  durationOption: {
    flexGrow: 1,
    flexBasis: "22%",
    minWidth: 72,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DCE3EF",
    borderRadius: 9,
    backgroundColor: "#F8F9FC",
    paddingHorizontal: 5,
  },
  selectedDuration: { borderColor: "#2875F5", backgroundColor: "#EEF4FF" },
  durationText: {
    color: "#68758B",
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedDurationText: { color: "#2875F5", fontWeight: "800" },
  dateRow: { flexDirection: "row", gap: 9 },
  dateField: { flex: 1, minWidth: 0 },
  inputWithIcon: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#DCE3EF",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  dateInput: {
    flex: 1,
    minWidth: 0,
    color: "#34415A",
    fontSize: 11,
    paddingVertical: 9,
  },
  balanceBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 3,
    paddingVertical: 11,
    paddingHorizontal: 6,
    marginBottom: 15,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#B7EBC9",
    backgroundColor: "#F0FBF4",
  },
  balanceItem: { flex: 1, minWidth: 0, alignItems: "center" },
  balanceLabel: {
    color: "#4B8060",
    fontSize: 7,
    fontWeight: "800",
    textAlign: "center",
  },
  balanceValue: {
    color: "#177944",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center",
  },
  requestedValue: { color: "#2875F5" },
  balanceOperator: { color: "#43835D", fontSize: 14, fontWeight: "800" },
  textArea: {
    minHeight: 86,
    borderWidth: 1,
    borderColor: "#DCE3EF",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    paddingVertical: 10,
    color: "#34415A",
    fontSize: 11,
  },
  reasonArea: { textAlignVertical: "top" },
  uploadButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CCD8EA",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FBFCFE",
  },
  uploadText: { flex: 1, color: "#2875F5", fontSize: 10, fontWeight: "600" },
  textInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#DCE3EF",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    color: "#34415A",
    fontSize: 10,
  },
  footer: {
    flexDirection: "row",
    gap: 9,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#E3E8F1",
    backgroundColor: "#FFFFFF",
  },
  cancelButton: { flex: 0.8 },
  submitButton: { flex: 1.5 },
});
