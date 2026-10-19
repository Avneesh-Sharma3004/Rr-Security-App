import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { useAuth } from "../../hooks/UseAuth";
import GradientButton from "../../components/Button";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";

const DEMO_ACCOUNTS = [
  { username: "admin", password: "admin123", role: "ADMIN" },
  { username: "client", password: "client123", role: "CLIENT" },
  { username: "employee", password: "emp123", role: "EMPLOYEE" },
  { username: "user", password: "user123", role: "USER" },
];

//////////////////////////////
// const { isDark, toggleTheme } = useTheme();

// <TouchableOpacity onPress={toggleTheme}>
//   <Text>{isDark ? "Switch to Light" : "Switch to Dark"}</Text>
// </TouchableOpacity>
////////////////////////////////////////////

export default function Login() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username.trim() || !password) {
      Alert.alert("Required", "Username aur password enter karo.");
      return;
    }

    const result = login(username, password);

    if (!result.success) {
      Alert.alert("Login Failed", result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Apne HRMS account mein login karein
          </Text>

          <CustomInput
            type="name"
            placeholder="Name"
            value={username}
            onChangeText={setUsername}
            leftIcon="mail-outline"
            required
          />

          <CustomInput
            type="password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            leftIcon="lock-closed-outline"
            required
          />

          {/* <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable> */}
          <CustomButton title="Login" onPress={handleLogin} />

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo Login Credentials</Text>

            {DEMO_ACCOUNTS.map((account) => (
              <Pressable
                key={account.role}
                style={styles.demoRow}
                onPress={() => {
                  setUsername(account.username);
                  setPassword(account.password);
                }}
              >
                <Text style={styles.demoRole}>{account.role}</Text>
                <Text style={styles.demoUsername}>
                  {account.username} / {account.password}
                </Text>
              </Pressable>
            ))}

            <Text style={styles.hint}>
              Credentials par tap karke fields fill kar sakte ho.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
    backgroundColor: "#F1F5F9",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 18,
    color: "#111827",
  },
  button: {
    backgroundColor: "#16A34A",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  demoBox: {
    marginTop: 24,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  demoRow: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  demoRole: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },
  demoUsername: {
    fontSize: 13,
    color: "#475569",
    marginTop: 3,
  },
  hint: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 10,
  },
});
