import React, { createContext, useState } from "react";

export const AuthContext = createContext(null);

const DUMMY_USERS = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    name: "Admin User",
    role: "ADMIN",
  },
  {
    id: "2",
    username: "client",
    password: "client123",
    name: "Client User",
    role: "CLIENT",
  },
  {
    id: "3",
    username: "employee",
    password: "emp123",
    name: "Employee User",
    role: "EMPLOYEE",
  },
  {
    id: "4",
    username: "user",
    password: "user123",
    name: "Normal User",
    role: "USER",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading] = useState(false);

  const login = (username, password) => {
    const matchedUser = DUMMY_USERS.find(
      (item) =>
        item.username.toLowerCase() === username.trim().toLowerCase() &&
        item.password === password,
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Username ya password galat hai.",
      };
    }

    const { password: _, ...safeUser } = matchedUser;
    setUser(safeUser);

    return { success: true, user: safeUser };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
