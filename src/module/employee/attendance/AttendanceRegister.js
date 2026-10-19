import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardCard from "../../../components/DashboardCard";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";

const ATTENDANCE = [
  {
    date: "2026-10-19",
    status: "Absent",
    checkIn: "—",
    checkOut: "—",
    hours: "—",
  },
  {
    date: "2026-10-17",
    status: "Absent",
    checkIn: "—",
    checkOut: "—",
    hours: "—",
  },
  {
    date: "2026-10-16",
    status: "Absent",
    checkIn: "—",
    checkOut: "—",
    hours: "—",
  },
  {
    date: "2026-10-18",
    status: "Present",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    hours: "9h 00m",
  },
];

const STATUS_COLORS = {
  Present: { color: "#07834E", tint: "#E7F8EF", dot: "#0AA866" },
  Absent: { color: "#D83E4A", tint: "#FFF0F1", dot: "#E34B57" },
  Leave: { color: "#2463EB", tint: "#EEF4FF", dot: "#2875F5" },
  Weekend: { color: "#71809A", tint: "#F1F3F7", dot: "#9BA6B8" },
};

const STAT_ITEMS = [
  {
    label: "Working Days",
    value: "4",
    icon: "calendar-outline",
    color: "#69758C",
    tint: "#F0F2F7",
  },
  {
    label: "Present",
    value: "1",
    icon: "checkmark-circle-outline",
    color: "#0AA866",
    tint: "#E7F8EF",
  },
  {
    label: "Absent",
    value: "3",
    icon: "close-circle-outline",
    color: "#E34B57",
    tint: "#FFF0F1",
  },
  {
    label: "Leave",
    value: "0",
    icon: "airplane-outline",
    color: "#2875F5",
    tint: "#EEF4FF",
  },
  {
    label: "Attendance Rate",
    value: "25%",
    icon: "bar-chart-outline",
    color: "#2875F5",
    tint: "#EEF4FF",
  },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = Array.from({ length: 12 }, (_, month) =>
  new Date(2026, month, 1).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  }),
);

const dateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
const formatDate = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function RecordCard({ item }) {
  const tone = STATUS_COLORS[item.status];
  return (
    <View style={styles.recordCard}>
      <View style={styles.recordTop}>
        <View style={styles.recordDateWrap}>
          <View style={styles.recordCalendarIcon}>
            <Ionicons name="calendar-outline" size={17} color="#2875F5" />
          </View>
          <View>
            <Text style={styles.recordDate}>{formatDate(item.date)}</Text>
            <Text style={styles.recordDay}>
              {new Date(`${item.date}T12:00:00`).toLocaleDateString("en", {
                weekday: "long",
              })}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: tone.tint }]}>
          <View style={[styles.statusDot, { backgroundColor: tone.dot }]} />
          <Text style={[styles.statusText, { color: tone.color }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.recordDetails}>
        <View style={styles.recordDetail}>
          <Text style={styles.detailLabel}>CHECK IN</Text>
          <Text style={styles.detailValue}>{item.checkIn}</Text>
        </View>
        <View style={styles.detailDivider} />
        <View style={styles.recordDetail}>
          <Text style={styles.detailLabel}>CHECK OUT</Text>
          <Text style={styles.detailValue}>{item.checkOut}</Text>
        </View>
        <View style={styles.detailDivider} />
        <View style={styles.recordDetail}>
          <Text style={styles.detailLabel}>HOURS</Text>
          <Text style={styles.detailValue}>{item.hours}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View attendance for ${formatDate(item.date)}`}
          onPress={() =>
            Alert.alert(
              "Attendance details",
              `${formatDate(item.date)} · ${item.status}`,
            )
          }
          style={styles.viewButton}
        >
          <Ionicons name="eye-outline" size={18} color="#2875F5" />
        </Pressable>
      </View>
    </View>
  );
}

export default function AttendanceRegister() {
  const now = new Date();
  const [month, setMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [monthFilter, setMonthFilter] = useState(
    MONTH_NAMES[now.getMonth()] || MONTH_NAMES[9],
  );
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const calendarDays = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const monthLabel = month.toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });
  const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

  const visibleRecords = useMemo(
    () =>
      ATTENDANCE.filter((item) => {
        const inMonth = item.date.startsWith(monthKey);
        const hasStatus =
          statusFilter === "All Statuses" || item.status === statusFilter;
        return inMonth && hasStatus;
      }),
    [monthKey, statusFilter],
  );

  const changeMonth = (amount) => {
    const next = new Date(year, monthIndex + amount, 1);
    setMonth(next);
    setSelectedDay(1);
    setMonthFilter(
      next.toLocaleDateString("en", { month: "long", year: "numeric" }),
    );
  };

  const selectMonth = (value) => {
    setMonthFilter(value);
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      setMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      setSelectedDay(1);
    }
  };

  const getDayStatus = (day) => {
    const record = ATTENDANCE.find(
      (item) => item.date === dateKey(year, monthIndex, day),
    );
    if (record) return record.status;
    return new Date(year, monthIndex, day).getDay() === 0 ? "Weekend" : null;
  };

  const resetFilters = () => {
    setStatusFilter("All Statuses");
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setMonthFilter(MONTH_NAMES[now.getMonth()] || MONTH_NAMES[9]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.summaryGrid}>
        {STAT_ITEMS.map((item) => (
          <View key={item.label} style={styles.summaryCardWrap}>
            <DashboardCard
              title={item.label}
              value={item.value}
              icon={item.icon}
              color={item.color}
              backgroundColor={item.tint}
            />
          </View>
        ))}
      </View>

      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <View style={styles.flexCopy}>
            <Text style={styles.eyebrow}>ATTENDANCE OVERVIEW</Text>
            <Text style={styles.overviewMonth}>{monthLabel}</Text>
            <Text style={styles.overviewSubtitle}>
              Your dynamic attendance summary for {monthLabel}
            </Text>
          </View>
          <Text style={styles.rateValue}>25%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressValue} />
        </View>
        <View style={styles.legend}>
          {[
            ["Present", "#0AA866"],
            ["Absent", "#E34B57"],
            ["Leave", "#2875F5"],
          ].map(([label, color]) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>
                {label}:{" "}
                {label === "Present" ? "1" : label === "Absent" ? "3" : "0"}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <View style={styles.flexCopy}>
            <Text style={styles.eyebrow}>MONTHLY ATTENDANCE CALENDAR</Text>
            <Text style={styles.calendarMonth}>{monthLabel}</Text>
          </View>
          <View style={styles.monthControls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              onPress={() => changeMonth(-1)}
              style={styles.monthArrow}
            >
              <Ionicons name="chevron-back" size={17} color="#52627D" />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next month"
              onPress={() => changeMonth(1)}
              style={styles.monthArrow}
            >
              <Ionicons name="chevron-forward" size={17} color="#52627D" />
            </Pressable>
          </View>
        </View>
        <View style={styles.calendarLegend}>
          {[
            ["Present", "#0AA866"],
            ["Absent", "#E34B57"],
            ["Leave", "#2875F5"],
            ["Weekend", "#9BA6B8"],
          ].map(([label, color]) => (
            <View key={label} style={styles.calendarLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.calendarLegendText}>{label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {WEEKDAYS.map((day) => (
            <Text key={day} style={styles.weekday}>
              {day}
            </Text>
          ))}
          {calendarDays.map((day, index) => {
            const dayStatus = day ? getDayStatus(day) : null;
            const tone = dayStatus ? STATUS_COLORS[dayStatus] : null;
            return (
              <View
                key={`${day ?? "blank"}-${index}`}
                style={styles.calendarCell}
              >
                {day ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${monthLabel} ${day}${dayStatus ? `, ${dayStatus}` : ""}`}
                    accessibilityState={{ selected: selectedDay === day }}
                    onPress={() => setSelectedDay(day)}
                    style={[
                      styles.dayButton,
                      selectedDay === day && styles.selectedDayButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        selectedDay === day && styles.selectedDayNumber,
                      ]}
                    >
                      {day}
                    </Text>
                    {dayStatus ? (
                      <View
                        style={[
                          styles.dayStatusDot,
                          {
                            backgroundColor:
                              selectedDay === day ? "#FFFFFF" : tone.dot,
                          },
                        ]}
                      />
                    ) : (
                      <View style={styles.dotPlaceholder} />
                    )}
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.filtersCard}>
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Month</Text>
          <BillingFilterDropdown
            label="Month"
            value={monthFilter}
            options={MONTH_NAMES}
            onSelect={selectMonth}
            style={styles.dropdown}
          />
        </View>
        <View style={styles.filterField}>
          <Text style={styles.filterLabel}>Status</Text>
          <BillingFilterDropdown
            label="Status"
            value={statusFilter}
            options={["All Statuses", "Present", "Absent", "Leave"]}
            onSelect={setStatusFilter}
            style={styles.dropdown}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={resetFilters}
          style={styles.resetButton}
        >
          <Ionicons name="refresh-outline" size={16} color="#52627D" />
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>

      <View style={styles.historyHeading}>
        <View style={styles.flexCopy}>
          <Text style={styles.eyebrow}>ATTENDANCE HISTORY</Text>
          <Text style={styles.historyTitle}>Attendance Records</Text>
        </View>
        <View style={styles.daysBadge}>
          <Text style={styles.daysBadgeText}>{visibleRecords.length} days</Text>
        </View>
      </View>
      <View style={styles.recordsList}>
        {visibleRecords.map((item) => (
          <RecordCard key={item.date} item={item} />
        ))}
        {visibleRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={25} color="#8290A8" />
            <Text style={styles.emptyTitle}>No attendance records</Text>
            <Text style={styles.emptyText}>
              Try another month or status filter.
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF" },
  content: { marginTop: 10 },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 9,
    marginBottom: 3,
  },
  summaryCardWrap: { width: "48.5%" },
  overviewCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  overviewHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  flexCopy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: "#71809A",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.65,
  },
  overviewMonth: {
    color: "#1C2940",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 3,
  },
  overviewSubtitle: {
    color: "#7B88A0",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },
  rateValue: { color: "#2875F5", fontSize: 20, fontWeight: "800" },
  progressTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#EDF0F5",
    overflow: "hidden",
    marginTop: 13,
  },
  progressValue: {
    width: "25%",
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#2875F5",
  },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { color: "#5F6F8C", fontSize: 9 },
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 14,
    padding: 13,
    marginBottom: 12,
  },
  calendarHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  calendarMonth: {
    color: "#1C2940",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },
  monthControls: { flexDirection: "row", gap: 5 },
  monthArrow: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  calendarLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 11,
    marginBottom: 9,
  },
  calendarLegendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  calendarLegendText: { color: "#697793", fontSize: 8 },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  weekday: {
    width: "14.2857%",
    textAlign: "center",
    color: "#6D7A94",
    fontSize: 8,
    fontWeight: "700",
    paddingBottom: 6,
  },
  calendarCell: { width: "14.2857%", padding: 2, minHeight: 41 },
  dayButton: {
    flex: 1,
    minHeight: 37,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8EBF2",
    borderRadius: 7,
    backgroundColor: "#F8F9FC",
  },
  selectedDayButton: { backgroundColor: "#2875F5", borderColor: "#2875F5" },
  dayNumber: { color: "#2D3A52", fontSize: 10, fontWeight: "600" },
  selectedDayNumber: { color: "#FFFFFF" },
  dayStatusDot: { width: 4, height: 4, borderRadius: 2, marginTop: 3 },
  dotPlaceholder: { height: 7 },
  filtersCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 14,
    padding: 12,
    marginBottom: 15,
    gap: 10,
  },
  filterField: { gap: 5 },
  filterLabel: { color: "#26334A", fontSize: 10, fontWeight: "700" },
  dropdown: {
    minHeight: 42,
    paddingHorizontal: 11,
    borderRadius: 10,
    borderColor: "#DCE4F0",
  },
  resetButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCE4F0",
    backgroundColor: "#F8FAFD",
  },
  resetText: { color: "#52627D", fontSize: 11, fontWeight: "700" },
  historyHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 9,
  },
  historyTitle: {
    color: "#1C2940",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 3,
  },
  daysBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 11,
    backgroundColor: "#EEF3FF",
  },
  daysBadgeText: { color: "#3157C8", fontSize: 9, fontWeight: "700" },
  recordsList: { gap: 9 },
  recordCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 13,
    padding: 12,
  },
  recordTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  recordDateWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  recordCalendarIcon: {
    width: 33,
    height: 33,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#EEF4FF",
  },
  recordDate: { color: "#26334A", fontSize: 11, fontWeight: "700" },
  recordDay: { color: "#7A869B", fontSize: 9, marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: "700" },
  recordDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF1F6",
  },
  recordDetail: { flex: 1, minWidth: 0 },
  detailLabel: {
    color: "#8290A8",
    fontSize: 8,
    fontWeight: "700",
    marginBottom: 4,
  },
  detailValue: { color: "#35435D", fontSize: 10, fontWeight: "600" },
  detailDivider: {
    width: 1,
    height: 26,
    backgroundColor: "#E8ECF2",
    marginHorizontal: 8,
  },
  viewButton: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "#EEF4FF",
    marginLeft: 7,
  },
  emptyState: {
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    gap: 7,
  },
  emptyTitle: { color: "#26334A", fontSize: 12, fontWeight: "700" },
  emptyText: { color: "#7A869B", fontSize: 10 },
});
