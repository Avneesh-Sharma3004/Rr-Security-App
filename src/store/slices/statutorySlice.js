import { createSlice } from "@reduxjs/toolkit";

const initialStatutoryModules = [
  {
    id: "pf",
    title: "Provident Fund (PF)",
    shortKey: "PF",
    description:
      "Employee & Employer EPF contributions with wage ceiling limits",
    metricLabel: "Contribution:",
    metricValue: "12% (Emp) / 12% (Empr)",
    effectiveDate: "2026-09-01",
    footerMetaLabel: "Effective:",
    footerMetaValue: "2026-09-01",
    status: "Enabled",
    wageCeiling: "₹15,000",
    employeeContribution: "12%",
    employerContribution: "12% (3.67% EPF + 8.33% EPS)",
    adminCharges: "0.50%",
    edliCharges: "0.50%",
    calculationBasis: "Basic + DA",
  },
  {
    id: "esi",
    title: "Employee State Insurance (ESI)",
    shortKey: "ESI",
    description:
      "Healthcare insurance for employees drawing gross wages up to ₹21,000",
    metricLabel: "Contribution:",
    metricValue: "0.75% (Emp) / 3.25% (Empr)",
    effectiveDate: "2026-04-01",
    footerMetaLabel: "Effective:",
    footerMetaValue: "2026-04-01",
    status: "Enabled",
    wageCeiling: "₹21,000 Gross / Month",
    employeeContribution: "0.75%",
    employerContribution: "3.25%",
    totalContribution: "4.00%",
    calculationBasis: "Gross Earnings (excl. Annual Bonus)",
  },
  {
    id: "pt",
    title: "Professional Tax (PT)",
    shortKey: "PT",
    description:
      "State-specific tax slabs applied to monthly gross earnings",
    metricLabel: "Configured:",
    metricValue: "8 Slabs across 4 States",
    effectiveDate: "2026-04-01",
    footerMetaLabel: "Effective:",
    footerMetaValue: "2026-04-01",
    status: "Enabled",
    statesConfigured: ["Maharashtra", "Karnataka", "Telangana", "Tamil Nadu"],
    maxDeductionPerMonth: "₹200 - ₹300",
    calculationBasis: "Monthly Gross Earnings",
  },
  {
    id: "tds",
    title: "Tax Deducted at Source (TDS)",
    shortKey: "TDS",
    description:
      "Income tax withholding regimes, standard deductions, and declaration workflows",
    metricLabel: "Regime:",
    metricValue: "New Regime (2026-2027)",
    effectiveDate: "2026-04-01",
    footerMetaLabel: "Std Ded:",
    footerMetaValue: "₹75,000",
    status: "Enabled",
    defaultRegime: "Section 115BAC (New Tax Regime)",
    standardDeduction: "₹75,000",
    rebateLimit: "₹7,00,000 (Sec 87A)",
    surchargeApplicable: "Yes (for > ₹50 Lakhs)",
  },
  {
    id: "bonus",
    title: "Statutory Bonus",
    shortKey: "Bonus",
    description:
      "Payment of Bonus Act compliance rates, wage ceiling, and eligibility rules",
    metricLabel: "Rate:",
    metricValue: "8.33% (Min 8.33% - Max 20%)",
    effectiveDate: "2026-04-01",
    footerMetaLabel: "Ceiling:",
    footerMetaValue: "₹7,000",
    status: "Enabled",
    minBonusRate: "8.33%",
    maxBonusRate: "20.00%",
    statutoryWageCeiling: "₹7,000 or Minimum Wage (whichever is higher)",
    eligibilityCriteria: "30 Working Days in Financial Year",
  },
  {
    id: "gratuity",
    title: "Gratuity",
    shortKey: "Gratuity",
    description:
      "Payment of Gratuity Act rules for employee retirement and separation",
    metricLabel: "Eligibility:",
    metricValue: "5 Years Continuous Service",
    effectiveDate: "2026-04-01",
    footerMetaLabel: "Basis:",
    footerMetaValue: "Basic + DA",
    status: "Enabled",
    formula: "(15 * Last Drawn Basic * Tenure Years) / 26",
    maxTaxExemptLimit: "₹20,00,000",
    eligibilityYears: "5 Years (4 yrs 240 days)",
  },
];

const initialPfSettings = {
  moduleStatus: "Active",
  employeeContribution: "12",
  employerContribution: "12",
  wageCeiling: "25000",
  effectiveDate: "09/01/2026",
  vpfOption: "Allowed (Employees can contribute beyond 12%)",
  restrictWageCeiling: "Yes (Calculate maximum on ₹15,000)",
  createdBy: "2025-04-01 by System SuperAdmin",
  lastUpdated: "2026-10-12 by RR Security Administrator",
};

const initialEsiSettings = {
  moduleStatus: "Active",
  employeeContribution: "0.75",
  employerContribution: "3.25",
  wageEligibilityLimit: "21000",
  disabilityWageLimit: "25000",
  effectiveDate: "04/01/2026",
  note: "ESI deduction is computed on gross earned wage (excluding annual bonus and overtime). If an employee's daily wage is under ₹176, employee contribution is exempted.",
  createdBy: "2025-04-01 by System SuperAdmin",
  lastUpdated: "2026-04-01 by Admin",
};

const initialPtSlabs = [
  {
    id: "pt-1",
    state: "Maharashtra",
    salaryRange: "₹10,001 - Above",
    monthlyTax: "₹200 / month",
    febSpecialRate: "₹300 (Feb)",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "pt-2",
    state: "Karnataka",
    salaryRange: "₹0 - ₹15,000",
    monthlyTax: "Exempt (₹0)",
    febSpecialRate: "Same as Regular",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "pt-3",
    state: "Karnataka",
    salaryRange: "₹15,001 - Above",
    monthlyTax: "₹200 / month",
    febSpecialRate: "Same as Regular",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "pt-4",
    state: "Telangana",
    salaryRange: "₹0 - ₹15,000",
    monthlyTax: "Exempt (₹0)",
    febSpecialRate: "Same as Regular",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "pt-5",
    state: "Telangana",
    salaryRange: "₹15,001 - ₹20,000",
    monthlyTax: "₹150 / month",
    febSpecialRate: "Same as Regular",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "pt-6",
    state: "Telangana",
    salaryRange: "₹20,001 - Above",
    monthlyTax: "₹200 / month",
    febSpecialRate: "Same as Regular",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
];

const initialTdsSettings = {
  moduleStatus: "Active",
  defaultTaxRegime: "New Tax Regime (Section 115BAC - Default)",
  effectiveFinancialYear: "FY 2026-2027 (AY 2027-2028)",
  standardDeductionNew: "75000",
  standardDeductionOld: "50000",
  requireInvestmentDeclaration: "Yes (Enable 80C, 80D, HRA proof submissions)",
  proofSubmissionDeadline: "01/31/2027",
  lastUpdated: "2026-04-01 by Admin",
};

const initialBonusSettings = {
  moduleStatus: "Active",
  calculationMethod: "Percentage of Basic Salary",
  bonusRate: "8.33",
  wageCeiling: "7000",
  minServiceDays: "30",
  disbursementSchedule: "Annual (Diwali / Puja Festival)",
  effectiveDate: "04/01/2026",
  lastUpdated: "2026-10-16 by RR Security Administrator",
};

const initialGratuitySettings = {
  moduleStatus: "Active",
  eligibilityPeriodYears: "5",
  calculationBasis: "Basic Salary + Dearness Allowance (DA)",
  maxTaxExemptionLimit: "2000000",
  effectiveDate: "04/01/2026",
  formula: "15 Days x (Last Drawn Basic + DA) x Completed Years / 26",
  lastUpdated: "2026-04-01 by Admin",
};

const initialLwfRules = [
  {
    id: "lwf-1",
    state: "Haryana",
    employeeShare: "₹25",
    employerShare: "₹50",
    frequency: "Monthly",
    deductionMonths: "Every Month",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "lwf-2",
    state: "West Bengal",
    employeeShare: "₹3",
    employerShare: "₹15",
    frequency: "Half-Yearly",
    deductionMonths: "June & December",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "lwf-3",
    state: "Maharashtra",
    employeeShare: "₹12",
    employerShare: "₹36",
    frequency: "Half-Yearly",
    deductionMonths: "June & December",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "lwf-4",
    state: "Karnataka",
    employeeShare: "₹20",
    employerShare: "₹40",
    frequency: "Annual",
    deductionMonths: "December Only",
    effectiveDate: "2026-04-01",
    status: "Active",
  },
];

const initialState = {
  activeStatutorySubTab: "Overview",
  modules: initialStatutoryModules,
  pfSettings: initialPfSettings,
  esiSettings: initialEsiSettings,
  ptSlabs: initialPtSlabs,
  ptStateFilter: "All States",
  ptSearchQuery: "",
  tdsSettings: initialTdsSettings,
  bonusSettings: initialBonusSettings,
  gratuitySettings: initialGratuitySettings,
  lwfRules: initialLwfRules,
  lwfStateFilter: "All States",
  lwfModuleStatus: "Active",
};

const statutorySlice = createSlice({
  name: "statutory",
  initialState,
  reducers: {
    setActiveStatutorySubTab: (state, action) => {
      state.activeStatutorySubTab = action.payload;
    },
    toggleModuleStatus: (state, action) => {
      const mod = state.modules.find((m) => m.id === action.payload);
      if (mod) {
        mod.status = mod.status === "Enabled" ? "Disabled" : "Enabled";
      }
    },
    updateModuleConfig: (state, action) => {
      const idx = state.modules.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) {
        state.modules[idx] = {
          ...state.modules[idx],
          ...action.payload,
        };
      }
    },

    // PF Settings
    savePfSettings: (state, action) => {
      state.pfSettings = {
        ...state.pfSettings,
        ...action.payload,
        lastUpdated: `Just now by ${action.payload.updatedBy || "Admin"}`,
      };
      // sync with overview module
      const pfMod = state.modules.find((m) => m.id === "pf");
      if (pfMod) {
        pfMod.metricValue = `${action.payload.employeeContribution}% (Emp) / ${action.payload.employerContribution}% (Empr)`;
        pfMod.effectiveDate = action.payload.effectiveDate;
        pfMod.footerMetaValue = action.payload.effectiveDate;
      }
    },
    togglePfModuleStatus: (state) => {
      state.pfSettings.moduleStatus =
        state.pfSettings.moduleStatus === "Active" ? "Inactive" : "Active";
    },

    // ESI Settings
    saveEsiSettings: (state, action) => {
      state.esiSettings = {
        ...state.esiSettings,
        ...action.payload,
        lastUpdated: `Just now by ${action.payload.updatedBy || "Admin"}`,
      };
      // sync with overview module
      const esiMod = state.modules.find((m) => m.id === "esi");
      if (esiMod) {
        esiMod.metricValue = `${action.payload.employeeContribution}% (Emp) / ${action.payload.employerContribution}% (Empr)`;
        esiMod.effectiveDate = action.payload.effectiveDate;
        esiMod.footerMetaValue = action.payload.effectiveDate;
      }
    },
    toggleEsiModuleStatus: (state) => {
      state.esiSettings.moduleStatus =
        state.esiSettings.moduleStatus === "Active" ? "Inactive" : "Active";
    },

    // PT Slabs
    setPtStateFilter: (state, action) => {
      state.ptStateFilter = action.payload;
    },
    setPtSearchQuery: (state, action) => {
      state.ptSearchQuery = action.payload;
    },
    addPtSlab: (state, action) => {
      state.ptSlabs.unshift({
        id: `pt-${Date.now()}`,
        state: action.payload.state,
        salaryRange: action.payload.salaryRange,
        monthlyTax: action.payload.monthlyTax,
        febSpecialRate: action.payload.febSpecialRate || "Same as Regular",
        effectiveDate: action.payload.effectiveDate || "2026-04-01",
        status: action.payload.status || "Active",
      });
    },
    editPtSlab: (state, action) => {
      const idx = state.ptSlabs.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) {
        state.ptSlabs[idx] = { ...state.ptSlabs[idx], ...action.payload };
      }
    },
    deletePtSlab: (state, action) => {
      state.ptSlabs = state.ptSlabs.filter((s) => s.id !== action.payload);
    },
    togglePtSlabStatus: (state, action) => {
      const slab = state.ptSlabs.find((s) => s.id === action.payload);
      if (slab) {
        slab.status = slab.status === "Active" ? "Inactive" : "Active";
      }
    },

    // TDS Settings
    saveTdsSettings: (state, action) => {
      state.tdsSettings = {
        ...state.tdsSettings,
        ...action.payload,
        lastUpdated: `Just now by ${action.payload.updatedBy || "Admin"}`,
      };
      const tdsMod = state.modules.find((m) => m.id === "tds");
      if (tdsMod) {
        tdsMod.metricValue = action.payload.defaultTaxRegime;
        tdsMod.footerMetaValue = `₹${action.payload.standardDeductionNew}`;
      }
    },
    toggleTdsModuleStatus: (state) => {
      state.tdsSettings.moduleStatus =
        state.tdsSettings.moduleStatus === "Active" ? "Inactive" : "Active";
    },

    // Bonus Settings
    saveBonusSettings: (state, action) => {
      state.bonusSettings = {
        ...state.bonusSettings,
        ...action.payload,
        lastUpdated: `Just now by ${action.payload.updatedBy || "Admin"}`,
      };
      const bonusMod = state.modules.find((m) => m.id === "bonus");
      if (bonusMod) {
        bonusMod.metricValue = `${action.payload.bonusRate}% (Min 8.33% - Max 20%)`;
        bonusMod.footerMetaValue = `₹${action.payload.wageCeiling}`;
        bonusMod.effectiveDate = action.payload.effectiveDate;
      }
    },
    toggleBonusModuleStatus: (state) => {
      state.bonusSettings.moduleStatus =
        state.bonusSettings.moduleStatus === "Active" ? "Inactive" : "Active";
    },

    // Gratuity Settings
    saveGratuitySettings: (state, action) => {
      state.gratuitySettings = {
        ...state.gratuitySettings,
        ...action.payload,
        lastUpdated: `Just now by ${action.payload.updatedBy || "Admin"}`,
      };
      const gratMod = state.modules.find((m) => m.id === "gratuity");
      if (gratMod) {
        gratMod.metricValue = `${action.payload.eligibilityPeriodYears} Years Continuous Service`;
        gratMod.footerMetaValue = action.payload.calculationBasis;
        gratMod.effectiveDate = action.payload.effectiveDate;
      }
    },
    toggleGratuityModuleStatus: (state) => {
      state.gratuitySettings.moduleStatus =
        state.gratuitySettings.moduleStatus === "Active" ? "Inactive" : "Active";
    },

    // LWF Rules
    setLwfStateFilter: (state, action) => {
      state.lwfStateFilter = action.payload;
    },
    toggleLwfModuleStatus: (state) => {
      state.lwfModuleStatus =
        state.lwfModuleStatus === "Active" ? "Inactive" : "Active";
    },
    addLwfRule: (state, action) => {
      state.lwfRules.unshift({
        id: `lwf-${Date.now()}`,
        state: action.payload.state,
        employeeShare: action.payload.employeeShare.startsWith("₹")
          ? action.payload.employeeShare
          : `₹${action.payload.employeeShare}`,
        employerShare: action.payload.employerShare.startsWith("₹")
          ? action.payload.employerShare
          : `₹${action.payload.employerShare}`,
        frequency: action.payload.frequency || "Monthly",
        deductionMonths: action.payload.deductionMonths || "Every Month",
        effectiveDate: action.payload.effectiveDate || "2026-04-01",
        status: action.payload.status || "Active",
      });
    },
    editLwfRule: (state, action) => {
      const idx = state.lwfRules.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) {
        state.lwfRules[idx] = {
          ...state.lwfRules[idx],
          ...action.payload,
          employeeShare: action.payload.employeeShare.startsWith("₹")
            ? action.payload.employeeShare
            : `₹${action.payload.employeeShare}`,
          employerShare: action.payload.employerShare.startsWith("₹")
            ? action.payload.employerShare
            : `₹${action.payload.employerShare}`,
        };
      }
    },
    deleteLwfRule: (state, action) => {
      state.lwfRules = state.lwfRules.filter((r) => r.id !== action.payload);
    },
    toggleLwfRuleStatus: (state, action) => {
      const rule = state.lwfRules.find((r) => r.id === action.payload);
      if (rule) {
        rule.status = rule.status === "Active" ? "Inactive" : "Active";
      }
    },
  },
});

export const {
  setActiveStatutorySubTab,
  toggleModuleStatus,
  updateModuleConfig,
  savePfSettings,
  togglePfModuleStatus,
  saveEsiSettings,
  toggleEsiModuleStatus,
  setPtStateFilter,
  setPtSearchQuery,
  addPtSlab,
  editPtSlab,
  deletePtSlab,
  togglePtSlabStatus,
  saveTdsSettings,
  toggleTdsModuleStatus,
  saveBonusSettings,
  toggleBonusModuleStatus,
  saveGratuitySettings,
  toggleGratuityModuleStatus,
  setLwfStateFilter,
  toggleLwfModuleStatus,
  addLwfRule,
  editLwfRule,
  deleteLwfRule,
  toggleLwfRuleStatus,
} = statutorySlice.actions;

export default statutorySlice.reducer;
