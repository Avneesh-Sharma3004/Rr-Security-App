import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const SHIFT_DOTS = ["#3157C8", "#A05AC7", "#168A72"];

export default function CalenderView() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const month = useMemo(() => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + monthOffset);
    return date;
  }, [monthOffset]);
  const monthName = month.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekday = new Date(
    month.getFullYear(),
    month.getMonth(),
    1,
  ).getDay();
  const days = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const changeMonth = (amount) => {
    setMonthOffset((value) => value + amount);
    setSelectedDate(1);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.calendar}>
        <View style={styles.monthRow}>
          <Text style={styles.monthTitle}>{monthName}</Text>
          <View style={styles.arrows}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              onPress={() => changeMonth(-1)}
              style={styles.arrow}
            >
              <Ionicons name="chevron-back" size={18} color="#40516F" />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next month"
              onPress={() => changeMonth(1)}
              style={styles.arrow}
            >
              <Ionicons name="chevron-forward" size={18} color="#40516F" />
            </Pressable>
          </View>
        </View>
        <View style={styles.grid}>
          {WEEKDAYS.map((day, index) => (
            <Text key={`${day}-${index}`} style={styles.weekday}>
              {day}
            </Text>
          ))}
          {days.map((day, index) => (
            <View key={`${day ?? "blank"}-${index}`} style={styles.dayCell}>
              {day ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${monthName} ${day}`}
                  accessibilityState={{ selected: selectedDate === day }}
                  onPress={() => setSelectedDate(day)}
                  style={[
                    styles.dayButton,
                    selectedDate === day && styles.selectedDay,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDate === day && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                  <View style={styles.dots}>
                    {SHIFT_DOTS.map((color) => (
                      <View
                        key={color}
                        style={[styles.dot, { backgroundColor: color }]}
                      />
                    ))}
                  </View>
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
        <View style={styles.legend}>
          {[
            ["Morning", SHIFT_DOTS[0]],
            ["Evening", SHIFT_DOTS[1]],
            ["Night", SHIFT_DOTS[2]],
          ].map(([label, color]) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.sectionTitle}>
        {month.toLocaleDateString(undefined, { month: "short" })} {selectedDate}{" "}
        · Shift coverage
      </Text>
      {[
        ["Morning shift", "08:00 AM – 04:00 PM", "12 employees", SHIFT_DOTS[0]],
        ["Evening shift", "04:00 PM – 12:00 AM", "08 employees", SHIFT_DOTS[1]],
        ["Night shift", "12:00 AM – 08:00 AM", "05 employees", SHIFT_DOTS[2]],
      ].map(([name, time, people, color]) => (
        <View key={name} style={styles.shiftRow}>
          <View style={[styles.shiftMarker, { backgroundColor: color }]} />
          <View style={styles.shiftCopy}>
            <Text style={styles.shiftName}>{name}</Text>
            <Text style={styles.shiftTime}>{time}</Text>
          </View>
          <Text style={styles.people}>{people}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {   backgroundColor: "#FFFFFF" },
  eyebrow: {
    color: "#73809A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  title: { color: "#18243A", fontSize: 24, fontWeight: "800", marginTop: 5 },
  subtitle: { color: "#7A869B", fontSize: 13, marginTop: 4, marginBottom: 16 },
  calendar: {
    borderWidth: 1,
    borderColor: "#E7ECF4",
    borderRadius: 17,
    padding: 14,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  monthTitle: { color: "#26334A", fontSize: 16, fontWeight: "700" },
  arrows: { flexDirection: "row", gap: 7 },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F2F5FA",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  weekday: {
    width: "14.2857%",
    textAlign: "center",
    color: "#8B96A9",
    fontSize: 11,
    fontWeight: "700",
    paddingBottom: 8,
  },
  dayCell: {
    width: "14.2857%",
    height: 47,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButton: {
    width: 34,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
  },
  selectedDay: { backgroundColor: "#3157C8" },
  dayText: { color: "#34415A", fontSize: 12, fontWeight: "600" },
  selectedDayText: { color: "#FFFFFF" },
  dots: { flexDirection: "row", gap: 2, marginTop: 3 },
  dot: { width: 3, height: 3, borderRadius: 2 },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 17,
    borderTopWidth: 1,
    borderTopColor: "#EDF0F5",
    marginTop: 12,
    paddingTop: 12,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 4 },
  legendText: { color: "#6E7B91", fontSize: 10 },
  sectionTitle: {
    color: "#202B40",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 21,
    marginBottom: 11,
  },
  shiftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E9EDF5",
    borderRadius: 13,
    marginBottom: 8,
  },
  shiftMarker: {
    width: 4,
    alignSelf: "stretch",
    minHeight: 34,
    borderRadius: 2,
  },
  shiftCopy: { flex: 1 },
  shiftName: { color: "#26334A", fontSize: 12, fontWeight: "700" },
  shiftTime: { color: "#7A869B", fontSize: 10, marginTop: 4 },
  people: { color: "#65728A", fontSize: 10 },
});
