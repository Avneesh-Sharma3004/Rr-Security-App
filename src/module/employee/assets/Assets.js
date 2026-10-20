import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import UserHeader from "../../../components/UserHeader";
import DashboardCard from "../../../components/DashboardCard";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";
import CustomButton from "../../../components/Button";
import navigationServices from "../../../navigation/navigationServices";

const SUMMARY = [
  {
    title: "Total Issued Items",
    value: "2",
    detail: "Active in your custody",
    icon: "cube-outline",
    color: "#2875F5",
    backgroundColor: "#EEF4FF",
  },
  {
    title: "Uniforms & Apparel",
    value: "2",
    detail: "Shirts, trousers, caps & belts",
    icon: "shirt-outline",
    color: "#635BEB",
    backgroundColor: "#F0EFFF",
  },
  {
    title: "My Requisitions",
    value: "2",
    detail: "0 pending review",
    icon: "document-text-outline",
    color: "#E78312",
    backgroundColor: "#FFF5E5",
  },
  {
    title: "Returned / Replaced",
    value: "0",
    detail: "Cleared back to warehouse",
    icon: "return-down-back-outline",
    color: "#0AA866",
    backgroundColor: "#E8F8EF",
  },
];

const TABS = [
  "All Items",
  "Uniforms",
  "Equipment & Kits",
  "My Requests",
  "Return History",
];

export default function Assets({ navigation }) {
  const [activeTab, setActiveTab] = useState("All Items");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Active");

  const openRequisition = () => navigationServices.navigate("AssetRequisition");

  const emptyTitle =
    activeTab === "My Requests"
      ? "No requisitions to show"
      : activeTab === "Return History"
        ? "No return history found"
        : "No Issued Items Match Filter";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeading}>
          <View style={styles.headingCopy}>
            <View style={styles.titleRow}>
              <Ionicons name="shirt-outline" size={22} color="#2875F5" />
              <Text style={styles.title}>My Assets &amp; Uniforms</Text>
            </View>
          </View>
          <View style={styles.headingActions}>
            <CustomButton
              title="Apply"
              onPress={openRequisition}
              leftIcon="add"
              width={96}
              height={40}
              borderRadius={10}
              color="#2875F5"
              fontSize={11}
              style={styles.applyButton}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Print custody card"
              onPress={() =>
                Alert.alert("Custody card", "Printing is not connected yet.")
              }
              style={styles.printButton}
            >
              <Ionicons name="print-outline" size={18} color="#52627D" />
            </Pressable>
          </View>
        </View>

        <View style={styles.summaryGrid}>
          {SUMMARY.map((item) => (
            <View key={item.title} style={styles.summaryCardWrap}>
              <DashboardCard {...item} />
            </View>
          ))}
        </View>

        <View style={styles.itemsPanel}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tab, selected && styles.selectedTab]}
                >
                  <Text
                    style={[styles.tabText, selected && styles.selectedTabText]}
                  >
                    {tab}
                  </Text>
                  <Text
                    style={[
                      styles.tabCount,
                      selected && styles.selectedTabText,
                    ]}
                  >
                    {tab === "All Items"
                      ? "2"
                      : tab === "Uniforms"
                        ? "2"
                        : tab === "My Requests"
                          ? "2"
                          : "0"}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.filterArea}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#8290A8" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search item, code, or brand"
                placeholderTextColor="#94A0B3"
                style={styles.searchInput}
                returnKeyType="search"
              />
              {search ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  onPress={() => setSearch("")}
                >
                  <Ionicons name="close-circle" size={17} color="#8290A8" />
                </Pressable>
              ) : null}
            </View>
            <BillingFilterDropdown
              label="Status"
              value={status}
              options={[
                "All Statuses",
                "Active",
                "Returned",
                "Replacement Requested",
              ]}
              onSelect={setStatus}
              style={styles.statusDropdown}
            />
          </View>

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="cube-outline" size={25} color="#8294AE" />
            </View>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptyText}>
              Try changing your filters or submit an application if you need an
              item.
            </Text>
            <CustomButton
              title="Apply for Uniform / Asset"
              onPress={openRequisition}
              leftIcon="add"
              width={210}
              height={40}
              borderRadius={10}
              color="#2875F5"
              fontSize={10}
              style={styles.emptyAction}
            />
          </View>
        </View>

        <View style={styles.guidelinesCard}>
          <View style={styles.guidelineTitleRow}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color="#07834E"
            />
            <Text style={styles.guidelineTitle}>
              Guard Uniform &amp; Asset Custody Guidelines
            </Text>
          </View>
          <Text style={styles.guidelineIntro}>
            Issued uniforms, badges, flashlights and tactical gear remain the
            property of the organization. Please maintain and securely store
            assigned items.
          </Text>
          {[
            "Wear clean, pressed uniforms and your official photo badge while on duty.",
            "Report damaged, lost, or malfunctioning equipment to your Site Supervisor.",
            "Submit a requisition when replacement or a size exchange is needed.",
            "Return issued equipment to HR / Logistics upon transfer or separation.",
          ].map((item) => (
            <View key={item} style={styles.guidelineRow}>
              <View style={styles.guidelineBullet} />
              <Text style={styles.guidelineText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  screen: { flex: 1, backgroundColor: "#FFF" },
  content: { paddingHorizontal: 10, paddingBottom: 28 },
  pageHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  headingCopy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: "#75839D",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.45,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  title: { color: "#17213B", fontSize: 16, fontWeight: "800", flexShrink: 1 },
  subtitle: { color: "#71809A", fontSize: 9, lineHeight: 13, marginTop: 4 },
  headingActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  applyButton: { flexShrink: 0 },
  printButton: {
    width: 38,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DCE4F0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 9,
    marginBottom: 13,
  },
  summaryCardWrap: { width: "48.5%" },
  itemsPanel: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7F0",
    borderRadius: 14,
    marginBottom: 13,
  },
  tabsRow: {
    padding: 7,
    gap: 5,
    backgroundColor: "#F8FAFD",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF3",
  },
  tab: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 9,
    borderRadius: 9,
    backgroundColor: "#EDF1F7",
  },
  selectedTab: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE7FA",
  },
  tabText: { color: "#687792", fontSize: 9, fontWeight: "600" },
  selectedTabText: { color: "#2875F5", fontWeight: "800" },
  tabCount: { color: "#7686A2", fontSize: 8, fontWeight: "700" },
  filterArea: {
    padding: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F6",
  },
  searchBox: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#DCE4F0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
    color: "#26334A",
    fontSize: 10,
  },
  statusDropdown: {
    minHeight: 42,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "#DCE4F0",
  },
  emptyState: {
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 22,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#F0F4F9",
    marginBottom: 10,
  },
  emptyTitle: {
    color: "#1D2B46",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyText: {
    maxWidth: 260,
    color: "#71809A",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 5,
  },
  emptyAction: { marginTop: 14 },
  guidelinesCard: {
    backgroundColor: "#EDFBF2",
    borderWidth: 1,
    borderColor: "#B8EAC9",
    borderRadius: 14,
    padding: 13,
  },
  guidelineTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 7,
  },
  guidelineTitle: {
    flex: 1,
    color: "#087B4B",
    fontSize: 11,
    fontWeight: "800",
  },
  guidelineIntro: {
    color: "#367956",
    fontSize: 9,
    lineHeight: 14,
    marginBottom: 8,
  },
  guidelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    marginTop: 4,
  },
  guidelineBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0AA866",
    marginTop: 5,
  },
  guidelineText: { flex: 1, color: "#367956", fontSize: 9, lineHeight: 13 },
});
