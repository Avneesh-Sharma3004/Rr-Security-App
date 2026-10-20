import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_ITEMS = [
  { title: "Home", icon: "home-outline" },
  { title: "My Profile", icon: "person-outline" },
  { title: "Settings", icon: "settings-outline" },
  { title: "Notifications", icon: "notifications-outline" },
  { title: "Help & Support", icon: "help-circle-outline" },
];

const MenuItem = ({ title, icon, onPress, isLast }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuItem,
      !isLast && styles.menuItemBorder,
      pressed && styles.pressed,
    ]}
  >
    <View style={styles.menuIcon}>
      <Ionicons name={icon} size={22} color="#087A43" />
    </View>

    <Text style={styles.menuTitle}>{title}</Text>

    <Ionicons name="chevron-forward" size={19} color="#98A49C" />
  </Pressable>
);

export default function Hamburger({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <CustomHeader>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color="#087A43" />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>Avneesh Sharma</Text>

            <View style={styles.roleRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.userRole}>Administrator</Text>
            </View>
          </View>

          <Pressable
            style={styles.notificationButton}
            onPress={() => navigation?.navigate("Notifications")}
          >
            <Ionicons name="notifications-outline" size={23} color="#23372B" />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      </CustomHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeText}>
            <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>

            <Text style={styles.welcomeTitle}>Hello, Avneesh!</Text>

            <Text style={styles.welcomeSubtitle}>
              Manage your account and workspace.
            </Text>
          </View>

          <View style={styles.welcomeIcon}>
            <Ionicons name="grid-outline" size={30} color="#FFFFFF" />
          </View>
        </View>

        {/* Menu Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <Text style={styles.sectionSubtitle}>Explore your options</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <MenuItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              isLast={index === MENU_ITEMS.length - 1}
              onPress={() => {
                const routes = {
                  Home: "Home",
                  "My Profile": "Profile",
                  Settings: "Settings",
                  Notifications: "Notifications",
                  "Help & Support": "Help",
                };

                if (routes[item.title]) {
                  navigation?.navigate(routes[item.title]);
                }
              }}
            />
          ))}
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            // Apna existing logout function yahan call karo
          }}
        >
          <Ionicons name="log-out-outline" size={22} color="#D83B45" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    gap: 12,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E4F4EA",
    borderWidth: 1,
    borderColor: "#CBE8D5",
    alignItems: "center",
    justifyContent: "center",
  },

  userInfo: {
    flex: 1,
    gap: 5,
  },

  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#17291F",
  },

  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#16A05A",
  },

  userRole: {
    fontSize: 12,
    color: "#78867D",
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F4F7F5",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5484D",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },

  content: {
    padding: 18,
    paddingBottom: 32,
  },

  welcomeCard: {
    backgroundColor: "#087A43",
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  welcomeText: {
    flex: 1,
    gap: 8,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#BCE8CC",
  },

  welcomeTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  welcomeSubtitle: {
    fontSize: 12,
    lineHeight: 19,
    color: "#D9F1E2",
  },

  welcomeIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#27945E",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  sectionHeader: {
    marginTop: 26,
    marginBottom: 14,
    gap: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1B2B21",
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#849087",
  },

  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E8EDE9",
  },

  menuItem: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 4,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F3F0",
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EAF6EE",
    alignItems: "center",
    justifyContent: "center",
  },

  menuTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#26372D",
  },

  pressed: {
    opacity: 0.7,
  },

  logoutButton: {
    marginTop: 18,
    minHeight: 58,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F4DCDD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D83B45",
  },

  version: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 11,
    color: "#9AA49D",
  },
});
