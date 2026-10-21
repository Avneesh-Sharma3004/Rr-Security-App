import { createSlice } from "@reduxjs/toolkit";

const initialAttendanceRecords = [
  {
    id: "att_1",
    empId: "RR-001",
    name: "Bandna Rana",
    fatherName: "Ravish Rana",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Plant 1 - Manesar",
    department: "Office Staff",
    monthYear: "2026-10 2026",
    present: 0,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Absent",
    avatarLetter: "R",
    avatarColor: "#7C3AED",
  },
  {
    id: "att_2",
    empId: "RR-001",
    name: "Bandna Rana",
    fatherName: "Ravish Rana",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Plant 1 - Manesar",
    department: "Office Staff",
    monthYear: "2026-10 2026",
    present: 0,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Absent",
    avatarLetter: "R",
    avatarColor: "#7C3AED",
  },
  {
    id: "att_3",
    empId: "RR-001",
    name: "Bandna Rana",
    fatherName: "Ravish Rana",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Plant 1 - Manesar",
    department: "Office Staff",
    monthYear: "2026-10 2026",
    present: 0,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Absent",
    avatarLetter: "R",
    avatarColor: "#7C3AED",
  },
  {
    id: "att_4",
    empId: "RR-002",
    name: "Deepa",
    fatherName: "Sunil Kumar",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Warehouse Unit 2",
    department: "Worker",
    monthYear: "2026-10 2026",
    present: 1,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Present",
    avatarLetter: "R",
    avatarColor: "#7C3AED",
  },
  {
    id: "att_5",
    empId: "RR-002",
    name: "Deepa",
    fatherName: "Sunil Kumar",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Warehouse Unit 2",
    department: "Worker",
    monthYear: "2026-10 2026",
    present: 1,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Present",
    avatarLetter: "R",
    avatarColor: "#7C3AED",
  },
  {
    id: "att_6",
    empId: "RR-002",
    name: "Deepa",
    fatherName: "Sunil Kumar",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Warehouse Unit 2",
    department: "Worker",
    monthYear: "2026-10 2026",
    present: 1,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Present",
    avatarLetter: "R",
    avatarColor: "#7C3AED",
  },
  {
    id: "att_7",
    empId: "RR-003",
    name: "Shikha",
    fatherName: "Krishan Kumar",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Warehouse Unit 2",
    department: "Worker",
    monthYear: "2026-10 2026",
    present: 1,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Present",
    avatarLetter: "S",
    avatarColor: "#DC2626",
  },
  {
    id: "att_8",
    empId: "RR-003",
    name: "Shikha",
    fatherName: "Krishan Kumar",
    client: "RSAG Sealing Solutions Pvt Ltd",
    site: "Warehouse Unit 2",
    department: "Worker",
    monthYear: "2026-10 2026",
    present: 1,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Present",
    avatarLetter: "S",
    avatarColor: "#DC2626",
  },
  {
    id: "att_9",
    empId: "RR-004",
    name: "Krishan Kumar",
    fatherName: "Ram Singh",
    client: "Petal Commercial Pvt Ltd",
    site: "DLF CyberCity Hub",
    department: "Security",
    monthYear: "2026-10 2026",
    present: 1,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Present",
    avatarLetter: "K",
    avatarColor: "#2563EB",
  },
  {
    id: "att_10",
    empId: "RR-005",
    name: "Raghav Sharma",
    fatherName: "Dharmendra Sharma",
    client: "RR Security & Facilities",
    site: "Corporate HQ",
    department: "Security",
    monthYear: "2026-10 2026",
    present: 1,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Present",
    avatarLetter: "R",
    avatarColor: "#D97706",
  },
  {
    id: "att_11",
    empId: "RR-006",
    name: "Aman Sharma",
    fatherName: "Mahesh Sharma",
    client: "RR Security & Facilities",
    site: "Corporate HQ",
    department: "Security",
    monthYear: "2026-10 2026",
    present: 1,
    weekOff: 0,
    holidays: 0,
    cl: 0,
    sl: 0,
    el: 0,
    lwp: 0,
    workingDays: 1,
    status: "Present",
    avatarLetter: "A",
    avatarColor: "#059669",
  },
];

const monthsList = [
  "Aug 2026",
  "Sep 2026",
  "Oct 2026",
  "Nov 2026",
  "Dec 2026",
];

const initialState = {
  searchQuery: "",
  timeframe: "Current Month", // "Current Month", "Previous Month", "Custom Range"
  selectedMonthIndex: 2, // Oct 2026
  selectedMonth: "Oct 2026",
  displayDate: "October 2026",
  selectedClient: "All Clients",
  selectedSite: "All Sites",
  selectedDepartment: "All Departments",
  selectedStatus: "All Statuses", // "All Statuses", "Present", "Absent"
  records: initialAttendanceRecords,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setTimeframe: (state, action) => {
      state.timeframe = action.payload;
    },
    prevMonth: (state) => {
      if (state.selectedMonthIndex > 0) {
        state.selectedMonthIndex -= 1;
        state.selectedMonth = monthsList[state.selectedMonthIndex];
        state.displayDate = `${state.selectedMonth.split(" ")[0]}ober 2026`; // descriptive
      }
    },
    nextMonth: (state) => {
      if (state.selectedMonthIndex < monthsList.length - 1) {
        state.selectedMonthIndex += 1;
        state.selectedMonth = monthsList[state.selectedMonthIndex];
        state.displayDate = `${state.selectedMonth.split(" ")[0]} 2026`;
      }
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
      const idx = monthsList.indexOf(action.payload);
      if (idx !== -1) state.selectedMonthIndex = idx;
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
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.timeframe = "Current Month";
      state.selectedMonthIndex = 2;
      state.selectedMonth = "Oct 2026";
      state.displayDate = "October 2026";
      state.selectedClient = "All Clients";
      state.selectedSite = "All Sites";
      state.selectedDepartment = "All Departments";
      state.selectedStatus = "All Statuses";
    },
    editAttendanceRecord: (state, action) => {
      const index = state.records.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = { ...state.records[index], ...action.payload };
      }
    },
    deleteAttendanceRecord: (state, action) => {
      state.records = state.records.filter((r) => r.id !== action.payload);
    },
    addAttendanceRecord: (state, action) => {
      state.records.unshift({
        id: `att_${Date.now()}`,
        present: 1,
        weekOff: 0,
        holidays: 0,
        cl: 0,
        sl: 0,
        el: 0,
        lwp: 0,
        workingDays: 1,
        status: "Present",
        monthYear: "2026-10 2026",
        avatarLetter: (action.payload.name || "A")[0].toUpperCase(),
        avatarColor: "#2563EB",
        ...action.payload,
      });
    },
  },
});

export const {
  setSearchQuery,
  setTimeframe,
  prevMonth,
  nextMonth,
  setSelectedMonth,
  setSelectedClient,
  setSelectedSite,
  setSelectedDepartment,
  setSelectedStatus,
  resetFilters,
  editAttendanceRecord,
  deleteAttendanceRecord,
  addAttendanceRecord,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
