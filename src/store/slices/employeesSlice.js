import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  selectedDepartment: "All",
  employees: [
    {
      id: "e1",
      name: "Krishan Kumar",
      empCode: "RR-SEC-0104",
      role: "Security Guard",
      department: "Security",
      phone: "+91 98123 45670",
      status: "Active",
      gender: "Male",
      site: "DLF CyberCity Hub",
      shift: "Day Shift",
      joiningDate: "05 Oct 2026",
      avatarBg: "#2563EB",
      salary: "₹ 18,500",
      bloodGroup: "O+",
    },
    {
      id: "e2",
      name: "Rajesh Singh",
      empCode: "RR-SEC-0082",
      role: "Head Security Guard",
      department: "Security",
      phone: "+91 98234 56781",
      status: "Active",
      gender: "Male",
      site: "Apex Corporate Towers",
      shift: "Night Patrol",
      joiningDate: "12 Jan 2025",
      avatarBg: "#16A34A",
      salary: "₹ 22,000",
      bloodGroup: "B+",
    },
    {
      id: "e3",
      name: "Anita Verma",
      empCode: "RR-SEC-0091",
      role: "Security Field Inspector",
      department: "Security",
      phone: "+91 98345 67892",
      status: "Active",
      gender: "Female",
      site: "Grand Hyatt Residences",
      shift: "Day Shift",
      joiningDate: "20 Jun 2025",
      avatarBg: "#EC4899",
      salary: "₹ 24,500",
      bloodGroup: "A+",
    },
    {
      id: "e4",
      name: "Sunita Devi",
      empCode: "RR-FAC-0045",
      role: "Facility & Housekeeping Lead",
      department: "Facility & Housekeeping",
      phone: "+91 98456 78903",
      status: "Active",
      gender: "Female",
      site: "Metro Logistic Park",
      shift: "Morning Shift",
      joiningDate: "15 Sep 2026",
      avatarBg: "#8B5CF6",
      salary: "₹ 17,200",
      bloodGroup: "AB+",
    },
  ],
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployeeSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setEmployeeDepartmentFilter: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    addEmployee: (state, action) => {
      const newId = `e_${Date.now()}`;
      state.employees.unshift({
        id: newId,
        empCode: `RR-SEC-0${Math.floor(100 + Math.random() * 900)}`,
        status: "Active",
        avatarBg: "#2563EB",
        salary: "₹ 19,000",
        bloodGroup: "O+",
        ...action.payload,
      });
    },
    toggleEmployeeStatus: (state, action) => {
      const emp = state.employees.find((e) => e.id === action.payload);
      if (emp) {
        emp.status = emp.status === "Active" ? "Inactive" : "Active";
      }
    },
  },
});

export const {
  setEmployeeSearchQuery,
  setEmployeeDepartmentFilter,
  addEmployee,
  toggleEmployeeStatus,
} = employeesSlice.actions;

export default employeesSlice.reducer;
