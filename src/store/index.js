import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slices/dashboardSlice.js";
import clientsReducer from "./slices/clientsSlice.js";
import employeesReducer from "./slices/employeesSlice.js";
import attendanceReducer from "./slices/attendanceSlice.js";
import shiftsReducer from "./slices/shiftsSlice.js";
import payrollReducer from "./slices/payrollSlice.js";
import statutoryReducer from "./slices/statutorySlice.js";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    clients: clientsReducer,
    employees: employeesReducer,
    attendance: attendanceReducer,
    shifts: shiftsReducer,
    payroll: payrollReducer,
    statutory: statutoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
