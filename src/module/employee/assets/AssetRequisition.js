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
import CustomTabs from "../../../components/CustomTab";
import BillingFilterDropdown from "../../../components/BillingFilterDropdown";
import CustomButton from "../../../components/Button";
import navigationServices from "../../../navigation/navigationServices";

const REASONS = [
  "New Joining Issue",
  "Replacement",
  "Size Exchange",
  "Damaged / Lost",
  "Additional Requirement",
];
const PRIORITIES = [
  "Normal (Routine Cycle)",
  "Urgent (Operational Need)",
  "Critical",
];
const UNITS = ["Pcs", "Set", "Pair", "Box"];

function Field({ label, required = false, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {children}
    </View>
  );
}

function DropdownField({ label, value, options, onSelect, required = false }) {
  return (
    <Field label={label} required={required}>
      <BillingFilterDropdown
        label={label}
        value={value}
        options={options}
        onSelect={onSelect}
        style={styles.dropdown}
      />
    </Field>
  );
}

function RequisitionForm({ kind }) {
  const isUniform = kind === "uniform";
  const title = isUniform ? "Uniform & Apparel" : "Asset & Equipment";
  const itemOptions = isUniform
    ? [
        "Guard Shirt — Navy Blue",
        "Trousers — Navy Blue",
        "Peak Cap",
        "Duty Belt",
      ]
    : ["LED Flashlight", "Walkie Talkie", "Safety Vest", "ID Card"];
  const categories = isUniform
    ? ["Uniform", "Footwear", "Accessories"]
    : ["Equipment", "Communication", "Protective Gear"];

  const [selectedItem, setSelectedItem] = useState(
    "-- Choose from available items --",
  );
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(isUniform ? "Uniform" : "Equipment");
  const [size, setSize] = useState("L");
  const [colour, setColour] = useState("Navy Blue");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("Pcs");
  const [reason, setReason] = useState("New Joining Issue");
  const [priority, setPriority] = useState(PRIORITIES[0]);
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (
      !itemName.trim() &&
      selectedItem === "-- Choose from available items --"
    ) {
      Alert.alert(
        "Item required",
        `Choose an available ${isUniform ? "uniform" : "asset"} item or enter its name.`,
      );
      return;
    }
    Alert.alert(
      "Submit requisition",
      "Requisition submission is not connected yet.",
    );
  };

  return (
    <View style={styles.formContainer}>
      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formIntro}>
          <View
            style={[styles.formIntroIcon, !isUniform && styles.assetIntroIcon]}
          >
            <Ionicons
              name={isUniform ? "shirt-outline" : "shield-outline"}
              size={19}
              color={isUniform ? "#2875F5" : "#7048D8"}
            />
          </View>
          <View style={styles.formIntroCopy}>
            <Text style={styles.formTitle}>{title} Requisition</Text>
            <Text style={styles.formSubtitle}>
              Request an issue or replacement for your duty.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <DropdownField
            label={`Select ${isUniform ? "Uniform" : "Asset"} Item (Added by Admin)`}
            required
            value={selectedItem}
            options={["-- Choose from available items --", ...itemOptions]}
            onSelect={setSelectedItem}
          />

          <Field label="Item Name" required>
            <TextInput
              value={itemName}
              onChangeText={setItemName}
              placeholder={
                isUniform
                  ? "e.g. Guard Shirt, Trousers, Peak Cap"
                  : "e.g. Torch, Walkie Talkie, Safety Vest"
              }
              placeholderTextColor="#929EB2"
              style={styles.textInput}
              returnKeyType="next"
            />
          </Field>

          <DropdownField
            label="Category"
            required
            value={category}
            options={categories}
            onSelect={setCategory}
          />

          {isUniform ? (
            <View style={styles.twoColumnRow}>
              <View style={styles.column}>
                <DropdownField
                  label="Size Required"
                  required
                  value={size}
                  options={["XS", "S", "M", "L", "XL", "XXL"]}
                  onSelect={setSize}
                />
              </View>
              <View style={styles.column}>
                <DropdownField
                  label="Colour"
                  required
                  value={colour}
                  options={["Navy Blue", "White", "Black", "Khaki"]}
                  onSelect={setColour}
                />
              </View>
            </View>
          ) : null}

          <View style={styles.twoColumnRow}>
            <View style={styles.column}>
              <Field label="Quantity" required>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="1"
                  placeholderTextColor="#929EB2"
                  keyboardType="number-pad"
                  style={styles.textInput}
                />
              </Field>
            </View>
            <View style={styles.column}>
              <DropdownField
                label="Unit of Measurement"
                required
                value={unit}
                options={UNITS}
                onSelect={setUnit}
              />
            </View>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.column}>
              <DropdownField
                label="Reason for Requisition"
                required
                value={reason}
                options={REASONS}
                onSelect={setReason}
              />
            </View>
            <View style={styles.column}>
              <DropdownField
                label="Urgency Priority"
                required
                value={priority}
                options={PRIORITIES}
                onSelect={setPriority}
              />
            </View>
          </View>

          <Field label="Additional Notes / Measurements / Details">
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add replacement reasons, fitting requirements, or other details..."
              placeholderTextColor="#929EB2"
              style={[styles.textInput, styles.notesInput]}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </Field>
        </View>
      </ScrollView>

      <View style={styles.formFooter}>
        <CustomButton
          title="Cancel"
          onPress={() => navigationServices.goBack()}
          width="auto"
          height={43}
          variant="outline"
          borderRadius={10}
          borderColor="#DCE4F0"
          textColor="#465570"
          fontSize={11}
          style={styles.cancelButton}
        />
        <CustomButton
          title="Submit Requisition"
          onPress={submit}
          leftIcon="paper-plane-outline"
          width="auto"
          height={43}
          color="#2875F5"
          borderRadius={10}
          fontSize={11}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
}

function UniformRequisition() {
  return <RequisitionForm kind="uniform" />;
}

function AssetRequisitionForm() {
  return <RequisitionForm kind="asset" />;
}

const TABS = [
  { key: "uniform", title: "Uniform & Apparel", component: UniformRequisition },
  { key: "asset", title: "Asset & Equipment", component: AssetRequisitionForm },
];

export default function AssetRequisition({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <UserHeader navigation={navigation} />

      <View style={styles.tabsContainer}>
        <CustomTabs
          tabs={TABS}
          initialTabKey="uniform"
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeTabText}
          tabBarStyle={styles.tabBar}
          contentStyle={styles.tabContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },

  headingCopy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: "#7B89A2",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  screenTitle: {
    color: "#1B2943",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 3,
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F2F5F9",
  },
  tabsContainer: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 11,
    paddingTop: 9,
    paddingBottom: 5,
  },
  tabBar: { marginBottom: 8, backgroundColor: "#E9EEF7" },
  activeTab: { backgroundColor: "#2875F5" },
  activeTabText: { color: "#FFFFFF", fontSize: 11 },
  tabContent: { flex: 1, minHeight: 0 },
  formContainer: { flex: 1, minHeight: 0, backgroundColor: "#FFF" },
  formScroll: { flex: 1 },
  formContent: { paddingBottom: 12 },
  formIntro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 3,
    paddingVertical: 7,
    marginBottom: 7,
  },
  formIntroIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#EAF2FF",
  },
  assetIntroIcon: { backgroundColor: "#F0EAFF" },
  formIntroCopy: { flex: 1, minWidth: 0 },
  formTitle: { color: "#1C2A44", fontSize: 13, fontWeight: "800" },
  formSubtitle: { color: "#7A879E", fontSize: 9, marginTop: 3 },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7F0",
    borderRadius: 14,
    padding: 12,
  },
  field: { marginBottom: 12 },
  label: { color: "#46546E", fontSize: 9, fontWeight: "700", marginBottom: 5 },
  required: { color: "#E34B57" },
  dropdown: {
    minHeight: 41,
    paddingHorizontal: 9,
    borderRadius: 9,
    borderColor: "#D5DFED",
  },
  textInput: {
    minHeight: 41,
    borderWidth: 1,
    borderColor: "#D5DFED",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    color: "#2C3A54",
    fontSize: 10,
  },
  twoColumnRow: { flexDirection: "row", gap: 8 },
  column: { flex: 1, minWidth: 0 },
  notesInput: { minHeight: 76, paddingTop: 10, textAlignVertical: "top" },
  formFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  cancelButton: { flex: 0.8 },
  submitButton: { flex: 1.4 },
});
