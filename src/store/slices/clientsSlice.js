import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  selectedStatus: "All",
  clients: [
    {
      id: "c1",
      name: "DLF CyberCity Hub",
      category: "IT Park & Commercial",
      location: "DLF Phase 2, Gurugram, Haryana",
      contactPerson: "Mr. Vikram Oberoi",
      phone: "+91 98765 43210",
      guardsDeployed: 12,
      shiftCount: 3,
      status: "Active",
      contractUntil: "31 Dec 2027",
      monthlyBilling: "₹ 2,40,000",
    },
    {
      id: "c2",
      name: "Apex Corporate Towers",
      category: "Corporate Office",
      location: "Sector 62, Noida, Uttar Pradesh",
      contactPerson: "Ms. Shalini Gupta",
      phone: "+91 98111 22334",
      guardsDeployed: 8,
      shiftCount: 2,
      status: "Active",
      contractUntil: "15 Aug 2027",
      monthlyBilling: "₹ 1,60,000",
    },
    {
      id: "c3",
      name: "Grand Hyatt Residences",
      category: "Luxury Residential & Hospitality",
      location: "Aerocity, New Delhi",
      contactPerson: "Col. R.K. Mehta (Retd.)",
      phone: "+91 99223 34455",
      guardsDeployed: 16,
      shiftCount: 3,
      status: "Active",
      contractUntil: "30 Nov 2028",
      monthlyBilling: "₹ 3,20,000",
    },
    {
      id: "c4",
      name: "Metro Logistic Park",
      category: "Warehousing & Logistics",
      location: "Industrial Area, Faridabad",
      contactPerson: "Mr. Amit Tyagi",
      phone: "+91 97123 45678",
      guardsDeployed: 6,
      shiftCount: 2,
      status: "Pending Review",
      contractUntil: "28 Feb 2027",
      monthlyBilling: "₹ 1,20,000",
    },
    {
      id: "c5",
      name: "Vantage Global School",
      category: "Educational Institution",
      location: "Sohna Road, Gurugram",
      contactPerson: "Dr. Ananya Sen",
      phone: "+91 98990 11223",
      guardsDeployed: 10,
      shiftCount: 2,
      status: "Active",
      contractUntil: "31 Mar 2028",
      monthlyBilling: "₹ 2,00,000",
    },
  ],
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
    addClient: (state, action) => {
      state.clients.unshift({
        id: `c_${Date.now()}`,
        status: "Active",
        shiftCount: 2,
        guardsDeployed: 4,
        ...action.payload,
      });
    },
    toggleClientStatus: (state, action) => {
      const client = state.clients.find((c) => c.id === action.payload);
      if (client) {
        client.status = client.status === "Active" ? "Inactive" : "Active";
      }
    },
  },
});

export const {
  setClientSearchQuery,
  setClientStatusFilter,
  addClient,
  toggleClientStatus,
} = clientsSlice.actions;

export default clientsSlice.reducer;
