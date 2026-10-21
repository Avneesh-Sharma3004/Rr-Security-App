import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import DashboardCard from "../../../components/DashboardCard";
import EmployeeCard from "../../../components/EmployeeCard";

const stats = [
  {
    title: "Present",
    value: "13",
    detail: "81%",
    // secondaryDetail: "Workforce",
    icon: "people-outline",
    color: "#2474F4",
    tint: "#E8F1FF",
  },
  {
    title: "Absent",
    value: "3",
    detail: "19%",
    icon: "clipboard-outline",
    color: "#0AA866",
    tint: "#E2F8EE",
  },
  {
    title: "Half Day",
    value: "0",
    detail: "0 %",
    // secondaryDetail: "0 on leave today",
    icon: "calendar-clear-outline",
    color: "#E78312",
    tint: "#FFF1DC",
  },
  {
    title: "On Leave",
    value: "0",
    detail: "0 %",
    // secondaryDetail: "146 Issued",
    icon: "cube-outline",
    color: "#5545E8",
    tint: "#EFEDFF",
  },
];
export default function DailyAttendance() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <DashboardCard key={item.title} {...item} compact />
          ))}
        </View>
        <View style={{ marginTop: 10 ,gap:10}}>
          <EmployeeCard
            name="Avneesh Sharma"
            employeeId="EMP001"
            status="Active"
            details={[
              { label: "Father Name", value: "Abc Sharma" },
              { label: "Present Days", value: "0" },
              { label: "Week of", value: "2" },
              { label: "holidays", value: "0" },
              { label: "Casual Leave (CL)", value: "0" },
              { label: "Sick Leave (SL)", value: "₹0" },
              { label: "Earn Leave (EL)", value: "0" },
              { label: "Leave Without Pay (LWP)", value: "0" },
              { label: "Working Days", value: "0" },
              { label: "Client", value: "RSAG Sealing Solutions Pvt Ltd" },
              {
                label: "Site",
                value: "Plot No-376,Greater Noida Gautam Budh Nagar U.P.",
              },
              { label: "Department", value: "Office Staff" },
            ]}
          />
          <EmployeeCard
            name="Avneesh Sharma"
            employeeId="EMP001"
            status="Active"
            details={[
              { label: "Father Name", value: "Abc Sharma" },
              { label: "Present Days", value: "0" },
              { label: "Week of", value: "2" },
              { label: "holidays", value: "0" },
              { label: "Casual Leave (CL)", value: "0" },
              { label: "Sick Leave (SL)", value: "₹0" },
              { label: "Earn Leave (EL)", value: "0" },
              { label: "Leave Without Pay (LWP)", value: "0" },
              { label: "Working Days", value: "0" },
              { label: "Client", value: "RSAG Sealing Solutions Pvt Ltd" },
              {
                label: "Site",
                value: "Plot No-376,Greater Noida Gautam Budh Nagar U.P.",
              },
              { label: "Department", value: "Office Staff" },
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 21,
    marginTop: 10,
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8ECF2",
    borderRadius: 14,
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
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

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E2F8EE",
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0AA866",
  },

  activeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#087B4B",
  },
});
