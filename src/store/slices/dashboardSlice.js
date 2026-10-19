import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  selectedTimeRange: "Today", // "Today" | "This Week" | "This Month"
  isQuickActionModalOpen: false,
  isDrawerOpen: false,
  selectedDrawerItem: "Pay Groups",
  lastUpdated: "19 Oct 2026, 01:27:07 pm",
  stats: {
    totalEmployees: { value: 4, change: "+12.5%", positive: true },
    activeEmployees: { value: 4, change: "+4.8%", positive: true },
    maleEmployees: { value: 1, change: "+3.1%", positive: true },
    femaleEmployees: { value: 3, change: "+5.6%", positive: true },
    newJoinees: { value: 4, change: "+4 this month", positive: true },
  },
  attendanceChart: {
    Today: {
      labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
      values: [100, 100, 95, 98, 92, 100, 90],
      peakPercentage: "90%",
      peakIndex: 6,
    },
    "This Week": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [96, 100, 94, 98, 100, 92, 88],
      peakPercentage: "100%",
      peakIndex: 4,
    },
    "This Month": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      values: [95, 98, 97, 94],
      peakPercentage: "98%",
      peakIndex: 1,
    },
  },
  quickInsights: {
    monthlyPayroll: {
      title: "Monthly Payroll",
      subtitle: "(October 2026)",
      value: "₹ 69,681",
      actionText: "View Details →",
      icon: "cash-outline",
      color: "#2563EB",
      bgColor: "#EFF6FF",
    },
    attendanceToday: {
      title: "Attendance Today",
      subtitle: "100% Present",
      value: "9 / 4",
      actionText: "View Roster →",
      icon: "calendar-outline",
      color: "#16A34A",
      bgColor: "#ECFDF5",
    },
    onLeaveToday: {
      title: "On Leave Today",
      subtitle: "0%",
      value: "0",
      actionText: "View Details →",
      icon: "person-outline",
      color: "#EA580C",
      bgColor: "#FFF7ED",
    },
    leaveRequests: {
      title: "Leave Requests",
      subtitle: "Pending approvals",
      value: "0",
      actionText: "View Details →",
      icon: "time-outline",
      color: "#9333EA",
      bgColor: "#FAF5FF",
    },
    pendingClaims: {
      title: "Pending Claims",
      subtitle: "Needs verification",
      value: "2",
      actionText: "View Details →",
      icon: "document-text-outline",
      color: "#0284C7",
      bgColor: "#F0F9FF",
    },
    upcomingBirthdays: {
      title: "Upcoming Birthdays",
      subtitle: "This month",
      value: "00",
      actionText: "View Details →",
      icon: "gift-outline",
      color: "#DB2777",
      bgColor: "#FDF2F8",
    },
  },
  departmentDistribution: [
    { department: "Security Staff", count: 3, percentage: 75, color: "#16A34A" },
    { department: "Facility & Housekeeping", count: 1, percentage: 25, color: "#2563EB" },
  ],
  recentActivities: [
    {
      id: "1",
      title: "New employee Krishan Kumar onboarded into Security.",
      time: "14d ago",
      tag: "New Joiner",
      icon: "person-outline",
      tagColor: "#2563EB",
      tagBg: "#EFF6FF",
    },
    {
      id: "2",
      title: "Shift schedule synchronized for DLF CyberCity Tower A.",
      time: "2d ago",
      tag: "Shift Update",
      icon: "time-outline",
      tagColor: "#16A34A",
      tagBg: "#ECFDF5",
    },
    {
      id: "3",
      title: "Monthly biometric attendance auto-reconciled.",
      time: "5h ago",
      tag: "Biometrics",
      icon: "finger-print-outline",
      tagColor: "#9333EA",
      tagBg: "#FAF5FF",
    },
    {
      id: "4",
      title: "Client Apex Towers contract renewal recorded.",
      time: "1d ago",
      tag: "Client",
      icon: "business-outline",
      tagColor: "#EA580C",
      tagBg: "#FFF7ED",
    },
  ],
  alertsAndReminders: [
    {
      id: "1",
      title: "Provident Fund (PF) ECR Filing",
      date: "15 Oct 2026",
      dueBadge: "In 1 Days",
      icon: "shield-checkmark-outline",
      isUrgent: true,
      category: "Compliance",
    },
    {
      id: "2",
      title: "ESIC Monthly Contribution Return",
      date: "21 Oct 2026",
      dueBadge: "In 7 Days",
      icon: "document-lock-outline",
      isUrgent: false,
      category: "Statutory",
    },
    {
      id: "3",
      title: "Quarterly Guard Site Equipment & Radio Check",
      date: "25 Oct 2026",
      dueBadge: "In 11 Days",
      icon: "radio-outline",
      isUrgent: false,
      category: "Operations",
    },
  ],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setTimeRange: (state, action) => {
      state.selectedTimeRange = action.payload;
    },
    setQuickActionModalOpen: (state, action) => {
      state.isQuickActionModalOpen = action.payload;
    },
    setDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setSelectedDrawerItem: (state, action) => {
      state.selectedDrawerItem = action.payload;
    },
    refreshDashboard: (state) => {
      const now = new Date();
      state.lastUpdated = `${now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}, ${now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })}`;
    },
  },
});

export const {
  setSearchQuery,
  setTimeRange,
  setQuickActionModalOpen,
  setDrawerOpen,
  toggleDrawer,
  setSelectedDrawerItem,
  refreshDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
