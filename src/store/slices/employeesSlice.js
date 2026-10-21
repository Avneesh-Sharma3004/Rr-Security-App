import { createSlice } from "@reduxjs/toolkit";

const initialEmployees = [
  {
    id: "emp_6",
    empId: "RR-006",
    name: "Aman Sharma",
    client: "RR Security & Facilities",
    department: "Security",
    designation: "Security Guard",
    contact: "8767654329",
    status: "Active",
    joiningDate: "10 Oct 2026",
    salary: "₹18,500",
  },
  {
    id: "emp_5",
    empId: "RR-005",
    name: "Raghav Sharma",
    client: "RR Security & Facilities",
    department: "Security",
    designation: "Security Guard",
    contact: "8768789098",
    status: "Active",
    joiningDate: "01 Oct 2026",
    salary: "₹18,500",
  },
  {
    id: "emp_4",
    empId: "RR-004",
    name: "Krishan Kumar",
    client: "Petal Commercial Pvt Ltd",
    department: "Security",
    designation: "Security Supervisor",
    contact: "9891325252",
    status: "Active",
    joiningDate: "15 Sep 2026",
    salary: "₹24,000",
  },
  {
    id: "emp_3",
    empId: "RR-003",
    name: "Shikha",
    client: "RSAG Sealing Solutions Pvt Ltd",
    department: "Worker",
    designation: "Helper",
    contact: "9654842633",
    status: "Active",
    joiningDate: "20 Aug 2026",
    salary: "₹16,000",
  },
  {
    id: "emp_2",
    empId: "RR-002",
    name: "Deepa",
    client: "RSAG Sealing Solutions Pvt Ltd",
    department: "Worker",
    designation: "Helper",
    contact: "9311238249",
    status: "Active",
    joiningDate: "12 Aug 2026",
    salary: "₹16,000",
  },
  {
    id: "emp_1",
    empId: "RR-001",
    name: "Bandna Rana",
    client: "RSAG Sealing Solutions Pvt Ltd",
    department: "Office Staff",
    designation: "Office Asst",
    contact: "9990890891",
    status: "Active",
    joiningDate: "01 Jul 2026",
    salary: "₹22,000",
  },
];

const initialState = {
  searchQuery: "",
  statusTab: "All", // "All" | "Active" | "Inactive"
  companyFilter: "All Companies",
  departmentFilter: "All Departments",
  designationFilter: "All Designations",
  statusFilter: "All Status",
  employees: initialEmployees,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployeeSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStatusTab: (state, action) => {
      state.statusTab = action.payload;
    },
    setCompanyFilter: (state, action) => {
      state.companyFilter = action.payload;
    },
    setDepartmentFilter: (state, action) => {
      state.departmentFilter = action.payload;
    },
    setDesignationFilter: (state, action) => {
      state.designationFilter = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    resetEmployeeFilters: (state) => {
      state.searchQuery = "";
      state.statusTab = "All";
      state.companyFilter = "All Companies";
      state.departmentFilter = "All Departments";
      state.designationFilter = "All Designations";
      state.statusFilter = "All Status";
    },
    addEmployee: (state, action) => {
      const nextId = `RR-00${state.employees.length + 1}`;
      state.employees.unshift({
        id: `emp_${Date.now()}`,
        empId: nextId,
        status: "Active",
        joiningDate: "19 Oct 2026",
        salary: "₹18,500",
        ...action.payload,
      });
    },
    editEmployee: (state, action) => {
      const index = state.employees.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = { ...state.employees[index], ...action.payload };
      }
    },
    toggleEmployeeStatus: (state, action) => {
      const emp = state.employees.find((e) => e.id === action.payload);
      if (emp) {
        emp.status = emp.status === "Active" ? "Inactive" : "Active";
      }
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter((e) => e.id !== action.payload);
    },
  },
});

export const {
  setEmployeeSearchQuery,
  setStatusTab,
  setCompanyFilter,
  setDepartmentFilter,
  setDesignationFilter,
  setStatusFilter,
  resetEmployeeFilters,
  addEmployee,
  editEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
} = employeesSlice.actions;

export default employeesSlice.reducer;
