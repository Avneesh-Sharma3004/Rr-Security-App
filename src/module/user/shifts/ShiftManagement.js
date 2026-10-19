import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserHeader from "../../../components/UserHeader";
import CustomTabs from "../../../components/CustomTab";
import ShiftProvider from "./ShiftProvider";
import ShiftPatterns from "./ShiftPatterns";
import CalenderView from "./CalenderView";

const TABS = [
  { key: "providers", title: "Shift Provider", component: ShiftProvider },
  { key: "patterns", title: "Shift Patterns", component: ShiftPatterns },
  { key: "calendar", title: "Calendar View", component: CalenderView },
];

export default function ShiftManagement({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <UserHeader navigation={navigation} />
      <View style={styles.tabs}>
        <CustomTabs
          tabs={TABS}
          initialTabKey="providers"
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
          tabBarStyle={styles.tabBar}
          contentStyle={styles.tabContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  tabs: { flex: 1, minHeight: 0, paddingHorizontal: 10 },
  tabBar: { marginBottom: 8 },
  tabContent: { flex: 1 },
  activeTab: { backgroundColor: "#3157C8" },
  activeText: { fontSize: 12 },
});
