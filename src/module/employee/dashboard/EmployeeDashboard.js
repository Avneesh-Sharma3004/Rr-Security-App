import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/Button";
import { useAuth } from "../../../hooks/UseAuth";
import CustomHeader from "../../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import DashboardCard from "../../../components/DashboardCard";
import AttendanceCard from "../../../components/AttendanceCard";
import SalarySlipCard from "../../../components/SalarySlipCard";
import UserHeader from "../../../components/UserHeader"

export default function EmployeeDashboard({navigation}) {
  const { logout } = useAuth();
  const theme = "light"; // "dark" bhi kar sakte ho

  // Example employee details
  const employee = {
    name: "Avneesh Sharma",
    designation: "Software Developer",
  };

  const initial = employee.name.trim().charAt(0).toUpperCase();

  const handleViewSlip = () => {
    Alert.alert("Salary Slip", "Opening salary slip...");
    // Yahan navigation ya slip preview open karein.
  };

  const handleDownloadPDF = () => {
    Alert.alert("Download PDF", "Download started...");
    // Yahan PDF download logic call karein.
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <UserHeader navigation={navigation} />

        <View style={styles.content}>
          <View>
            {/* <View>
            <Text style={styles.heading}>My Attendance</Text>
          </View> */}

            <CustomButton title="Logout" color="red" onPress={logout} />
            <View style={{ gap: 10, marginTop: 5 }}>
              <View style={styles.cardContainer}>
                <DashboardCard
                  title="Working Days"
                  value={22}
                  icon="calendar-outline"
                  color="#16A34A"
                  backgroundColor="#EAF8EF"
                  theme={theme}
                />

                <DashboardCard
                  title="Present Days"
                  value={18}
                  icon="checkmark-circle-outline"
                  color="#2563EB"
                  backgroundColor="#EAF2FF"
                  theme={theme}
                />
              </View>
              <View style={styles.cardContainer}>
                <DashboardCard
                  title="Absent"
                  value={2}
                  icon="time-outline"
                  color="#EA580C"
                  backgroundColor="#FFF1E8"
                  theme={theme}
                />
                <DashboardCard
                  title="Leave"
                  value={2}
                  icon="time-outline"
                  color="#60bbf8"
                  backgroundColor="#c9e7fc"
                  theme={theme}
                />
              </View>
              <DashboardCard
                title="Attendance"
                value={2}
                icon="time-outline"
                color="#fc70c6"
                backgroundColor="#fad0ea"
                theme={theme}
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <AttendanceCard
              date="19 October 2026"
              shift="General Shift"
              status="Not Marked"
              hours="—"
              checkInTime="—"
              checkInStatus="Scheduled"
              checkOutTime="—"
              checkOutStatus="Active"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <SalarySlipCard
              month="October 2026"
              grossSalary={42000}
              deductions={3360}
              currency="₹"
              status="Processed"
              onViewSlip={handleViewSlip}
              onDownloadPDF={handleDownloadPDF}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: -40,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#4980f5",
    borderWidth: 1,
    borderColor: "#4980f5",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 23,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  employeeInfo: {
    flex: 1,
    justifyContent: "center",
  },

  employeeName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#17211B",
  },

  designation: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  content: {
    paddingHorizontal: 10,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#17211B",
  },
  cardContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
