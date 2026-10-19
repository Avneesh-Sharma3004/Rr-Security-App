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

const initialState = {
  searchQuery: "",
  selectedStatus: "All Status", // "All Status" | "Active" | "Inactive"
  clients: initialClients,
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
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
  },
});

export const {
  setClientSearchQuery,
  setClientStatusFilter,
  resetFilters,
  addClient,
  editClient,
  toggleClientStatus,
  deleteClient,
} = clientsSlice.actions;

export default clientsSlice.reducer;
