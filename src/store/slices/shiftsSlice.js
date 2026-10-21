import { createSlice } from "@reduxjs/toolkit";

const initialRosterEmployees = [
  {
    id: "rost_1",
    name: "Krishan Kumar",
    empId: "RR-004",
    client: "Petal Commercial Pvt Ltd",
    site: "A-32A, Block a, sector-62 Noida U.P.",
    department: "Security",
    shift: "Unassigned",
    shiftType: "—",
    status: "Active",
    avatar: "KR",
    date: "10/19/2026",
  },
  {
    id: "rost_2",
    name: "Shikha",
    empId: "RR-003",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Plot No-376, Udyog Kendra -1 Ecotech-III, Greater Noida Gautam Budh Nagar U.P.",
    department: "Worker",
    shift: "Unassigned",
    shiftType: "—",
    status: "Active",
    avatar: "SH",
    date: "10/19/2026",
  },
  {
    id: "rost_3",
    name: "Deepa",
    empId: "RR-002",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Main Building",
    department: "Worker",
    shift: "Unassigned",
    shiftType: "—",
    status: "Active",
    avatar: "DE",
    date: "10/19/2026",
  },
  {
    id: "rost_4",
    name: "Bandna Rana",
    empId: "RR-001",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Plot No-376,Greater Noida Gautam Budh Nagar U.P.",
    department: "Office Staff",
    shift: "Unassigned",
    shiftType: "—",
    status: "Active",
    avatar: "BA",
    date: "10/19/2026",
  },
  {
    id: "rost_5",
    name: "Raghav Sharma",
    empId: "RR-005",
    client: "RR Security & Facilities",
    site: "Corporate HQ",
    department: "Security",
    shift: "Unassigned",
    shiftType: "—",
    status: "Active",
    avatar: "RS",
    date: "10/19/2026",
  },
  {
    id: "rost_6",
    name: "Aman Sharma",
    empId: "RR-006",
    client: "RR Security & Facilities",
    site: "Corporate HQ",
    department: "Security",
    shift: "Unassigned",
    shiftType: "—",
    status: "Active",
    avatar: "AS",
    date: "10/19/2026",
  },
];

// Exact shift patterns from the screenshot
const initialShiftPatterns = [
  {
    id: "pat_1",
    name: "Evening Shift",
    type: "Day", // Day / Night / Rotational
    startTime: "02:00 PM",
    endTime: "10:00 PM",
    breakDuration: "30 min",
    gracePeriod: "15 min",
    status: "Active",
  },
  {
    id: "pat_2",
    name: "General Day Shift",
    type: "Day",
    startTime: "09:00 AM",
    endTime: "06:00 PM",
    breakDuration: "60 min",
    gracePeriod: "15 min",
    status: "Active",
  },
  {
    id: "pat_3",
    name: "Morning Shift",
    type: "Day",
    startTime: "06:00 AM",
    endTime: "02:00 PM",
    breakDuration: "30 min",
    gracePeriod: "15 min",
    status: "Active",
  },
  {
    id: "pat_4",
    name: "Night Patrol Shift",
    type: "Night",
    startTime: "10:00 PM",
    endTime: "06:00 AM",
    breakDuration: "45 min",
    gracePeriod: "15 min",
    status: "Active",
  },
  {
    id: "pat_5",
    name: "Rotational 12H Guard",
    type: "Rotational",
    startTime: "08:00 AM",
    endTime: "08:00 PM",
    breakDuration: "60 min",
    gracePeriod: "15 min",
    status: "Active",
  },
  {
    id: "pat_6",
    name: "Night Shift",
    type: "Night",
    startTime: "06:00 PM",
    endTime: "03:00 AM",
    breakDuration: "30 min",
    gracePeriod: "15 min",
    status: "Active",
  },
];

const initialState = {
  // Active Sub-Tab: "Shift Patterns" | "Shift Roster" | "Calendar View"
  activeShiftSubTab: "Shift Patterns",

  // KPI Metrics
  totalShifts: 6,
  activeShifts: 6,
  employeesAssigned: 0,
  unassignedEmployees: 4,

  // Shift Patterns Summary
  patternsSummary: [
    { type: "Day", count: 3, color: "#2563EB" },
    { type: "Night", count: 2, color: "#8B5CF6" },
    { type: "Rotational", count: 1, color: "#D97706" },
  ],

  // Shift Patterns List (screenshot table)
  patterns: initialShiftPatterns,

  // Roster Filters
  searchQuery: "",
  selectedClient: "All Clients",
  selectedSite: "All Sites",
  selectedDepartment: "All Departments",
  selectedShift: "All Shifts",
  selectedShiftType: "All Types",
  selectedStatus: "All Status",
  selectedDate: "10/19/2026",

  // Employee shift roster table records
  roster: initialRosterEmployees,

  // Client Summary Data
  clientSummary: [
    { client: "RR Security & Facilities", employees: 0, activeShifts: 6 },
    { client: "RSAG Sealing Solutions Pvt Ltd", employees: 0, activeShifts: 3 },
    { client: "Petal Commercial Pvt Ltd", employees: 0, activeShifts: 2 },
  ],
};

const recalculatePatternSummary = (patterns) => {
  const dayCount = patterns.filter((p) => p.type === "Day").length;
  const nightCount = patterns.filter((p) => p.type === "Night").length;
  const rotCount = patterns.filter((p) => p.type === "Rotational").length;
  return [
    { type: "Day", count: dayCount, color: "#2563EB" },
    { type: "Night", count: nightCount, color: "#8B5CF6" },
    { type: "Rotational", count: rotCount, color: "#D97706" },
  ];
};

const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setActiveShiftSubTab: (state, action) => {
      state.activeShiftSubTab = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
    setSelectedSite: (state, action) => {
      state.selectedSite = action.payload;
    },
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    setSelectedShift: (state, action) => {
      state.selectedShift = action.payload;
    },
    setSelectedShiftType: (state, action) => {
      state.selectedShiftType = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    resetShiftFilters: (state) => {
      state.searchQuery = "";
      state.selectedClient = "All Clients";
      state.selectedSite = "All Sites";
      state.selectedDepartment = "All Departments";
      state.selectedShift = "All Shifts";
      state.selectedShiftType = "All Types";
      state.selectedStatus = "All Status";
      state.selectedDate = "10/19/2026";
    },
    assignShift: (state, action) => {
      const { employeeId, shiftName, shiftType } = action.payload;
      const emp = state.roster.find((r) => r.id === employeeId || r.empId === employeeId);
      if (emp) {
        emp.shift = shiftName;
        emp.shiftType = shiftType || "Day";
      }
      state.employeesAssigned = state.roster.filter((r) => r.shift !== "Unassigned").length;
      state.unassignedEmployees = state.roster.filter((r) => r.shift === "Unassigned").length;
    },
    unassignShift: (state, action) => {
      const employeeId = action.payload;
      const emp = state.roster.find((r) => r.id === employeeId || r.empId === employeeId);
      if (emp) {
        emp.shift = "Unassigned";
        emp.shiftType = "—";
      }
      state.employeesAssigned = state.roster.filter((r) => r.shift !== "Unassigned").length;
      state.unassignedEmployees = state.roster.filter((r) => r.shift === "Unassigned").length;
    },
    addShiftPattern: (state, action) => {
      const newPattern = {
        id: `pat_${Date.now()}`,
        status: "Active",
        breakDuration: "30 min",
        gracePeriod: "15 min",
        ...action.payload,
      };
      state.patterns.unshift(newPattern);
      state.totalShifts = state.patterns.length;
      state.activeShifts = state.patterns.filter((p) => p.status === "Active").length;
      state.patternsSummary = recalculatePatternSummary(state.patterns);
    },
    editShiftPattern: (state, action) => {
      const index = state.patterns.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patterns[index] = { ...state.patterns[index], ...action.payload };
      }
      state.activeShifts = state.patterns.filter((p) => p.status === "Active").length;
      state.patternsSummary = recalculatePatternSummary(state.patterns);
    },
    deleteShiftPattern: (state, action) => {
      state.patterns = state.patterns.filter((p) => p.id !== action.payload);
      state.totalShifts = state.patterns.length;
      state.activeShifts = state.patterns.filter((p) => p.status === "Active").length;
      state.patternsSummary = recalculatePatternSummary(state.patterns);
    },
  },
});

export const {
  setActiveShiftSubTab,
  setSearchQuery,
  setSelectedClient,
  setSelectedSite,
  setSelectedDepartment,
  setSelectedShift,
  setSelectedShiftType,
  setSelectedStatus,
  setSelectedDate,
  resetShiftFilters,
  assignShift,
  unassignShift,
  addShiftPattern,
  editShiftPattern,
  deleteShiftPattern,
} = shiftsSlice.actions;

export default shiftsSlice.reducer;
