import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStatusFilter: "All",
  todayDate: "19 October 2026",
  stats: {
    total: 4,
    present: 4,
    absent: 0,
    onLeave: 0,
    presentPercentage: "100%",
    activeNow: 4,
  },
  records: [
    {
      id: "att_1",
      employeeId: "e1",
      employeeName: "Krishan Kumar",
      empCode: "RR-SEC-0104",
      role: "Security Guard",
      site: "DLF CyberCity Hub - Gate 1",
      shift: "General Day Shift",
      checkInTime: "07:45 AM",
      checkOutTime: "—",
      status: "Present",
      workHours: "5h 42m",
      locationVerified: true,
      biometricStatus: "Verified",
    },
    {
      id: "att_2",
      employeeId: "e2",
      employeeName: "Rajesh Singh",
      empCode: "RR-SEC-0082",
      role: "Head Security Guard",
      site: "Apex Corporate Towers - Reception",
      shift: "Day Shift",
      checkInTime: "07:55 AM",
      checkOutTime: "—",
      status: "Present",
      workHours: "5h 32m",
      locationVerified: true,
      biometricStatus: "Verified",
    },
    {
      id: "att_3",
      employeeId: "e3",
      employeeName: "Anita Verma",
      empCode: "RR-SEC-0091",
      role: "Security Field Inspector",
      site: "Grand Hyatt Residences - Main Tower",
      shift: "Day Shift",
      checkInTime: "08:00 AM",
      checkOutTime: "—",
      status: "Present",
      workHours: "5h 27m",
      locationVerified: true,
      biometricStatus: "Verified",
    },
    {
      id: "att_4",
      employeeId: "e4",
      employeeName: "Sunita Devi",
      empCode: "RR-FAC-0045",
      role: "Facility & Housekeeping Lead",
      site: "Metro Logistic Park - Block C",
      shift: "Morning Shift",
      checkInTime: "08:10 AM",
      checkOutTime: "—",
      status: "Present",
      workHours: "5h 17m",
      locationVerified: true,
      biometricStatus: "Verified",
    },
  ],
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setAttendanceFilter: (state, action) => {
      state.selectedStatusFilter = action.payload;
    },
    recordCheckIn: (state, action) => {
      const { employeeId } = action.payload;
      const record = state.records.find((r) => r.employeeId === employeeId);
      if (record) {
        record.checkInTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        record.status = "Present";
      }
    },
    recordCheckOut: (state, action) => {
      const { employeeId } = action.payload;
      const record = state.records.find((r) => r.employeeId === employeeId);
      if (record) {
        record.checkOutTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    },
  },
});

export const { setAttendanceFilter, recordCheckIn, recordCheckOut } =
  attendanceSlice.actions;

export default attendanceSlice.reducer;
