import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const shifts = [
  { name: "Morning shift", time: "08:00 AM to 04:00 PM", people: "12 employees", color: "#3157C8", tint: "#EEF2FF" },
  { name: "Evening shift", time: "04:00 PM to 12:00 AM", people: "08 employees", color: "#A05AC7", tint: "#F7EEFC" },
  { name: "Night shift", time: "12:00 AM to 08:00 AM", people: "05 employees", color: "#168A72", tint: "#E9F7F3" },
];

export default function ShiftManagement() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>WORKFORCE</Text>
        <Text style={styles.title}>Shift management</Text>
        <Text style={styles.subtitle}>Today's team schedule</Text>
        <View style={styles.summary}><View style={styles.summaryIcon}><Ionicons name="time" size={20} color="#FFFFFF" /></View><View><Text style={styles.summaryValue}>25</Text><Text style={styles.summaryText}>scheduled today</Text></View><View style={styles.summaryBadge}><Text style={styles.summaryBadgeText}>3 shifts</Text></View></View>
        <Text style={styles.sectionTitle}>Today's shifts</Text>
        {shifts.map((shift) => (
          <View key={shift.name} style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: shift.tint }]}><Ionicons name="time-outline" size={20} color={shift.color} /></View>
            <View style={styles.shiftCopy}><Text style={styles.shiftName}>{shift.name}</Text><Text style={styles.shiftTime}>{shift.time}</Text><Text style={styles.people}>{shift.people}</Text></View>
            <Ionicons name="chevron-forward" size={18} color="#A0A8B8" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F7FC" },
  content: { padding: 20, paddingTop: 22 },
  eyebrow: { color: "#73809A", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#18243A", fontSize: 25, fontWeight: "800", marginTop: 6 },
  subtitle: { color: "#7A869B", fontSize: 13, marginTop: 5, marginBottom: 22 },
  summary: { backgroundColor: "#263F91", borderRadius: 20, padding: 17, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 25 },
  summaryIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#FFFFFF26", justifyContent: "center", alignItems: "center" },
  summaryValue: { color: "#FFFFFF", fontSize: 21, fontWeight: "800" },
  summaryText: { color: "#DAE2FF", fontSize: 11, marginTop: 2 },
  summaryBadge: { marginLeft: "auto", backgroundColor: "#FFFFFF22", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  summaryBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  sectionTitle: { color: "#202B40", fontSize: 16, fontWeight: "800", marginBottom: 12 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E9EDF5", padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 11 },
  iconBox: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  shiftCopy: { flex: 1 },
  shiftName: { color: "#26334A", fontSize: 13, fontWeight: "700" },
  shiftTime: { color: "#66738A", fontSize: 11, marginTop: 4 },
  people: { color: "#909AAF", fontSize: 10, marginTop: 5 },
});

