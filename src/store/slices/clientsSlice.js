import { createSlice } from "@reduxjs/toolkit";

const initialClients = [
  {
    id: "c3",
    clientId: "CLI-003",
    initial: "PE",
    name: "Petal Commercial Pvt Ltd",
    address: "A-32A, Block a, sector-62 Noida U.P.",
    gstin: "07AAICP6612N1Z0",
    contactPerson: "ASHU",
    phone: "8802515674",
    contractStart: "15 Jun 2027",
    contractEnd: "14 Jun 2027",
    employees: 1,
    status: "Active",
  },
  {
    id: "c2",
    clientId: "CLI-002",
    initial: "RS",
    name: "RSAG Sealing Solutions Pvt Ltd",
    address: "Plot No-376, Udyog Kendra-1 Ecotech-III, Greater Noida",
    gstin: "09AALCR8241G1Z1",
    contactPerson: "Ravinder kumar",
    phone: "+9990509003",
    contractStart: "01 Jul 2026",
    contractEnd: "30 Jun 2027",
    employees: 3,
    status: "Active",
  },
  {
    id: "c1",
    clientId: "CLI-001",
    initial: "RR",
    name: "RR Secutity & Facilities",
    address: "G-75/A, Gali No. 04, Block-G M.B. Extn Badarpur New Delhi",
    gstin: "07ABIFR8539E1ZV",
    contactPerson: "Ravish Rana",
    phone: "9999890891",
    contractStart: "01 Sept 2026",
    contractEnd: "31 Aug 2027",
    employees: 0,
    status: "Active",
  },
];

const initialInvoices = [
  {
    id: "inv_1",
    invoiceNo: "INV-2026-1001",
    clientName: "Nexus Corporate Towers",
    gstin: "07AAACN1234D1Z5",
    billingPeriod: "October 2026",
    deployedForce: "12 Guards",
    baseAmount: "₹3,10,000",
    gst: "₹55,800",
    grossTotal: "₹3,65,800",
    balanceDue: "Settled",
    status: "Paid", // Paid | Partially Paid | Pending | Overdue
    statusColor: "#16A34A",
    statusBg: "#DCFCE7",
  },
  {
    id: "inv_2",
    invoiceNo: "INV-2026-1002",
    clientName: "Alpha Logistics Hub",
    gstin: "09AABCA9876E1Z2",
    billingPeriod: "October 2026",
    deployedForce: "16 Guards",
    baseAmount: "₹3,99,000",
    gst: "₹71,820",
    grossTotal: "₹4,70,820",
    balanceDue: "₹2,20,820",
    status: "Partially Paid",
    statusColor: "#2563EB",
    statusBg: "#EFF6FF",
  },
  {
    id: "inv_3",
    invoiceNo: "INV-2026-1003",
    clientName: "Apex Healthcare & Multi-Specialty",
    gstin: "07AAACA4455F1Z9",
    billingPeriod: "October 2026",
    deployedForce: "10 Guards",
    baseAmount: "₹2,68,000",
    gst: "₹48,240",
    grossTotal: "₹3,16,240",
    balanceDue: "₹3,16,240",
    status: "Pending",
    statusColor: "#D97706",
    statusBg: "#FEF3C7",
  },
  {
    id: "inv_4",
    invoiceNo: "INV-2026-0901",
    clientName: "Metro Smart City Infrastructure",
    gstin: "09AAACM7788K1Z3",
    billingPeriod: "September 2026",
    deployedForce: "8 Guards",
    baseAmount: "₹2,05,000",
    gst: "₹36,900",
    grossTotal: "₹2,41,900",
    balanceDue: "₹2,41,900",
    status: "Overdue",
    statusColor: "#DC2626",
    statusBg: "#FEE2E2",
  },
  {
    id: "inv_5",
    invoiceNo: "INV-2026-0801",
    clientName: "Petal Commercial Pvt Ltd",
    gstin: "07AAICP6612N1Z0",
    billingPeriod: "August 2026",
    deployedForce: "14 Guards",
    baseAmount: "₹3,40,000",
    gst: "₹61,200",
    grossTotal: "₹4,01,200",
    balanceDue: "Settled",
    status: "Paid",
    statusColor: "#16A34A",
    statusBg: "#DCFCE7",
  },
];

const initialState = {
  activeSubTab: "All Clients", // "All Clients" | "Billing"
  searchQuery: "",
  selectedStatus: "All Status",
  clients: initialClients,

  // Billing states
  billingSearchQuery: "",
  billingClientFilter: "All Clients (5)",
  billingPeriodFilter: "All Periods",
  billingStatusFilter: "All Statuses",
  invoices: initialInvoices,
  billingStats: {
    totalInvoiced: "₹18,21,920",
    totalInvoicedSub: "+14.2% across 5 billing cycles",
    totalCollected: "₹10,42,960",
    totalCollectedSub: "57% realization rate",
    outstandingBalance: "₹7,78,960",
    outstandingSub: "1 Overdue Invoices",
    activeWorkforces: "60 Guards",
    workforcesSub: "Deployed at 5 client sites",
  },
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setActiveSubTab: (state, action) => {
      state.activeSubTab = action.payload;
    },
    setClientSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setClientStatusFilter: (state, action) => {
      state.selectedStatus = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.selectedStatus = "All Status";
    },
    addClient: (state, action) => {
      const nextNum = state.clients.length + 1;
      const idStr = `CLI-00${nextNum}`;
      const name = action.payload.name || "New Client";
      const words = name.trim().split(" ");
      const initial =
        words.length > 1
          ? `${words[0][0]}${words[1][0]}`.toUpperCase()
          : name.slice(0, 2).toUpperCase();

      state.clients.unshift({
        id: `c_${Date.now()}`,
        clientId: idStr,
        initial,
        status: "Active",
        employees: 0,
        ...action.payload,
      });
    },
    editClient: (state, action) => {
      const index = state.clients.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = { ...state.clients[index], ...action.payload };
      }
    },
    toggleClientStatus: (state, action) => {
      const client = state.clients.find((c) => c.id === action.payload);
      if (client) {
        client.status = client.status === "Active" ? "Inactive" : "Active";
      }
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter((c) => c.id !== action.payload);
    },

    // Billing Reducers
    setBillingSearchQuery: (state, action) => {
      state.billingSearchQuery = action.payload;
    },
    setBillingClientFilter: (state, action) => {
      state.billingClientFilter = action.payload;
    },
    setBillingPeriodFilter: (state, action) => {
      state.billingPeriodFilter = action.payload;
    },
    setBillingStatusFilter: (state, action) => {
      state.billingStatusFilter = action.payload;
    },
    resetBillingFilters: (state) => {
      state.billingSearchQuery = "";
      state.billingClientFilter = "All Clients (5)";
      state.billingPeriodFilter = "All Periods";
      state.billingStatusFilter = "All Statuses";
    },
    generateInvoice: (state, action) => {
      const nextId = `INV-2026-${1000 + state.invoices.length + 1}`;
      state.invoices.unshift({
        id: `inv_${Date.now()}`,
        invoiceNo: nextId,
        billingPeriod: "November 2026",
        baseAmount: "₹2,50,000",
        gst: "₹45,000",
        grossTotal: "₹2,95,000",
        balanceDue: "₹2,95,000",
        status: "Pending",
        statusColor: "#D97706",
        statusBg: "#FEF3C7",
        ...action.payload,
      });
    },
    payInvoice: (state, action) => {
      const invoice = state.invoices.find((inv) => inv.id === action.payload);
      if (invoice) {
        invoice.balanceDue = "Settled";
        invoice.status = "Paid";
        invoice.statusColor = "#16A34A";
        invoice.statusBg = "#DCFCE7";
      }
    },
    deleteInvoice: (state, action) => {
      state.invoices = state.invoices.filter((inv) => inv.id !== action.payload);
    },
  },
});

export const {
  setActiveSubTab,
  setClientSearchQuery,
  setClientStatusFilter,
  resetFilters,
  addClient,
  editClient,
  toggleClientStatus,
  deleteClient,
  setBillingSearchQuery,
  setBillingClientFilter,
  setBillingPeriodFilter,
  setBillingStatusFilter,
  resetBillingFilters,
  generateInvoice,
  payInvoice,
  deleteInvoice,
} = clientsSlice.actions;

export default clientsSlice.reducer;
