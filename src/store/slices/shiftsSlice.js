import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStatus: "All",
  shifts: [
    {
      id: "sh_1",
      name: "Morning Shift",
      code: "MS-01",
      timing: "06:00 AM - 02:00 PM",
      totalHours: "8 Hours",
      assignedGuards: 18,
      supervisors: ["Anita Verma"],
      sitesCount: 4,
      status: "In Progress",
      color: "#16A34A",
      bgLight: "#ECFDF5",
      description: "Primary morning gate access control and visitor screening.",
    },
    {
      id: "sh_2",
      name: "General Day Shift",
      code: "GS-02",
      timing: "08:00 AM - 05:00 PM",
      totalHours: "9 Hours",
      assignedGuards: 12,
      supervisors: ["Rajesh Singh"],
      sitesCount: 3,
      status: "In Progress",
      color: "#2563EB",
      bgLight: "#EFF6FF",
      description: "Corporate office front-desk concierge and perimeter inspection.",
    },
    {
      id: "sh_3",
      name: "Evening Shift",
      code: "ES-03",
      timing: "02:00 PM - 10:00 PM",
      totalHours: "8 Hours",
      assignedGuards: 14,
      supervisors: ["Vikram Rawat"],
      sitesCount: 4,
      status: "Upcoming",
      color: "#D97706",
      bgLight: "#FFFBEB",
      description: "Evening rush hour crowd management and parking supervision.",
    },
    {
      id: "sh_4",
      name: "Night Patrol Shift",
      code: "NS-04",
      timing: "10:00 PM - 06:00 AM",
      totalHours: "8 Hours",
      assignedGuards: 16,
      supervisors: ["Rajesh Singh", "Krishan Kumar"],
      sitesCount: 5,
      status: "Scheduled",
      color: "#7C3AED",
      bgLight: "#F5F3FF",
      description: "Night security patrolling, CCTV surveillance and perimeter lockup.",
    },
  ],
};

const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setShiftFilter: (state, action) => {
      state.selectedStatus = action.payload;
    },
    addShift: (state, action) => {
      state.shifts.unshift({
        id: `sh_${Date.now()}`,
        status: "Scheduled",
        color: "#2563EB",
        bgLight: "#EFF6FF",
        ...action.payload,
      });
    },
    toggleShiftStatus: (state, action) => {
      const shift = state.shifts.find((s) => s.id === action.payload);
      if (shift) {
        shift.status = shift.status === "In Progress" ? "Completed" : "In Progress";
      }
    },
  },
});

export const { setShiftFilter, addShift, toggleShiftStatus } = shiftsSlice.actions;

export default shiftsSlice.reducer;
