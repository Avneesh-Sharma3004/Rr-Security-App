import { createSlice } from "@reduxjs/toolkit";

const initialPayGroups = [
  {
    id: "pg-1",
    name: "Monthly Security Guard Staff",
    code: "PG-SEC-01",
    description:
      "Primary pay group for on-site security guards, supervisors and field marshals.",
    paySchedule: "Monthly Payroll",
    payCycle: "Standard Monthly (1st to End of Month)",
    payDay: "7th of Every Month",
    calculationMethod: "Calendar Days Basis",
    componentsCount: 9,
    componentsList: [
      "Basic Salary",
      "HRA",
      "Uniform Allowance",
      "Night Shift Allowance",
      "Overtime Allowance",
      "Conveyance Allowance",
      "EPF (12%)",
      "ESIC (0.75%)",
      "Professional Tax",
    ],
    status: "Active",
    assignedEmployees: 42,
  },
  {
    id: "pg-2",
    name: "Corporate & Office Staff",
    code: "PG-OFF-02",
    description:
      "Pay structure for head office executives, HR, accounts and admin personnel.",
    paySchedule: "Monthly Payroll",
    payCycle: "Standard Monthly (1st to End of Month)",
    payDay: "Last Working Day",
    calculationMethod: "Calendar Days Basis",
    componentsCount: 7,
    componentsList: [
      "Basic Salary",
      "HRA",
      "Special Allowance",
      "Medical Reimbursement",
      "EPF (12%)",
      "TDS Deductions",
      "Professional Tax",
    ],
    status: "Active",
    assignedEmployees: 18,
  },
  {
    id: "pg-3",
    name: "Weekly Contract Manpower",
    code: "PG-CONT-03",
    description:
      "Short-tenure workforce and temporary event deployment security personnel.",
    paySchedule: "Weekly Payroll",
    payCycle: "Standard Weekly (Monday to Sunday)",
    payDay: "10th of Every Month",
    calculationMethod: "Working Days Basis (26 Days)",
    componentsCount: 5,
    componentsList: [
      "Daily Wage Rate",
      "Site Transport Allowance",
      "Food Allowance",
      "ESIC (0.75%)",
      "Statutory Bonus",
    ],
    status: "Active",
    assignedEmployees: 24,
  },
  {
    id: "pg-4",
    name: "Executive & Facility In-Charge",
    code: "PG-EXEC-04",
    description:
      "Senior facility directors and regional operations managers across zonal offices.",
    paySchedule: "Monthly Payroll",
    payCycle: "Standard Monthly (1st to End of Month)",
    payDay: "Last Working Day",
    calculationMethod: "Calendar Days Basis",
    componentsCount: 6,
    componentsList: [
      "Executive Basic",
      "Car Allowance",
      "Executive Health Insurance",
      "EPF (12%)",
      "TDS Deductions",
      "Gratuity Provision",
    ],
    status: "Active",
    assignedEmployees: 8,
  },
];

const initialPaySchedules = [
  {
    id: "ps-1",
    name: "Monthly Payroll",
    description:
      "Standard monthly payroll processing schedule for regular on-site security and administration staff",
    status: "Active",
  },
  {
    id: "ps-2",
    name: "Weekly Payroll",
    description:
      "Weekly payroll schedule for short-term temporary manpower and daily wages",
    status: "Active",
  },
  {
    id: "ps-3",
    name: "Bi-Weekly Payroll",
    description:
      "Fortnightly payout schedule processed every 14 days",
    status: "Active",
  },
  {
    id: "ps-4",
    name: "Daily Wage Settlement",
    description:
      "Ad-hoc daily payment schedule for spot-hired event security guards",
    status: "Inactive",
  },
];

const initialPayCycles = [
  {
    id: "pc-1",
    name: "Standard Monthly (1st to End of Month)",
    frequency: "Monthly",
    cutoffBounds: "Day 1 to 31",
    description:
      "Full calendar month cycle from 1st day to last calendar day of the month",
    status: "Active",
  },
  {
    id: "pc-2",
    name: "Mid-Month Cutoff (26th to 25th)",
    frequency: "Monthly",
    cutoffBounds: "Day 26 to 25",
    description:
      "Attendance & overtime cutoff from 26th of previous month to 25th of current month",
    status: "Active",
  },
  {
    id: "pc-3",
    name: "Standard Weekly (Monday to Sunday)",
    frequency: "Weekly",
    cutoffBounds: "Day 1 to 7",
    description:
      "7-day weekly roster cycle beginning every Monday morning",
    status: "Active",
  },
  {
    id: "pc-4",
    name: "Bi-Weekly 14-Day Cycle",
    frequency: "Bi-Weekly",
    cutoffBounds: "Day 1 to 14",
    description:
      "Two-week cycle starting 1st and 15th of the calendar month",
    status: "Active",
  },
];

const initialPayDays = [
  {
    id: "pd-1",
    ruleName: "7th of Every Month",
    payDayType: "Fixed Day",
    disbursementTiming: "7th of Month",
    description:
      "Salary disbursement on the 7th of every month. If holiday, processed prior.",
    status: "Active",
  },
  {
    id: "pd-2",
    ruleName: "Last Working Day",
    payDayType: "Last Working Day",
    disbursementTiming: "Last Working Day",
    description:
      "Disbursed on the last official working day before month end.",
    status: "Active",
  },
  {
    id: "pd-3",
    ruleName: "10th of Every Month",
    payDayType: "Fixed Day",
    disbursementTiming: "10th of Month",
    description:
      "Payout on 10th of every month for contract workers.",
    status: "Active",
  },
  {
    id: "pd-4",
    ruleName: "Last Calendar Day",
    payDayType: "Last Calendar Day",
    disbursementTiming: "Last Calendar Day",
    description:
      "Disbursed directly on 28th/30th/31st calendar close date.",
    status: "Inactive",
  },
];

const initialCalculationMethods = [
  {
    id: "cm-1",
    tag: "CAL_DAYS",
    name: "Calendar Days Basis",
    formula:
      "Per Day Salary = Monthly Gross / Total Days in Month (28/29/30/31)",
    description:
      "Calculates per-day salary by dividing fixed gross by total days in the month. Standard industry practice for monthly salaried workforce.",
    isDefault: true,
    status: "Active",
  },
  {
    id: "cm-2",
    tag: "WORK_DAYS_26",
    name: "Working Days Basis (26 Days)",
    formula: "Per Day Salary = Monthly Gross / Fixed 26 Days",
    description:
      "Calculates daily rate on a fixed 26 working days basis excluding weekly off days as per Minimum Wages Act guidelines.",
    isDefault: false,
    status: "Active",
  },
  {
    id: "cm-3",
    tag: "ACTUAL_ATTENDANCE",
    name: "Actual Attendance Days",
    formula: "Payout = (Daily Rate x Present Days) + Paid Leaves",
    description:
      "Strict pay calculation where salary is strictly prorated for each verified check-in shift and approved paid leave balance.",
    isDefault: false,
    status: "Active",
  },
];

const initialState = {
  activePayrollSubTab: "Pay Groups",
  searchQuery: "",
  selectedStatus: "All Status",
  selectedCycle: "All Cycles",
  kpiSummary: {
    configuredPayGroups: 4,
    activePayGroups: 4,
    activePaySchedules: 3,
    configuredPayCycles: 4,
    salaryCalculationMethod: "Calendar Days Basis",
    salaryCalculationDefault: "Default Basis",
  },
  payGroups: initialPayGroups,
  paySchedules: initialPaySchedules,
  payCycles: initialPayCycles,
  payDays: initialPayDays,
  calculationMethods: initialCalculationMethods,
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    setActivePayrollSubTab: (state, action) => {
      state.activePayrollSubTab = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setSelectedCycle: (state, action) => {
      state.selectedCycle = action.payload;
    },

    // Pay Groups
    addPayGroup: (state, action) => {
      const newGroup = {
        id: `pg-${Date.now()}`,
        name: action.payload.name,
        code: action.payload.code || `PG-${Math.floor(100 + Math.random() * 900)}`,
        description: action.payload.description || "Custom configured pay group.",
        paySchedule: action.payload.paySchedule || "Monthly Payroll",
        payCycle:
          action.payload.payCycle || "Standard Monthly (1st to End of Month)",
        payDay: action.payload.payDay || "7th of Every Month",
        calculationMethod:
          action.payload.calculationMethod || "Calendar Days Basis",
        componentsCount: action.payload.componentsCount || 6,
        componentsList: action.payload.componentsList || [
          "Basic Salary",
          "HRA",
          "Conveyance",
          "EPF (12%)",
          "ESIC",
          "Professional Tax",
        ],
        status: action.payload.status || "Active",
        assignedEmployees: action.payload.assignedEmployees || 0,
      };
      state.payGroups.unshift(newGroup);
      state.kpiSummary.configuredPayGroups = state.payGroups.length;
      state.kpiSummary.activePayGroups = state.payGroups.filter(
        (g) => g.status === "Active"
      ).length;
    },
    editPayGroup: (state, action) => {
      const idx = state.payGroups.findIndex((g) => g.id === action.payload.id);
      if (idx !== -1) {
        state.payGroups[idx] = {
          ...state.payGroups[idx],
          ...action.payload,
        };
        state.kpiSummary.activePayGroups = state.payGroups.filter(
          (g) => g.status === "Active"
        ).length;
      }
    },
    togglePayGroupStatus: (state, action) => {
      const group = state.payGroups.find((g) => g.id === action.payload);
      if (group) {
        group.status = group.status === "Active" ? "Inactive" : "Active";
        state.kpiSummary.activePayGroups = state.payGroups.filter(
          (g) => g.status === "Active"
        ).length;
      }
    },
    deletePayGroup: (state, action) => {
      state.payGroups = state.payGroups.filter((g) => g.id !== action.payload);
      state.kpiSummary.configuredPayGroups = state.payGroups.length;
      state.kpiSummary.activePayGroups = state.payGroups.filter(
        (g) => g.status === "Active"
      ).length;
    },

    // Pay Schedules
    addPaySchedule: (state, action) => {
      state.paySchedules.push({
        id: `ps-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description || "Configured pay schedule.",
        status: action.payload.status || "Active",
      });
      state.kpiSummary.activePaySchedules = state.paySchedules.filter(
        (s) => s.status === "Active"
      ).length;
    },
    editPaySchedule: (state, action) => {
      const idx = state.paySchedules.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) {
        state.paySchedules[idx] = { ...state.paySchedules[idx], ...action.payload };
        state.kpiSummary.activePaySchedules = state.paySchedules.filter(
          (s) => s.status === "Active"
        ).length;
      }
    },
    togglePayScheduleStatus: (state, action) => {
      const schedule = state.paySchedules.find((s) => s.id === action.payload);
      if (schedule) {
        schedule.status = schedule.status === "Active" ? "Inactive" : "Active";
        state.kpiSummary.activePaySchedules = state.paySchedules.filter(
          (s) => s.status === "Active"
        ).length;
      }
    },
    deletePaySchedule: (state, action) => {
      state.paySchedules = state.paySchedules.filter((s) => s.id !== action.payload);
      state.kpiSummary.activePaySchedules = state.paySchedules.filter(
        (s) => s.status === "Active"
      ).length;
    },

    // Pay Cycles
    addPayCycle: (state, action) => {
      state.payCycles.push({
        id: `pc-${Date.now()}`,
        name: action.payload.name,
        frequency: action.payload.frequency || "Monthly",
        cutoffBounds: action.payload.cutoffBounds || "Day 1 to 31",
        description: action.payload.description || "Configured attendance cutoff cycle.",
        status: action.payload.status || "Active",
      });
      state.kpiSummary.configuredPayCycles = state.payCycles.filter(
        (c) => c.status === "Active"
      ).length;
    },
    editPayCycle: (state, action) => {
      const idx = state.payCycles.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.payCycles[idx] = { ...state.payCycles[idx], ...action.payload };
        state.kpiSummary.configuredPayCycles = state.payCycles.filter(
          (c) => c.status === "Active"
        ).length;
      }
    },
    togglePayCycleStatus: (state, action) => {
      const cycle = state.payCycles.find((c) => c.id === action.payload);
      if (cycle) {
        cycle.status = cycle.status === "Active" ? "Inactive" : "Active";
        state.kpiSummary.configuredPayCycles = state.payCycles.filter(
          (c) => c.status === "Active"
        ).length;
      }
    },
    deletePayCycle: (state, action) => {
      state.payCycles = state.payCycles.filter((c) => c.id !== action.payload);
      state.kpiSummary.configuredPayCycles = state.payCycles.filter(
        (c) => c.status === "Active"
      ).length;
    },

    // Pay Day Rules
    addPayDayRule: (state, action) => {
      state.payDays.push({
        id: `pd-${Date.now()}`,
        ruleName: action.payload.ruleName,
        payDayType: action.payload.payDayType || "Fixed Day",
        disbursementTiming:
          action.payload.disbursementTiming || "7th of Month",
        description: action.payload.description || "Configured disbursement timing.",
        status: action.payload.status || "Active",
      });
    },
    editPayDayRule: (state, action) => {
      const idx = state.payDays.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) {
        state.payDays[idx] = { ...state.payDays[idx], ...action.payload };
      }
    },
    togglePayDayRuleStatus: (state, action) => {
      const rule = state.payDays.find((d) => d.id === action.payload);
      if (rule) {
        rule.status = rule.status === "Active" ? "Inactive" : "Active";
      }
    },
    deletePayDayRule: (state, action) => {
      state.payDays = state.payDays.filter((d) => d.id !== action.payload);
    },

    // Calculation Methods
    setDefaultCalculationMethod: (state, action) => {
      state.calculationMethods.forEach((m) => {
        m.isDefault = m.id === action.payload;
      });
      const def = state.calculationMethods.find((m) => m.id === action.payload);
      if (def) {
        state.kpiSummary.salaryCalculationMethod = def.name;
      }
    },

    resetFilters: (state) => {
      state.searchQuery = "";
      state.selectedStatus = "All Status";
      state.selectedCycle = "All Cycles";
    },
  },
});

export const {
  setActivePayrollSubTab,
  setSearchQuery,
  setSelectedStatus,
  setSelectedCycle,
  addPayGroup,
  editPayGroup,
  togglePayGroupStatus,
  deletePayGroup,
  addPaySchedule,
  editPaySchedule,
  togglePayScheduleStatus,
  deletePaySchedule,
  addPayCycle,
  editPayCycle,
  togglePayCycleStatus,
  deletePayCycle,
  addPayDayRule,
  editPayDayRule,
  togglePayDayRuleStatus,
  deletePayDayRule,
  setDefaultCalculationMethod,
  resetFilters,
} = payrollSlice.actions;

export default payrollSlice.reducer;
