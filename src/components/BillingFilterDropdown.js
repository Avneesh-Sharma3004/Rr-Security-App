import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BillingFilterDropdown({
  label,
  value,
  options,
  onSelect,
  style,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        onPress={() => setOpen(true)}
        style={[styles.trigger, style]}
      >
        <Text numberOfLines={1} style={styles.value}>
          {value}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#14234D" />
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Text style={styles.heading}>{label}</Text>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.options}
            >
              {options.map((option) => {
                const selected = option === value;
                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      onSelect(option);
                      setOpen(false);
                    }}
                    style={styles.option}
                  >
                    <Text
                      style={[styles.optionText, selected && styles.selected]}
                    >
                      {option}
                    </Text>
                    {selected ? (
                      <Ionicons name="checkmark" size={18} color="#0878FF" />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D7E3F6",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  value: { flex: 1, color: "#14234D", fontSize: 14, fontWeight: "500" },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(13, 25, 55, 0.28)",
    justifyContent: "center",
    padding: 24,
  },
  menu: {
    maxHeight: "70%",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 16,
    elevation: 8,
    shadowColor: "#14234D",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  heading: {
    color: "#14234D",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  options: { flexGrow: 0 },
  option: {
    minHeight: 46,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5ECF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  optionText: { color: "#566788", fontSize: 14 },
  selected: { color: "#0878FF", fontWeight: "700" },
});
