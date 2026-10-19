
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "./Button";

const SalarySlipCard = ({
  month = "September 2026",
  grossSalary = 42000,
  deductions = 3360,
  currency = "₹",
  status = "Processed",

  onViewSlip,
  onDownloadPDF,

  cardStyle,
}) => {
  const { width } = useWindowDimensions();

  const formatAmount = (amount) =>
    `${currency}${Math.abs(Number(amount) || 0).toLocaleString(
      "en-IN"
    )}`;

  const takeHome = Number(grossSalary) - Number(deductions);

  const compact = width < 360;

  return (
    <View style={[styles.card, cardStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>LATEST SALARY SLIP</Text>
          <Text style={styles.month}>{month}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Ionicons
            name="checkmark-circle-outline"
            size={13}
            color="#15803D"
          />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Salary Details */}
      <View style={styles.salaryRow}>
        <View style={[styles.salaryBox, styles.grossBox]}>
          <Text style={styles.label}>GROSS SALARY</Text>
          <Text style={styles.grossAmount} numberOfLines={1}>
            {formatAmount(grossSalary)}
          </Text>
        </View>

        <View style={[styles.salaryBox, styles.deductionBox]}>
          <Text style={styles.label}>DEDUCTIONS</Text>
          <Text style={styles.deductionAmount} numberOfLines={1}>
            -{formatAmount(deductions)}
          </Text>
        </View>

        <View style={[styles.salaryBox, styles.netBox]}>
          <Text style={[styles.label, styles.netLabel]}>
            NET TAKE-HOME
          </Text>
          <Text style={styles.netAmount} numberOfLines={1}>
            {formatAmount(takeHome)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View
        style={[
          styles.buttonRow,
          compact && styles.compactButtonRow,
        ]}
      >
        <CustomButton
          title="View Slip"
          leftIcon="eye-outline"
          color="#FFFFFF"
          textColor="#111827"
          variant="outline"
          borderColor="#DCDDE3"
          height={36}
          borderRadius={4}
          fontSize={13}
          width="100%"
          style={styles.button}
          onPress={onViewSlip}
        />

        <CustomButton
          title="Download PDF"
          leftIcon="download-outline"
          color="#2563EB"
          textColor="#FFFFFF"
          height={36}
          borderRadius={4}
          fontSize={13}
          width="100%"
          style={styles.button}
          onPress={onDownloadPDF}
        />
      </View>
    </View>
  );
};

export default SalarySlipCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E1E3E8",

    // Android shadow
    elevation: 2,

    // iOS shadow
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
    gap: 8,
  },

  heading: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#858BA0",
    marginBottom: 5,
  },

  month: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  statusText: {
    color: "#15803D",
    fontSize: 11,
    fontWeight: "700",
  },

  salaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  salaryBox: {
    flex: 1,
    minWidth: 0,
    minHeight: 64,
    paddingHorizontal: 11,
    paddingVertical: 11,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
  },

  grossBox: {
    backgroundColor: "#F8F7FD",
    borderColor: "#E2E0EB",
  },

  deductionBox: {
    backgroundColor: "#FFF1F2",
    borderColor: "#FECDD3",
  },

  netBox: {
    backgroundColor: "#E5EDFF",
    borderColor: "#BDD1FF",
  },

  label: {
    fontSize: 9,
    fontWeight: "700",
    color: "#737B91",
    letterSpacing: 0.5,
    marginBottom: 7,
  },

  netLabel: {
    color: "#1D4ED8",
  },

  grossAmount: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },

  deductionAmount: {
    color: "#E11D48",
    fontSize: 16,
    fontWeight: "700",
  },

  netAmount: {
    color: "#1D4ED8",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  compactButtonRow: {
    gap: 8,
  },

  button: {
    flex: 1,
  },
});
