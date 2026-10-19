import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../../hooks/UseAuth";
import {
  setDrawerOpen,
  setSelectedDrawerItem,
} from "../../../store/slices/dashboardSlice";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.84, 340);

export default function AdminDrawer() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  const { isDrawerOpen, selectedDrawerItem } = useSelector(
    (state) => state.dashboard
  );

  // Expanded state map for accordion sections
  const [expandedSections, setExpandedSections] = useState({
    Payroll: true,
    "Payroll Setup": true,
  });

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleSelectSubItem = (parentKey, subItemTitle) => {
    dispatch(setSelectedDrawerItem(subItemTitle));
    dispatch(setDrawerOpen(false));

    // Handle navigation mappings if applicable
    if (subItemTitle === "Client List") {
      navigation.navigate("Clients");
    } else if (subItemTitle === "Employee List" || subItemTitle === "Onboarding") {
      navigation.navigate("Employees");
    } else if (subItemTitle === "Attendance Log" || subItemTitle === "Daily Roster") {
      navigation.navigate("Attendance");
    } else if (subItemTitle === "Shift Schedules") {
      navigation.navigate("Shift Management");
    } else {
      Alert.alert(
        `${parentKey} • ${subItemTitle}`,
        `Viewing details and management controls for ${subItemTitle}.`
      );
    }
  };

  const handleDirectNavigation = (routeName, label) => {
    dispatch(setSelectedDrawerItem(label));
    dispatch(setDrawerOpen(false));
    if (routeName) {
      navigation.navigate(routeName);
    }
  };

  const menuConfig = [
    {
      group: "MAIN",
      items: [
        {
          key: "Dashboard",
          title: "Dashboard",
          icon: "grid-outline",
          isDirect: true,
          routeName: "Dashboard",
        },
      ],
    },
    {
      group: "ORGANIZATION",
      items: [
        {
          key: "Company Setup",
          title: "Company Setup",
          icon: "business-outline",
          subItems: [
            "Company Profile",
            "Branches & Sites",
            "Departments",
            "Designations",
          ],
        },
      ],
    },
    {
      group: "WORKFORCE",
      items: [
        {
          key: "Clients",
          title: "Clients",
          icon: "briefcase-outline",
          subItems: [
            "Client List",
            "Site Locations",
            "Contract Agreements",
          ],
        },
        {
          key: "Employees",
          title: "Employees",
          icon: "people-outline",
          subItems: [
            "Employee List",
            "Onboarding",
            "Document Verification",
          ],
        },
        {
          key: "Attendance",
          title: "Attendance",
          icon: "checkbox-outline",
          subItems: [
            "Attendance Log",
            "Daily Roster",
            "Biometric Devices",
          ],
        },
        {
          key: "Shift Management",
          title: "Shift Management",
          icon: "calendar-outline",
          subItems: [
            "Shift Schedules",
            "Guard Allocation",
            "Rotation Plan",
          ],
        },
      ],
    },
    {
      group: "PAYROLL MANAGEMENT",
      items: [
        {
          key: "Payroll",
          title: "Payroll",
          icon: "wallet-outline",
          subItems: [
            "Payroll Processing",
            "Salary Structure",
            "Rate Revision",
            "Arrears",
            "Salary Slips",
            "Statutory Reports",
          ],
        },
        {
          key: "Payroll Setup",
          title: "Payroll Setup",
          icon: "options-outline",
          subItems: [
            "Pay Groups",
            "Pay Schedules",
            "Pay Cycles",
            "Pay Days",
            "Calculation Methods",
          ],
        },
        {
          key: "Statutory Setup",
          title: "Statutory Setup",
          icon: "library-outline",
          subItems: [
            "Provident Fund (PF)",
            "ESIC Setup",
            "Professional Tax (PT)",
            "Labour Welfare Fund (LWF)",
            "TDS & Tax Slabs",
          ],
        },
        {
          key: "Advances & Loans",
          title: "Advances & Loans",
          icon: "swap-horizontal-outline",
          subItems: [
            "Loan Requests",
            "Salary Advance",
            "EMI Deduction Schedule",
          ],
        },
        {
          key: "Reimbursements",
          title: "Reimbursements",
          icon: "receipt-outline",
          subItems: [
            "Claims Processing",
            "Travel & Conveyance",
            "Uniform & Kit Allowance",
          ],
        },
        {
          key: "Overtime",
          title: "Overtime",
          icon: "time-outline",
          subItems: [
            "Overtime Rules",
            "OT Approvals",
            "Holiday Rates",
          ],
        },
      ],
    },
    {
      group: "MANAGEMENT",
      items: [
        {
          key: "Leave",
          title: "Leave",
          icon: "calendar-number-outline",
          subItems: [
            "Leave Applications",
            "Leave Balance",
            "Holiday Calendar",
          ],
        },
        {
          key: "Inventory",
          title: "Inventory",
          icon: "cube-outline",
          subItems: [
            "Uniforms & Badges",
            "Walkie-Talkies & Torches",
            "Security Equipment",
            "Stock Register",
          ],
        },
        {
          key: "Reports",
          title: "Reports",
          icon: "bar-chart-outline",
          isDirect: true,
        },
      ],
    },
    {
      group: "SETTINGS",
      items: [
        {
          key: "Masters",
          title: "Masters",
          icon: "git-network-outline",
          subItems: [
            "General Settings",
            "Shift Categories",
            "Guard Grades",
          ],
        },
        {
          key: "Role & Permissions",
          title: "Role & Permissions",
          icon: "shield-checkmark-outline",
          subItems: [
            "User Roles",
            "Access Control",
            "Audit Trail",
          ],
        },
        {
          key: "User Management",
          title: "User Management",
          icon: "people-outline",
          subItems: [
            "Admin Users",
            "Client Portal Users",
            "Employee Portal Users",
            "Password & Security Policies",
          ],
        },
        {
          key: "Preferences",
          title: "Preferences",
          icon: "options-outline",
          subItems: [
            "General Preferences",
            "Language & Region",
            "Date, Time & Timezone",
            "Currency & Units",
          ],
        },
        {
          key: "Template Setup",
          title: "Template Setup",
          icon: "document-text-outline",
          subItems: [
            "Salary Slip Template",
            "Offer Letter Template",
            "Relieving Letter Template",
            "ID Card Template",
          ],
        },
        {
          key: "Letter Management",
          title: "Letter Management",
          icon: "create-outline",
          isDirect: true,
        },
        {
          key: "Docs & Compliance",
          title: "Docs & Compliance",
          icon: "document-attach-outline",
          subItems: [
            "Statutory Compliance Check",
            "Police Verification Records",
            "Guard License Documents",
            "Client Agreement Archival",
          ],
        },
        {
          key: "Notifications",
          title: "Notifications",
          icon: "notifications-outline",
          subItems: [
            "Alert Rules & Triggers",
            "Email Configuration",
            "SMS & WhatsApp Alerts",
            "Push Notifications",
          ],
        },
      ],
    },
  ];

  if (!isDrawerOpen) return null;

  return (
    <Modal
      visible={isDrawerOpen}
      transparent
      animationType="fade"
      onRequestClose={() => dispatch(setDrawerOpen(false))}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable
          style={styles.backdrop}
          onPress={() => dispatch(setDrawerOpen(false))}
        />

        {/* Drawer Content */}
        <View style={styles.drawerContainer}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.brandName}>RR Security & Facilities</Text>
                <Text style={styles.brandSub}>HRMS Admin Suite</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => dispatch(setDrawerOpen(false))}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* User Profile Banner */}
          <View style={styles.userBanner}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>RR</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name || "RR Security Administrator"}
              </Text>
              <Text style={styles.userRole}>Administrator</Text>
            </View>
          </View>

          {/* Menu Sections */}
          <ScrollView
            style={styles.menuScroll}
            contentContainerStyle={styles.menuScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {menuConfig.map((groupObj) => (
              <View key={groupObj.group} style={styles.groupContainer}>
                <Text style={styles.groupTitle}>{groupObj.group}</Text>

                {groupObj.items.map((item) => {
                  const isExpanded = !!expandedSections[item.key];
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isDirectActive = selectedDrawerItem === item.title;

                  return (
                    <View key={item.key} style={styles.itemWrapper}>
                      {/* Parent Item Header */}
                      <TouchableOpacity
                        style={[
                          styles.parentItem,
                          isDirectActive && styles.activeParentItem,
                          isExpanded && styles.expandedParentItem,
                        ]}
                        onPress={() => {
                          if (item.isDirect) {
                            handleDirectNavigation(item.routeName, item.title);
                          } else {
                            toggleSection(item.key);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.parentLeft}>
                          <Ionicons
                            name={item.icon}
                            size={19}
                            color={
                              isDirectActive || isExpanded
                                ? "#2563EB"
                                : "#475569"
                            }
                          />
                          <Text
                            style={[
                              styles.parentTitle,
                              (isDirectActive || isExpanded) &&
                                styles.activeParentTitle,
                            ]}
                          >
                            {item.title}
                          </Text>
                        </View>

                        {/* Expand/Collapse Chevron */}
                        {hasSubItems && (
                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={17}
                            color={isExpanded ? "#2563EB" : "#94A3B8"}
                          />
                        )}
                      </TouchableOpacity>

                      {/* Sub Items (Expandable Accordion) */}
                      {hasSubItems && isExpanded && (
                        <View style={styles.subItemsContainer}>
                          {item.subItems.map((sub) => {
                            const isSelected = selectedDrawerItem === sub;

                            return (
                              <TouchableOpacity
                                key={sub}
                                style={[
                                  styles.subItem,
                                  isSelected && styles.selectedSubItem,
                                ]}
                                onPress={() =>
                                  handleSelectSubItem(item.title, sub)
                                }
                                activeOpacity={0.7}
                              >
                                <View
                                  style={[
                                    styles.bulletDot,
                                    isSelected && styles.selectedBulletDot,
                                  ]}
                                />
                                <Text
                                  style={[
                                    styles.subItemText,
                                    isSelected && styles.selectedSubItemText,
                                  ]}
                                >
                                  {sub}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {/* Footer with Logout */}
          <View style={styles.drawerFooter}>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                dispatch(setDrawerOpen(false));
                logout();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    height: "100%",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
    flexDirection: "column",
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  brandSub: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "500",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  userBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 10,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  userRole: {
    fontSize: 10,
    color: "#64748B",
  },
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 20,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8B95A5",
    letterSpacing: 0.8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  itemWrapper: {
    marginBottom: 2,
  },
  parentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeParentItem: {
    backgroundColor: "#EFF6FF",
  },
  expandedParentItem: {
    backgroundColor: "#F8FAFC",
  },
  parentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  parentTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  activeParentTitle: {
    color: "#2563EB",
    fontWeight: "700",
  },
  subItemsContainer: {
    paddingLeft: 22,
    paddingTop: 4,
    paddingBottom: 4,
    gap: 2,
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 10,
  },
  selectedSubItem: {
    backgroundColor: "#EFF6FF",
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94A3B8",
  },
  selectedBulletDot: {
    backgroundColor: "#2563EB",
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  subItemText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  selectedSubItemText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  drawerFooter: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
});
